# Entrega Final - Backend Ecommerce

## Descripción

Proyecto final de backend para un ecommerce desarrollado con Node.js y Express.

La aplicación implementa una API REST completa para gestión de productos y carritos, renderizado de vistas dinámicas con Handlebars, persistencia en MongoDB Atlas y actualización en tiempo real mediante WebSockets con Socket.io.

## Funcionalidades principales

* Gestión completa de productos (CRUD)
* Gestión completa de carritos
* Persistencia en MongoDB Atlas
* Paginación de productos
* Filtros por categoría o disponibilidad
* Ordenamiento por precio
* Populate de productos dentro de carritos
* Renderizado de vistas con Handlebars
* Actualización en tiempo real de productos con WebSockets

---

## Tecnologías utilizadas

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* Mongoose Paginate V2
* Express Handlebars
* Socket.io
* Dotenv

---

## Instalación

### 1. Clonar repositorio

git clone TU_REPO_URL

### 2. Ingresar al proyecto

cd NOMBRE_DEL_PROYECTO

### 3. Instalar dependencias

npm install

### 4. Crear archivo `.env`

En la raíz del proyecto crear:

MONGO_URI=your_mongodb_connection_string
PORT=8080

### 5. Ejecutar servidor

Modo desarrollo:

npm run dev

Modo normal:

npm start

---

## Acceso al servidor

Servidor local:

http://localhost:8080

---

## Vistas disponibles

### Home

GET /

Renderiza productos cargados desde base de datos.

---

### Productos en tiempo real

GET /realtimeproducts

Permite:

* agregar productos
* eliminar productos

La lista se actualiza automáticamente mediante Socket.io.

---

### Productos paginados

GET /products

Permite:

* paginación
* ordenamiento
* filtros

Parámetros disponibles:

* limit
* page
* sort
* query

Ejemplo:

/products?limit=5&page=1&sort=asc&query=category

---

### Detalle de producto

GET /products/:pid

Muestra detalle individual del producto.

---

### Vista de carrito

GET /carts/:cid

Muestra carrito con productos poblados mediante populate.

---

## API REST

## Productos

### Obtener productos

GET /api/products

### Obtener producto por ID

GET /api/products/:pid

### Crear producto

POST /api/products

### Actualizar producto

PUT /api/products/:pid

### Eliminar producto

DELETE /api/products/:pid

---

## Carritos

### Crear carrito

POST /api/carts

### Obtener carrito

GET /api/carts/:cid

### Agregar producto al carrito

POST /api/carts/:cid/products/:pid

### Eliminar producto del carrito

DELETE /api/carts/:cid/products/:pid

### Reemplazar carrito completo

PUT /api/carts/:cid

### Actualizar cantidad de producto

PUT /api/carts/:cid/products/:pid

### Vaciar carrito

DELETE /api/carts/:cid

---

## WebSockets

Implementado en:

GET /realtimeproducts

Eventos disponibles:

* addProduct
* deleteProduct

---

## Base de datos

Base utilizada: MongoDB Atlas

Colecciones:

* products
* carts

---

## Variables de entorno

Archivo `.env`

MONGO_URI=your_mongodb_connection_string
PORT=8080

---

## Notas

El proyecto utiliza MongoDB Atlas, por lo tanto es necesario configurar correctamente la cadena de conexión antes de ejecutar.

---

## Autor

Juan Hernandez
