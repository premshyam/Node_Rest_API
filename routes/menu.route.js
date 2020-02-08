module.exports = app => {
  const menu_controller = require("../controllers/menu.controller");
  const Caterer = require("../models/Caterer");
  const { body, check } = require("express-validator");
  const isAuth = require("../middleware/is-auth");

  // Create Menu
  app.post(
    "/api/create_menu",
    isAuth,
    [
      body("userId", "not a vaild caterer").custom(catererId => {
        return Caterer.findById(catererId).then(result => {
          if (result) {
            //
            return true;
          } else {
            //
            return Promise.reject("not a vaild caterer");
          }
        });
      })
    ],
    menu_controller.create_menu
  );

  // Fetch All Menus of a caterer
  app.get("/api/menus/:id", menu_controller.menus);

  // Update Menu
  app.put(
    "/api/update_menu/:id",
    isAuth,
    [
      body("userId", "not a vaild caterer").custom(catererId => {
        return Caterer.findById(catererId).then(result => {
          if (result) {
            //
            return true;
          } else {
            //
            return Promise.reject("not a vaild caterer");
          }
        });
      })
    ],
    menu_controller.update_menu
  );

  // Menu Details
  app.get("/api/menu/:id", menu_controller.menu);

  // Delete Menu
  app.delete(
    "/api/delete_menu/:id",
    isAuth,
    [
      body("userId", "not a vaild caterer").custom(catererId => {
        return Caterer.findById(catererId).then(result => {
          if (result) {
            //
            return true;
          } else {
            //
            return Promise.reject("not a vaild caterer");
          }
        });
      })
    ],
    menu_controller.delete_menu
  );
};
