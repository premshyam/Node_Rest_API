module.exports = (app) => {
  const AdminBro = require("admin-bro");
  const AdminBroExpress = require("admin-bro-expressjs");
  const AdminBroMongoose = require("admin-bro-mongoose");
  AdminBro.registerAdapter(AdminBroMongoose);
  const Customer = require("../models/Customer");
  const Caterer = require("../models/Caterer");
  const Menu = require("../models/Menu");
  const Order = require("../models/Order");
  const Token = require("../models/Token");
  const AdminBroOptions = {
    resources: [Customer, Caterer, Menu, Order, Token],
    branding: {
      companyName: "Catersmart",
    },
    rootPath: "/admin",
  };
  const adminBro = new AdminBro(AdminBroOptions);

  // const router = AdminBroExpress.buildRouter(adminBro);
  const router = AdminBroExpress.buildAuthenticatedRouter(
    adminBro,
    {
      authenticate: async (email, password) => {
        console.log(email, password, process.env.ADMIN_PASSWORD);
        if (
          process.env.ADMIN_EMAIL === email &&
          process.env.ADMIN_PASSWORD === password
        ) {
          return {
            email: email,
            password: password,
          };
        }
        return false;
      },
      cookieName: "admin-bro",
      cookiePassword: "somepassword",
    },
    undefined,
    { resave: false, saveUninitialized: true }
  );
  app.use(AdminBroOptions.rootPath, router);
};
