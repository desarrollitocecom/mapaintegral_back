const qs = require("qs");
const cache = require("../cache");
const { getRealTimeUnidades } = require("../controllers/realTimeUnidadesController");
const { checkIssiInArea, checkIfPointisInArea } = require("./checkIssiInArea");
const { getIssiInfo } = require("../controllers/IssisController");
const redisClient = require("../redisClient");
const { roundTo, fixArrayRedis } = require("../helpers/calcHelper");
const { io } = require("../server");
const { getRadios } = require("../controllers/radiosController");
const { createAlert, closeAlert, getActiveAlert } = require("../controllers/alertasController");
const { getPuntoTacticoById } = require("../controllers/puntosTacticosController");

const deleteAlert = async (issi) => {

    if (!redisClient.isOpen)
        await redisClient.connect();

    let alertsList = await redisClient.lRange("alerts", 0, -1);
    let alertsArray = alertsList.map(alert => JSON.parse(alert));
    const alertIdToRemove = issi;
    alertsArray = alertsArray.filter(alert => alert.issi !== alertIdToRemove && alert.isInside !== true);
    await redisClient.del("alerts");
    for (const alert of alertsArray) {
        await redisClient.rPush("alerts", JSON.stringify(alert));
    }
};

const monitorIssis = async () => {

    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    // Obtener las ISSIs activas para vigilar
    const issis = await redisClient.keys('vigilancia:*');

    if (issis.length > 0) {
        for (const key of issis) {
            const issi = key.split(':')[1]; // obtener la ISSI actual
            const { point, position } = await getIssiInfo(issi); // obtener la ubicación y el punto a vigilar de la ISSI
            const centerPoint = [roundTo(point.latitud), roundTo(point.longitud)];
            //const isInside = checkIssiInArea(position, centerPoint);
            const isInside = await checkIfPointisInArea(position, centerPoint, point.options);
            const response = await getActiveAlert(issi);
            //console.log(isInside, issi);
            // console.log("response: ",response);
            const issiInfo = await redisClient.hGetAll(`vigilancia:${issi}`);
            const pointInfo = issiInfo.punto_index ? await getPuntoTacticoById(issiInfo.punto_index) : false;
            //console.log("pointinfo:", pointInfo);
            // Caso 1: ISSI fuera del área y no tiene alerta
            if (isInside === false && (response === null || (response && response.is_inside === true))) {
                try {
                    await deleteAlert(issiInfo.issi)
                    // Crear una nueva alerta
                    const newAlert = await createAlert(issi, 1, point, position, `ISSI ${issi} ha salido del área: ${pointInfo.nombre}`);
                    if (newAlert) {
                        console.log(`Alerta creada para ISSI ${issi}:`);
                        // Crear objeto de alerta para emitir a través de Socket.IO
                        const alertObject = {
                            issi,
                            message: `ISSI ${issi} ha salido del área ${pointInfo !== false ? pointInfo.nombre : ""}`,
                            position, // Posición actual de la ISSI
                            point: centerPoint, // Centro del área vigilada
                            punto_index: issiInfo.punto_index,
                            feature_index: issiInfo.feature_index,
                            alertid: newAlert.id, // ID de la alerta recién creada
                            isInside: false,
                            options: JSON.parse(issiInfo.options)
                        };
                        // Añadir la alerta al array
                        // Recuperar el array de alertas del caché
                        await redisClient.rPush('alerts', JSON.stringify(alertObject));
                        const a = await redisClient.lRange("alerts", 0, -1);
                        const b = fixArrayRedis(a);
                        io.emit('alerta', b);  // Emitir desde la caché
                        return;
                    }
                } catch (error) {
                    console.error(`Error al crear la alerta para ISSI ${issi}:`, error);
                }

                // Caso 2: ISSI ha entrado en el área vigilada y tiene una alerta activa
            } else if (isInside === true && response && response.is_inside === false) {

                try {
                    // Cerrar la alerta
                    const a = await closeAlert(response.id);
                    console.log(`Alerta cerrada para ISSI ${response.issi}:`);
                    let alertsList = await redisClient.lRange("alerts", 0, -1);
                    let alertsArray = alertsList.map(alert => JSON.parse(alert));
                    const alertIdToRemove = response.id;
                    alertsArray = alertsArray.map(alert => {
                        if (alert.alertid === alertIdToRemove)
                            return {
                                ...alert,
                                isInside: true,
                                message: `ISSI ${issi} ha regresado al área : ${pointInfo.nombre}`
                            }
                        return alert;
                    });
                    await redisClient.del("alerts");
                    for (const alert of alertsArray) {
                        await redisClient.rPush("alerts", JSON.stringify(alert));
                    }
                    io.emit('alerta', alertsArray);  // Emitir desde la caché
                    return;
                } catch (error) {
                    console.error(`Error al cerrar la alerta para ISSI ${issi}:`, error);
                }
            }
        }
    }
    const alertsList = await redisClient.lRange("alerts", 0, -1);
    //console.log(alertsList);
    let alertsArray = alertsList
        .map(alert => JSON.parse(alert)).filter(alert => alert.isInside === false); // Filtra las alertas que no están dentro

    if (alertsArray.length === 0)
        alertsArray = [];
    io.emit('alerta', alertsArray);  // Emitir desde la caché
};

