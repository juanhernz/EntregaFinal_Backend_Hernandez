import fs from "fs/promises";
import path from "path";

export default class ProductManager {
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
      // si se corrompe, lo reseteamos para no romper el server
      await fs.writeFile(this.path, "[]", { encoding: "utf-8" });
      return [];
    }
  }

  async #writeJSON(payload) {
    await this.#ensureFile();
    await fs.writeFile(this.path, JSON.stringify(payload, null, 2), { encoding: "utf-8" });
  }

  async getProducts() {
    return await this.#readJSON();
  }

  async getProductById(pid) {
    const products = await this.#readJSON();
    return products.find((p) => String(p.id) === String(pid)) || null;
  }

  async addProduct(productData) {
    const required = ["title", "description", "code", "price", "status", "stock", "category", "thumbnails"];
    for (const k of required) {
      if (productData[k] === undefined) {
        throw new Error(`Missing field: ${k}`);
      }
    }
    if (!Array.isArray(productData.thumbnails)) {
      throw new Error("thumbnails must be an array of strings");
    }

    const products = await this.#readJSON();

    // code unique 
    const codeTaken = products.some((p) => String(p.code) === String(productData.code));
    if (codeTaken) throw new Error("Product code already exists");

    const nextId = products.length ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 1;

    const newProduct = {
      id: nextId,
      title: String(productData.title),
      description: String(productData.description),
      code: String(productData.code),
      price: Number(productData.price),
      status: Boolean(productData.status),
      stock: Number(productData.stock),
      category: String(productData.category),
      thumbnails: productData.thumbnails.map(String),
    };

    products.push(newProduct);
    await this.#writeJSON(products);
    return newProduct;
  }

  async updateProduct(pid, updates) {
    const products = await this.#readJSON();
    const idx = products.findIndex((p) => String(p.id) === String(pid));
    if (idx === -1) return null;

    // no tocar id
    const { id, ...safeUpdates } = updates ?? {};

    // si viene thumbnails, validar
    if (safeUpdates.thumbnails !== undefined) {
      if (!Array.isArray(safeUpdates.thumbnails)) {
        throw new Error("thumbnails must be an array of strings");
      }
      safeUpdates.thumbnails = safeUpdates.thumbnails.map(String);
    }

    // si viene price/stock, castear
    if (safeUpdates.price !== undefined) safeUpdates.price = Number(safeUpdates.price);
    if (safeUpdates.stock !== undefined) safeUpdates.stock = Number(safeUpdates.stock);
    if (safeUpdates.status !== undefined) safeUpdates.status = Boolean(safeUpdates.status);

    products[idx] = { ...products[idx], ...safeUpdates };
    await this.#writeJSON(products);
    return products[idx];
  }

  async deleteProduct(pid) {
    const products = await this.#readJSON();
    const idx = products.findIndex((p) => String(p.id) === String(pid));
    if (idx === -1) return false;

    products.splice(idx, 1);
    await this.#writeJSON(products);
    return true;
  }
}
