const Menu = require("../models/Menu");
//module to catch request validation Result
const { validationResult } = require("express-validator");

// CREATE MENU
exports.create_menu = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Server side validation failed",
      errors: errors.array()
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
    beverages: req.body.beverages
  });

  await menu
    .save()
    .then(result => {
      res.json({
        status: "success",
        message: "Menu Create Successfully",
        data: result
      });
    })
    .catch(err => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err
      });
    });
};

// Fetch All Menus
exports.menus = async (req, res) => {
  await Menu.find({ caterer_id: req.params.id })
    .then(result => {
      res.json({
        status: "success",
        message: result.length + " Menus Found",
        data: result
      });
    })
    .catch(err => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err
      });
    });
};

// Update Menu
exports.update_menu = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Server side validation failed",
      errors: errors.array()
    });
  }
  await Menu.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    (err, menu) => {
      if (err) {
        res.json({
          status: "error",
          message: "Something went wrong",
          error: err
        });
      } else {
        if (menu) {
          res.json({
            status: "success",
            message: "Menu Updated Successfully"
          });
        } else {
          res.json({
            status: "failed",
            message: "Menu Not Found"
          });
        }
      }
    }
  );
};

// Menu Details
exports.menu = async (req, res) => {
  await Menu.findOne({ _id: req.params.id })
    .then(result => {
      if (result) {
        res.json({
          status: "success",
          message: "Menu Found",
          data: result
        });
      } else {
        res.json({
          status: "failed",
          message: "No Menu Found",
          data: result
        });
      }
    })
    .catch(err => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err
      });
    });
};

// Delete Menu
exports.delete_menu = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Server side validation failed",
      errors: errors.array()
    });
  }
  await Menu.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.json({
          status: "success",
          message: "Menu Deleted Successfully"
        });
      } else {
        res.json({
          status: "failed",
          message: "Menu Not Found"
        });
      }
    })
    .catch(err => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err
      });
    });
};
