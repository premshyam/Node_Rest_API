const HttpStatus = require("http-status-codes");
const Cart = require("../models/Cart");
//module to catch request validation Result
const { validationResult } = require("express-validator");

exports.add_item = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  const item = {
    menu_id: req.body.menu_id,
    cartItems: req.body.cartItems,
    quantity: req.body.quantity,
  };
  Cart.findOne({ customer_id: req.body.userId })
    .then((cartObj) => {
      if (cartObj) {
        // console.log(cartObj.cartItems);
        // check if cartItems is empty
        if (cartObj.cart.length) {
          if (cartObj.cart.some((element) => element.menu_id == item.menu_id)) {
            let index = cartObj.cart.findIndex(
              (i) => i.menu_id == item.menu_id
            );
            cartObj.cart[index].quantity = item.quantity;
            cartObj.cart[index].cartItems = item.cartItems;
          } else {
            cartObj.cart.push(item);
          }
        } else {
          cartObj.cart.push(item);
        }
        return cartObj.save();
      } else {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "Cart Not Found",
          errors: [],
        });
      }
    })
    .then((cart) => {
      res.json({
        message: "Added items to Cart",
        cart: cart,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

exports.remove_item = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  const item = {
    menu_id: req.body.menu_id,
  };
  Cart.findOne({ customer_id: req.body.userId })
    .then((cartObj) => {
      if (cartObj) {
        // console.log(cartObj.cartItems);
        if (cartObj.cart.some((element) => element.menu_id == item.menu_id)) {
          let index = cartObj.cart.findIndex((i) => i.menu_id == item.menu_id);
          cartObj.cart.splice(index, 1);
        }
        return cartObj.save();
      } else {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "Cart Not Found",
          errors: [],
        });
      }
    })
    .then((cart) => {
      res.json({
        message: "Menu removed from Cart",
        cart: cart,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Customer Cart Items
exports.cart_items = async (req, res) => {
  await Cart.findOne({ customer_id: req.body.userId })
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
exports.empty_cart = async (req, res) => {
  await Cart.findOne({ customer_id: req.body.userId })
    .then((cartObj) => {
      if (cartObj) {
        cartObj.cart = [];
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
        message: "Cart empty",
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
