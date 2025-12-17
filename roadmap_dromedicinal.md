# Roadmap del proyecto web — Dromedicinal

> **Objetivo:** construir una plataforma moderna que organice el catálogo, facilite pedidos (WhatsApp/Rappi) y centralice servicios y contacto, mejorando presencia digital y eficiencia operativa.

---

## 1) Contexto del negocio (base)
- **Nombre:** Droguería Dromedicinal  
- **Ubicación:** Av. 70 # 79-16, Engativá, Bogotá  
- **Contacto principal (WhatsApp):** 313 424 3625  
- **Correo:** contacto@dromedicinal.com  
- **Horario:**
  - Lunes a Sábado: 7:30 a.m. – 9:30 p.m.
  - Domingos y Festivos: 8:30 a.m. – 8:30 p.m.

**Preferencia de estilo:** moderno, limpio e innovador, ajustado a colores corporativos (prioridad al azul claro).

---

## 2) Objetivos del proyecto (qué se busca lograr)
1. **Catálogo ordenado y fácil de navegar** por categorías y subcategorías.
2. **Pedido simple y rápido**: contacto directo por **WhatsApp** y opción visible de **Rappi**.
3. **Centralizar servicios y atención**: servicios, canales de contacto y ubicación.
4. **Panel administrativo** para que el equipo gestione contenido sin depender de terceros.
5. **Mejorar visibilidad local** en Google (SEO local) y redes.
6. **Resultado esperado:** una plataforma profesional que soporte crecimiento.

---

## 3) Alcance del MVP (lo que se entrega en el primer lanzamiento)
### 3.1 Sitio público
- **Inicio** con propuesta de valor, categorías destacadas y llamados a acción (WhatsApp).
- **Catálogo** por categorías (medicamentos, nutrición, belleza, cuidado personal, bebé, hogar/mascotas, etc.).
- **Detalle de producto** (descripción, presentación, disponibilidad, y botón de pedir por WhatsApp).
- **Promociones y ofertas** (por campaña o temporada).
- **Servicios** (ej. toma de presión, control de glicemia, inyectología, asesoría, domicilios, etc. según inventario final).
- **Nosotros** (historia, misión, visión y diferenciadores).
- **Contacto** (formulario + mapa de Google + datos de atención).
- **SEO local básico** (estructura, metas, indexación, ficha/ubicación).

### 3.2 Pedidos
- **Canal principal:** WhatsApp (pedido asistido).
- **Canal alterno:** Rappi (enlace/CTA y lineamientos de uso).
- **Nota:** compra con pago en línea/checkout se deja como *fase futura* si se requiere.

### 3.3 Panel administrativo (operación diaria)
- **Catálogo:** crear/editar/eliminar productos, categorías, imágenes, precios y disponibilidad.
- **Inventario:** control por ubicación/temporada y alertas de reposición (inicialmente básico, escalable).
- **Promociones:** campañas, destacados y organización por temporada.
- **Usuarios:** roles y permisos (con capacitación incluida).
- **Informes:** reportes básicos (catálogo, disponibilidad, consultas/pedidos).

### 3.4 Analítica
- Integración con **Google Analytics** y **Meta Pixel** (y otros que se definan), para medir desempeño y campañas.

---

## 4) Fuera de alcance del MVP (para evitar ambigüedad)
- Pasarela de pagos y checkout completo (se propone como **Fase 2**).
- Integración profunda con sistemas de terceros (ERP, POS, inventarios externos) salvo que se defina explícitamente.
- Automatización compleja de logística (ruteo, operadores, etc.) salvo que se priorice.

---

## 5) Requisitos de insumo (lo que debe entregar el cliente)
- Logo en alta calidad y guía básica de marca (o colores definitivos).
- Lista inicial de categorías y subcategorías (validación final).
- Banco inicial de productos (mínimo: nombre, foto, presentación, descripción, precio si aplica, disponibilidad).
- Textos finales: misión/visión, historia, servicios, políticas básicas (privacidad/uso).
- Accesos: Google Business Profile (si existe), redes sociales (Facebook/Instagram) para vinculación.

