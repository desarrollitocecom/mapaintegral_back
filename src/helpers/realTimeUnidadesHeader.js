const getRealTimeUnidadesHeader = (payload) => {
    return {
        headers: {
            'Connection': 'keep-alive',
            'Content-Length': payload.length,
            'Accept': '*/*',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'http://190.102.145.248',
            'Referer': 'http://190.102.145.248/dolphinv2d/rpt5_gps.html',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'es-419,es;q=0.9'
        },
        withCredentials: true
    };

};

module.exports = { getRealTimeUnidadesHeader };