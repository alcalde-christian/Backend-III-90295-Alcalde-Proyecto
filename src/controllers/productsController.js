import productModel from "../models/product.js"

// Función para obtener todos los productos de la base de datos ///////////////
///////////////////////////////////////////////////////////////////////////////
export const getProducts = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const page = req.query.page ? parseInt(req.query.page) : 1
        const filter = req.query.filter ? { category: req.query.filter } : {}
        const sort = req.query.sort ? { price: req.query.sort === "asc" ? 1 : -1 } : undefined

        if (limit <= 0 || page <= 0) {
            req.logger.warn("Función: getProducts | Los parámetros limit o page son inválidos")
            return res.status(400).render("templates/error", {error: "Los valores de limit y page deben ser mayores que 0"})
        }

        const products = await productModel.paginate(filter, { limit: limit, page: page, sort: sort, lean: true })

        if (products.docs.length === 0) {
            req.logger.warn("Función: getProducts | No se encontraron productos según el filtro solicitado")
            return res.status(404).render("templates/error", {error: "No se encontraron productos que cumplan con el filtro solicitado"})
        }

        products.prevLink = products.hasPrevPage ? `http://localhost:8080?limit=${limit}&page=${products.prevPage}&filter=${req.query.filter || ``}&sort=${req.query.sort || ''}` : ''

        products.nextLink = products.hasNextPage ? `http://localhost:8080?limit=${limit}&page=${products.nextPage}&filter=${req.query.filter || ``}&sort=${req.query.sort || ''}` : ''

        products.isValid = !(page <= 0 || page > products.totalPages)

        // console.log(products)
        req.logger.info(`Función: getProducts | Es válido? ${products.isValid}`)
        req.logger.info(`Función: getProducts | Links ${products.nextLink} & ${products.prevLink}`)
        res.status(200).render("templates/home", {products})
    } catch (error) {
        req.logger.error(`Función: getProducts | Error interno al obtener los productos de la base de datos: ${error}`)
        res.status(500).render("templates/error", {error})
    }
}


// Función para obtener sólo un producto de la base de datos //////////////////
///////////////////////////////////////////////////////////////////////////////
export const getProduct = async (req, res) => {
    try {
        const productId = req.params.pid
        const product = await productModel.findById(productId)

        if (product) {
            res.status(200).json({ success: true, payload: product })
            // res.status(200).render("templates/product", {product})
            //         //
            // Testing //
            //         //
            req.logger.info(`Función: getProduct | El producto consultado es: ${product}`)
        } else {
            req.logger.warn("Función: getProduct | Producto no encontrado")
            return res.status(404).render("templates/error", {error: "Producto no encontrado"})
        }
    } catch (error) {
        req.logger.error(`Función: getProduct | Error interno al obtener un producto de la base de datos: ${error}`)
        res.status(500).render("templates/error", {error})
    }
}


// Función para agregar un nuevo producto a la base de datos //////////////////
///////////////////////////////////////////////////////////////////////////////
export const addProduct = async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnail } = req.body

        if (!title || !description || !code || !price || !stock || !category) {
            req.logger.warn("Función: addProduct | No se completaron todos los datos necesarios para agregar el producto")
            return res.status(400).render("templates/error", {error: "Alguno de los datos no ha sido completado"})
        }

        if (price <= 0 || stock <= 0) {
            req.logger.warn("Función: addProduct | Valores de precio o stock inválidos")
            return res.status(400).render("templates/error", {error: "Precio o stock no válidos"})
        }

        const newProduct = await productModel.create({ title, description, code, price, stock, category, thumbnail })

        req.logger.info(`Función: addProduct | Nuevo producto agregado: ${newProduct}`)
        // res.status(201).redirect("templates/home")
        res.status(201).json({ success: true, payload: newProduct })
    } catch (error) {
        req.logger.error(`Función: addProduct | Error interno al intentar agregar un producto a la base de datos: ${error}`)
        res.status(500).render("templates/error", {error})
    }
}


// Función para actualizar un producto en la base de datos ////////////////////
///////////////////////////////////////////////////////////////////////////////
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.pid
        const productToUpdate = req.body
        const updatedProduct = await productModel.findByIdAndUpdate(productId, productToUpdate, { new:true })

        if (!updatedProduct) {
            req.logger.warn("Función: updateProduct | Producto no encontrado")
            return res.status(404).render("templates/error", {error: "Producto no encontrado"})
        } else {
            req.logger.info(`Función: updateProduct | El producto actualizado es: ${updatedProduct}`)
            res.status(200).json({ success: true, payload: updatedProduct })
            // res.status(200).render("templates/product", {updatedProduct})
        }
    } catch (error) {
        req.logger.error(`Función: updateProduct | Error interno al intentar actualizar la información de un producto: ${error}`)
        res.status(500).render("templates/error", {error})
    }
}


// Función para eliminar un producto de la base de datos //////////////////////
///////////////////////////////////////////////////////////////////////////////
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.pid
        const deletedProduct = await productModel.findByIdAndDelete(productId)

        if (!deletedProduct) {
            req.logger.warn("Función: deleteProduct | Producto no encontrado")
            return res.status(404).render("templates/error", {error: "Producto no encontrado"})
        } else {
            req.logger.info(`Función: deleteProduct | El producto eliminado es: ${deletedProduct}`)
            res.status(200).json({ success: true, payload: deletedProduct })
            // res.status(200).redirect("templates/home")
        }
    } catch (error) {
        req.logger.error(`Función: deleteProduct | Error interno al intentar eliminar un producto de la base de datos: ${error}`)
        res.status(500).render("templates/error", {error})
    }
}