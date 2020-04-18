module.exports = (app) => {
  const order_controller = require("../controllers/order.controller");
  const isAuth = require("../middleware/is-auth");
  const Customer = require("../models/Customer");
  const Caterer = require("../models/Caterer");
  const Menu = require("../models/Menu");
  const { body, check } = require("express-validator");
  // Create Order
  app.post(
    "/api/create_order",
    isAuth,
    [
      body("caterer_id", "not a vaild caterer").custom((catererId) => {
        return Caterer.findById(catererId).then((result) => {
          if (result && result !== null) {
            //
            // console.log(result);
            return true;
          } else {
            //
            return Promise.reject("not a valid caterer");
          }
        });
      }),
      body("menu_id", "not a vaild menu").custom((menuId) => {
        return Menu.findById(menuId).then((result) => {
          if (result && result !== null) {
            //
            // console.log(result);
            return true;
          } else {
            //
            return Promise.reject("not a valid menu");
          }
        });
      }),
      body("quantity", "quantity not valid")
        .isNumeric()
        .custom(async (quantity, { req }) => {
          await Caterer.findById(req.body.caterer_id).then((caterer) => {
            if (caterer) {
              if (quantity > caterer.minimum_order_quantity) {
                return true;
              } else {
                return Promise.reject("quantity not valid");
              }
            }
          });
        }),
      body("order_amount", "order_amount not valid")
        .isNumeric()
        .custom((orderAmount, { req }) => {
          return Menu.findById(req.body.menu_id).then((menu) => {
            if (menu) {
              if (menu.price * req.body.quantity === orderAmount) {
                return true;
              } else {
                return Promise.reject("order_amount not valid");
              }
            }
          });
        }),
      // Order creation date has to be today
      body("order_date", "order date invalid").custom((date) => {
        let inputDate = new Date(date);
        let today = new Date();
        if (inputDate.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
          return true;
        } else {
          return Promise.reject("order date invalid");
        }
      }),
      body("delivery_date", "delivery date invalid").custom(
        async (date, { req }) => {
          let inputDate = new Date(date);
          let today = new Date();
          await Caterer.findById(req.body.caterer_id).then((caterer) => {
            if (caterer) {
              // console.log(caterer);
              today.setHours(today.getHours() + caterer.lead_time);
              // console.log(inputDate.getTime(), today.getTime());
              if (inputDate.getTime() > today.getTime()) {
                return true;
              } else {
                return Promise.reject("delivery date invalid");
              }
            }
          });
        }
      ),
    ],
    order_controller.create_order
  );

  // Fetch All Orders
  app.get("/api/orders", order_controller.orders);

  // Order Details
  app.get("/api/order/:id", isAuth, order_controller.order_details);

  // Customer Orders
  app.get(
    "/api/customer_orders/",
    isAuth,
    [
      body("userId", "not a valid customer").custom((customerId) => {
        return Customer.findById(customerId).then((customer) => {
          if (customer) {
            return true;
          } else {
            return Promise.reject("not a valid customer");
          }
        });
      }),
    ],
    order_controller.customer_orders
  );

  // Caterer Orders
  app.get(
    "/api/caterer_orders/",
    isAuth,
    [
      body("userId", "not a valid caterer").custom((catererId) => {
        return Caterer.findById(catererId).then((caterer) => {
          if (caterer) {
            return true;
          } else {
            return Promise.reject("not a valid caterer");
          }
        });
      }),
    ],
    order_controller.caterer_orders
  );

  // Update Order Status
  // app.put("/api/update_order/:id", isAuth, order_controller.update_order);

  // Delete Order
  // app.put("/api/delete_order/:id", isAuth, order_controller.delete_order);
};
