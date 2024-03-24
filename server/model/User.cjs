

const Sequelize = require('sequelize');
const db = require('../config/db.cjs')
const Post = require('./Post.cjs');
const User = db.define('users', {
  name: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: 'Software Engineer'
  },
  email: {
    type: Sequelize.STRING
  },
  mobile: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  profileImage: {
    type: Sequelize.STRING,
    defaultValue: "https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_640.png"
  },
  reports: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  isBlocked: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: new Date()
  },
})

User.hasMany(Post, { as: 'posts', foreignKey: 'userId' });
module.exports = User