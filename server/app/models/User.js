const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    coursesId:[{type:ObjectId,ref:"Course"}],
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// api add course id
// courses.map((course) => {
//   api add(course._id)
// })


// create virtual password
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  // encode password
  encryptPassword: function (password) {
    if (!password) {
      return "";
    } else {
      try {
        return crypto
          .createHmac("sha1", this.salt)
          .update(password)
          .digest("hex");
      } catch (err) {
        return "";
      }
    }
  },

  // authenticate password
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
};

module.exports = mongoose.model("User", userSchema);
