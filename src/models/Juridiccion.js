const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const Juridiccion = sequelize.define('Juridiccion', {
    // Definición de los campos de la tabla

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    puntos: {
        type: DataTypes.JSONB,
        allowNull: false,
    },

}, {
    // Opciones del modelo
    tableName: 'Juridicciones',
    timestamps: true, // Añade campos `createdAt` y `updatedAt`
});

module.exports = Juridiccion;