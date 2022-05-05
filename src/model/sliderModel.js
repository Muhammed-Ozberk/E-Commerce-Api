const { Sequelize } = require('sequelize');
const sequelize = require('../db/database');

const Slider = sequelize.define('slider_table', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    image: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
},);

module.exports = Slider;