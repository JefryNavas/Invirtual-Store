const proveedor = function(req, res) {
    if (req.session.loggedinAdmin || req.session.loggedinEmpleado) {
        let user = req.session.user;
        res.render('proveedor', {
            login: true,
            titulo: 'Nuevo Proveedor',
            tipo: user.tipo,
            name: user.nombre
        });
    } else {
        res.redirect('/')
    }
};

module.exports = {
    proveedor
}