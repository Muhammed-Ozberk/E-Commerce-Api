const Cart = require('../model/cartModel');
const CartItem = require('../model/cartItemModel');
const sequelize = require('../db/database');
const Token = require('../config/token');

const cartAdd = async (req, res, next) => {
    try {
        const userToken = Token(req.headers.authorization);
        const cart = await Cart.findOne({ where: { userId: (await userToken).userId } });
        if (!cart) {
            const cart = await Cart.create(({ userId: (await userToken).userId }));
            if (!cart) {
                res.json({ message: 'Sepet oluşturulurken bir hata oluştu', status: false });
            } else {
                const productAdd = await CartItem.create(({
                    cartId: cart.id,
                    productId: req.body.productId,
                    productQuantity: 1,
                }));
                if (!productAdd) {
                    res.json({ message: 'Ürün sepete eklenirken bir hata oluştu', status: false });
                } else {
                    res.json({ message: 'Ürün sepete başarıyla eklendi', status: true });
                }
            }
        } else {
            const product = await CartItem.findOne({ where: { productId: req.body.productId, cartId: cart.id } });
            if (!product) {
                const productAdd = await CartItem.create(({
                    cartId: cart.id,
                    productId: req.body.productId,
                    productQuantity: 1,
                }));
                if (!productAdd) {
                    res.json({ message: 'Ürün sepete eklenirken bir hata oluştu', status: false });
                } else {
                    res.json({ message: 'Ürün sepete başarıyla eklendi', status: true });
                }
            } else {
                const productAdd = await product.update({
                    productQuantity: product.productQuantity + 1,
                });
                if (!productAdd) {
                    res.json({ message: 'Ürün sepete eklenirken bir hata oluştu', status: false });
                } else {
                    res.json({ message: 'Ürün sepete başarıyla eklendi', status: true });
                }
            }
        }
    } catch (error) {
        res.json({ message: 'Ürün sepete eklenirken bilinmeyen bir hata oluştu', status: false });
    }
}

const cartBring = async (req, res, next) => {
    try {
        const userToken = Token(req.headers.authorization);
        const cart = await Cart.findOne({ where: { userId: (await userToken).userId } });
        if (!cart) {
            let totalPrice = 0;
            let prod = [];
            res.json({ message: 'Sepetinizde ürün bulunamadı', status: true, data: { products: prod, totalPrice } });
        } else {
            const cartItem = await CartItem.findOne({ where: { cartId: cart.id } });
            if (!cartItem) {
                let totalPrice = 0;
                let prod = [];
                res.json({ message: 'Sepetinizde ürün bulunamadı', status: true, data: { products: prod, totalPrice } });
            } else {
                const products = await sequelize.query(`select "productId","image",title,"price",cart_item_tables."productQuantity"
                from product_tables 
                inner join cart_item_tables  on
                product_tables.id = cart_item_tables."productId" and
                cart_item_tables."cartId" = ${cart.id}`);
                if (!products) {
                    res.json({ message: 'Sepetinizdeki ürünler getirilirken bir hata oluştu', status: false });
                } else {
                    let totalPrice = 0;
                    products[0].forEach(element => {
                        totalPrice = element.price * element.productQuantity + totalPrice;
                    });
                    res.json({ message: "Sepetteki ürünler başarıyla getirildi", data: { products: products[0], totalPrice }, status: true });
                }
            }
        }
    } catch (error) {
        res.json({ message: 'Sepet getirilirken bilinmeyen bir hata oluştu', status: false });
    }
}

const cartDelete = async (req, res, next) => {
    try {
        const userToken = Token(req.headers.authorization);
        const cart = await Cart.findOne({ where: { userId: (await userToken).userId } });
        const product = await CartItem.findOne({ where: { productId: req.body.productId, cartId: cart.id } });
        if (!product) {
            res.json({ message: 'Ürün bulunamadı', status: false });
        } else {
            const deletedProduct = await product.destroy();
            if (!deletedProduct) {
                res.json({ message: 'Ürün sepetten kaldırılırken bir hata oluştu', status: false });
            } else {
                res.json({ message: 'Ürün sepetten başarıyla kaldırıldı', status: true });
            }
        }
    } catch (error) {
        res.json({ message: 'Ürün sepetten çıkarılırken bilinmeyen bir hata oluştu', status: false });
    }
}

const cartDecrease = async (req, res, next) => {
    try {
        const userToken = Token(req.headers.authorization);
        const cart = await Cart.findOne({ where: { userId: (await userToken).userId } });
        const product = await CartItem.findOne({ where: { productId: req.body.productId, cartId: cart.id } });
        if (!product) {
            res.json({ message: 'Ürün bulunamadı', status: false });
        } else {
            if (product.productQuantity == 1) {
                res.json({ message: 'Ürün miktarı azaltılamaz', status: false });
            } else {
                const productDec = await product.update({
                    productQuantity: product.productQuantity - 1,
                });
                if (!productDec) {
                    res.json({ message: 'Ürün miktarı azaltılırken bir hata oluştu', status: false });
                } else {
                    res.json({ message: 'Ürün miktarı başarıyla azaltıldı', status: true });
                }
            }
        }
    } catch (error) {
        res.json({ message: 'Ürün miktarı azaltılırken bilinmeyen bir hata oluştu', status: false });
    }
}

const cartEmpty = async (req, res, next) => {
    try {
        const userToken = Token(req.headers.authorization);
        const cart = await Cart.findOne({ where: { userId: (await userToken).userId } });
        const products = await CartItem.findAll({ where: { cartId: cart.id } });
        if (!products) {
            res.json({ message: "Sepet veya ürünler bulunamadı", status: false });
        } else {
            let deletedProduct;
            let item = true;
            products.forEach(async element => {
                deletedProduct = await element.destroy();
                if (!deletedProduct) item = false;
            });
            if (!item) {
                res.json({ message: "Sepet boşaltılırken bir hata oluştu", status: false });
            } else {
                res.json({ message: "Sepet başarıyla boşaltıldı", status: true });
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ message: "Sepet boşaltılırken bilinmeyen bir hata oluştu", status: false });
    }
}


module.exports = {
    cartAdd,
    cartBring,
    cartDelete,
    cartDecrease,
    cartEmpty
}