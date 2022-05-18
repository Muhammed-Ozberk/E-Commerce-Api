const Favorite = require('../model/favoriteModel');
const Token = require('../config/token');
const sequelize = require('../db/database');

const favoriAdd = async (req, res, next) => {
    try {
        const userToken = Token(req.headers.authorization);
        const product = await Favorite.findOne({ where: { userId: (await userToken).userId, productId: req.body.productId } });
        if (product) {
            res.json({ message: 'Bu ürün zaten favorilerde', status: true });
        } else {
            const productAdd = await Favorite.create(({ userId: (await userToken).userId, productId: req.body.productId }));
            if (!productAdd) {
                res.json({ message: 'Ürün favorilere eklenirken bir hata oluştu', status: false });
            } else {
                res.json({
                    message: 'Ürün favorilere başarıyla eklendi',
                    status: true,
                });
            }
        }
    } catch (error) {
        res.json({ message: 'Ürün favorilere eklenirken bilinmeyen bir hata oluştu', status: false });
    }
}

const favoriRemove = async (req, res, next) => {
    try {
        const userToken = Token(req.headers.authorization);
        const product = await Favorite.findOne({ where: { userId: (await userToken).userId, productId: req.body.productId } });
        if (!product) {
            res.json({ message: 'Ürün bulunamadı', status: false });
        } else {
            const removeProduct = await product.destroy();
            if (!removeProduct) {
                res.json({ message: 'Ürün favorilerden çıkarılırken bir hata oluştu', status: false });
            } else {
                res.json({ message: 'Ürün favorilerden çıkarıldı', status: true });
            }
        }
    } catch (error) {
        res.json({ message: 'Ürün favorilerden çıkarılıken bilinmeyen bir hata oluştu', status: false });
    }
}

const favoriList = async (req, res, next) => {
    try {
        const userToken = Token(req.headers.authorization);
        const favoriList = await sequelize.query(`select productId,image,price,title from product_tables 
        inner join favorites_tables  on
        product_tables.id = favorites_tables.productId and
        favorites_tables.userId = ${(await userToken).userId}`);
        if (!favoriList) {
            res.json({ message: 'Favorilerdeki ürünler getirilirken bir hata oluştu', status: false });
        } else {
            let newList = new Array();
            favoriList[0].forEach(element => {
                let newFav = {
                    productId: element.productId,
                    image: element.image,
                    price: element.price,
                    title: element.title,
                    isFavorite:true
                }
                newList.push(newFav);
            });
            if (favoriList.length === 0) {
                res.json({ message: 'Favorilerde hiç ürün bulunamadı', status: true, });
            } else {
                res.json({ message: 'Favorilerdeki ürünler başarıyla getirildi', status: true, data: newList });
            }
        }
    } catch (error) {
        res.json({ message: 'Favori ürünler listelenirken bilinmeyen bir hata oluştu', status: false });
    }
}

module.exports = {
    favoriAdd,
    favoriRemove,
    favoriList
}