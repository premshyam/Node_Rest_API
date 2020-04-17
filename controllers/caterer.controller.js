//import Caterer model
const Caterer = require("../models/Caterer");
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
    return res.status(422).json({
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
        res.json({
          status: "failed",
          message: "Email Already Exists",
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

        caterer
          .save()
          .then((result) => {
            res.json({
              status: "success",
              message: "Caterer Registered Successfully",
              data: result,
            });
          })
          .catch((err) => {
            res.json({
              status: "error",
              message: "Something went wrong",
              error: err,
            });
          });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    });
};

// Caterer Login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
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
          "secret",
          { expiresIn: "1h" }
        );
        // If Caterer Exists
        res.json({
          status: "success",
          message: "Login Successfull",
          token: token,
          userId: result._id.toString(),
        });
      } else {
        // If Caterer doesn't Exists
        res.json({
          status: "failed",
          message: "Invalid Email or Password",
          data: result,
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    });
};

// Caterer Details
exports.caterer_details = async (req, res) => {
  await Caterer.findOne({ _id: req.body.userId })
    .then((result) => {
      if (result) {
        res.json({
          status: "success",
          message: "Caterer Found",
          data: result,
        });
      } else {
        res.json({
          status: "failed",
          message: "Caterer Not Found",
          data: result,
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    });
};

// Fetch All Caterers

exports.caterers = async (req, res) => {
  await Caterer.find()
    .then((result) => {
      res.json({
        status: "success",
        message: result.length + " Caterers Found",
        data: result,
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    });
};

// Update Caterer

exports.update_caterer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Server side validation failed",
      errors: errors.array(),
    });
  }
  await Caterer.findByIdAndUpdate(
    req.body.userId,
    { $set: req.body },
    (err, caterer) => {
      if (err) {
        res.json({
          status: "error",
          message: "Something went wrong",
          error: err,
        });
      } else {
        if (caterer) {
          res.json({
            status: "success",
            message: "Caterer Updated Successfully",
          });
        } else {
          res.json({
            status: "failed",
            message: "Caterer Not Found",
          });
        }
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
          status: "success",
          message: "Caterer Deleted Successfully",
        });
      } else {
        res.json({
          status: "failed",
          message: "Caterer Not Found",
        });
      }
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    });
};
