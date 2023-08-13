import AppError from "../Utils/appErorr";
import { userErrorMessages } from "../ErrorMessages/user.error.messages";

class JsonWebTokenError {
  static JsonWebTokenError() {
    const message = "Token is invalid, Please login or signup";
    return new AppError(message, userErrorMessages.statusCodeUnAuth);
  }

  static handelJwtExpired() {
    const message = "Token is expired, please login";
    return new AppError(message, userErrorMessages.statusCodeUnAuth);
  }
}

export default JsonWebTokenError;
