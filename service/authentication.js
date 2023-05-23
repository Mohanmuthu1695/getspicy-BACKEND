require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1]; // Use index 1 instead of 0 to get the token
  if (token == null)
    return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, response) => {
    if (err)
      return res.sendStatus(403);
    res.locals.response = response;
    next();
  });
}

module.exports = { authenticate: authenticate };
