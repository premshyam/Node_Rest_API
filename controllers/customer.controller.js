const bcrypt = require("bcryptjs");
const Customer = require("../models/Customer");
const Token = require("../models/Token");
const Cart = require("../models/Cart");
//jsonwebtokens module for generating auth tokens
const jwt = require("jsonwebtoken");
//validationResult for catching validation erros from express-validator middleware
const { validationResult } = require("express-validator");
//email transporter
const { transporter } = require("../util/emailer");
//random token generator
const crypto = require("crypto");
// Customer Signup
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  let password = "";
  // hash the user password
  await bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
    // console.log(hashedPassword);
    password = hashedPassword;
  });
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
        customer_id: customer.id,
        cart: [],
      });

      return cart.save();
    })
    .then((cartObj) => {
      // Create a verification token for this Customer
      const token = new Token({
        _userId: customer.id,
        token: crypto.randomBytes(16).toString("hex"),
      });

      return token.save();
    })
    .then((tokenObj) => {
      const authToken = jwt.sign(
        { email: customer.email, userId: customer.id },
        "secret",
        { expiresIn: "1h" }
      );
      res.json({
        status: "success",
        message:
          "Customer Registered Successfully, A verification email has will be sent",
        token: authToken,
        id: tokenObj._userId,
      });
      return transporter.sendMail({
        to: req.body.email,
        from: "info@catersmart.in",
        subject: "Welcome " + req.body.first_name,
        html: `
        <p>Click this <a href="http://${req.headers.host}/api/email_confirmation/${tokenObj.token}">link</a> to verify your email.</p>
       `,
      });
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    });
};

// Login Existing Customer
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
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
        res.json({
          status: "failed",
          message: "Invalid Email, Phone or password",
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
          "secret",
          {
            expiresIn: "1h",
          }
        );
        // If Customer Exists
        res.json({
          status: "success",
          message: "Login Successfull",
          token: token,
          userId: id.toString(),
        });
      } else {
        res.json({
          status: "failed",
          message: "Invalid Email, Phone or password",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    });
};

// Customer Details
exports.customer_details = async (req, res) => {
  await Customer.findById(req.body.userId)
    .then((customer) => {
      if (customer) {
        res.json({
          status: "success",
          message: "Customer Found",
          data: customer,
        });
      } else {
        res.json({
          status: "failed",
          message: "Customer Not Found",
          data: result,
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    });
};

// Fetch All Customers
exports.customers = async (req, res) => {
  await Customer.find()
    .then((result) => {
      res.json({
        status: "success",
        message: result.length + " Customers Found",
        data: result,
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    });
};

// Update Customer
exports.update_customer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
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
    await bcrypt.hash(req.body.password, 12).then((hashedPassword) => {
      // console.log(hashedPassword);
      req.body.password = hashedPassword;
    });
  }
  await Customer.findByIdAndUpdate(
    req.body.userId,
    { $set: req.body },
    (err, customer) => {
      if (err) {
        res.json({
          status: "error",
          message: "Something went wrong",
          error: err,
        });
      } else {
        if (customer) {
          if (customer.verified) {
            res.json({
              status: "success",
              message: "Customer Updated Successfully",
            });
          } else {
            // Create a verification token for this Customer
            const token = new Token({
              _userId: customer.id,
              token: crypto.randomBytes(16).toString("hex"),
            });

            token
              .save()
              .then((tokenObj) => {
                res.json({
                  status: "success",
                  message:
                    "Customer Updated Successfully, A verification email has will be sent",
                  // id: tokenObj._userId,
                });
                return transporter.sendMail({
                  to: req.body.email,
                  from: "info@catersmart.in",
                  subject: "Welcome " + req.body.first_name,
                  html: `
                <p>Click this <a href="http://${req.headers.host}/api/email_confirmation/${tokenObj.token}">link</a> to verify your email.</p>
               `,
                });
              })
              .then((result) => {
                console.log(result);
              })
              .catch((err) => {
                res.json({
                  status: "error",
                  message: "Something went wrong",
                  error: err,
                });
              });
          }
        } else {
          res.json({
            status: "failed",
            message: "Customer Not Found",
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
              status: "success",
              message: "Customer Deleted Successfully",
            });
          }
        );
      } else {
        res.json({
          status: "failed",
          message: "Customer Not Found",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    });
};

exports.customer_confirm_email = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Token.findOne({ token: req.params.token })
    .then((tokenObj) => {
      if (!tokenObj) {
        res.json({
          status: "failed",
          message: "Token expired or unable to find it.",
        });
        return;
      }
      return Customer.findOne({ _id: tokenObj._userId });
    })
    .then((customer) => {
      if (!customer) {
        res.json({
          status: "failed",
          message: "Customer Not Found",
        });
        return;
      }
      if (customer.verified) {
        res.json({
          status: 400,
          message: "Customer already been verified",
        });
        return;
      }
      customer.verified = true;
      return customer.save();
    })
    .then(() => {
      res.json({
        status: "success",
        message: "Customer successfully verified",
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    });
};
