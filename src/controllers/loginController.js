const axios = require("axios");
const { headers } = require("../helpers/loginHeader");
const qs = require("qs");
const cache = require("../cache");

const { LOGIN_URL, USUARIO, PASSWORD } = process.env;
const loginPayload = qs.stringify({
    vUser: USUARIO,
    vPass: PASSWORD
});

const login = async () => {
    try {
        const { data, status } = await axios.post(LOGIN_URL, loginPayload, headers);
        if (status === 200 && data[0]._idusuario) {
            cache.set("sesion", data[0]);
            return true;
        }
        else
            console.error("Error en el inicio de sesion en Dolphin, verifica las credenciales de inicio o el endpoint - login");
        return false;
    } catch (error) {
        console.error("Error en el proceso de inicio:", error.message);
        return null;
    }
};

module.exports = { login };