import mongoose from "mongoose"
import cartModel from "../models/cart.js"
import productModel from "../models/product.js"
import ticketModel from "../models/ticket.js"


// Función para obtener un carrito determinado por ID /////////////////////////
///////////////////////////////////////////////////////////////////////////////
export const getCart = async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const cart = await cartModel.findById(cartId)

        if (!cart) {
            return res.status(404).render("templates/error", {error: "Carrito no encontrado"})
        } else {
            res.status(200).render("templates/cart", {cart})
            //         //
            // Testing //
            //         //
            console.log("\nFunción: getCart\nEl carrito consultado es:\n", cart)
        }
    } catch (error) {
        console.log(error)
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
        console.log("\nFunción: createCart\nEl carrito creado es:\n", newCart)
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}


// Función para agregar productos a un carrito ya existente ///////////////////
///////////////////////////////////////////////////////////////////////////////
export const addProductToCart = async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const productId = new mongoose.Types.ObjectId(req.params.pid) 
        const { quantity } = req.body

        if (!quantity || quantity <= 0) {
            return res.status(400).json({success: false, payload: "Cantidad inválida"})
        }

        const cartToUpdate = await cartModel.findById(cartId)
        const productToAdd = await productModel.findById(productId)

        if (!cartToUpdate) {
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        } 

        if (!productToAdd) {
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
        console.log("\nFunción: addProductToCart\nEl carrito actualizado es:\n", updatedCart)
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}


// Función desconocida <><><><><><><><><><><><><><><><><><><><><><><><><><><><>
///////////////////////////////////////////////////////////////////////////////
export const updateProducts = async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
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
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const productId = new mongoose.Types.ObjectId(req.params.pid)
        const { quantity } = req.body

        if (!quantity || quantity <= 0) {
            return res.status(400).json({success: false, payload: "Cantidad inválida"})
        }

        const cartToUpdate = await cartModel.findById(cartId)

        if (!cartToUpdate) {
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        } 

        const productIndex = cartToUpdate.products.findIndex(prod => prod.id_prod._id.toString() == productId)

        if (productIndex == -1) {
            return res.status(404).json({success: false, payload: "Producto no encontrado"})
        }

        cartToUpdate.products[productIndex].qty = quantity
        cartToUpdate.save()
        res.status(200).json({success: true, payload: cartToUpdate})
        //         //
        // Testing //
        //         //
        console.log("\nFunción: updateProductQty\nEl carrito actualizado es:\n", cartToUpdate)
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}


// Función para eliminar un producto del carrito //////////////////////////////
///////////////////////////////////////////////////////////////////////////////
export const removeProduct = async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const productId = new mongoose.Types.ObjectId(req.params.pid) 
        const cartToUpdate = await cartModel.findById(cartId)

        if (!cartToUpdate) {
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        } 

        const productIndex = cartToUpdate.products.findIndex(prod => prod.id_prod._id.toString() == productId)

        if (productIndex == -1) {
            return res.status(404).json({success: false, payload: "Producto no encontrado"})
        }

        cartToUpdate.products.splice(productIndex, 1)
        cartToUpdate.save()
        res.status(200).json({success: true, payload: cartToUpdate})
        //         //
        // Testing //
        //         //
        console.log("\nFunción: removeProduct\nEl carrito actualizado es:\n", cartToUpdate)
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}


// Función para vaciar el carrito /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
export const emptyCart = async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const cartToUpdate = await cartModel.findById(cartId)

        if (!cartToUpdate) {
            return res.status(404).json({success: false, payload: "Carrito no encontrado"})
        } 

        cartToUpdate.products = []
        cartToUpdate.save()
        res.status(200).json({success: true, payload: cartToUpdate})
        //         //
        // Testing //
        //         //
        console.log("\nFunción: emptyCart\nEl carrito actualizado es:\n", cartToUpdate)
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}


// Función para finalizar compra //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export const checkout = async (req, res) => {
    try {
        const cartId = new mongoose.Types.ObjectId(req.params.cid)
        const cartToCheckout = await cartModel.findById(cartId)
        const stockInsufficient = []

        if (!cartToCheckout) {
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
            console.log("\nFunción: checkout\nLos productos sin stock son:\n", stockInsufficient)
            console.log("\nFunción: checkout\nEl carrito quedó:\n", cartToCheckout)
            return res.status(409).json({success: false, payload: stockInsufficient})
        }

        if (cartToCheckout.products.length == 0) {
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
        console.log("\nFunción: checkout\nEl carrito a comprar es:\n", cartId)
        console.log("\nFunción: checkout\nLa compra es:\n", newTicket)
    } catch (error) {
        console.log(error)
        res.status(500).render("templates/error", {error})
    }
}