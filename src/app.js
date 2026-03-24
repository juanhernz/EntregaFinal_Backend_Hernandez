import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import http from "http"
import mongoose from "mongoose"

import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"

import ProductModel from "./models/Product.model.js"

import dotenv from "dotenv"
dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server)

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

    try {

        const products = await ProductModel.find()
        socket.emit("products", products)

    } catch (error) {

        console.log("Error cargando productos:", error.message)

    }

    /* AGREGAR PRODUCTO */

    socket.on("addProduct", async (product) => {

        try {

            await ProductModel.create(product)

            const products = await ProductModel.find()
            io.emit("products", products)

        } catch (error) {

            console.log("Error agregando producto:", error.message)

        }

    })

    /* ELIMINAR PRODUCTO */

    socket.on("deleteProduct", async (id) => {

        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return console.log("ID inválido")
            }

            await ProductModel.findByIdAndDelete(id)

            const products = await ProductModel.find()
            io.emit("products", products)

        } catch (error) {

            console.log("Error eliminando producto:", error.message)

        }

    })

})

/* MONGO */

mongoose.connect(process.env.MONGO_URL || "mongodb+srv://TU_URL")
    .then(() => console.log("Mongo conectado"))
    .catch(error => console.log("Error Mongo:", error.message))

/* SERVER */

server.listen(8080, () => {
    console.log("Servidor corriendo en puerto 8080")
})