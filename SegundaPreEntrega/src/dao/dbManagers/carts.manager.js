import cartsModel from "../dbManagers/models/carts.model.js";
import productsModel from "../dbManagers/models/products.model.js";

export default class CartManager {

    createCart = async (cart) => {
        try {
            const newCart = await cartsModel.create(cart);
            return newCart;
        } catch (err) {
            console.log(err);
        }
    };

    getCarts = async () => {
        try {
            const carts = await cartsModel.find({});
            return carts;
        } catch (err) {
            console.log(err);
        }
    };

    getCartById = async (cid) => {
        try {
            const cart = await cartsModel.findOne({ _id: cid });
            if (cart) {
                return cart;
            }
        } catch (err) {
            console.log(err);
        }
    };

    addProductToCart = async (cid, pid) => {
        try {
            const cart = await cartsModel.findOne({
                _id: cid,
            });
            if (cart) {
                const existingProduct = cart.products.find(
                (product) => String(product.product._id) === pid
            );
            if (existingProduct) {
                const updateProduct = { existingProduct, quantity: +1 };
                console.log(updateProduct);
            } else {
                const product = await productsModel.findById(pid);
                if (product) {
                const newProduct = { product, quantity: 1 };
                cart.products.push(newProduct);
                console.log(newProduct);
            }
        }
        let updatedCart = await cart.save();
        return updatedCart;
        } else return console.log("Error: el carrito no existe");
        } catch (err) {
            console.log(err);
        }
    };

    updateCart = async (cid, page, limit) => {
        try {
            const cart = await cartsModel.findById(cid);
            if (cart) {
                const products = cart.products;
                const options = { page: Number(page), limit: Number(limit) };
                const result = await cartsModel.paginate({}, options);
                const updatedCart = {
                    status: "Updated products:",
                    payload: products,
                    totalPages: result.totalPages,
                    prevPage: result.prevPage,
                    nextPage: result.nextPage,
                    page: result.page,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.prevLink,
                    nextLink: result.nextLink,
                };
                console.log(updatedCart);
                return updatedCart;
            } else {
                console.log("El carrito no existe");
            }
        } catch (err) {
            console.log(err);
        }
    };

    updateProductFromCart = async (cid, pid, productQuantity) => {
        try {
            const cart = await cartsModel.findById(cid);

            if (cart) {
                const newQuantity = productQuantity.quantity;
                const product = cart.products.find(
                (product) => String(product.product._id) === pid
            );
            if (product) {
                product.product.quantity = newQuantity;
                const updatedCart = await cart.save();
                return updatedCart;
            } else {
                console.log("El producto no está en el carrito");
            }
            } else {
                console.log("Carrito inexistente");
            }
        } catch (err) {
            console.log(err);
        }
    };

    deleteCart = async (cid) => {
        try {
            const carts = await cartsModel.deleteOne({ _id: cid });
            if (cid === 0) {
                console.log("Error: id inexistente");
            } else if (cid < 0) {
                console.log("Error: carrito no encontrado");
            } else {
                return carts;
            }
        } catch (err) {}
    };

    deleteProductFromCart = async (cid, pid) => {
        try {
            const cart = await cartsModel.findById(cid);
            if (cart) {
            const product = cart.products.findIndex(
            (product) => String(product.product._id) === pid
        );
            cart.products.splice(product, 1);
            let updatedCart = await cart.save();
            return updatedCart;
            } else return console.log("Error: el carrito no existe");
        } catch (err) {
            console.log(err);
        }
    };

    deleteAllProductsFromCart = async (cid) => {
        try {
            const cart = await cartsModel.findOne({ _id: cid });
            cart.products = [];
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (err) {
            console.log(err);
        }
    };
}