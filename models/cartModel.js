const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cart_total: Number,
    tota_after_discount: Number,
    ordered_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Cart", cartSchema);
