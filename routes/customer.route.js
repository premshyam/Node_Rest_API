module.exports = (app) => {
  const customer_controller = require("../controllers/customer.controller");
  const Customer = require("../models/Customer");
  const { check, body } = require("express-validator");
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
      body("email", "Enter valid email")
        .isEmail()
        .custom((email) => {
          return Customer.isEmailRegistered(email);
        }),
      body("phone", "Enter a valid phone number")
        .isMobilePhone()
        .isLength({ min: 10, max: 10 })
        .custom((phone) => {
          return Customer.isPhoneRegistered(phone);
        }),
    ],
    customer_controller.signup
  );

  // Customer Login
  app.post(
    "/api/customer_login",
    [
      body("phone", "Enter a valid registered phone number")
        .if(body("phone").exists())
        .isMobilePhone()
        .isLength({ min: 10, max: 10 })
        .custom((email) => {
          return Customer.isCustomerPhone(email);
        }),
      body(
        "password",
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 15 char long"
      ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
      body("email", "Enter valid registered email")
        .if(body("email").exists())
        .custom((email) => {
          return Customer.isCustomerEmail(email);
        }),
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

  // Customer email verification
  app.get(
    "/api/email_confirmation/:token",
    [check("token").isAlphanumeric()],
    customer_controller.customer_confirm_email
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
        .if(body("first_name").exists())
        .trim()
        .isLength({ min: 1, max: 15 }),
      body("last_name", "Invalid Last name, enter 1 to 15 characters only")
        .if(body("last_name").exists())
        .trim()
        .isLength({ min: 1, max: 15 }),
      body(
        "password",
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 15 char long"
      )
        .if(body("password").exists())
        .matches(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
          "i"
        ),
      body("email", "Enter valid email").if(body("email").exists()).isEmail(),
      body("phone", "Enter a valid phone number")
        .if(body("phone").exists())
        .isMobilePhone()
        .isLength({ min: 10, max: 10 }),
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