---

## 6) Arquitectura e integraciones (base propuesta)
- **Frontend:** React / Next.js con Tailwind (sitio rápido y adaptable a móvil).
- **Backend:** PHP o Next.js (según hosting y despliegue).
- **Base de datos:** MySQL.
- **Integraciones:** WhatsApp, Google Maps, Facebook/Instagram, Rappi (enlace), analítica (GA + Pixel).
- **Enfoque:** escalable, seguro y orientado al cliente.

---

## 7) Roadmap de ejecución (4 semanas)
> Plan semanal claro y ejecutable para lanzamiento rápido.

### Semana 1 — Diseño visual y estructura
**Entregables:**
- Estructura del sitio (mapa de páginas) y navegación.
- Lineamientos visuales (tipografía, colores, componentes).
- Base de datos y estructura inicial del catálogo.
- Prototipo inicial (pantallas clave: inicio, catálogo, producto, contacto).

**Criterio de aceptación:**
- Diseño aprobado + estructura de categorías validada.

### Semana 2 — Vista pública y catálogo
**Entregables:**
- Sitio público funcional: inicio, catálogo, detalle de producto, promociones, servicios, nosotros, contacto.
- Botones/CTAs de WhatsApp y enlace de Rappi.
- Carga inicial de categorías y una primera muestra de productos.

**Criterio de aceptación:**
- Navegación completa + catálogo navegable sin fricción en móvil.

### Semana 3 — Panel administrativo y autenticación
**Entregables:**
- Panel administrativo para productos/categorías/imágenes/precios.
- Módulo de promociones.
- Gestión de usuarios (roles y permisos).
- Base de reportes básicos.

**Criterio de aceptación:**
- El equipo puede actualizar catálogo y promociones sin soporte técnico.

### Semana 4 — Pruebas, optimización y lanzamiento
**Entregables:**
- Pruebas funcionales (sitio + panel).
- Optimización de velocidad y estabilidad.
- SEO técnico + SEO local (base).
- Analítica (GA/Pixel) y eventos clave (clic WhatsApp, formularios, vistas de producto).
- Capacitación y guía corta de operación.
- **Lanzamiento** (go-live).

**Criterio de aceptación:**
- Sitio estable, medible y listo para operar diariamente.

---

## 8) Indicadores (KPIs) y medición (primeros 30 días)
- **+15% mejora en conversiones** (estimación inicial; se ajusta con datos reales).
- **Tiempo objetivo de respuesta por WhatsApp:** ~2 minutos (meta operativa).
- **-30% reducción de carga operativa** por centralización (estimación; validar).

**Cómo se mide:**
- Clics a WhatsApp / formularios / productos vistos / promociones.
- Tiempo promedio de atención (operación interna).
- Volumen de consultas/pedidos antes vs. después.

---

## 9) Riesgos típicos y mitigación
- **Carga de catálogo incompleta o sin fotos:** definir mínimo viable de productos y cargar por lotes.
- **Precios/stock cambian frecuentemente:** priorizar flujos simples de actualización en panel.
- **Aprobaciones tardías (diseño/textos):** fijar 1 día por semana para revisión y cierre.
- **Cumplimiento y comunicación responsable:** revisar textos de medicamentos y políticas.

---

## 10) Próximos pasos (para arrancar sin fricción)
1. Confirmar alcance final del MVP (sin/ con checkout).
2. Definir hosting/dominio (si el equipo lo gestiona o ya existe).
3. Validar estructura de categorías y “Top productos” iniciales.
4. Entregar accesos y materiales (logo, redes, Google, fotos, base de productos).
5. Aprobación del diseño (Semana 1) y arranque de desarrollo.

---

## Anexo — Fase 2 (opcional, si el negocio lo prioriza)
- Checkout/pago en línea, seguimiento de pedidos, historial del cliente.
- Programa de fidelización y beneficios.
- Integración avanzada con Rappi/otros canales (según disponibilidad técnica).
- Automatización de inventario más completa y reportes avanzados.
