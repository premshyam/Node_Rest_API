const HttpStatus = require("http-status-codes");
const Cart = require("../models/Cart");
//module to catch request validation Result
const { validationResult } = require("express-validator");

// Customer Cart Items
exports.getCart = async (req, res) => {
  await Cart.findOne({ customer: req.body.userId })
    .then((result) => {
      if (result) {
        res.json({
          message: "Cart Items Found",
          cart: result,
        });
      } else {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "Cart Not Found",
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

// Delete Cart Item
exports.updateCart = async (req, res) => {
  await Cart.findOne({ customer: req.body.userId })
    .then((cartObj) => {
      if (cartObj) {
        cartObj.caterer = req.body.caterer;
        cartObj.cartItems = req.body.cartItems;
        return cartObj.save();
      } else {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "Cart Not Found",
          errors: [],
        });
      }
    })
    .then((cartObj) => {
      res.json({
        message: "Cart updated",
        cart: cartObj,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};
