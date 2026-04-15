/**
 * 🔌 Realtime Subscriptions Utility
 * 
 * Maneja subscripciones a cambios en tiempo real desde Supabase
 * con reconnect automático y cleanup.
 */

import { supabase } from "./client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface SubscriptionCallback<T> {
  (data: T): void;
}

export class RealtimeSubscription<T> {
  private channel: RealtimeChannel | null = null;
  private listeners: Set<SubscriptionCallback<T>> = new Set();
  private retryCount = 0;
  private maxRetries = 5;
  private retryDelay = 2000;

  constructor(
    private tableName: string,
    private filter?: string
  ) {}

  /**
   * Inicia la suscripción a cambios de tabla
   */
  async subscribe() {
    try {
      this.channel = supabase.channel(`${this.tableName}:changes`);

      this.channel
        .on<T>(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: this.tableName,
            ...(this.filter && { filter: this.filter }),
          },
          (payload) => {
            console.log(`[Realtime] ${this.tableName} updated:`, payload);
            this.notifyListeners(payload.new || payload.old);
          }
        )
        .on("system", { event: "channel_error" }, () => {
          console.warn(`[Realtime] Error in ${this.tableName}, retrying...`);
          this.reconnect();
        })
        .subscribe((status) => {
          console.log(`[Realtime] ${this.tableName} status:`, status);
          if (status === "SUBSCRIBED") {
            this.retryCount = 0;
          }
        });
    } catch (err) {
      console.error(`[Realtime] Failed to subscribe to ${this.tableName}:`, err);
      this.reconnect();
    }
  }

  /**
   * Reconecta con backoff exponencial
   */
  private reconnect() {
    if (this.retryCount >= this.maxRetries) {
      console.error(
        `[Realtime] Max retries reached for ${this.tableName}`
      );
      return;
    }

    const delay = this.retryDelay * Math.pow(2, this.retryCount);
    this.retryCount++;

    console.log(
      `[Realtime] Reconnecting to ${this.tableName} in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`
    );

    setTimeout(() => {
      this.subscribe();
    }, delay);
  }

  /**
   * Escucha cambios
   */
  onChange(callback: SubscriptionCallback<T>) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notifica a todos los listeners
   */
  private notifyListeners(data: T) {
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (err) {
        console.error("[Realtime] Listener error:", err);
      }
    });
  }

  /**
   * Limpia la suscripción
   */
  unsubscribe() {
    if (this.channel) {
      console.log(`[Realtime] Unsubscribing from ${this.tableName}`);
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.listeners.clear();
  }
}

/**
 * Hook helper para usar realtime subscriptions
 */
export function useRealtimeChanges<T>(
  tableName: string,
  onUpdate: (data: T) => void,
  filter?: string
) {
  const subscription = new RealtimeSubscription<T>(tableName, filter);

  const start = () => {
    subscription.subscribe();
    const unsubscribe = subscription.onChange(onUpdate);
    return unsubscribe;
  };

  const stop = () => {
    subscription.unsubscribe();
  };

  return { start, stop };
}
