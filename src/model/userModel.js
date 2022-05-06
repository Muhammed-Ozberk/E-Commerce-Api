const { Sequelize } = require('sequelize');
const sequelize = require('../db/database');

const User = sequelize.define('users_table', {
    id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true,
   },
   name: { 
      type: Sequelize.STRING,
   },
   phone: {
      type: Sequelize.BIGINT(11),
   },
    email: {
       type: Sequelize.STRING,
       allowNull: false,
    },
    password: {
       type: Sequelize.STRING,
       allowNull: false,
   },
   avatar: {
      type: Sequelize.TEXT,
      defaultValue:"default.jpg"
    }
}, {
   timestamps: false
 });

module.exports = User;
