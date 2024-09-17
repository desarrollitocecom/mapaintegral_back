const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const Subsector = sequelize.define('Subsector', {
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
    }

}, {
    // Opciones del modelo
    tableName: 'Subsectores',
    timestamps: true, // Añade campos `createdAt` y `updatedAt`
});

module.exports = Subsector;
