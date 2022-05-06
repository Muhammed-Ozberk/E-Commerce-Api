const { Sequelize } = require('sequelize');
const sequelize = require('../db/database');

const Category = sequelize.define('category_table', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    categoryName: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
}, {
   timestamps: false
 });

module.exports = Category;
