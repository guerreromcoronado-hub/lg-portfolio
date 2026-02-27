# Laura Guerrero Portfolio - Sistema Administrativo

Portfolio profesional con sistema de administración completo construido con Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion y Supabase.

## 🚀 Características

### Frontend
- **Next.js 15** con App Router
- **React 19** con Server Components
- **TypeScript** para type-safety
- **Tailwind CSS** para estilos pixel-perfect
- **Framer Motion** para animaciones profesionales
- **Diseño responsive** optimizado para todos los dispositivos

### Backend & Auth
- **Supabase** para base de datos PostgreSQL
- **Supabase Auth** para autenticación segura
- **Row Level Security (RLS)** para protección de datos
- **Real-time subscriptions** (opcional)
- **API RESTful** automática

### Sistema Admin
- **Dashboard completo** para gestión de contenido
- **CRUD de posts** del blog
- **CRUD de proyectos** (casos de estudio)
- **Sistema de borradores** y publicación
- **Editor visual** de contenido estructurado
- **Protección de rutas** con middleware

## 📦 Instalación

### 1. Clonar el repositorio

```bash
cd c:\proyects\lauraGuerrero\laura-guerrero-portfolio
npm install
```

### 2. Configurar Supabase

#### Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta si no tienes
3. Crea un nuevo proyecto
4. Anota tu Project URL y anon key

#### Ejecutar el esquema de base de datos

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Copia todo el contenido del archivo `supabase/schema.sql`
3. Pégalo en el editor y ejecuta

Esto creará:
- Tabla `posts` para artículos del blog
- Tabla `projects` para casos de estudio
- Índices para optimización
- Políticas de seguridad (RLS)
- Triggers para timestamps automáticos

#### Cargar datos de ejemplo (Opcional pero recomendado)

Para empezar con datos de muestra (3 posts y 3 proyectos):

1. En el mismo **SQL Editor** de Supabase
2. Copia todo el contenido de `supabase/seed-data.sql`
3. Pégalo y ejecuta

**¿Qué incluye?**
- ✉️ 3 posts de blog sobre Email Marketing, SEO y E-commerce
- 🚀 3 proyectos/casos de estudio con métricas reales
- 📊 Contenido estructurado listo para mostrar

Para instrucciones detalladas, ver: [INSTALL_MOCK_DATA.md](INSTALL_MOCK_DATA.md)

#### Crear usuario administrador

1. En Supabase, ve a **Authentication > Users**
2. Click en "Add user" > "Create new user"
3. Ingresa email y contraseña
4. Confirma el email (o deshabilita la verificación en Development)

### 3. Variables de entorno

Crea `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

**¿Dónde encontrar las keys?**
- Ve a tu proyecto en Supabase
- Settings > API
- Project URL y anon public key están ahí

### 4. Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 5. Verificar que los datos mock están cargados (Opcional)

Si cargaste los datos de ejemplo, verifica que funcionan:

```bash
# Instalar ts-node si no lo tienes
npm install -D ts-node

