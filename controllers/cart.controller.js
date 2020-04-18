const Cart = require("../models/Cart");
//module to catch request validation Result
const { validationResult } = require("express-validator");

exports.add_item = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
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
          } else {
            cartObj.cart.push(item);
          }
        } else {
          cartObj.cart.push(item);
        }
        return cartObj.save();
      } else {
        res.json({
          status: "failed",
          message: "Cart Not Found",
        });
      }
    })
    .then((cart) => {
      res.json({
        status: "success",
        message: "Menu Added to Cart",
        data: cart,
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

exports.remove_item = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
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
        res.json({
          status: "failed",
          message: "Cart Not Found",
        });
      }
    })
    .then((cart) => {
      res.json({
        status: "success",
        message: "Menu removed from Cart",
        data: cart,
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

// Item Details
// exports.item_details = async (req, res) => {
//   await Cart.findOne({ _id: req.params.id })
//     .then(result => {
//       if (result) {
//         res.json({
//           status: "success",
//           message: "Item Found",
//           data: result
//         });
//       } else {
//         res.json({
//           status: "failed",
//           message: "No Item Found",
//           data: result
//         });
//       }
//     })
//     .catch(err => {
//       res.json({
//         status: "error",
//         message: "Something went wrong",
//         error: err
//       });
//     });
// };

// Customer Cart Items
exports.cart_items = async (req, res) => {
  await Cart.findOne({ customer_id: req.body.userId })
    .then((result) => {
      if (result) {
        res.json({
          status: "success",
          message: "Cart Items Found",
          cart: result,
        });
      } else {
        res.json({
          status: "failed",
          message: "Cart Not Found",
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

// Update Cart Item
// exports.update_cart = async (req, res) => {
//   await Cart.findByIdAndUpdate(
//     req.params.itemId,
//     { $set: req.body },
//     (err, cart) => {
//       if (err) {
//         res.json({
//           status: "error",
//           message: "Something went wrong",
//           error: err
//         });
//       } else {
//         if (cart) {
//           res.json({
//             status: "success",
//             message: "Cart Item Updated Successfully"
//           });
//         } else {
//           res.json({
//             status: "failed",
//             message: "Cart Item Not Found"
//           });
//         }
//       }
//     }
//   );
// };

// Delete Cart Item
exports.empty_cart = async (req, res) => {
  await Cart.findOne({ customer_id: req.body.userId })
    .then((cartObj) => {
      if (cartObj) {
        cartObj.cartItems = [];
        return cartObj.save();
      } else {
        res.json({
          status: "failed",
          message: "Cart Not Found",
        });
      }
    })
    .then((cartObj) => {
      res.json({
        status: "success",
        message: "Cart empty",
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
