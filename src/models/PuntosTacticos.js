const { DataTypes } = require('sequelize');
const sequelize = require("../database");
const Turno = require("./Turno");
const Zona = require("./Zona");

const PuntoTactico = sequelize.define('PuntosTactico', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    turno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Turno,
            key: "id"
        }
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    zona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Zona,
            key: "id"
        }
    },
    puntos: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
}, {
    tableName: 'PuntosTacticos',
    timestamps: true,
});

// Definir asociaciones con alias diferentes para evitar colisiones
PuntoTactico.belongsTo(Turno, { foreignKey: 'turno', as: 'TurnoAsociado' });
PuntoTactico.belongsTo(Zona, { foreignKey: 'zona', as: 'ZonaAsociada' });

module.exports = PuntoTactico;
