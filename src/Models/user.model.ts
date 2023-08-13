import mongoose, { Schema, Document } from "mongoose";
import bcrypt, { compare } from "bcryptjs";
import { userErrorMongoose } from "../ErrorMessages/user.error.messages";
import validator from "validator";
import { sign as jwtSign } from "jsonwebtoken";

// Define User Interface Schema
export interface UserInterface extends Document {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
  confirm_email: boolean;
  isBlocked: boolean;
  lastSeen: Date;
  googleToken: string;
  githubToken: string;
  facebookToken: string;
  authByThirdParty: boolean;
  unlockLoginTime: Date;
  failedLoginAttempts: number;
  password: string;
  checkPasswordIsValid(password: string): boolean;
  generateAuthToken(): string;
}

// Define Schema ["Admin", "User", "Manager", "Hr"],
const userSchema: Schema<UserInterface> = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, userErrorMongoose.isRequired("first name")],
      minlength: [3, userErrorMongoose.minMaxlength("first name", 3, "min")],
      maxlength: [8, userErrorMongoose.minMaxlength("first name", 8, "max")],
    },
    lastName: {
      type: String,
      required: [true, userErrorMongoose.isRequired("last name")],
      minlength: [3, userErrorMongoose.minMaxlength("last name", 3, "min")],
      maxlength: [8, userErrorMongoose.minMaxlength("last name", 8, "max")],
    },
    email: {
      type: String,
      required: [true, userErrorMongoose.isRequired("email")],
      unique: true,
      validate: [validator.isEmail, "please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, userErrorMongoose.isRequired("password")],
      minlength: [8, userErrorMongoose.minMaxlength("password", 8, "min")],
    },
    role: {
      type: String,
      default: "User",
      enum: {
        values: ["Admin", "User", "PM", "DM"],
        message: "Role must be User, Admin, PM, DM",
      },
    },

    permissions: [
      {
        type: String,
      },
    ],
    confirm_email: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastSeen: {
      type: Date,
    },
    googleToken: {
      type: String,
      required: false,
    },
    githubToken: {
      type: String,
      required: false,
    },
    facebookToken: {
      type: String,
      required: false,
    },
    authByThirdParty: {
      type: Boolean,
      default: false,
    },
    unlockLoginTime: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add Method To Check Password Validate
userSchema.methods.checkPasswordIsValid = async function (
  password: string
): Promise<boolean> {
  const RES = await compare(password, this.password);

  return RES;
};

userSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwtSign(
    { id: user._id, role: user.role, permissions: user.permissions },
    process.env.TOKEN_SIGNATURE,
    { expiresIn: "24h" }
  );
  return token;
};
// userSchema.methods.toJSON = function () {
//     const userObj = this.toObject();
//     delete userObj.password;
//     delete userObj.permission;
//     delete userObj.role;
//     delete userObj.active;
//     delete userObj.confirm_email;
//     delete userObj.isBlocked;
//     delete userObj.authByThirdParty;
//     delete userObj.failedLoginAttempts;
//     delete userObj.unlockLoginTime;
//     delete userObj.facebookToken;
//     delete userObj.githubToken;
//     delete userObj.googleToken;
//     delete userObj.lastSeen;

//     return userObj;
// };

userSchema.pre("save", async function (next): Promise<void> {
  const user: any = this;
  if (!user.isModified("password")) return next();
  user.password = await bcrypt.hash(user.password, 12);
  return next();
});

export const UserModel = mongoose.model<UserInterface>(
  "authUsersAhmed",
  userSchema
);
