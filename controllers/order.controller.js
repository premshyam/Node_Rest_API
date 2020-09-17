const HttpStatus = require("http-status-codes");
const Order = require("../models/Order");
const { validationResult } = require("express-validator");

// Create New Order
exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  let date = new Date();
  let orderAmount = req.body.orderAmount;
  let paymentAmount;
  if (orderAmount > 20000) {
    paymentAmount = 20000;
  } else {
    paymentAmount = orderAmount;
  }
  let order = new Order({
    customer: req.body.userId,
    shoppingCart: req.body.shoppingCart,
    orderAmount: orderAmount,
    orderDate: date.toLocaleString("en-IN"),
    paymentAmount: paymentAmount,
    paymentStatus: "Pending",
  });

  order
    .save()
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Fetch All Orders
exports.orders = async (req, res) => {
  await Order.find()
    .then((result) => {
      res.json({
        message: result.length + " Orders Found",
        order: result,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Order Details
exports.orderDetails = async (req, res) => {
  await Order.findOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.json({
          message: "Order Found",
          order: result,
        });
      } else {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "No Order Found",
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

// Customer Orders
exports.customerOrders = async (req, res) => {
  await Order.find({ customer: req.body.userId })
    .then((result) => {
      res.json({
        message: result.length + " Orders Found",
        orders: result,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Caterer Orders
// exports.caterer_orders = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
//       message: "Server side validation failed",
//       errors: errors.array(),
//     });
//   }
//   await Order.find({ caterer_id: req.body.userId })
//     .then((result) => {
//       res.json({
//         message: result.length + " Orders Found",
//         orders: result,
//       });
//     })
//     .catch((err) => {
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         message: "Something went wrong",
//         errors: err,
//       });
//     });
// };

// Update Order Status
exports.updateOrder = async (req, res) => {
  await Order.findByIdAndUpdate(
    req.params.id,
    { $set: { paymentStatus: req.body.paymentStatus } },
    (err, order) => {
      if (err) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "Something went wrong",
          error: err,
        });
      } else {
        res.json({
          message: "Order Updated Successfully",
        });
      }
    }
  );
};

// Delete Order
exports.delete_order = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.json({
          message: "Order Deleted Successfully",
        });
      } else {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "Order Not Found",
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
