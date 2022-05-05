const { Sequelize } = require('sequelize');
const sequelize = require('../db/database');

const Favorite = sequelize.define('favorites_table', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = Favorite;