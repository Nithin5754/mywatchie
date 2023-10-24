const userBeforeLoginAuthentication = (req, res, next) => {
  if (req.session.isUser) {
    return res.redirect('/homepage');
  } else {
    next();
  }
};

const userAfterLoginAuthentication = (req, res, next) => {
  if (req.session.isUser) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = {
  userBeforeLoginAuthentication,
  userAfterLoginAuthentication,
};