/*const monitorIssis = async () => {
    if (!redisClient.isOpen) await redisClient.connect();
    const issis = await redisClient.keys('vigilancia:*');
    
    if (issis.length > 0) {
        for (const key of issis) {
            const issi = key.split(':')[1];
            const { point, position } = await getIssiInfo(issi);
            const centerPoint = [roundTo(point.latitud), roundTo(point.longitud)];
            const isInside = await checkIfPointisInArea(position, centerPoint, point.options);
            const response = await getActiveAlert(issi);
            const issiInfo = await redisClient.hGetAll(`vigilancia:${issi}`);
            const pointInfo = issiInfo.punto_index ? await getPuntoTacticoById(issiInfo.punto_index) : false;
            
            if (!isInside && (!response || response.is_inside)) {
                try {
                    await deleteAlert(issiInfo.issi);
                    const newAlert = await createAlert(issi, 1, point, position, `ISSI ${issi} ha salido del área: ${pointInfo.nombre}`);
                    if (newAlert) {
                        const alertObject = {
                            issi, message: `ISSI ${issi} ha salido del área ${pointInfo ? pointInfo.nombre : ""}`,
                            position, point: centerPoint, punto_index: issiInfo.punto_index, feature_index: issiInfo.feature_index,
                            alertid: newAlert.id, isInside: false, options: JSON.parse(issiInfo.options)
                        };
                        await redisClient.rPush('alerts', JSON.stringify(alertObject));
                        io.emit('alerta', fixArrayRedis(await redisClient.lRange("alerts", 0, -1)));
                        return;
                    }
                } catch (error) { console.error(`Error al crear la alerta para ISSI ${issi}:`, error); }
            } else if (isInside && response && !response.is_inside) {
                try {
                    await closeAlert(response.id);
                    let alertsArray = (await redisClient.lRange("alerts", 0, -1)).map(alert => JSON.parse(alert)).map(alert =>
                        alert.alertid === response.id ? { ...alert, isInside: true, message: `ISSI ${issi} ha regresado al área: ${pointInfo.nombre}` } : alert);
                    await redisClient.del("alerts");
                    for (const alert of alertsArray) await redisClient.rPush("alerts", JSON.stringify(alert));
                    io.emit('alerta', alertsArray);
                    return;
                } catch (error) { console.error(`Error al cerrar la alerta para ISSI ${issi}:`, error); }
            }
        }
    }
    let alertsAr*ray = (await redisClient.lRange("alerts", 0, -1)).map(alert => JSON.parse(alert)).filter(alert => !alert.isInside);
    io.emit('alerta', alertsArray.length === 0 ? [] : alertsArray);
};*/


