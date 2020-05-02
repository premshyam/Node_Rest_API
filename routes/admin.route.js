module.exports = (app) => {
  const bcrypt = require("bcryptjs");
  const AdminBro = require("admin-bro");
  const AdminBroExpress = require("admin-bro-expressjs");
  const AdminBroMongoose = require("admin-bro-mongoose");
  AdminBro.registerAdapter(AdminBroMongoose);
  const Customer = require("../models/Customer");
  const Caterer = require("../models/Caterer");
  const Menu = require("../models/Menu");
  const Item = require("../models/Item");
  const Order = require("../models/Order");
  const Otp = require("../models/Otp");
  const AdminBroOptions = {
    resources: [
      {
        resource: Customer,
        options: {
          actions: {
            new: {
              before: async (request) => {
                // console.log(request.payload);
                if (request.payload.password) {
                  request.payload.password = await bcrypt.hash(
                    request.payload.password,
                    12
                  );
                }
                return request;
              },
            },
            edit: {
              before: async (request) => {
                // console.log(request);
                if (request.payload.password) {
                  request.payload.password = await bcrypt.hash(
                    request.payload.password,
                    12
                  );
                }
                return request;
              },
            },
          },
        },
      },
      {
        resource: Caterer,
        options: {
          actions: {
            new: {
              before: async (request) => {
                // console.log(request.payload);
                if (request.payload.password) {
                  request.payload.password = await bcrypt.hash(
                    request.payload.password,
                    12
                  );
                }
                return request;
              },
            },
            edit: {
              before: async (request) => {
                // console.log(request);
                if (request.payload.password) {
                  request.payload.password = await bcrypt.hash(
                    request.payload.password,
                    12
                  );
                }
                return request;
              },
            },
          },
        },
      },
      Menu,
      Item,
      Order,
      Otp,
    ],
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
        // console.log(email, password, process.env.ADMIN_PASSWORD);
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
