const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const Radio = sequelize.define('Radio', {
    // Definición de los campos de la tabla
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    issi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    fuente: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    informacion:{
        type: DataTypes.JSONB,
        allowNull: false,
    },
    
}, {
    // Opciones del modelo
    tableName: 'Radios',
    timestamps: true, // Añade campos `createdAt` y `updatedAt`
});

module.exports = Radio;
