import { Router } from "express";
import path from "path";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const cartsManager = new CartManager(path.resolve("data/carts.json"));
const productsManager = new ProductManager(path.resolve("data/products.json"));

// POST /api/carts
router.post("/", async (req, res) => {
  try {
    const cart = await cartsManager.createCart();
    res.status(201).json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartsManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ status: "error", error: "Cart not found" });
    res.json({ status: "success", payload: cart.products });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    // validar que el producto exista
    const product = await productsManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: "error", error: "Product not found" });

    const cart = await cartsManager.addProductToCart(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).json({ status: "error", error: "Cart not found" });

    res.json({ status: "success", payload: cart });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

export default router;
