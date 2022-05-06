const { Sequelize } = require('sequelize');
const sequelize = require('../db/database');

const ProductImage = sequelize.define('product_image_table', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    image: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
}, {
   timestamps: false
 });

module.exports = ProductImage;
