const axios = require("axios");

const getCluster = async (clusters) => {
  try {
    let url = `http://127.0.0.1:5000/ml/${clusters}`;
    const respuesta = await axios.get(url);
    return respuesta.data;
  } catch (error) {
    return error.message;
  }
};
const fechaActual = () => {
  var fecha = new Date();
  var mes = fecha.getMonth() + 1;
  var dia = fecha.getDate();
  var ano = fecha.getFullYear();
  if (dia < 10) dia = "0" + dia;
  if (mes < 10) mes = "0" + mes;
  FechaActual = ano + "-" + mes + "-" + dia;
  return FechaActual;
};

const shuffle = (array) => {
  var currentIndex = array.length,
    randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};
module.exports = { getCluster, fechaActual, shuffle };
