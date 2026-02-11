import fs from "fs/promises";
import path from "path";

export default class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async #ensureFile() {
    try {
      await fs.access(this.path);
    } catch {
      await fs.mkdir(path.dirname(this.path), { recursive: true });
      await fs.writeFile(this.path, "[]", { encoding: "utf-8" });
    }
  }

  async #readJSON() {
    await this.#ensureFile();
    const data = await fs.readFile(this.path, { encoding: "utf-8" });
    try {
      return JSON.parse(data || "[]");
    } catch {
      await fs.writeFile(this.path, "[]", { encoding: "utf-8" });
      return [];
    }
  }

  async #writeJSON(payload) {
    await this.#ensureFile();
    await fs.writeFile(this.path, JSON.stringify(payload, null, 2), { encoding: "utf-8" });
  }

  async createCart() {
    const carts = await this.#readJSON();
    const nextId = carts.length ? Math.max(...carts.map((c) => Number(c.id) || 0)) + 1 : 1;

    const newCart = { id: nextId, products: [] };
    carts.push(newCart);
    await this.#writeJSON(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.#readJSON();
    return carts.find((c) => String(c.id) === String(cid)) || null;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.#readJSON();
    const cartIdx = carts.findIndex((c) => String(c.id) === String(cid));
    if (cartIdx === -1) return null;

    const cart = carts[cartIdx];
    const pIdx = cart.products.findIndex((p) => String(p.product) === String(pid));

    if (pIdx === -1) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      cart.products[pIdx].quantity += 1;
    }

    carts[cartIdx] = cart;
    await this.#writeJSON(carts);
    return cart;
  }
}
