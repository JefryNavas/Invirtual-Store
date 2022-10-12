const login = function (req, res) {
  res.render("login", {
    titulo: "Login",
  });
};
const admin = function (req, res) {
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

module.exports = {
  login,
  admin
};
