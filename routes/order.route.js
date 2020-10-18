module.exports = (app) => {
  const orderController = require("../controllers/order.controller");
  const isAuth = require("../middleware/is-auth");
  const { body } = require("express-validator");

  // Create Order
  app.post(
    "/api/create_order",
    isAuth,
    [body("orderAmount", "Order amount not valid").isNumeric()],
    orderController.createOrder
  );

  // Update Order Status
  app.put("/api/update_order/:id", isAuth, orderController.updateOrder);

  // Customer Orders
  app.get("/api/customer_orders/", isAuth, orderController.customerOrders);

  // Customer Order Details
  app.get("/api/customer_order_details/:id", isAuth, orderController.customerOrderDetails);

  // Fetch All Orders
  //app.get("/api/orders",  orderController.orders);


  // Caterer Orders
  // app.get(
  //   "/api/caterer_orders/",
  //   isAuth,
  //   [
  //     body("userId", "not a valid caterer").custom((catererId) => {
  //       return Caterer.findById(catererId).then((caterer) => {
  //         if (caterer) {
  //           return true;
  //         } else {
  //           return Promise.reject("not a valid caterer");
  //         }
  //       });
  //     }),
  //   ],
  //   orderController.caterer_orders
  // );

  // Delete Order
  // app.put("/api/delete_order/:id", isAuth, orderController.delete_order);
};
