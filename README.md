# ✅ ToDo List Pro
npx json-server --watch db.json --port 3001

> Sistema avanzado de gestión de tareas — UniMinuto · Ingeniería Web II

---

## 🚀 Tecnologías

| Tecnología | Uso |
|-----------|-----|
| React 19 + Vite | UI Framework y build tool |
| React Router DOM 7 | Navegación SPA |
| Axios | Cliente HTTP con interceptores |
| Context API | Estado global (Auth + Tasks) |
| JSON Server | API REST simulada |
| Framer Motion | Animaciones |
| React Hot Toast | Notificaciones toast |
| CSS Modules | Estilos modulares por componente |

---

## 📦 Instalación

```bash
cd todo-list-pro
npm install
```

---

## ▶️ Cómo ejecutar

### Terminal 1 — API JSON Server:
```bash
npm run server
# → http://localhost:3001
```

### Terminal 2 — App React:
```bash
npm run dev
# → http://localhost:5173
```

### O ambos juntos:
```bash
npm start
```

### Credenciales de prueba

| Campo | Valor |
|-------|-------|
| Email | `admin@admin.com` |
| Password | `123456` |

---

## 🗂️ Arquitectura del proyecto

```
src/
 ├── assets/
 ├── components/
 │    ├── Navbar/           # Navegación sticky + menú móvil
 │    ├── TaskCard/         # Tarjeta de tarea con acciones
 │    ├── StatsCards/       # 4 estadísticas en tiempo real
 │    ├── Modal/            # Modal reutilizable con Framer
 │    ├── Forms/TaskForm    # Formulario crear/editar
 │    └── Loader/           # Spinner elegante
 ├── pages/
 │    ├── Login/            # Autenticación con validaciones
 │    ├── Dashboard/        # Panel principal
 │    └── NotFound/         # Página 404
 ├── context/
 │    ├── AuthContext.jsx   # Sesión global
 │    └── TaskContext.jsx   # CRUD + filtros + stats
 ├── services/
 │    ├── api.js            # Axios base + interceptores
 │    ├── authService.js    # Login / logout / localStorage
 │    └── taskService.js    # CRUD tareas y categorías
 ├── hooks/
 │    ├── useTaskForm.js    # Formulario + validaciones
 │    └── useDebounce.js    # Debounce para búsqueda
 ├── utils/
 │    ├── constants.js      # Constantes globales
 │    └── helpers.js        # Fechas, filtros, estadísticas
 ├── routes/
 │    ├── AppRouter.jsx     # Rutas SPA
 │    └── ProtectedRoute    # Guard de autenticación
 └── styles/global.css      # Tokens CSS + reset
```

---

## 🔄 Flujo de datos

```
Login → authService → JSON Server /users
                              ↓
                     AuthContext (user, login, logout)
                              ↓
                     ProtectedRoute → Dashboard
                              ↓
                     TaskContext (tasks, CRUD, stats, filters)
                              ↓
                     taskService → JSON Server /tasks /categories
```

---

## 📊 API Endpoints

| Método | Endpoint | Acción |
|--------|----------|--------|
| GET | `/users?email=x` | Autenticación |
| GET | `/tasks` | Listar tareas |
| POST | `/tasks` | Crear tarea |
| PUT | `/tasks/:id` | Editar tarea |
| DELETE | `/tasks/:id` | Eliminar tarea |
| GET | `/categories` | Listar categorías |
| POST | `/categories` | Nueva categoría |

---

## 🧠 Manejo de estado global

### AuthContext
- `user`, `loading`, `authError`, `isAuthenticated`
- `login(email, password)`, `logout()`, `clearAuthError()`

### TaskContext
- `tasks`, `filteredTasks`, `categories`, `loading`, `stats`
- `addTask()`, `editTask()`, `removeTask()`, `toggleTask()`
- `updateFilters()`, `clearFilters()`, `addCategory()`

---

## 🛡️ Manejo de errores

| Escenario | Mecanismo |
|-----------|-----------|
| Sin servidor | Interceptor Axios → toast error |
| Credenciales inválidas | Validación local + API |
| Campos vacíos | `useTaskForm.validate()` |
| Fechas inválidas | `isValidDateRange()` |
| Error CRUD | try/catch → toast con mensaje |
| Ruta protegida | Redirect a `/login` |

---

## 🎨 Paleta de colores

| Token | Color | Uso |
|-------|-------|-----|
| `--color-green-primary` | `#00e676` | Acento principal |
| `--color-bg-primary` | `#0a0e1a` | Fondo oscuro |
| `--color-pending` | `#ffd740` | Tareas pendientes |
| `--color-completed` | `#00e676` | Tareas completadas |
| `--color-overdue` | `#ff5252` | Tareas vencidas |
| `--color-upcoming` | `#40c4ff` | Próximas a vencer |

---

## 📱 Responsive breakpoints

| Pantalla | Layout |
|---------|--------|
| ≥ 1024px | Desktop — 4 stats, sidebar completo |
| 768–1023px | Tablet — 2 columnas stats |
| < 768px | Móvil — menú hamburguesa |
| < 480px | Mobile first — todo apilado |

---

## ✨ Bonus implementados

- ✅ Animaciones Framer Motion en cards, modal y página
- ✅ Toast notifications diferenciadas por tipo
- ✅ Loader spinner elegante con tres capas
- ✅ Confirmación inline al eliminar (sin alert del browser)
- ✅ Botón de acceso rápido demo en login
- ✅ Scrollbar personalizado con tema verde
- ✅ Toggle completada/pendiente sin recargar
- ✅ Indicador de días restantes en cada tarea
- ✅ Categorías con color asignado dinámicamente

---

## 👨‍💻 Proyecto Académico

**UniMinuto · Ingeniería Web II · 2026**
