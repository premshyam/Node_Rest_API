const HttpStatus = require("http-status-codes");
const Cart = require("../models/Cart");
//module to catch request validation Result
const { validationResult } = require("express-validator");

// Customer Cart Items
exports.getCart = async (req, res) => {
  await Cart.findOne({ customer: req.body.userId })
    .then((cartObj) => {
      if (cartObj) {
        res.json({
          message: "Cart Found",
          shoppingCart: cartObj.shoppingCart,
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
        cartObj.shoppingCart = req.body.shoppingCart;
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
        shoppingCart: cartObj.shoppingCart,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};
