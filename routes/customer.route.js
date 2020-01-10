module.exports = app => {
  const customer_controller = require("../controllers/customer.controller");
  const Customer = require("../models/Customer");
  const { body } = require("express-validator");
  const isAuth = require("../middleware/is-auth");
  // Customer Registration
  app.post(
    "/api/customer_signup",
    //Authentication middleware
    // isAuth,
    //validators for request body fields
    [
      body("first_name", "Invalid First name, enter 1 to 15 characters only")
        .trim()
        .isLength({ min: 1, max: 15 }),
      body("last_name", "Invalid Last name, enter 1 to 15 characters only")
        .trim()
        .isLength({ min: 1, max: 15 }),
      body(
        "password",
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 15 char long"
      ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
      body("email", "Enter valid email").isEmail(),
      body("phone", "Enter a valid phone number")
        .isMobilePhone()
        .isLength({ min: 10, max: 10 })
    ],
    customer_controller.signup
  );

  // Customer Login
  app.post(
    "/api/customer_login",
    [
      body("phone", "Enter a valid registered phone number").isMobilePhone(),
      body(
        "password",
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 15 char long"
      ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
      body("email", "Enter valid registered email").isEmail()
    ],
    customer_controller.login
  );

  // Customer Details
  app.get(
    "/api/customer_details/",
    //Authentication middleware
    isAuth,
    customer_controller.customer_details
  );

  // All Customers
  app.get("/api/customers", customer_controller.customers);

  // Update Customer
  app.put(
    "/api/update_customer/",
    //Authentication middleware
    isAuth,
    //validators for request body fields
    [
      body("first_name", "Invalid First name, enter 1 to 15 characters only")
        .trim()
        .isLength({ min: 1, max: 15 }),
      body("last_name", "Invalid Last name, enter 1 to 15 characters only")
        .trim()
        .isLength({ min: 1, max: 15 }),
      body(
        "password",
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 15 char long"
      ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
      body("email", "Enter valid email").isEmail(),
      body("phone", "Enter a valid phone number")
        .isMobilePhone()
        .isLength({ min: 10, max: 10 })
    ],
    customer_controller.update_customer
  );

  // Delete Customer
  app.delete(
    "/api/delete_customer/",
    //Authentication middleware
    isAuth,
    customer_controller.delete_customer
  );
};
