const adminAuthentication = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect('/adminLogin');
  }
};

module.exports = adminAuthentication;
