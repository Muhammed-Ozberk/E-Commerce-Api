const Category = require("../model/categoryModel");
const Product = require('../model/productModel');
const ProductImage = require('../model/productImageModel');
const Favorite = require('../model/favoriteModel');
const Token = require('../config/token');

const category = async (req, res, next) => {
    try {
        const categoryList = await Category.findAll({ attributes: ['id', 'categoryName','image'] });
        if (!categoryList) {
            res.json({
                message: 'Kategoriler getirilirken bir hata oluştu',
                status: false,
            });
        } else {
            res.json({
                message: 'Kategoriler başarıyla getirildi',
                status: true,
                data: categoryList
            });
        }
    } catch (error) {
        res.json({ message: 'Kategoriler getirilirken bilinmeyen bir hata oluştu', status: false });
    }
}

const productsList = async (req, res, next) => {
    try {
        const productLlist = await Product.findAll({ attributes: ['id', 'image', 'price', 'title'], where: { categoryId: req.body.categoryId } });
        if (!productLlist) {
            res.json({ message: "Ürünler getirilirken bir hata oluştu", status: false });
        } else {
            if (!req.headers.authorization) {
                let newList = new Array();
                productLlist.forEach(element => {
                    let newPro = {
                        id: element.id,
                        image: element.image,
                        price: element.price,
                        title: element.title,
                        isFavorite: false
                    }
                    newList.push(newPro);
                });
                res.json({ message: "Ürünler başarıyla getirildi", status: true, data: newList });
            } else {
                const userToken = Token(req.headers.authorization);
                const favori = await Favorite.findAll({ attributes: ['productId'], where: { userId: (await userToken).userId } });
                let newList = new Array();
                productLlist.forEach(element => {
                    let item = false;
                    favori.forEach(pro => {
                        if (pro.productId === element.id) {
                            item = true;
                        }
                    });
                    if (item) {
                        let produc = {
                            id: element.id,
                            image: element.image,
                            price: element.price,
                            title: element.title,
                            isFavorite: true
                        }
                        newList.push(produc);
                    } else {
                        let produc = {
                            id: element.id,
                            image: element.image,
                            price: element.price,
                            title: element.title,
                            isFavorite: false
                        }
                        newList.push(produc);
                    }
                });
                res.json({ message: "Ürünler başarıyla getirildi", status: true, data: newList });
            }
        }
    } catch (error) {
        res.json({ message: 'Ürünler getirilirken bilinmeyen bir hata oluştu', status: false });
    }
}

const productDetail = async (req, res, next) => {
    try {
        const product = await Product.findOne({ attributes: ['id', 'image', 'price', 'title', 'description'], where: { id: req.body.productId } });
        if (!product) {
            res.json({ message: "Ürün detayı getirilirken bir hata oluştu", status: false });
        } else {
            const productImage = await ProductImage.findAll({ attributes: ['image'], where: { productId: req.body.productId } });
            if (!req.headers.authorization) {
                if (productImage.length == 0) {
                    const Detail = {
                        id: product.id,
                        image: [product.image],
                        price: product.price,
                        title: product.title,
                        description: product.description,
                        isFavorite: false
                    };
                    res.json({ message: "Ürün detayı başarıyla getirildi", status: true, data: Detail });
                } else {
                    let item = new Array();
                    productImage.forEach(element => {
                        item.push(element.image);
                    });
                    const Detail = {
                        id: product.id,
                        image: item,
                        price: product.price,
                        title: product.title,
                        description: product.description,
                        isFavorite: false
                    };
                    res.json({ message: "Ürün detayı başarıyla getirildi", status: true, data: Detail });
                }
            } else {
                const userToken = Token(req.headers.authorization);
                const productImage = await ProductImage.findAll({ attributes: ['image'], where: { productId: req.body.productId } });
                const favori = await Favorite.findOne({ where: { userId: (await userToken).userId, productId: req.body.productId } });
                if (favori) {
                    if (productImage.length == 0) {
                        const Detail = {
                            id: product.id,
                            image: [product.image],
                            price: product.price,
                            title: product.title,
                            description: product.description,
                            isFavorite: true
                        };
                        res.json({ message: "Ürün detayı başarıyla getirildi", status: true, data: Detail });
                    } else {
                        let item = new Array();
                        productImage.forEach(element => {
                            item.push(element.image);
                        });
                        const Detail = {
                            id: product.id,
                            image: item,
                            price: product.price,
                            title: product.title,
                            description: product.description,
                            isFavorite: true
                        };
                        res.json({ message: "Ürün detayı başarıyla getirildi", status: true, data: Detail });
                    }
                } else {
                    if (productImage.length == 0) {
                        const Detail = {
                            id: product.id,
                            image: [product.image],
                            price: product.price,
                            title: product.title,
                            description: product.description,
                            isFavorite: false
                        };
                        res.json({ message: "Ürün detayı başarıyla getirildi", status: true, data: Detail });
                    } else {
                        let item = new Array();
                        productImage.forEach(element => {
                            item.push(element.image);
                        });
                        const Detail = {
                            id: product.id,
                            image: item,
                            price: product.price,
                            title: product.title,
                            description: product.description,
                            isFavorite: false
                        };
                        res.json({ message: "Ürün detayı başarıyla getirildi", status: true, data: Detail });
                    }
                }
            }
        }
    } catch (error) {
        res.json({ message: "Ürün detayı getirilirken bilinmeyen bir hata oluştu", status: false });
    }
}


module.exports = {
    category,
    productsList,
    productDetail,
}