# 🛒 Backend - Entrega 1 (Products & Carts API)

Servidor backend desarrollado con **Node.js** y **Express** que permite gestionar productos y carritos de compra mediante una API REST, con persistencia en archivos JSON.

---

## 🚀 Tecnologías usadas

- Node.js  
- Express  
- File System (fs/promises)  

---

## ⚙️ Instalación

1. Clonar el repositorio:
```bash
git clone <URL_DEL_REPO>
```

2. Entrar al proyecto:
```bash
cd nombre-del-proyecto
```

3. Instalar dependencias:
```bash
npm install
```

4. Ejecutar servidor:
```bash
npm run dev
```

Servidor corriendo en:

```
http://localhost:8080
```

---

## 📂 Persistencia

Los datos se almacenan en archivos:

```
/data/products.json
/data/carts.json
```

---

## 📌 Endpoints

### 🛒 Products

Base URL:
```
/api/products
```

#### Obtener todos los productos
```
GET /api/products
```

#### Obtener producto por ID
```
GET /api/products/:pid
```

#### Crear producto
```
POST /api/products
```

Body ejemplo:

```json
{
  "title": "Remera",
  "description": "Algodón",
  "code": "REM-01",
  "price": 12000,
  "status": true,
  "stock": 10,
  "category": "ropa",
  "thumbnails": ["img1.png"]
}
```

#### Actualizar producto
```
PUT /api/products/:pid
```

Body ejemplo:

```json
{
  "price": 15000,
  "stock": 5
}
```

#### Eliminar producto
```
DELETE /api/products/:pid
```

---

### 🛒 Carts

Base URL:
```
/api/carts
```

#### Crear carrito
```
POST /api/carts
```

#### Obtener carrito por ID
```
GET /api/carts/:cid
```

#### Agregar producto al carrito
```
POST /api/carts/:cid/product/:pid
```

Si el producto ya existe en el carrito, se incrementa automáticamente su cantidad.

---

## ✅ Funcionalidades

- CRUD completo de productos  
- Creación y consulta de carritos  
- Persistencia en archivos JSON  
- IDs autogenerados  
- Uso de routers de Express  

---

## 📎 Notas

- No incluye implementación visual.  
- Probado mediante Postman.  
- No se incluye carpeta `node_modules` en el repositorio.
