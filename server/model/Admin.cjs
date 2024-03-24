const Sequelize = require('sequelize');
const db = require('../config/db.cjs')

const Admin = db.define('admins', {
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  profileImage: {
    type: Sequelize.STRING,
    defaultValue: "https://t4.ftcdn.net/jpg/02/27/45/09/360_F_227450952_KQCMShHPOPebUXklULsKsROk5AvN6H1H.jpg"
  },
})

module.exports = Admin