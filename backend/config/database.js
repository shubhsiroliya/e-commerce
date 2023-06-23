const mongoose = require("mongoose");

exports.connection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((data) =>
      console.log(`MongoDB connected with server:${data.connection.host}`)
    );
};