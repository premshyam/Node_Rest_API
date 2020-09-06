const HttpStatus = require("http-status-codes");
//import Caterer model
const Caterer = require("../models/Caterer");
const Menu = require("../models/Menu");
const Item = require("../models/Item");
const ServiceableArea = require("../models/ServiceableArea");
//jsonwebtokens module for generating auth tokens
const jwt = require("jsonwebtoken");
// module to upload images to the cloudinary
const cloudinary = require("cloudinary");
//module to catch request validation Result
const { validationResult } = require("express-validator");
//variables
var imgUrl = null;
var urlImage = null;

// Image Upload
const uploadImage = async (image) => {
  console.log("Image is " + image);
  imgUrl = await cloudinary.uploader.upload(
    //image path
    image,
    //cloudinary destination folder
    { folder: "user_images/" },
    //call back on success
    (result) => {
      console.log(result.url);
      return result.url;
    },
    //call back on error
    (err) => {
      console.log("Error is here " + err);
    }
  );
  return imgUrl;
};

// Caterer Registration
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }

  console.log(req.body);
  //variable to store image file path
  var imageFile = null;
  //check if an image file was uploaded
  if (req.file) {
    imageFile = req.file.path;
  }

  if (imageFile !== null) {
    console.log("Yes Image is here " + imageFile);
    await uploadImage(imageFile);
    // console.log(imgUrl.url);
    urlImage = imgUrl.url;
  } else {
    console.log("No Image");
    urlImage = "";
  }

  // Check if Caterer Already Exists with same Email
  await Caterer.find({ email: req.body.email })
    .then((count) => {
      if (count.length > 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Email Already Exists",
          errors: [],
        });
      } else {
        const caterer = new Caterer({
          name: req.body.name,
          description: req.body.description,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone,
          minimum_order_quantity: req.body.minimum_order_quantity,
          lead_time: req.body.lead_time,
          availability: req.body.availability,
          menu_starting_from: req.body.menu_starting_from,
          delivery_fee: req.body.delivery_fee,
          live_kitchen: req.body.live_kitchen,
          image: urlImage,
        });

        // Register Caterer

        return caterer.save();
      }
    })
    .then((caterer) => {
      const token = jwt.sign(
        { email: caterer.email, userId: caterer._id },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: "1h" }
      );
      res.json({
        message: "Caterer Registered Successfully",
        token: token,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Caterer Login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Caterer.findOne({
    $or: [
      {
        $and: [{ email: req.body.email }, { password: req.body.password }],
      },
      {
        $and: [{ phone: req.body.phone }, { password: req.body.password }],
      },
    ],
  })
    .then((result) => {
      // console.log(result);
      if (result) {
        const token = jwt.sign(
          { email: result.email, userId: result._id },
          process.env.JWT_PRIVATE_KEY,
          { expiresIn: "1h" }
        );
        // If Caterer Exists
        res.json({
          message: "Login Successfull",
          token: token,
        });
      } else {
        // If Caterer doesn't Exists
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Caterer Email or Password not registered",
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

// Caterer Details
exports.caterer_details = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  try {
    // console.log(req.query.location, req.query.catererName);
    let regex = new RegExp(req.query.catererName.replace(/-/g, " "), "i");
    // console.log(regex);
    let caterer = await Caterer.findOne({
      name: {
        $regex: regex,
      },
    })
      .select("-email")
      .populate({
        path:
          "serviceableArea cateringType dietaryRestrictions cuisineType vendorType event ribbon service",
        skipInvalidIds: true,
      });
    // console.log(caterer);
    if (caterer) {
      const result = [];
      let menus = await Menu.find({ catererId: caterer._id }).populate({
        path:
          "catererMenus.category catererMenus.menus.menuDetails.itemCategory catererMenus.menus.ribbon",
        skipInvalidIds: true,
      });
      // console.log(menus);
      let items = await Item.find({ catererId: caterer._id }).populate({
        path: "catererItems.category catererItems.items.ribbon",
        skipInvalidIds: true,
      });
      console.log(items);
      if (menus.length) {
        menus = await menus[0].catererMenus.map((menu) => {
          // console.log(menu);
          return { items: menu.menus, category: menu.category.Category };
        });
      }
      if (items.length) {
        items = await items[0].catererItems.map((item) => {
          // console.log(item);
          return { items: item.items, category: item.category.Category };
        });
      }
      // result.push(items);
      // result.push(menus);
      // console.log(items);
      res.json({
        message: "Caterer Found",
        reviews: caterer.reviews,
        caterer: caterer,
        // menus: menus, //[0].catererMenus,
        items: menus.concat(items), //[0].catererItems,
      });
    } else {
      res.json({
        message: "Caterer Not Found",
        reviews: [],
        caterer: {},
        items: [],
      });
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      errors: err,
    });
  }
  // await Caterer.findOne({ _id: req.params.id })
  //   .then((result) => {
  //     if (result) {
  //       res.json({
  //         message: "Caterer Found",
  //         caterer: items,
  //       });
  //     } else {
  //       res.status(HttpStatus.BAD_REQUEST).json({
  //         message: "Caterer Not Found",
  //         errors: [],
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       message: "Something went wrong",
  //       errors: err,
  //     });
  //   });
};

// Caterer info
exports.caterer_info = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Caterer.findOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.json({
          message: "Caterer Found",
          caterer: result,
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Caterer Not Found",
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

// Fetch All Caterers
exports.caterers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  console.log(req.body);
  let query = { availability: true };
  const operator = "$and";
  if (req.body.location) {
    query["serviceableArea"] = await ServiceableArea.find({
      serviceableArea: {
        $regex: new RegExp(req.body.location.replace(/-/g, " "), "i"),
      },
    }).then((result) => {
      if (result.length) {
        //
        // console.log(result[0]);
        return result[0]._id.toString();
      } else {
        return null;
      }
    });
  }
  if (req.body.leadTime) {
    // console.log(req.body);
    query["leadTime"] = { $lte: req.body.leadTime };
  }
  if (req.body.searchValue) {
    // console.log(req.body);
    query["$text"] = { $search: req.body.searchValue };
  }
  if (req.body.cateringType && req.body.cateringType.length) {
    if (query[operator]) {
      query[operator].push({ cateringType: { $in: req.body.cateringType } });
    } else {
      query[operator] = [{ cateringType: { $in: req.body.cateringType } }];
    }
  }
  if (req.body.dietary && req.body.dietary.length) {
    if (query[operator]) {
      query[operator].push({ dietaryRestrictions: { $in: req.body.dietary } });
    } else {
      query[operator] = [{ dietaryRestrictions: { $in: req.body.dietary } }];
    }
  }
  if (req.body.cuisine && req.body.cuisine.length) {
    if (query[operator]) {
      query[operator].push({ cuisineType: { $in: req.body.cuisine } });
    } else {
      query[operator] = [{ cuisineType: { $in: req.body.cuisine } }];
    }
  }
  if (req.body.vendorType && req.body.vendorType.length) {
    if (query[operator]) {
      query[operator].push({ vendorType: { $in: req.body.vendorType } });
    } else {
      query[operator] = [{ vendorType: { $in: req.body.vendorType } }];
    }
  }
  if (req.body.event && req.body.event.length) {
    if (query[operator]) {
      query[operator].push({ event: { $in: req.body.event } });
    } else {
      query[operator] = [{ event: { $in: req.body.event } }];
    }
  }
  if (req.body.dish && req.body.dish.length) {
    if (query[operator]) {
      query[operator].push({ dish: { $in: req.body.dish } });
    } else {
      query[operator] = [{ dish: { $in: req.body.dish } }];
    }
  }
  if (req.body.corporateEvent && req.body.corporateEvent.length) {
    if (query[operator]) {
      query[operator].push({
        corporateEvent: { $in: req.body.corporateEvent },
      });
    } else {
      query[operator] = [{ corporateEvent: { $in: req.body.corporateEvent } }];
    }
  }
  if (req.body.ribbon && req.body.ribbon.length) {
    if (query[operator]) {
      query[operator].push({
        ribbon: { $in: req.body.ribbon },
      });
    } else {
      query[operator] = [{ ribbon: { $in: req.body.ribbon } }];
    }
  }
  // console.log(query);
  await Caterer.find(query)
    .select("-email -phone")
    .populate({
      path:
        "serviceableArea cateringType dietaryRestrictions cuisineType vendorType event ribbon",
      skipInvalidIds: true,
    })
    .then((result) => {
      res.json({
        message: result.length + " Caterers Found",
        caterer: result,
      });
    })
    .catch((err) => {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Something went wrong",
        errors: err,
      });
    });
};

// Update Caterer

exports.update_caterer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Caterer.findByIdAndUpdate(
    req.body.userId,
    { $set: req.body },
    (err, caterer) => {
      if (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: "Something went wrong",
          errors: err,
        });
      } else {
        res.json({
          message: "Caterer Updated Successfully",
          caterer: caterer,
        });
      }
    }
  );
};

// Delete Caterer

exports.delete_caterer = async (req, res) => {
  await Caterer.findByIdAndDelete(req.body.userId)
    .then((result) => {
      if (result) {
        res.json({
          message: "Caterer Deleted Successfully",
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: "Caterer Not Found",
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
