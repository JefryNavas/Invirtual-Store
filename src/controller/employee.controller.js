const { authEmail } = require("../services/authService");
const {
    insertUser,
    getUsers,
    editUser
} = require("../services/employeeService");

const admin = function(req, res) {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        res.render("admin", {
            login: true,
            titulo: "Dashboard",
            tipo: "admin",
            name: user.nombre,
        });
    } else {
        res.redirect("/");
    }
};

const empleado = function(req, res) {
    if (req.session.loggedinEmpleado) {
        let user = req.session.user;
        res.render('empleado', {
            login: true,
            tipo: 'empleado',
            name: user.nombre
        });
    } else {
        res.redirect('/')
    }
};

const repartidor = function(req, res) {
    if (req.session.loggedinRepartidor) {
        let user = req.session.user;
        res.render('repartidor', {
            login: true,
            tipo: 'repartidor',
            name: user.nombre
        });
    } else {
        res.redirect('/')
    }
};

// Registrar Empleado
const register = async(req, res) => {

    let rol = req.body.rol;
    let placa = ""
    if (rol == 3) {
        placa = req.body.placa
    } else {
        placa = ""
    }
    const user = {
        email: req.body.user,
        name: req.body.name,
        rol,
        pass: req.body.pass,
        pass2: req.body.pass2,
        placa
    };
    // Insertar en la base de datos y mensaje
    //let passhash = await bcryptjs.hash(user.pass, 8);
    if (user.pass2 == user.pass) {
        if (await authEmail(user.email)) {
            insertUser(user.rol, user.name, user.email, user.pass, user.placa).then(resp => res.render('login', {
                alert: true,
                alertTitle: 'Registrado Correctamente',
                alertMessage: resp,
                icon: 'success',
                timer: 1700,
                ruta: ''
            }));
        } else {
            res.render('login', {
                alert: true,
                alertMessage: 'El email ya existe',
                icon: 'error',
                timer: 1500,
                ruta: ''
            });
        }

    } else {
        res.render('login', {
            alert: true,
            alertMessage: 'Las Contraseñas no coinciden',
            icon: 'error',
            timer: 1500,
            ruta: ''
        });

    }
};

// Tabla Usuarios 
const tableEmployee = async(req, res) => {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        let users = await getUsers();
        res.render('tableUser', {
            login: true,
            titulo: 'Tablas',
            tipo: user.tipo,
            name: user.nombre,
            users
        });
    } else {
        res.redirect('/')
    }
};

// Editar Usuario
const editTableEmployee = async(req, res) => {
    if (req.session.loggedinAdmin) {
        let user = req.session.user;
        const idUser = req.body.id;
        let users = await getUsers();
        let usuario = users.find(obj => obj.id_empleado == idUser);
        res.render('tableUser', {
            login: true,
            titulo: 'Tablas',
            tipo: user.tipo,
            name: user.nombre,
            usuario
        });
    } else {
        res.redirect('/')
    }
};
const editEmployee = async(req, res) => {
    let userr = req.session.user;
    const user = {
        id: req.body.id_empleado,
        email: req.body.user,
        name: req.body.name,
        rol: req.body.rol,
        pass: req.body.pass
    };

    const msg = await editUser(user.id, user.name, user.rol, user.email, user.pass);

    res.render('tableUser', {
        tipo: userr.tipo,
        alert: true,
        alertTitle: msg,
        icon: 'success',
        timer: 1700,
        ruta: 'tableUser'
    });

};

module.exports = {
    admin,
    empleado,
    repartidor,
    register,
    tableEmployee,
    editTableEmployee,
    editEmployee
}