const HttpStatus = require("http-status-codes");
const Menu = require("../models/Menu");
//module to catch request validation Result
const { validationResult } = require("express-validator");

// CREATE MENU
exports.create_menu = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  let menu = new Menu({
    caterer_id: req.body.userId,
    menu_name: req.body.menu_name,
    price: req.body.price,
    welcome_drinks: req.body.welcome_drinks,
    starters: req.body.starters,
    main_course: req.body.main_course,
    desserts: req.body.desserts,
    chats: req.body.chats,
    beverages: req.body.beverages,
  });

  await menu
    .save()
    .then((menu) => {
      res.json({
        message: "Menu Create Successfully",
        menu: menu,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Fetch All Menus
exports.caterer_menus = async (req, res) => {
  await Menu.find({ caterer_id: req.params.id })
    .then((result) => {
      res.json({
        message: result.length + " Menus Found",
        menu: result,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Update Menu
exports.update_menu = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Menu.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    (err, menu) => {
      if (err) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "Something went wrong",
          errors: err,
        });
      } else {
        res.json({
          message: "Menu Updated Successfully",
          menu: menu,
        });
      }
    }
  );
};

// Menu Details
exports.menu = async (req, res) => {
  await Menu.findOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.json({
          message: "Menu Found",
          menu: result,
        });
      } else {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "No Menu Found",
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

// Delete Menu
exports.delete_menu = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Menu.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.json({
          message: "Menu Deleted Successfully",
        });
      } else {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          message: "Menu Not Found",
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
