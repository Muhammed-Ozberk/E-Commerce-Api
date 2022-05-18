const Product = require('../model/productModel');
const sequelize = require('sequelize');
const Favorite = require('../model/favoriteModel');
const Token = require('../config/token');

const search = async (req, res, next) => {
    try {
        let searchWorld = req.body.search;
        let combining = /[\u0300-\u036F]/g;
        searchWorld = searchWorld.normalize('NFKD').replace(combining, '');
        let searchList;
        if (req.body.categoryId) {
             searchList = await Product.findAll({
                attributes: ['id', 'price', 'title', 'image'],
                where:sequelize.and({ categoryId: req.body.categoryId }, sequelize.or({
                    description: { [sequelize.Op.substring]: searchWorld }
                }, { title: { [sequelize.Op.substring]: searchWorld } }))
            });
        } else {
             searchList = await Product.findAll({
                attributes: ['id', 'price', 'title', 'image'],
                where: sequelize.or({
                    description: { [sequelize.Op.substring]: searchWorld }
                }, { title: { [sequelize.Op.substring]: searchWorld } })
            });
        }
        if (!searchList) {
            res.json({ message: 'Ürünler getirilirken bir hata oluştu', status: false })
        } else {
            if (!req.headers.authorization) {
                let newList = new Array();
                searchList.forEach(element => {
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
                searchList.forEach(element => {
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
        res.json({ message: 'Arama yapılırken bilinmeyen bir hata oluştu', status: false });
    }
}
module.exports = search;
