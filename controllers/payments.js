const HttpStatus = require("http-status-codes");
const Payment = require("../models/Payment");
const { validationResult } = require("express-validator");

// Create Payment
exports.createPayment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  const payment = new Payment(req.body);
  await payment
    .save()
    .then((paymentObj) => {
      res.json({
        message: "payment attempt created",
        payment: paymentObj
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Update Payment
exports.updatePayment = async (req, res, next) => {
  await Payment.findOneAndUpdate(
    {orderTransactionId: req.params.id},
    { $set: req.body }, {new: true},
    (err, payment) => {
      if (err) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "Something went wrong",
          error: err,
        });
      } else if (payment == null) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: "Payment not found",
        });
      } else {
        res.json({
          message: "Payment Updated Successfully",
          payment: payment
        });
      }
    }
  );
}