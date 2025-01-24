const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const Zona = sequelize.define('Zona', {
    // Definición de los campos de la tabla
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    }

}, {
    // Opciones del modelo
    tableName: 'Zonas',
    timestamps: true, // Añade campos `createdAt` y `updatedAt`
});

module.exports = Zona;
