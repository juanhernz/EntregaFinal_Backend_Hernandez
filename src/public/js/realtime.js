const socket = io()

const list = document.getElementById("productList")

socket.on("products", (products) => {

    list.innerHTML = ""

    products.forEach(p => {

        const li = document.createElement("li")
        li.innerText = `${p.id} - ${p.title} - $${p.price}`

        list.appendChild(li)

    })

})

/* AGREGAR PRODUCTO */

const form = document.getElementById("productForm")

form.addEventListener("submit", (e) => {

    e.preventDefault()

    const data = new FormData(form)

    const product = {
        title: data.get("title"),
        description: "test",
        code: Math.random().toString(),
        price: Number(data.get("price")),
        status: true,
        stock: 10,
        category: "general",
        thumbnails: []
    }

    socket.emit("addProduct", product)

})

/* ELIMINAR */

const deleteForm = document.getElementById("deleteForm")

deleteForm.addEventListener("submit", (e) => {

    e.preventDefault()

    const data = new FormData(deleteForm)

    const id = data.get("id")

    socket.emit("deleteProduct", id)

})