import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import http from "http"

import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"

import ProductManager from "./managers/ProductManager.js"

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const productManager = new ProductManager("./data/products.json")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"))

/* HANDLEBARS */

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

/* ROUTES */

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)

/* WEBSOCKETS */

io.on("connection", async (socket) => {

    console.log("Cliente conectado")

    const products = await productManager.getProducts()
    socket.emit("products", products)

    socket.on("addProduct", async (product) => {

        await productManager.addProduct(product)

        const products = await productManager.getProducts()
        io.emit("products", products)

    })

    socket.on("deleteProduct", async (id) => {

        await productManager.deleteProduct(id)

        const products = await productManager.getProducts()
        io.emit("products", products)

    })

})

server.listen(8080, () => {
    console.log("Servidor corriendo en puerto 8080")
})