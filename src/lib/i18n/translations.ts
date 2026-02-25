/**
 * Translations — ES / EN dictionaries
 *
 * All user-facing strings for the app.
 * Add keys here first, then use in components via useTranslation().
 */

export type Lang = "es" | "en";

const translations = {
    es: {
        nav: {
            home: "Inicio",
            historias: "Historias",
            mapa: "Mapa",
            catalogo: "Catálogo",
        },
        header: {
            tagline: "Viviendo",
            sub: "LA TRADICIÓN",
        },
        home: {
            badge: "HISTORIA DEL DÍA",
            readArticle: "Leer Artículo",
            coleccionViva: "Colección Viva",
            descubreMas: "Descubre Más",
            taller: "El Taller",
            tallerSub: "Proceso",
            tallerDesc: "Cómo se crea una mojiganga",
            tips: "Tips & Datos",
            tipsSub: "Curiosidades",
            tipsDesc: "Sabías que...",
            heroFallbackTitle: "Ojos que Cuentan Historias",
            heroFallbackDesc: "Descubre el significado detrás de la mirada esmeralda de Doña Josefa...",
        },
        historias: {
            title: "Historias",
            sharePrompt: "Comparte tu historia...",
            destacados: "Destacados Hoy",
            labels: {
                taller: "Taller",
                desfile: "Desfile",
                artesano: "Artesano",
                museo: "Museo",
            },
            timeAgo: {
                minutes: "hace {n}m",
                hours: "hace {n}h",
                days: "hace {n}d",
            },
            defaultLocation: "México",
        },
        catalogo: {
            title: "Almas de Cartón",
            subtitle: "El catálogo de nuestras mojigangas",
            loading: "Cargando colección...",
            searchPlaceholder: "Buscar mojiganga...",
        },
        detail: {
            historia: "Historia",
            materiales: "Materiales",
            backToCatalog: "Ver todo el Catálogo",
            noFound: "No encontrada",
            noFoundDesc: "Esta mojiganga no existe o fue removida.",
            loading: "Cargando...",
            artisan: "Artesano",
            year: "Año",
            category: "Categoría",
        },
        mapa: {
            loadingMap: "Cargando mapa...",
            enVivo: "EN VIVO",
            verRuta: "Ver Ruta",
            compartir: "Compartir",
        },
        taller: {
            title: "El Taller",
            badge: "Proceso Artesanal",
            subtitle: "Descubre el proceso ancestral de creación de una mojiganga, desde la estructura de carrizo hasta la vestimenta final.",
            tapHint: "Toca cada tarjeta para ver los detalles",
            materialesTitle: "Materiales Tradicionales",
            steps: [
                {
                    title: "Estructura de Carrizo",
                    description: "Se construye un esqueleto ligero con varas de carrizo atadas con alambre. Esta estructura define la forma y tamaño de la mojiganga, que puede medir hasta 3.5 metros.",
                },
                {
                    title: "Modelado con Papel",
                    description: "Se aplican capas de papel periódico impregnado con engrudo (mezcla de harina y agua). Cada capa se deja secar antes de aplicar la siguiente para dar rigidez.",
                },
                {
                    title: "Pintura y Detalle",
                    description: "Se pinta con colores vibrantes: esmaltes, acrílicos y pigmentos naturales. Los detalles del rostro, vestimenta y accesorios definen la personalidad del personaje.",
                },
                {
                    title: "Vestimenta Final",
                    description: "Se viste con telas, encajes y adornos. La ropa refleja la identidad del personaje: puede ser una novia, un diablo, una catrina o un personaje histórico.",
                },
            ],
            materiales: [
                { emoji: "🎋", nombre: "Carrizo" },
                { emoji: "📰", nombre: "Papel" },
                { emoji: "🫗", nombre: "Engrudo" },
                { emoji: "🎨", nombre: "Pintura" },
                { emoji: "🧵", nombre: "Tela" },
                { emoji: "✨", nombre: "Adornos" },
            ],
        },
        tips: {
            title: "Tips & Datos",
            badge: "Curiosidades",
            titleHighlight: "Datos",
            subtitle: "Curiosidades sobre las mojigangas",
            featuredTitle: "¿Sabías que...?",
            featuredText: "La palabra 'Mojiganga' viene del árabe 'moharracha', que significa 'bufonada'. En España eran representaciones teatrales cómicas que se hacían en las calles.",
            items: [
                {
                    title: "Hasta 3.5 metros",
                    description: "Las mojigangas más grandes pueden medir más de 3 metros de altura y pesar hasta 25 kg.",
                },
                {
                    title: "Siglo XVI",
                    description: "La tradición llegó a México con los evangelizadores españoles y se fusionó con rituales prehispánicos.",
                },
                {
                    title: "Una sola persona",
                    description: "A pesar de su tamaño, una mojiganga la baila una sola persona que carga la estructura desde adentro.",
                },
                {
                    title: "San Miguel de Allende",
                    description: "La capital de las mojigangas. Aquí se celebran los desfiles más espectaculares durante las fiestas patronales.",
                },
                {
                    title: "Patrimonio Vivo",
                    description: "En 2023 se presentó la solicitud para declarar a las mojigangas como Patrimonio Cultural Inmaterial.",
                },
            ],
        },
        subir: {
            title: "Comparte tu Historia",
            addPhoto: "Toca para agregar foto",
            nameLabel: "Tu Nombre",
            namePlaceholder: "¿Cómo te llamas?",
            storyLabel: "Tu Historia",
            storyPlaceholder: "Cuéntanos tu experiencia con las mojigangas...",
            locationLabel: "Ubicación",
            locationPlaceholder: "¿Dónde fue? (ej. San Miguel de Allende)",
            submit: "Compartir Historia",
            sending: "Enviando...",
            successTitle: "¡Historia Enviada!",
            successDesc: "Tu relato ya es parte del archivo comunitario. Gracias por mantener viva la tradición.",
            successBtn: "Ver Historias",
            errorGeneric: "Ocurrió un error al enviar. Intenta de nuevo.",
        },
        common: {
            back: "Volver",
            loading: "Cargando...",
        },
    },

    en: {
        nav: {
            home: "Home",
            historias: "Stories",
            mapa: "Map",
            catalogo: "Catalog",
        },
        header: {
            tagline: "Living",
            sub: "THE TRADITION",
        },
        home: {
            badge: "STORY OF THE DAY",
            readArticle: "Read Article",
            coleccionViva: "Living Collection",
            descubreMas: "Discover More",
            taller: "The Workshop",
            tallerSub: "Process",
            tallerDesc: "How a mojiganga is made",
            tips: "Tips & Facts",
            tipsSub: "Curiosities",
            tipsDesc: "Did you know...",
            heroFallbackTitle: "Eyes That Tell Stories",
            heroFallbackDesc: "Discover the meaning behind Doña Josefa's emerald gaze...",
        },
        historias: {
            title: "Stories",
            sharePrompt: "Share your story...",
            destacados: "Featured Today",
            labels: {
                taller: "Workshop",
                desfile: "Parade",
                artesano: "Artisan",
                museo: "Museum",
            },
            timeAgo: {
                minutes: "{n}m ago",
                hours: "{n}h ago",
                days: "{n}d ago",
            },
            defaultLocation: "Mexico",
        },
        catalogo: {
            title: "Souls of Cardboard",
            subtitle: "Our mojigangas catalog",
            loading: "Loading collection...",
            searchPlaceholder: "Search mojiganga...",
        },
        detail: {
            historia: "Story",
            materiales: "Materials",
            backToCatalog: "View full Catalog",
            noFound: "Not found",
            noFoundDesc: "This mojiganga does not exist or was removed.",
            loading: "Loading...",
            artisan: "Artisan",
            year: "Year",
            category: "Category",
        },
        mapa: {
            loadingMap: "Loading map...",
            enVivo: "LIVE",
            verRuta: "Get Directions",
            compartir: "Share",
        },
        taller: {
            title: "The Workshop",
            badge: "Artisan Process",
            subtitle: "Discover the ancestral process of creating a mojiganga, from the reed frame to the final costume.",
            tapHint: "Tap each card to see the details",
            materialesTitle: "Traditional Materials",
            steps: [
                {
                    title: "Reed Frame",
                    description: "A lightweight skeleton is built with reed stalks tied with wire. This frame defines the shape and size of the mojiganga, which can stand up to 3.5 meters tall.",
                },
                {
                    title: "Paper Modeling",
                    description: "Layers of newspaper soaked in paste (a mix of flour and water) are applied. Each layer is left to dry before applying the next one to build rigidity.",
                },
                {
                    title: "Painting & Detail",
                    description: "The figure is painted with vibrant colors: enamels, acrylics and natural pigments. Facial expression, clothing and accessories define the character's personality.",
                },
                {
                    title: "Final Costume",
                    description: "The figure is dressed with fabrics, lace and ornaments. The clothing reflects the character's identity: a bride, a devil, a catrina or a historical figure.",
                },
            ],
            materiales: [
                { emoji: "🎋", nombre: "Reed" },
                { emoji: "📰", nombre: "Paper" },
                { emoji: "🫗", nombre: "Paste" },
                { emoji: "🎨", nombre: "Paint" },
                { emoji: "🧵", nombre: "Fabric" },
                { emoji: "✨", nombre: "Ornaments" },
            ],
        },
        tips: {
            title: "Tips & Facts",
            badge: "Curiosities",
            titleHighlight: "Facts",
            subtitle: "Curiosities about mojigangas",
            featuredTitle: "Did you know...?",
            featuredText: "The word 'Mojiganga' comes from the Arabic 'moharracha', meaning 'buffoonery'. In Spain they were comic theatrical performances held in the streets.",
            items: [
                {
                    title: "Up to 3.5 meters",
                    description: "The largest mojigangas can stand over 3 meters tall and weigh up to 25 kg.",
                },
                {
                    title: "16th Century",
                    description: "The tradition arrived in Mexico with Spanish missionaries and merged with pre-Hispanic rituals.",
                },
                {
                    title: "Just one person",
                    description: "Despite their size, a mojiganga is danced by a single person carrying the structure from the inside.",
                },
                {
                    title: "San Miguel de Allende",
                    description: "The capital of mojigangas. The most spectacular parades are held here during the patron saint festivals.",
                },
                {
                    title: "Living Heritage",
                    description: "In 2023, a petition was submitted to declare mojigangas as Intangible Cultural Heritage.",
                },
            ],
        },
        subir: {
            title: "Share your Story",
            addPhoto: "Tap to add a photo",
            nameLabel: "Your Name",
            namePlaceholder: "What is your name?",
            storyLabel: "Your Story",
            storyPlaceholder: "Tell us about your experience with mojigangas...",
            locationLabel: "Location",
            locationPlaceholder: "Where was it? (e.g. San Miguel de Allende)",
            submit: "Share Story",
            sending: "Sending...",
            successTitle: "Story Shared!",
            successDesc: "Your story is now part of the community archive. Thanks for keeping the tradition alive.",
            successBtn: "View Stories",
            errorGeneric: "An error occurred. Please try again.",
        },
        common: {
            back: "Back",
            loading: "Loading...",
        },
    },
} as const;

export type Translations = typeof translations.es;
export default translations;
