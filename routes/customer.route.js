module.exports = (app) => {
  const customer_controller = require("../controllers/customer.controller");
  const Customer = require("../models/Customer");
  const Caterer = require("../models/Caterer");
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
      body("phone", "Enter a valid phone number")
        .if(body("email").not().exists({ checkNull: true }))
        .exists({ checkNull: true })
        .if(body("phone").exists({ checkNull: true }))
        .isMobilePhone()
        .isLength({ min: 10, max: 10 })
        .custom((email) => {
          return Customer.isCustomerPhone(email);
        }),
      body(
        "password",
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 15 char long"
      ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
      body("email", "Enter valid email")
        .if(body("phone").not().exists({ checkNull: true }))
        .exists({ checkNull: true })
        .if(body("email").exists({ checkNull: true }))
        .isEmail()
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

  // Customer OTP verification
  app.post(
    "/api/customer_otp_verification/",
    isAuth,
    [body("otp", "Invalid OTP").isNumeric().isLength({ min: 6, max: 6 })],
    customer_controller.otp_verification
  );

  // Customer add to favourite
  app.post(
    "/api/customer/add_to_favourite/",
    isAuth,
    [
      body("caterer_id", "Invalid caterer Id").custom((catererId) => {
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
    customer_controller.addCatererToFavourite
  );

  // resend Customer OTP
  app.get("/api/resend_customer_otp/", isAuth, customer_controller.resend_otp);

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
        .optional()
        .trim()
        .isLength({ min: 1, max: 15 }),
      body("last_name", "Invalid Last name, enter 1 to 15 characters only")
        .optional()
        .trim()
        .isLength({ min: 1, max: 15 }),
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
