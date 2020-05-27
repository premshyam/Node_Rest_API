module.exports = (app) => {
  const caterer_controller = require("../controllers/caterer.controller");
  const upload = require("../config/caterer_image.config.js");
  const Caterer = require("../models/Caterer");
  const { body, check } = require("express-validator");
  const isAuth = require("../middleware/is-auth");
  // caterer Registration
  app.post(
    "/api/caterer_signup",

    upload.single("image"),
    //validators for request body fields
    [
      body("name", "Invalid name, enter 1 to 15 characters only")
        .trim()
        .isLength({ min: 1, max: 15 }),
      body("email", "Enter valid email").isEmail(),
      body("description", "Invalid Description, enter 1 to 300 characters")
        .trim()
        .isLength({ min: 1, max: 300 }),
      body(
        "password",
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 15 char long"
      ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
      body("phone", "Enter a valid phone number")
        .isMobilePhone()
        .isLength({ min: 10, max: 10 }),
      body(
        "minimum_order_quantity",
        "Enter a valid number for minimum order quantity"
      ).isInt({ gt: 0 }),
      body("availability", "Enter a boolean value").isBoolean(),
      body("live_kitchen", "Enter a boolean value").isBoolean(),
      body("delivery_fee", "Enter a valid amount for delivery fee").isInt({
        gt: 0,
      }),
      body(
        "lead_time",
        "Enter a valid number of hours for lead time, it should be more than 24"
      ).isInt({
        gt: 24,
      }),
      body("menu_starting_from", "Enter a valid amount").isInt({ gt: 0 }),
    ],
    caterer_controller.signup
  );

  // caterer Login
  app.post(
    "/api/caterer_login",
    [
      body("phone", "Enter a valid registered phone number")
        .if(body("phone").exists())
        .isMobilePhone()
        .isLength({ min: 10, max: 10 })
        .custom((email) => {
          return Caterer.isCatererPhone(email);
        }),
      body(
        "password",
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 15 char long"
      ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
      body("email", "Enter valid registered email")
        .if(body("email").exists())
        .custom((email) => {
          return Caterer.isCatererEmail(email);
        }),
    ],
    caterer_controller.login
  );

  // caterer Details
  app.get(
    "/api/caterer_details/",
    //Authentication middleware
    isAuth,
    [
      body("userId", "not a vaild caterer").custom((catererId) => {
        return Caterer.findById(catererId).then((result) => {
          if (result) {
            //
            return true;
          } else {
            //
            return Promise.reject("not a vaild caterer");
          }
        });
      }),
    ],
    caterer_controller.caterer_details
  );

  // All caterers
  app.post(
    "/api/caterers",
    [
      body("location", "Invalid location").optional(),
      body("leadTime", "Invalid location").optional(),
      body("searchValue", "Invalid location").optional(),
      body("cateringType", "Invalid cateringType").optional(),
      body("dietary", "Invalid dietary").optional(),
      body("cuisine", "Invalid cuisine").optional(),
      body("vendorType", "Invalid vendorType").optional(),
      body("event", "Invalid event").optional(),
      body("dish", "Invalid dish").optional(),
      body("corporateEvent", "Invalid corporateEvent").optional(),
      body("name", "Invalid name").optional(),
    ],
    caterer_controller.caterers
  );

  // Update caterer
  app.put(
    "/api/update_caterer/",
    upload.single("image"),
    //Authentication middleware
    isAuth,
    //Caterer field validations
    [
      body("name", "Invalid name, enter 1 to 15 characters only")
        .optional()
        .trim()
        .isLength({ min: 1, max: 15 }),
      body("description", "Invalid Description, enter 1 to 50 characters")
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 }),
      body(
        "password",
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 15 char long"
      )
        .optional()
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
          "i"
        ),
      body("email", "Enter valid email").optional().isEmail(),
      body("phone", "Enter a valid phone number")
        .optional()
        .isMobilePhone()
        .isLength({ min: 10, max: 10 }),
    ],
    caterer_controller.update_caterer
  );

  // Delete caterer
  app.delete(
    "/api/delete_caterer/",
    //Authentication middleware
    isAuth,
    caterer_controller.delete_caterer
  );
};
