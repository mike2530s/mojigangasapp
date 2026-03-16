# Tecnologías del Proyecto

Este proyecto está construido con herramientas modernas, diseñadas para ser rápidas, seguras y escalables. A continuación, se detalla el *stack* tecnológico utilizado y por qué se eligió cada pieza.

## Framework y Lenguaje

*   **Next.js (React Framework):** Elegido por su capacidad de renderizado híbrido (SSR/SSG), lo que mejora drásticamente el SEO (crucial para dar a conocer la cultura) y la velocidad de carga inicial de las páginas.
*   **TypeScript:** Se usa en lugar de JavaScript puro para asegurar la calidad del código. Permite detectar errores durante el desarrollo y autocompletar propiedades, haciendo que el proyecto sea más robusto a medida que crece.

## Estilos y Diseño

*   **Tailwind CSS:** Es un framework de CSS de utilidades que nos permite crear diseños personalizados (como la paleta de colores vibrante "rosa-mexicano" y "cyan-fiesta") de forma rapidísima, directamente en los componentes, manteniento el tamaño final del CSS al mínimo.
*   **Framer Motion:** Biblioteca para animaciones en React. Se utiliza para darle "vida" a la página (por ejemplo, transiciones suaves, tarjetas de eventos que se deslizan, animaciones del menú), proporcionando una experiencia de usuario (UX) premium y fluida.

## Backend, Base de Datos y Autenticación

*   **Supabase:** Funciona como nuestra alternativa open-source a Firebase (Backend as a Service). Se eligió por:
    *   **PostgreSQL:** Un motor de base de datos relacional potente y sólido.
    *   **Autenticación integrada:** Maneja el inicio de sesión de artesanos y administradores de forma segura.
    *   **Almacenamiento (Storage):** Donde se suben y sirven las imágenes de las historias y mojigangas, manteniendo los buckets organizados.
    *   **Row Level Security (RLS):** Garantiza que cada artesano solo pueda editar o borrar sus propias creaciones.

## Mapas interactivos

*   **Leaflet & React-Leaflet:** La biblioteca líder de código abierto para mapas web interactivos. Se optó por ella en lugar de Google Maps para evitar costos de API, aprovechando los mosaicos (tiles) de OpenStreetMap para mostrar rutas, desfiles y artesanos de forma dinámica.

## Otras Herramientas

*   **Lucide React:** Iconos vectoriales consistentes y ligeros utilizados en toda la app.
*   **Sonner:** Utilizado para las alertas emergentes (toast notifications) como éxito al crear, borrar o editar un registro.
