import { Router } from "express"
import Product from "../models/Product.model.js"

const router = Router()

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.json({ status: "success", payload: products })
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message })
  }
})

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid)

    if (!product) {
      return res.status(404).json({ status: "error", error: "Product not found" })
    }

    res.json({ status: "success", payload: product })

  } catch (error) {
    res.status(500).json({ status: "error", error: error.message })
  }
})

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const createdProduct = await Product.create(req.body)

    res.status(201).json({
      status: "success",
      payload: createdProduct
    })

  } catch (error) {
    res.status(400).json({ status: "error", error: error.message })
  }
})

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    )

    if (!updatedProduct) {
      return res.status(404).json({ status: "error", error: "Product not found" })
    }

    res.json({
      status: "success",
      payload: updatedProduct
    })

  } catch (error) {
    res.status(400).json({ status: "error", error: error.message })
  }
})

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid)

    if (!deletedProduct) {
      return res.status(404).json({ status: "error", error: "Product not found" })
    }

    res.json({
      status: "success",
      payload: true
    })

  } catch (error) {
    res.status(500).json({ status: "error", error: error.message })
  }
})

export default router