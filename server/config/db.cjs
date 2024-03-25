const { Sequelize } = require('sequelize');

/** Database Connection */
const db = new Sequelize('blogApp', 'postgres', 'Mashhoor@Postgre', {
  host: 'localhost',
  dialect: 'postgres'
});


// db.sync({ force: false })
//   .then(() => {
//     console.log('Database synchronized');
//   })
//   .catch(err => {
//     console.error('Error synchronizing database:', err);
//   });

module.exports = db;