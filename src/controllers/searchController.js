const Product = require('../model/productModel');
const sequelize = require('sequelize');

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
            res.json({
                message: 'Ürünler başarıyla getirildi',
                status: true,
                data: {
                    searchList
                }
            });
        }
    } catch (error) {
        res.json({ message: 'Arama yapılırken bilinmeyen bir hata oluştu', status: false });
    }
}
module.exports = search;
