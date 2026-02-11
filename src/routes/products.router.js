import { Router } from "express";
import path from "path";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager(path.resolve("data/products.json"));

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.json({ status: "success", payload: products });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: "error", error: "Product not found" });
    res.json({ status: "success", payload: product });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const created = await manager.addProduct(req.body);
    res.status(201).json({ status: "success", payload: created });
  } catch (err) {
    // 400 para validaciones
    res.status(400).json({ status: "error", error: err.message });
  }
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  try {
    const updated = await manager.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ status: "error", error: "Product not found" });
    res.json({ status: "success", payload: updated });
  } catch (err) {
    res.status(400).json({ status: "error", error: err.message });
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const ok = await manager.deleteProduct(req.params.pid);
    if (!ok) return res.status(404).json({ status: "error", error: "Product not found" });
    res.json({ status: "success", payload: true });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;
