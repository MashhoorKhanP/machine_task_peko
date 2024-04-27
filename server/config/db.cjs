const { Sequelize } = require('sequelize');
require("dotenv").config();

/** Database Connection */
const db = new Sequelize(process.env.DB_NAME, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres'
});


db.sync({ force: false })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

module.exports = db;