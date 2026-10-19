const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  res.redirect('/');
};

module.exports = { requireAuth };
