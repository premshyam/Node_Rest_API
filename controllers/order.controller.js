const Order = require("../models/Order");
const { validationResult } = require("express-validator");
const axios = require("axios");
const qs = require("querystring");
const config = require("../config/config.json");
// Create New Order
exports.create_order = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  let order = new Order({
    customer_id: req.body.userId,
    caterer_id: req.body.caterer_id,
    menu_id: req.body.menu_id,
    cart: req.body.cartItems,
    quantity: req.body.quantity,
    order_amount: req.body.order_amount,
    order_date: req.body.order_date,
    delivery_date: req.body.delivery_date,
  });

  order
    .save()
    .then((result) => {
      return result;
    })
    .then((result) => {
      return Order.findById(result._id)
        .populate("customer_id")
        .populate("caterer_id")
        .populate("menu_id")
        .then((result) => {
          return result;
        });
    })
    .then((result) => {
      // console.log(result);
      data = {
        appId: config.appId,
        secretKey: config.secretKey,
        orderId: result._id.toString(),
        orderAmount: result.order_amount,
        customerName:
          result.customer_id.first_name + result.customer_id.last_name,
        customerPhone: result.customer_id.phone,
        customerEmail: result.customer_id.email,
        // returnUrl: "http://localhost:/3000/checkout/result"
      };
      axios
        .post(config.orderApi, qs.stringify(data), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((result) => {
          console.log(result.data);
          res.json(result.data);
        })
        .catch((err) => {
          console.log(err);
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

// Fetch All Orders
exports.orders = async (req, res) => {
  await Order.find()
    .then((result) => {
      res.json({
        status: "success",
        message: result.length + " Orders Found",
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

// Order Details
exports.order_details = async (req, res) => {
  await Order.findOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.json({
          status: "success",
          message: "Order Found",
          data: result,
        });
      } else {
        res.json({
          status: "failed",
          message: "No Order Found",
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

// Customer Orders
exports.customer_orders = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Order.find({ customer_id: req.body.userId })
    .then((result) => {
      res.json({
        status: "success",
        message: result.length + " Orders Found",
        orders: result,
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

// Caterer Orders
exports.caterer_orders = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Order.find({ caterer_id: req.body.userId })
    .then((result) => {
      res.json({
        status: "success",
        message: result.length + " Orders Found",
        orders: result,
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

// Update Order Status
exports.update_order = async (req, res) => {
  await Order.findByIdAndUpdate(
    req.params.id,
    { $set: { order_status: req.body.status } },
    (err, order) => {
      if (err) {
        res.json({
          status: "error",
          message: "Something went wrong",
          error: err,
        });
      } else {
        if (order) {
          res.json({
            status: "success",
            message: "Order Updated Successfully",
          });
        } else {
          res.json({
            status: "failed",
            message: "No Order Found",
          });
        }
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
          status: "success",
          message: "Order Deleted Successfully",
        });
      } else {
        res.json({
          status: "failed",
          message: "Order Not Found",
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
