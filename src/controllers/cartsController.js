import mongoose from "mongoose"
import cartModel from "../models/cart.js"
import productModel from "../models/product.js"
import ticketModel from "../models/ticket.js"


// Función para obtener un carrito determinado por ID /////////////////////////
///////////////////////////////////////////////////////////////////////////////
export const getCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findById(cartId)

        if (!cart) {
            req.logger.warn("Función: getCart | Carrito no encontrado")
            return res.status(404).render("templates/error", {error: "Carrito no encontrado"})
        } else {
            res.status(200).render("templates/cart", {cart})
            //         //
            // Testing //
            //         //
            req.logger.info(`Función: getCart | El carrito consultado es: ${cart}`)
        }
    } catch (error) {
        req.logger.error(`Función: getCart | Error interno al consultar carrito: ${error}`)
        res.status(500).render("templates/error", {error})
    }
}


// Función para crear un nuevo carrito vacío //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
export const createCart = async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] })
        res.status(201).json({success: true, payload: newCart})
        //         //
        // Testing //
        //         //
        req.logger.info(`Función: createCart | El carrito creado es: ${newCart}`)
    } catch (error) {
        req.logger.error(`Función: createCart | Error interno al crear el carrito: ${error}`)
        res.status(500).render("templates/error", {error})
    }
}


// Función para agregar productos a un carrito ya existente ///////////////////
///////////////////////////////////////////////////////////////////////////////
export const addProductToCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const { quantity } = req.body

        if (!quantity || quantity <= 0) {
            req.logger.warn("Función: addProductToCart | Cantidad inválida")
            return res.status(400).json({success: false, payload: "Cantidad inválida"})
        }

        const cartToUpdate = await cartModel.findById(cartId)
        const productToAdd = await productModel.findById(productId)

        if (!cartToUpdate) {
            req.logger.warn("Función: addProductToCart | Carrito no encontrado")
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        } 

        if (!productToAdd) {
            req.logger.warn("Función: addProductToCart | Producto no encontrado")
            return res.status(404).json({success: false, payload: "Producto no encontrado"})
        }

        const productIndex = cartToUpdate.products.findIndex(prod => prod._id == productId)

        if (productIndex == -1) {
            cartToUpdate.products.push({ id_prod: productId, qty: quantity })
        } else {
            cartToUpdate.products[productIndex].qty = quantity
        }

        const updatedCart = await cartModel.findByIdAndUpdate(cartId, cartToUpdate, { new:true })

        res.status(200).json({success: true, payload: updatedCart})
        //         //
        // Testing //
        //         //
        req.logger.info(`Función: addProductToCart | El carrito actualizado es: ${updatedCart}`)
    } catch (error) {
        req.logger.error(`Función: addProductToCart | Error interno al agregar productos al carrito: ${error}`)
        res.status(500).render("templates/error", {error})
    }
}


// Función desconocida <><><><><><><><><><><><><><><><><><><><><><><><><><><><>
///////////////////////////////////////////////////////////////////////////////
export const updateProducts = async (req, res) => {
    try {
        const cartId = req.params.cid
        const { newProduct } = req.body
        const cartToUpdate = await cartModel.findById(cartId)
        cartToUpdate.products = newProduct
        cartToUpdate.save()

        res.status(200).json({success: true, payload: cartToUpdate})
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}


// Función para actualizar cantidades de un producto ya agregado //////////////
///////////////////////////////////////////////////////////////////////////////
export const updateProductQty = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const { quantity } = req.body

        if (!quantity || quantity <= 0) {
            req.logger.warn("Función: updateProductQty | Cantidad inválida")
            return res.status(400).json({success: false, payload: "Cantidad inválida"})
        }

        const cartToUpdate = await cartModel.findById(cartId)

        if (!cartToUpdate) {
            req.logger.warn("Función: updateProductQty | Carrito no encontrado")
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        } 

        const productIndex = cartToUpdate.products.findIndex(prod => prod.id_prod._id.toString() == productId)

        if (productIndex == -1) {
            req.logger.warn("Función: updateProductQty | Producto no encontrado")
            return res.status(404).json({success: false, payload: "Producto no encontrado"})
        }

        cartToUpdate.products[productIndex].qty = quantity
        cartToUpdate.save()
        res.status(200).json({success: true, payload: cartToUpdate})
        //         //
        // Testing //
        //         //
        req.logger.info(`Función: updateProductQty | El carrito actualizado es: ${cartToUpdate}`)
    } catch (error) {
        req.logger.error(`Función: updateProductQty | Error interno al actualizar productos en carrito: ${error}`)
        res.status(500).render("templates/error", {error})
    }
}


