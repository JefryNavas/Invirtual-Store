const axios = require('axios');

const getCluster = async(clusters) => {
    try {
        let url = `http://127.0.0.1:5000/ml/${clusters}`;
        const respuesta = await axios.get(url);

        return respuesta.data;
    } catch (error) {
        return error.message;
    }
}

getCluster(2).then((data) => console.log(data.Repartidores));