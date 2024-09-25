const { DataTypes } = require('sequelize');
const sequelize = require("../database");
const Turno = require("../models/Turno");

const Usuario = sequelize.define('Usuario', {
    // Definición de los campos de la tabla
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        //autoIncrement: true,
        defaultValue: DataTypes.UUIDV4
    },
    member: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombres: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dni: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    superior: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    turno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Turno,
            key: "id"
        }
    },
    state: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }

}, {
    // Opciones del modelo
    tableName: 'Usuarios',
    timestamps: true, // Añade campos `createdAt` y `updatedAt`
});

Usuario.belongsTo(Turno, { foreignKey: 'turno', as: 'TurnoAsociado' });

module.exports = Usuario;
