const pedido = async(req, res) => {
    if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
        let user = req.session.user;
        res.render('pedido', {
            login: true,
            titulo: 'Pedido',
            tipo: user.tipo,
            name: user.nombre,
            prod: req.session.prod,
            productos: req.session.productos,
            cliente: req.session.cliente,
            nuevoP: req.session.nuevoPro
        });
    } else {
        res.redirect('/')
    }
};

module.exports = {
    pedido
}