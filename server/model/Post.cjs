const Sequelize = require('sequelize');
const db = require('../config/db.cjs')

const Post = db.define('posts', {
  title: {
    type: Sequelize.STRING
  },
  category: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  image: {
    type: Sequelize.STRING
  },
  likes: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  likedBy: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
    defaultValue: []
  },
  dislikedBy: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
    defaultValue: []
  },
  dislikes: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  uName: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.STRING
  },
  comments: {
    type: Sequelize.ARRAY(Sequelize.JSONB),
    allowNull: true,
    defaultValue: []
  },
  reportings: {
    type: Sequelize.ARRAY(Sequelize.JSONB),
    allowNull: true,
    defaultValue: []
  },
  updatedAt: {
    type: Sequelize.DATE,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: new Date()
  },
})


module.exports = Post