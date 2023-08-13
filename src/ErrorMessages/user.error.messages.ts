const userErrorMessages = {
  invalidEmailOrPassword: "Invaild email or password.",
  confirmEmail: "Please confrim your Email first",
  blockedByAdmin: "Your acccount has been blocked by admin.",
  authByThirdParty:
    "You cant login from this page. Please reset your oassword. Thanks for your time.",

  tooManyFailedLoginAttempts(mintues) {
    return `Too many failed login attempts. Please try again after ${mintues} mintues`;
  },
  statusCodeBadRequest: 400,
  statusCodeUnAuth: 401,
};

// userErrorMongoose just will be for all ErrorMongoose
const userErrorMongoose = {
  isRequired(fieldName) {
    return `Please enter your ${fieldName}`;
  },

  minMaxlength(fieldName, length, minOrMax) {
    const message =
      minOrMax === "max"
        ? `Invalid ${fieldName} Maximum ${length} characters required.`
        : `Invalid ${fieldName} Minimum ${length} characters required.`;
    return message;
  },
};

export { userErrorMessages, userErrorMongoose };

/*export async function signIn(
  email: string,
  password: string,
  rememberMe: boolean,
  next: NextFunction
) {
  let user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("In-vaild Email OR Password.", 400));
  }

  if (!user.confirm_email) {
    logger.error({
      err: 'Please confrim your Email first."',
    });
    return next(new AppError("Please confrim your Email first.", 400));
  }
  if (user.isBlocked) {
    return next(new AppError("Your acccount has bloced by Admin.", 400));
  }

  if (user.authByThirdParty) {
    return next(
      new AppError(
        "You Cant Login From This Page. Please Reset Your Password. Thanks For Your Time.",
        400
      )
    );
  }
  
  async function lockUserLogin(user, next: NextFunction) {
  user.failedLoginAttempts++;
  await user.save();
  if (user.failedLoginAttempts >= Number(process.env.MAX_LOGIN_ATTEMPTS)) {
    if (user.unlockLoginTime && Date.now() > user.unlockLoginTime) {
      user.failedLoginAttempts = 1;
      user.unlockLoginTime = undefined;
      await user.save();
      return next(new AppError("In-vaild Email OR Password.", 400));
    }

    if (!user.unlockLoginTime) {
      user.unlockLoginTime = calculateExpirationDate(process.env.LOCK_TIME); //Date.now() + 5000;
      await user.save();
    }
    return next(
      new AppError(
        `Too many failed login attempts. Please try again after ${getRemaningMints(
          user.unlockLoginTime
        )} minutes.`,
        401
      )
    );
  } else {
    return next(new AppError("In-vaild Email OR Password.", 400));
  }
}
  
  */
