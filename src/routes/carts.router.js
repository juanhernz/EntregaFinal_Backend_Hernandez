import { Router } from "express"
import CartModel from "../models/Cart.model.js"
import ProductModel from "../models/Product.model.js"

const router = Router()

// POST /api/carts
router.post("/", async (req, res) => {
    try {
        const cart = await CartModel.create({ products: [] })

        res.status(201).json({
            status: "success",
            payload: cart
        })

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        })
    }
})

// GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid)
            .populate("products.product")

        if (!cart) {
            return res.status(404).json({
                status: "error",
                error: "Cart not found"
            })
        }

        res.json({
            status: "success",
            payload: cart.products
        })

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        })
    }
})

// POST /api/carts/:cid/product/:pid
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params

        const product = await ProductModel.findById(pid)

        if (!product) {
            return res.status(404).json({
                status: "error",
                error: "Product not found"
            })
        }

        const cart = await CartModel.findById(cid)

        if (!cart) {
            return res.status(404).json({
                status: "error",
                error: "Cart not found"
            })
        }

        const existingProduct = cart.products.find(
            item => item.product.toString() === pid
        )

        if (existingProduct) {
            existingProduct.quantity += 1
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            })
        }

        await cart.save()

        res.json({
            status: "success",
            payload: cart
        })

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        })
    }
})

// DELETE producto específico
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params

        const cart = await CartModel.findById(cid)

        if (!cart) {
            return res.status(404).json({
                status: "error",
                error: "Cart not found"
            })
        }

        cart.products = cart.products.filter(
            item => item.product.toString() !== pid
        )

        await cart.save()

        res.json({
            status: "success",
            payload: cart
        })

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        })
    }
})

// PUT reemplazar carrito completo
router.put("/:cid", async (req, res) => {
    try {
        const { products } = req.body

        if (!Array.isArray(products)) {
            return res.status(400).json({
                status: "error",
                error: "Products must be an array"
            })
        }

        const updatedCart = await CartModel.findByIdAndUpdate(
            req.params.cid,
            { products },
            { new: true }
        )

        if (!updatedCart) {
            return res.status(404).json({
                status: "error",
                error: "Cart not found"
            })
        }

        res.json({
            status: "success",
            payload: updatedCart
        })

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        })
    }
})

// PUT cantidad producto
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        const cart = await CartModel.findById(cid)

        if (!cart) {
            return res.status(404).json({
                status: "error",
                error: "Cart not found"
            })
        }

        const product = cart.products.find(
            item => item.product.toString() === pid
        )

        if (!product) {
            return res.status(404).json({
                status: "error",
                error: "Product not found in cart"
            })
        }

        product.quantity = Number(quantity)

        await cart.save()

        res.json({
            status: "success",
            payload: cart
        })

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        })
    }
})

// DELETE vaciar carrito
router.delete("/:cid", async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid)

        if (!cart) {
            return res.status(404).json({
                status: "error",
                error: "Cart not found"
            })
        }

        cart.products = []

        await cart.save()

        res.json({
            status: "success",
            payload: cart
        })

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        })
    }
})

export default router