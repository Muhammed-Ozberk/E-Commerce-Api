const Category = require("../model/categoryModel");
const Product = require('../model/productModel');
const ProductImage = require('../model/productImageModel');


const category = async (req, res, next) => {
    try {
        const categoryList = await Category.findAll({ attributes: ['id', 'categoryName'] });
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
        res.json(productLlist);
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
            if (productImage.length == 0) {
                const Detail = {
                    id: product.id,
                    image: [product.image],
                    price: product.price,
                    title: product.title,
                    description: product.description
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
                    description: product.description
                };
                res.json({ message: "Ürün detayı başarıyla getirildi", status: true, data: Detail });
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