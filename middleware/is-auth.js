const HttpStatus = require("http-status-codes");
//jwt module for authentication
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  //if Authorization wasn't passed as part of req header
  if (!authHeader) {
    //throw error saying the req is not authenticated
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  /**if Authorization was passed as part of req header
   * then extract the token
   */
  const token = authHeader.split(" ")[1];
  //variable to store the decoded token
  let decodedToken;
  // try to decode token
  try {
    //verify and decode the token
    decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
  } catch (err) {
    //catch errors
    //throw error
    err.statusCode = HttpStatus.UNAUTHORIZED;
    throw err;
  }
  //if the token was invalid
  if (!decodedToken) {
    //throw error saying the req is not authenticated
    const error = new Error("Not authenticated.");
    error.statusCode = HttpStatus.UNAUTHORIZED;
    throw error;
  }
  req.body.userId = decodedToken.userId;
  req.email = decodedToken.email;
  next();
};
