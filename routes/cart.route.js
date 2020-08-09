module.exports = (app) => {
  const cartController = require("../controllers/cart.controller");
  const Menu = require("../models/Menu");
  const isAuth = require("../middleware/is-auth");
  const { body, check } = require("express-validator");

  // get cart
  app.get("/api/get_cart/", isAuth, cartController.getCart);
  // Update cart
  app.post("/api/update_cart/", isAuth, cartController.updateCart);
};
