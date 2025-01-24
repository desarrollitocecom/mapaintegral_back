const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const Turno = sequelize.define('Turno', {
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

}, {
    // Opciones del modelo
    tableName: 'Turnos',
    timestamps: true, // Añade campos `createdAt` y `updatedAt`
});

module.exports = Turno;