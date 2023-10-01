


const UserAuthentication = (req, res, next) => {
  if (req.session.isUser) {
 next();
  } else {
   
  }
};

module.exports = UserAuthentication;
