module.exports = (app) => {
  const caterer_controller = require("../controllers/caterer.controller");
  const upload = require("../config/caterer_image.config.js");
  const Caterer = require("../models/Caterer");
  const { query, check, body } = require("express-validator");
  const isAuth = require("../middleware/is-auth");
  // caterer Registration
  app.post(
    "/api/caterer_signup",

    upload.single("image"),
    //validators for request query fields
    [
      query("name", "Invalid name, enter 1 to 15 characters only")
        .trim()
        .isLength({ min: 1, max: 15 }),
      query("email", "Enter valid email").isEmail(),
      query("description", "Invalid Description, enter 1 to 300 characters")
        .trim()
        .isLength({ min: 1, max: 300 }),
      query(
        "password",
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 15 char long"
      ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
      query("phone", "Enter a valid phone number")
        .isMobilePhone()
        .isLength({ min: 10, max: 10 }),
      query(
        "minimum_order_quantity",
        "Enter a valid number for minimum order quantity"
      ).isInt({ gt: 0 }),
      query("availability", "Enter a boolean value").isBoolean(),
      query("live_kitchen", "Enter a boolean value").isBoolean(),
      query("delivery_fee", "Enter a valid amount for delivery fee").isInt({
        gt: 0,
      }),
      query(
        "lead_time",
        "Enter a valid number of hours for lead time, it should be more than 24"
      ).isInt({
        gt: 24,
      }),
      query("menu_starting_from", "Enter a valid amount").isInt({ gt: 0 }),
    ],
    caterer_controller.signup
  );

  // caterer Login
  app.post(
    "/api/caterer_login",
    [
      query("phone", "Enter a valid registered phone number")
        .if(query("phone").exists())
        .isMobilePhone()
        .isLength({ min: 10, max: 10 })
        .custom((email) => {
          return Caterer.isCatererPhone(email);
        }),
      query(
        "password",
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 15 char long"
      ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
      query("email", "Enter valid registered email")
        .if(query("email").exists())
        .custom((email) => {
          return Caterer.isCatererEmail(email);
        }),
    ],
    caterer_controller.login
  );

  // caterer Details
  app.get("/api/caterer_details", caterer_controller.caterer_details);

  // All caterers
  app.post(
    "/api/caterers",
    [
      query("location", "Invalid location").optional(),
      query("leadTime", "Invalid location").optional(),
      query("searchValue", "Invalid location").optional(),
      body("cateringType", "Invalid cateringType").optional(),
      body("dietary", "Invalid dietary").optional(),
      body("cuisine", "Invalid cuisine").optional(),
      body("vendorType", "Invalid vendorType").optional(),
      body("event", "Invalid event").optional(),
      body("dish", "Invalid dish").optional(),
      body("corporateEvent", "Invalid corporateEvent").optional(),
      query("ribbon", "Invalid name").optional(),
    ],
    caterer_controller.caterers
  );

  // caterer info
  app.get(
    "/api/caterer_info/",
    //Authentication middleware
    isAuth,
    [
      query("userId", "not a vaild caterer").custom((catererId) => {
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
    caterer_controller.caterer_info
  );

  // Update caterer
  app.put(
    "/api/update_caterer/",
    upload.single("image"),
    //Authentication middleware
    isAuth,
    //Caterer field validations
    [
      query("name", "Invalid name, enter 1 to 15 characters only")
        .optional()
        .trim()
        .isLength({ min: 1, max: 15 }),
      query("description", "Invalid Description, enter 1 to 50 characters")
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 }),
      query(
        "password",
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 15 char long"
      )
        .optional()
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
          "i"
        ),
      query("email", "Enter valid email").optional().isEmail(),
      query("phone", "Enter a valid phone number")
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
