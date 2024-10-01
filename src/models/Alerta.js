const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const Alerta = sequelize.define('Alerta', {
    // Definición de los campos de la tabla
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    issi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    point: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    position: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    information: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_inside: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }

}, {
    // Opciones del modelo
    tableName: 'Alertas',
    timestamps: true, // Añade campos `createdAt` y `updatedAt`
});

module.exports = Alerta;
