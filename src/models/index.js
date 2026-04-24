const { sequelize, Sequelize } = require('../dao/database');
const User = require('./User');

const db = {
  sequelize,
  Sequelize,
  User,
};

module.exports = db;
