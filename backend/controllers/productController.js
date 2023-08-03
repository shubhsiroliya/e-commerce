const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/ApiFeatures");
const cloudinary = require("cloudinary");

// create product -admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; ++i) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      image_url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user;

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  let products = await apiFeature.query;
  const filteredProductCount = await products.length;

  await apiFeature.pagination(resultPerPage);

  res.status(200).json({
    success: true,
    productsCount,
    products,
    resultPerPage,
    filteredProductCount,
  });
});

// get all products(admin)
exports.getAllProductsAdmin = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

// get product
exports.getProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById({ _id: req.params.id });
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  } else {
    res.status(200).json({
      success: true,
      product,
    });
  }
});

// update product -admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  let product = await Product.findById({ _id: req.params.id });
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  } else {
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    if (images !== undefined) {
      //delete images from cloudinary
      for (let i = 0; i < product.images.length; ++i) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }
      const imageLinks = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });

        imageLinks.push({
          public_id: result.public_id,
          image_url: result.secure_url,
        });
      }
      req.body.images = imageLinks;
    }
    product = await Product.findByIdAndUpdate({ _id: req.params.id }, req.body);
    res.status(201).json({
      success: true,
      product,
    });
  }
});

// delete product -admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.findById({ _id: req.params.id });
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  } else {
    // deleting images from cloudinary
    for (let i = 0; i < product.images.length; ++i) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    await Product.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: "product deleted successfully ",
    });
  }
});

// create or update review -auth
exports.productReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productid } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productid);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// get all reviews
exports.getAllreviews = catchAsyncErrors(async (req, res, next) => {
  console.log(req.query.id);
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  console.log(product.reviews);
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// delete review -admin
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productid);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productid,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});