const express = require("express");
const { check, body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const paymentController = require("../controllers/payments");
const router = express.Router();

// Create Payment
router.post(
  "/create_payment",
  [
    body("orderId", "Invalid order Id").custom((orderId) => {
      return Order.findById(orderId).then((order) => {
        if (order) {
          return true;
        } else {
          return Promise.reject("order not found");
        }
      });
    }),
    body("orderTransactionId", "Enter a valid order Transaction Id").isString(),
  ],
  paymentController.createPayment
);

// Update Payment
router.patch("/update_payment/:id", paymentController.updatePayment);

module.exports = router;
