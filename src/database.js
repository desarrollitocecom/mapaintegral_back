const { Sequelize } = require('sequelize');

const { DB_DATABASE, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT } = process.env;

// Configura la conexión a la base de datos
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres', // o 'mysql', 'sqlite', 'mariadb', 'mssql'
  logging: false, // Desactiva los logs de Sequelize
});

module.exports = sequelize;