// Función para eliminar un producto del carrito //////////////////////////////
///////////////////////////////////////////////////////////////////////////////
export const removeProduct = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const cartToUpdate = await cartModel.findById(cartId)

        if (!cartToUpdate) {
            req.logger.warn("Función: removeProduct | Carrito no encontrado")
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        } 

        const productIndex = cartToUpdate.products.findIndex(prod => prod.id_prod._id.toString() == productId)

        if (productIndex == -1) {
            req.logger.warn("Función: removeProduct | Producto no encontrado")
            return res.status(404).json({success: false, payload: "Producto no encontrado"})
        }

        cartToUpdate.products.splice(productIndex, 1)
        cartToUpdate.save()
        res.status(200).json({success: true, payload: cartToUpdate})
        //         //
        // Testing //
        //         //
        req.logger.info(`Función: removeProduct | El carrito actualizado es: ${cartToUpdate}`)
    } catch (error) {
        req.logger.error(`Función: removeProduct | Error interno al remover productos del carrito: ${error}`)
        res.status(500).render("templates/error", {error})
    }
}


// Función para vaciar el carrito /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
export const emptyCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cartToUpdate = await cartModel.findById(cartId)

        if (!cartToUpdate) {
            req.logger.warn("Función: emptyCart | Carrito no encontrado")
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        } 

        cartToUpdate.products = []
        cartToUpdate.save()
        res.status(200).json({success: true, payload: cartToUpdate})
        //         //
        // Testing //
        //         //
        req.logger.info(`Función: emptyCart | El carrito actualizado es: ${cartToUpdate}`)
    } catch (error) {
        req.logger.error(`Función: emptyCart | Error interno al intentar vaciar el carrito: ${error}`)
        res.status(500).render("templates/error", {error})
    }
}


// Función para finalizar compra //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export const checkout = async (req, res) => {
    try {
        const cartId = req.params.cid
        const cartToCheckout = await cartModel.findById(cartId)
        const stockInsufficient = []

        if (!cartToCheckout) {
            req.logger.warn("Función: checkout | Carrito no encontrado")
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        }

        for (const product of cartToCheckout.products) {
            const productQuery = await productModel.findById(product.id_prod)

            if (productQuery.stock < product.qty) {
                stockInsufficient.push(productQuery._id)
            }
        }

        if(stockInsufficient.length > 0) {
            stockInsufficient.forEach(prodId => {
                const productIndex = cartToCheckout.products.findIndex(prod => prod._id == prodId)
                cartToCheckout.products.splice(productIndex, 1)
            })
            
            await cartModel.findByIdAndUpdate(cartId, {
                products: cartToCheckout.products
            })
            //         //
            // Testing //
            //         //
            req.logger.info(`Función: checkout | Los productos sin stock son: ${stockInsufficient}`)
            req.logger.info(`Función: checkout | El carrito quedó: ${cartToCheckout}`)
            return res.status(409).json({success: false, payload: stockInsufficient})
        }

        if (cartToCheckout.products.length == 0) {
            req.logger.warn("Función: checkout | El carrito se encuentra vacío")
            return res.status(400).json({success: false, payload: "No existen productos agregados al carrito"})
        }

        let totalAmount = 0

        for (const product of cartToCheckout.products) {
            const productQuery = await productModel.findById(product.id_prod)

            if (productQuery) {
                productQuery.stock -= product.qty
                totalAmount += productQuery.price * product.qty
                await productQuery.save()
            }
        }

        const newTicket = await ticketModel.create({
            code: crypto.randomUUID(),
            amount: totalAmount,
            purchaser: req.user.email,
            products: cartToCheckout.products
        })

        await cartModel.findByIdAndUpdate(cartId, { products: [] })
        res.status(200).json({success: true, payload: newTicket})
        //         //
        // Testing //
        //         //
        req.logger.info(`Función: checkout | El carrito a comprar es: ${cartId}`)
        req.logger.info(`Función: checkout | La compra es: ${newTicket}`)
    } catch (error) {
        req.logger.error(`Función: checkout | Error interno al intentar realizar el checkout: ${error}`)
        res.status(500).render("templates/error", {error})
    }
}