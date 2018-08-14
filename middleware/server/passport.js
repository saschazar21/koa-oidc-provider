const passport = require('koa-passport');

passport.isAuthenticated = (req, res, next) => {
  if (!req.user || (req.state && !req.state.user)) {
    res.statusCode = 302;
    res.statusMessage = 'Found';
    res.setHeader('Location', '/login');
    return res.end();
  }
  return next();
};

module.exports = (req, res, next) => {
  if (req.url.startsWith('/login') || req.url.startsWith('/register')) {
    return next();
  }
  if (!req.isAuthenticated) {
    req.isAuthenticated = passport.isAuthenticated;
  }
  return req.isAuthenticated(req, res, next);
};
