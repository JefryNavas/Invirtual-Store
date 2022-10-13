const {
    getGeneros,
    insertCliente,
    getClientes,
    buscarPorCed,
    updateCli
} = require("../services/clientService")

const cliente = async(req, res) => {
    if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
        let user = req.session.user;
        let genero = await getGeneros();
        res.render('cliente', {
            login: true,
            titulo: 'Cliente',
            tipo: user.tipo,
            name: user.nombre,
            genero
        });
    } else {
        res.redirect('/')
    }
};

module.exports = {
    cliente
}