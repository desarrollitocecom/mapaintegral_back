const esAlfabetica = (cadena) => {
    const regex = /^[a-zA-Z\s]{3,}$/;
    return regex.test(cadena);
};



module.exports = { esAlfabetica };