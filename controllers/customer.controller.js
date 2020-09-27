const bcrypt = require("bcryptjs");
const HttpStatus = require("http-status-codes");
const Customer = require("../models/Customer");
const Otp = require("../models/Otp");
const Cart = require("../models/Cart");
//jsonwebtokens module for generating auth tokens
const jwt = require("jsonwebtoken");
//validationResult for catching validation erros from express-validator middleware
const { validationResult } = require("express-validator");
//email transporter
const { transporter } = require("../util/emailer");
// Customer Signup
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  // hash the user password
  let password = await bcrypt.hash(req.body.password, 12);
  //create customer object
  const customer = new Customer({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: password,
    phone: req.body.phone,
  });

  // Register Customer
  await customer
    .save()
    .then((customer) => {
      // console.log(customer);
      // Create an empty cart for the customer
      const cart = new Cart({
        customer: customer.id,
        caterer: {},
        cartItems: [],
      });

      return cart.save();
    })
    .then((cartObj) => {
      // generate OTP for this Customer
      const otp = new Otp({
        _userId: customer.id,
        otp: Math.floor(100000 + Math.random() * 900000),
      });

      return otp.save();
    })
    .then((otpObj) => {
      const authToken = jwt.sign(
        { email: customer.email, userId: customer.id },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: process.env.JWT_TOKEN_EXPIERY }
      );
      res.json({
        message:
          "Customer Registered Successfully, A verification email has been sent",
        token: authToken,
      });
      return transporter.sendMail({
        to: req.body.email,
        from: "info@catersmart.in",
        subject: "Welcome " + req.body.first_name,
        html: `
        <p>${otpObj.otp} is the OTP to verify your email at catersmart.</p>
       `,
      });
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Login Existing Customer
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  const password = req.body.password;
  let id = "";
  await Customer.findOne({
    $or: [
      {
        email: req.body.email,
      },
      {
        phone: req.body.phone,
      },
    ],
  })
    .select("email password")
    .then((customer) => {
      if (!customer) {
        // If Customer doesn't Exists
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "Customer Email or Phone not registered",
          errors: [],
        });
      }
      // console.log(customer);
      id = customer._id;
      // compare the password to the hashed password
      return bcrypt.compare(password, customer.password);
    })
    .then((result) => {
      // console.log(result);
      if (result) {
        // generate auth token
        const token = jwt.sign(
          { email: req.body.email, userId: id },
          process.env.JWT_PRIVATE_KEY,
          {
            expiresIn: "1h",
          }
        );
        // If Customer Exists
        res.json({
          message: "Login Successfull",
          token: token,
        });
      } else {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "Invalid Email, Phone or password",
          errors: [],
        });
      }
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Customer Details
exports.customer_details = async (req, res) => {
  await Customer.findById(req.body.userId)
    .then((customer) => {
      res.json({
        message: "Customer Found",
        customer: customer,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Fetch All Customers
exports.customers = async (req, res) => {
  await Customer.find()
    .then((customers) => {
      res.json({
        message: customers.length + " Customers Found",
        customer: customers,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Update Customer
exports.update_customer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  //if email field is updated
  if (req.body.email) {
    //then set verified field to false
    req.body.verified = false;
  }
  //check is password field was updated
  if (req.body.password) {
    //then hash the new password
    req.body.password = await bcrypt.hash(req.body.password, 12);
  }
  await Customer.findByIdAndUpdate(
    req.body.userId,
    { $set: req.body },
    { new: true },
    (err, customer) => {
      if (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Something went wrong",
          errors: err,
        });
      } else {
        if (customer.verified) {
          res.json({
            message: "Customer Updated Successfully",
            customer: customer,
          });
        } else {
          // generate OTP for this Customer
          const otp = new Otp({
            _userId: customer.id,
            otp: Math.floor(100000 + Math.random() * 900000),
          });

          otp
            .save()
            .then((otpObj) => {
              res.json({
                message:
                  "Customer Updated Successfully, A verification email has will be sent",
                customer: customer,
              });
              return transporter.sendMail({
                to: req.body.email,
                from: "info@catersmart.in",
                subject: "Welcome " + req.body.first_name,
                html: `
                <p>${otpObj.otp} is the OTP to verify your email at catersmart.</p>
               `,
              });
            })
            .then((result) => {
              console.log(result);
            })
            .catch((err) => {
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Something went wrong",
                errors: err,
              });
            });
        }
      }
    }
  );
};

// Delete Customer
exports.delete_customer = async (req, res) => {
  await Customer.findByIdAndDelete(req.body.userId)
    .then((result) => {
      if (result) {
        Cart.findOneAndRemove({ customer_id: req.body.userId }).then(
          (result) => {
            res.json({
              message: "Customer Deleted Successfully",
            });
          }
        );
      } else {
        res.json({
          message: "Customer Not Found",
        });
      }
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

exports.addCatererToFavourite = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  const caterId = { caterer_id: req.body.caterer_id };
  await Customer.findById(req.body.userId)
    .then((customer) => {
      if (customer.favouriteCaterer.length) {
        if (
          customer.favouriteCaterer.some(
            (element) => element.caterer_id == caterId.caterer_id
          )
        ) {
          let index = customer.favouriteCaterer.findIndex(
            (i) => i.caterer_id == caterId.caterer_id
          );
          customer.favouriteCaterer.splice(index, 1);
        } else {
          customer.favouriteCaterer.push(caterId);
        }
      } else {
        customer.favouriteCaterer.push(caterId);
      }
      return customer.save();
    })
    .then((customer) => {
      res.json({
        message: "Favourite Caterers",
        favouriteCaterer: customer.favouriteCaterer,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

exports.otp_verification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Otp.findOne({ otp: req.body.otp })
    .then((otpObj) => {
      if (!otpObj) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "OTP expired or Invalid.",
          errors: [],
        });
        return;
      } else {
        return Customer.findOne({ _id: otpObj._userId });
      }
    })
    .then((customer) => {
      if (!customer) {
        return;
      } else if (customer.verified) {
        res.json({
          message: "Customer already been verified",
          customer: customer,
        });
        return;
      } else {
        customer.verified = true;
        return customer.save();
      }
    })
    .then((customer) => {
      if (customer) {
        res.json({
          message: "Customer successfully verified",
          customer: customer,
        });
      }
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

exports.resend_otp = async (req, res) => {
  //console.log(req.body, req.email);
  await Otp.findOne({ _userId: req.body.userId })
    .then((otpObj) => {
      if (otpObj) {
        return otpObj;
      }
      const otp = new Otp({
        _userId: req.body.userId,
        otp: Math.floor(100000 + Math.random() * 900000),
      });
      return otp.save();
    })
    .then((otpObj) => {
      // console.log(otpObj);
      return transporter.sendMail({
        to: req.email,
        from: "info@catersmart.in",
        subject: otpObj.otp + " is the OTP",
        html: `
      <p>${otpObj.otp} is the OTP to verify your email at catersmart.</p>
     `,
      });
    })
    .then((result) => {
      console.log(result);
      res.json({
        message: "Resent OTP",
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  const email = req.body.email;
  await Customer.findOne({ email: email })
    .then((customer) => {
      // generate OTP for this Customer
      const otp = new Otp({
        _userId: customer.id,
        otp: Math.floor(100000 + Math.random() * 900000),
      });
      return otp.save();
    })
    .then((otpObj) => {
      // console.log(otpObj);
      return transporter.sendMail({
        to: email,
        from: "info@catersmart.in",
        subject: otpObj.otp + " is the OTP",
        html: `
      <p>${otpObj.otp} is the OTP to verify your email at catersmart.</p>
     `,
      });
    })
    .then((result) => {
      console.log(result);
      res.json({
        message: "Sent OTP",
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

exports.updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Customer.findOne({ email: req.body.email })
    .then(async (customer) => {
      customer.password = await bcrypt.hash(req.body.password, 12);
      return customer.save();
    })
    .then((customer) => {
      res.json({
        message: "Password Updated successfully",
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};
