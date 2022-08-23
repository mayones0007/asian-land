
const corsMiddleware = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-control-Allow-Headers', '*')
  req.header('Access-Control-Allow-Origin', '*')
  req.header('Access-control-Allow-Headers', '*')
  next();
}

module.exports = corsMiddleware