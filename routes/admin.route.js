module.exports = (app) => {
  const bcrypt = require("bcryptjs");
  const AdminBro = require("admin-bro");
  const AdminBroExpress = require("admin-bro-expressjs");
  const AdminBroMongoose = require("admin-bro-mongoose");
  AdminBro.registerAdapter(AdminBroMongoose);
  const Customer = require("../models/Customer");
  const Cart = require("../models/Cart");
  const Caterer = require("../models/Caterer");
  const Menu = require("../models/Menu");
  const Item = require("../models/Item");
  const FoodCategoryItem = require("../models/FoodCategoryItem");
  const ItemCategory = require("../models/ItemCategory");
  const MenuCategory = require("../models/MenuCategory");
  const Order = require("../models/Order");
  const CateringType = require("../models/CateringType");
  const Dietary = require("../models/Dietary");
  const Cuisine = require("../models/Cuisine");
  const VendorType = require("../models/VendorType");
  const Event = require("../models/Event");
  const CorporateEvent = require("../models/CorporateEvent");
  const FoodCategory = require("../models/FoodCategory");
  const Dish = require("../models/Dish");
  const Ribbon = require("../models/Ribbon");
  const ServiceableArea = require("../models/ServiceableArea");
  const Service = require("../models/Service");
  const GeneralCoupon = require("../models/GeneralCoupon");
  const CatererCoupon = require("../models/CatererCoupon");
  const Otp = require("../models/Otp");
  const Logistic = require("../models/Logistic");
  const filterParent = {
    name: "filters",
    icon: "Filter",
  };
  const couponParent = {
    name: "coupons",
    icon: "Wallet",
  };
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
      FoodCategoryItem,
      ItemCategory,
      MenuCategory,
      Cart,
      Order,
      Otp,
      Logistic,
      { resource: CateringType, options: { parent: filterParent } },
      { resource: Dietary, options: { parent: filterParent } },
      { resource: Cuisine, options: { parent: filterParent } },
      { resource: VendorType, options: { parent: filterParent } },
      { resource: Event, options: { parent: filterParent } },
      { resource: CorporateEvent, options: { parent: filterParent } },
      { resource: Dish, options: { parent: filterParent } },
      { resource: Ribbon, options: { parent: filterParent } },
      { resource: FoodCategory, options: { parent: filterParent } },
      { resource: ServiceableArea, options: { parent: filterParent } },
      { resource: Service, options: { parent: filterParent } },
      { resource: GeneralCoupon, options: { parent: couponParent } },
      { resource: CatererCoupon, options: { parent: couponParent } },
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
