const { DataTypes } = require('sequelize');
const sequelize = require("../database");
const Sector = require("../models/Sector");

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
    },
    sector:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:
        {
            model: Sector,
            key: 'id'
        }
    }

}, {
    // Opciones del modelo
    tableName: 'Subsectores',
    timestamps: true, // Añade campos `createdAt` y `updatedAt`
});

Subsector.belongsTo(Sector, { foreignKey: 'sector', as: 'SectorAsociado' });

module.exports = Subsector;