const setUnidades = async () => {
    let unidades = [];
    if (!redisClient.isOpen)
        await redisClient.connect();
    try {
        // Preparar la payload para la consulta de las unidades en tiempo real
        const unidadespayload = qs.stringify({
            vidusuario: cache.get("sesion")._idusuario,
            vidtipo: 0,  // Cambia este valor según el tipo de unidades que necesites
            videstado: "TODOS",
            vtipousuario: cache.get("sesion")._tipo,
            vorden: 1,
            vissi: ""
        });

        // Hacer la consulta a la API para obtener las unidades
        const { data, status } = await getRealTimeUnidades(unidadespayload);

        // Verificar si la consulta fue exitosa
        if (status === 200) {
            const issi_muni = await getRadios();  // Obtener información adicional de las radios

            // Inicializar el conteo
            const conteo = {
                TODOS: { activo: 0, inactivo: 0 },
                PERSONA: { activo: 0, inactivo: 0 },
                AMBULANCIA: { activo: 0, inactivo: 0 },
                AUTOMOVIL: { activo: 0, inactivo: 0 },
                MOTO: { activo: 0, inactivo: 0 },
                POLICIA: { activo: 0, inactivo: 0 },
                CAMION: { activo: 0, inactivo: 0 }
            };

            // Iterar sobre las unidades obtenidas y guardarlas en Redis
            await Promise.all(data.map(async (element,index) => {
                const unidad = issi_muni.find(e => element._issi === e.issi);
                const estado = element._estado;
                const tipoIssi = element._tipounid;

                // Actualizar el conteo basado en el estado de la unidad
                switch (estado) {
                    case "NORMAL":
                    case "BATERIA BAJA":
                        conteo[tipoIssi].activo++;
                        break;
                    case "NO REPORTA - MAL APAGADO":
                    case "SIN COBERTURA DE GPS":
                        console.log("conteo tipoissi:",conteo[tipoIssi]);
                        console.log("activos:",element._issi, index);
                        //console.log(data[383]);
                        console.log("camion: ",conteo.CAMION);
                        conteo[tipoIssi].inactivo++;
                        break;
                    default:
                        break;
                }

                // Verificar que los valores que se van a pasar a Redis no sean `undefined`
                const unidadData = {
                    _issi: element._issi || "",
                    _unicocodigo: element._unicocodigo || "",
                    _idtunidad: element._idtunidad || "",
                    _tipounid: element._tipounid || "",
                    _estadocod: element._estadocod || "",
                    _estado: element._estado || "",
                    _estadoradar: element._estadoradar || "",
                    _color: element._color || "",
                    _hexacolor: element._hexacolor || "",
                    _longitud: String(element._longitud || ""),  // Convertir los números a cadenas de texto
                    _latitud: String(element._latitud || ""),    // Convertir los números a cadenas de texto
                    _fechahora: element._fechahora || "",
                    _velocidad: String(element._velocidad || ""),  // Convertir los números a cadenas de texto
                    _direccion: element._direccion || "",
                    _unidad: unidad ? unidad.informacion?.unidad : "-",
                    _placa: unidad ? unidad.informacion?.placa : "-",
                    _cargo: unidad ? unidad.informacion?.cargo : "-",
                    _nombre: unidad ? unidad.informacion?.nombre : "-"
                };

                unidades.push(unidadData);

                await redisClient.hSet(`unidades:${unidadData._issi}`, {
                    latitud: unidadData._latitud,
                    longitud: unidadData._longitud
                });
            }));
            io.emit('unidades', unidades);
            io.emit('conteo', conteo);

        } else {
            console.error("No se encontraron unidades disponibles o hubo un error en la API.");
        }
    } catch (error) {
        console.error("Error actualizando setUnidades:", error.message);
    }

};

module.exports = { setUnidades, monitorIssis }
