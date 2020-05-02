const HttpStatus = require("http-status-codes");
const Order = require("../models/Order");
const { validationResult } = require("express-validator");
const axios = require("axios");
const qs = require("querystring");

// Create New Order
exports.create_order = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
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
        appId: process.env.CASHFREE_APP_ID,
        secretKey: process.env.CASHFREE_SECRET_KEY,
        orderId: result._id.toString(),
        orderAmount: result.order_amount,
        customerName:
          result.customer_id.first_name + result.customer_id.last_name,
        customerPhone: result.customer_id.phone,
        customerEmail: result.customer_id.email,
        // returnUrl: "http://localhost:/3000/checkout/result"
      };
      axios
        .post(process.env.CASHFREE_ORDER_API, qs.stringify(data), {
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
exports.order_details = async (req, res) => {
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
exports.customer_orders = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Order.find({ customer_id: req.body.userId })
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
exports.caterer_orders = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Order.find({ caterer_id: req.body.userId })
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

// Update Order Status
exports.update_order = async (req, res) => {
  await Order.findByIdAndUpdate(
    req.params.id,
    { $set: { order_status: req.body.status } },
    (err, order) => {
      if (err) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "Something went wrong",
          error: err,
        });
      } else {
        res.json({
          message: "Order Updated Successfully",
          order: order,
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
