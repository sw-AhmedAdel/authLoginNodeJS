import AppError from "../Utils/appErorr";
import { userErrorMessages } from "../ErrorMessages/user.error.messages";

class MongooseError {
  static handleDublicateValues(error: any): Error {
    const message = ` ${Object.values(error.keyValue)} already exists.`;
    console.log(message);
    return new AppError(message, userErrorMessages.statusCodeBadRequest);
  }
  static handleInvalidMongoId(error: any): Error {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, userErrorMessages.statusCodeBadRequest);
  }

  static handelValidationError(error: any): Error {
    // loop throw each obj
    const errors = Object.values(error.errors).map((err: Error) => err.message);
    const message = `Invalid Errors: ${errors.join(". ")}`; // make array string
    return new AppError(message, userErrorMessages.statusCodeBadRequest);
  }
}
export default MongooseError;
