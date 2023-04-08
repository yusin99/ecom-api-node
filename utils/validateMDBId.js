const mongoose = require("mongoose");
const validateMongoDBId = (id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId)
    throw new Error("The provided id is not in valid format or not found");
};

module.exports = validateMongoDBId;