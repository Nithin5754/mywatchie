const checkAdminLogin = (req, res, next) => {
  if (req.session.adminData) {
    res.redirect('/adminUserManagement');
  } else {
    next();
  }
};

const checkAdminAuthentication = (req, res, next) => {
  if (req.session.adminData) {
    next();
  } else {
    res.redirect('/adminLogin');
  }
};

module.exports = { checkAdminAuthentication, checkAdminLogin };
