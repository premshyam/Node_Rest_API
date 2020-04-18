module.exports = (app) => {
  const cart_controller = require("../controllers/cart.controller");
  const Menu = require("../models/Menu");
  const isAuth = require("../middleware/is-auth");
  const { body, check } = require("express-validator");

  // Add Item to Cart
  app.post(
    "/api/add_item",
    isAuth,
    [
      body("menu_id", "not a valid menu").custom((menuId) => {
        return Menu.findById(menuId).then((result) => {
          if (result && result !== null) {
            //
            // console.log(result);
            return true;
          } else {
            //
            return Promise.reject("not a valid menu");
          }
        });
      }),
      body("quantity", "quantity not valid").isNumeric(),
    ],
    cart_controller.add_item
  );

  // Remove Item from Cart
  app.post(
    "/api/remove_item",
    isAuth,
    [
      body("menu_id", "not a valid menu").custom((menuId) => {
        return Menu.findById(menuId).then((result) => {
          if (result && result !== null) {
            //
            console.log(result);
            return true;
          } else {
            //
            return Promise.reject("not a valid menu");
          }
        });
      }),
    ],
    cart_controller.remove_item
  );

  // // Item Details
  // app.get("/api/item/:id", isAuth, cart_controller.item_details);

  // View Customer Cart Items
  app.get("/api/cart_items/", isAuth, cart_controller.cart_items);

  app.put("/api/empty_cart/", isAuth, cart_controller.empty_cart);
};
