const { Sequelize } = require('sequelize');
const sequelize = require('../db/database');

const Cart = sequelize.define('cart_table', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = Cart;