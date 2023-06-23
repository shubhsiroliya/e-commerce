const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require('cloudinary');

exports.signupUser=catchAsyncErrors(async(req,res,next)=>{
  const cloud =await cloudinary.v2.uploader.upload(req.body.avatar,{folder:"avatars",width:150,crop:"scale"});
  const {name,email,password}=req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar:{
      public_id:cloud.public_id,
      image_url:cloud.secure_url
    }
  })
  sendToken(user,201,res);
})

// login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // checking if user has given email & password both or not ?
  if (!email || !password) {
    return next(new ErrorHandler("please enter email & password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("invalid email or password", 401));
  }
  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    return next(new ErrorHandler("invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

// logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "logged out successfully",
  });
});

// forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }
  // get resetpassword token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get('host')}/user/reset/${resetToken}`;
  const message = `Your password rest token is :-\n\n ${resetPasswordUrl} \n\nIf you have not requrested this email then,please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `ShopLok Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "reset password token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("password doesn't match with confirm password", 400)
    );
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

// get user details
exports.getPersonalDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});


exports.updatePasword = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if(!isPasswordMatched)
  {
    return next(new ErrorHandler('Old password is incorrect',400));
  }
  if(req.body.newPassword!==req.body.confirmPassword){
    return next(new ErrorHandler("New Password & Confirm Password does not match",400));
  }
  user.password=req.body.newPassword;
  await user.save();
  sendToken(user,200,res);
})

// update profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  if(req.body.avatar!==""){
    const user=await User.findById(req.user.id);
    const old_image_id=user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(old_image_id);
    const cloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
      folder:"avatar",width:150,crop:"scale"
    })
    newUserData.avatar={
      public_id:cloud.public_id,
      image_url:cloud.secure_url
    }

  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// get all users -admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// get user -admin
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("user does not exist", 400));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// update user role -admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("user does not exist", 400));
  }
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});

// delete user -admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  // will remove cloudinary later
  if (!user) {
    return next(new ErrorHandler(`user does not exist with id:${req.params.id}`, 400));
  }

  const imageId=user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "user deleted successfully",
  });
});
