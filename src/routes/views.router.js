import { Router } from "express"
import ProductModel from "../models/Product.model.js"
import CartModel from "../models/Cart.model.js"

const router = Router()

// HOME original
router.get("/", async (req, res) => {
    try {
        const products = await ProductModel.find().lean()

        res.render("home", {
            products
        })

    } catch (error) {
        res.status(500).send(error.message)
    }
})

// realtimeproducts
router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await ProductModel.find().lean()

        res.render("realTimeProducts", {
            products
        })

    } catch (error) {
        res.status(500).send(error.message)
    }
})

// vista products con paginación
router.get("/products", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query

        let filter = {}

        if (query) {
            if (query === "true" || query === "false") {
                filter.status = query === "true"
            } else {
                filter.category = query
            }
        }

        let options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true
        }

        if (sort === "asc") {
            options.sort = { price: 1 }
        }

        if (sort === "desc") {
            options.sort = { price: -1 }
        }

        const result = await ProductModel.paginate(filter, options)

        res.render("products", {
            products: result.docs,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page
        })

    } catch (error) {
        res.status(500).send(error.message)
    }
})

// detalle producto
router.get("/products/:pid", async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).lean()

        if (!product) {
            return res.status(404).send("Producto no encontrado")
        }

        res.render("productDetail", {
            product
        })

    } catch (error) {
        res.status(500).send(error.message)
    }
})

// carrito específico
router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid)
            .populate("products.product")
            .lean()

        if (!cart) {
            return res.status(404).send("Carrito no encontrado")
        }

        res.render("cartDetail", {
            products: cart.products
        })

    } catch (error) {
        res.status(500).send(error.message)
    }
})

export default router