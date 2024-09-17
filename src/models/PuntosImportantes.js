const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const PuntoImportante = sequelize.define('PuntoImportante', {
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
    punto: {
        type: DataTypes.JSONB,
        allowNull: false,
    }

}, {
    // Opciones del modelo
    tableName: 'PuntosImportantes',
    timestamps: true, // Añade campos `createdAt` y `updatedAt`
});


module.exports = PuntoImportante;