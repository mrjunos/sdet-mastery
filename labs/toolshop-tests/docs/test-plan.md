## Inventario funcional de Toolshop
### Cliente
- Búsqueda y filtrado de productos (categoría, marca, precio, texto)
- Detalle de producto, productos relacionados
- Carrito (agregar, cambiar cantidad, eliminar)
- Checkout: login/registro → dirección → pago
- Cuenta: registro, login, perfil, historial, favoritos
- Devoluciones (rentals), contacto
### Admin
- CRUD de productos, marcas, categorías
- Gestión de usuarios, órdenes, mensajes de contacto

## Matriz de riesgo
| Área | Probabilidad | Impacto | Riesgo | Por qué |
|------|--------------|---------|--------|---------|
| Checkout + pago | Alta (multi-paso, estado, integración) | Crítico (revenue directo) | 🔴 P1 | Si falla, la tienda no vende |
| Búsqueda/filtros | Media | Alto (descubrimiento de producto) | 🟠 P2 | Puede que las personas no encuentren el producto que desean comprar |
| Registro/login | Media | Alto (bloquea todo lo demás) | 🟠 P2 | Bloquea el proceso de pago, y gestion del sitio |
| Carrito | Media | Alto | 🟠 P2 | Bloquea el proceso de pago |
| CRUD admin | Baja | Medio (interno) | 🟡 P3 | Afecta la gestión de catálogo pero no bloquea la compra |
| Contacto, favoritos | Baja | Bajo | 🟢 P4 | Causa desconfianza en el sitio |

## Estrategia por capa (top 3 riesgos)
### Checkout
- API: cálculo de totales, creación de orden, validaciones de stock → rápido, estable
- E2E (UNO solo): flujo completo búsqueda→carrito→pago como humo de revenue
- NO automatizar (aún): combinaciones de métodos de pago → exploratorio

### Filtros
- API: Combinatoria de filtros con data aleatoria
- UI: Texto, Categoría y Precio
- No automatizar (aún): Marca

### Registro/Login
- API: Pruebas negativas de seguridad
- E2E: Flujo completo de registro con páginas del manager
- No automatizar (aún): Logout y Reportes

## Los 10 primeros tests

| Test | Capa | Riesgo | Justificación |
|------|------|--------|---------------|
| Full Checkout | E2E | Alto | Verificar completo el flujo más importante |
| Cuenta Login/Registro -> Perfil | E2E | Alto | Verificar el flujo básico de un usuario autenticado |
| Búsqueda | UI | Medio | Habilidad para filtrar por texto |
| Filtros | UI | Medio | Habilidad para filtrar |
| Lógica de Filtros | API | Medio | Probar combinatoria de filtros |
| Detalle de Producto | UI | Medio | Ver las características del producto |
| Lógica de Carrito | API | Medio | Probar funciones del carrito con combinatoria de productos |
| Carrito Agregar -> cambiar cantidad -> eliminar | API | Medio | Ya hay un flujo UI que cubre parte, se cubre el resto con API |
| Devoluciones | API| Bajo | Garantizar que el flujo lógico complejo de una devolución funciona bien desde API |
| Lógica de Login | API | Medio | Probar lógica de autenticación y logout |
