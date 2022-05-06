const { Sequelize } = require('sequelize');
const sequelize = require('../db/database');

const CartItem = sequelize.define('cart_item_table', {
    cartId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    productQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
   timestamps: false
 });

module.exports = CartItem;