# Ejecutar script de verificación
npx ts-node scripts/check-db.ts
```

Deberías ver un listado de 3 posts y 3 proyectos. Si no, revisa [INSTALL_MOCK_DATA.md](INSTALL_MOCK_DATA.md).

## 🔐 Sistema de Autenticación

### Login de Administrador

**URL:** [http://localhost:3000/login](http://localhost:3000/login)

⚠️ **Importante:** Esta ruta NO tiene enlaces públicos en el sitio. Es de acceso directo solo para administradores.

Credenciales: Las que configuraste en Supabase Auth

### Rutas Protegidas

Todas las rutas bajo `/dashboard/*` están protegidas por middleware y requieren autenticación.

## 📁 Estructura del Proyecto

```
laura-guerrero-portfolio/
├── app/
│   ├── layout.tsx                    # Layout principal
│   ├── page.tsx                      # Página home
│   ├── login/                        # Login de admin
│   │   └── page.tsx
│   ├── dashboard/                    # Panel administrativo
│   │   ├── layout.tsx               # Layout del dashboard
│   │   ├── page.tsx                 # Resumen/estadísticas
│   │   ├── posts/                   # Gestión de posts
│   │   │   ├── page.tsx            # Lista de posts
│   │   │   └── new/                # Crear nuevo post
│   │   │       └── page.tsx
│   │   └── projects/               # Gestión de proyectos
│   │       ├── page.tsx            # Lista de proyectos
│   │       └── new/                # Crear proyecto
│   │           └── page.tsx
│   ├── blog/                        # Blog dinámico
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── proyectos/                   # Proyectos dinámicos
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── blog-articulo/               # Template de blog (demo)
│   │   └── page.tsx
│   ├── caso-de-estudio/             # Template de proyecto (demo)
│   │   └── page.tsx
│   └── globals.css
├── components/
│   ├── Navigation.tsx               # Nav principal
│   ├── BlogNavigation.tsx           # Nav para blog/proyectos
│   ├── Footer.tsx
│   ├── ProgressBar.tsx
│   └── sections/                    # Secciones del home
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── Services.tsx
│       ├── Portfolio.tsx
│       ├── Blog.tsx
│       └── Contact.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Cliente de Supabase (browser)
│   │   └── server.ts               # Cliente de Supabase (server)
│   ├── api/
│   │   └── content.ts              # Helpers para queries
│   └── types/
│       └── database.ts             # Tipos TypeScript
├── supabase/
│   ├── schema.sql                  # Esquema de base de datos
│   ├── seed-data.sql               # 🆕 Datos de ejemplo (mock)
│   ├── reset-data.sql              # 🆕 Limpieza de datos
│   └── README.md                   # 🆕 Documentación de DB
├── scripts/
│   └── check-db.ts                 # 🆕 Verificar base de datos
├── middleware.ts                    # Middleware de auth
├── INSTALL_MOCK_DATA.md            # 🆕 Guía de instalación de datos
└── README.md
```

## 🎨 Uso del Dashboard

### Crear un Post

1. Accede a `/dashboard`
2. Click en "Blog Posts" en el sidebar
3. Click en "+ Nuevo Post"
4. Completa la información:
   - **Título:** Aparecerá en el hero del artículo
   - **Slug:** URL amigable (se genera automáticamente)
   - **Excerpt:** Resumen corto para las cards
   - **Categoría:** Ej: "Email Marketing", "SEO", etc.
   - **Emoji:** Para las cards y hero
   - **Introducción:** Párrafos iniciales
   - **Cita destacada:** Quote en el artículo
   - **Lista de errores/tips:** Secciones numeradas con soluciones
   - **Caja destacada:** Highlight box opcional
   - **Conclusión:** Párrafos finales
5. Marca "Publicar ahora" si quieres que sea visible
6. Click en "Crear Post"

El post estará disponible en: `/blog/{slug}`

### Crear un Proyecto

1. Accede a `/dashboard`
2. Click en "Proyectos" en el sidebar
3. Click en "+ Nuevo Proyecto"
4. Completa:
   - Información básica (título, cliente, año)
   - Contexto del proyecto
   - Proceso paso a paso
   - Resultados con métricas
   - Herramientas utilizadas
   - Aprendizajes
5. Marca como "Destacado" para aparecer en el home
6. Publica cuando esté listo

El proyecto estará en: `/proyectos/{slug}`

### Gestionar Contenido

Desde las listas de posts/proyectos puedes:
- ✏️ **Editar:** Modificar cualquier campo
- ✅ **Publicar/Despublicar:** Controlar visibilidad
- ⭐ **Destacar** (solo proyectos): Aparecerán en home
- 🗑 **Eliminar:** Borrar permanentemente

## 🗄️ Base de Datos

### Tabla: posts

```sql
- id (UUID)
- title (TEXT)
- slug (TEXT UNIQUE)
- excerpt (TEXT)
- content (JSONB) - Contenido estructurado
- category (TEXT)
- emoji (TEXT)
- published (BOOLEAN)
- views (INTEGER)
- read_time (TEXT)
- created_at, updated_at, published_at
- author_id (UUID FK)
```

### Tabla: projects

```sql
- id (UUID)
- title, slug, excerpt
- content (JSONB) - Contenido estructurado
- category, tags (TEXT[])
- emoji, client, services, duration, year
- tools (TEXT[])
- metrics (JSONB)
- published, featured (BOOLEAN)
- created_at, updated_at, published_at
- author_id (UUID FK)
```

### Row Level Security (RLS)

- **Lectura pública:** Solo posts/proyectos publicados
- **Escritura:** Solo usuarios autenticados
- Protección automática contra acceso no autorizado

## 🔒 Seguridad

- ✅ Middleware de Next.js para proteger rutas
- ✅ RLS en Supabase para proteger datos
- ✅ Tokens JWT seguros
- ✅ Variables de entorno para keys sensibles
- ✅ Validación en cliente y servidor

## 📝 Notas Importantes

1. **No commitear `.env.local`** - Está en `.gitignore`
2. **Ruta `/login` es privada** - Sin enlaces públicos
3. **Backup regular** de la base de datos desde Supabase
4. **Tipos actualizados** - Regenera tipos si cambias el schema

## 🚀 Deployment

### Vercel (Recomendado)

1. Push tu código a GitHub
2. Importa el proyecto en Vercel
3. Configura las variables de entorno en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático

Compatible con Netlify, AWS Amplify, Railway, etc.

## 🆘 Troubleshooting

### Error: "Invalid API key"
- Verifica que las keys en `.env.local` sean correctas
- Restart el servidor de desarrollo

### Error: "Row level security"
- Asegúrate de ejecutar `schema.sql` completo
- Verifica políticas en Supabase Dashboard > Authentication > Policies

### Posts no aparecen en el sitio
- Verifica que `published = true`
- Check que el slug sea único
- Revisa la consola de errores
- Si cargaste datos mock, ejecuta `npx ts-node scripts/check-db.ts` para verificar

### No puedo hacer login
- Verifica que el usuario exista en Supabase Auth
- Confirma el email si es requerido
- Check la configuración de Auth en Supabase

### Error ejecutando seed-data.sql
- Ejecuta primero `schema.sql` si no lo hiciste
- Si los datos ya existen, usa `reset-data.sql` primero
- Verifica que estés conectado al proyecto correcto en Supabase

## 💡 Tips sobre Datos Mock

### ¿Cuándo usar datos mock?

✅ **Úsalos si:**
- Es tu primera vez configurando el proyecto
- Quieres ver cómo se ve el sitio con contenido real
- Necesitas datos para probar funcionalidades
- Estás haciendo una demo del proyecto

❌ **No los uses si:**
- Ya tienes contenido real en producción
- Quieres empezar de cero con tu propio contenido

### ¿Puedo editarlos después?

Sí, los datos mock se pueden:
- ✏️ **Editar** desde el dashboard `/dashboard`
- 🗑 **Eliminar** uno por uno desde las listas
- 🔄 **Reemplazar** ejecutando `reset-data.sql` y luego `seed-data.sql` de nuevo

### Personalizar los datos mock

Los datos están en `supabase/seed-data.sql`. Puedes:
1. Editar el archivo SQL directamente
2. Cambiar títulos, categorías, emojis, etc.
3. Agregar más posts/proyectos copiando la estructura
4. Volver a ejecutar el script

## 📚 Recursos

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Framer Motion](https://www.framer.com/motion/)
- [Documentación Tailwind CSS](https://tailwindcss.com/docs)

---

Desarrollado con ❤️ por GitHub Copilot
