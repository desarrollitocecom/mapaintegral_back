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
        get() {
            const rawValue = this.getDataValue('dni');
            // Rellena el número entero con ceros a la izquierda para que tenga 8 dígitos
            return rawValue ? rawValue.toString().padStart(8, '0') : null;
        },
        set(value) {
            // Asegura que el valor se almacene como entero
            this.setDataValue('dni', parseInt(value, 10));
        }
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
        defaultValue: false
    }

}, {
    // Opciones del modelo
    tableName: 'Usuarios',
    timestamps: true, // Añade campos `createdAt` y `updatedAt`
});

Usuario.belongsTo(Turno, { foreignKey: 'turno', as: 'TurnoAsociado' });

module.exports = Usuario;
