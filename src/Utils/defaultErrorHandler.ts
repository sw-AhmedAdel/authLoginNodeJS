import { Response } from "express";
import { Request } from "express";
import { NextFunction } from "express";
import MongooseError from "../HandelErrors/MongooseError";
import JsonWebTokenError from "../HandelErrors/JsonWebTokenError";
import { logger } from "../logger/logger";
import AppError from "./appErorr";

function sendErrorDev(err: any, req: Request, res: Response) {
  logger.error("Uncaught Exception:", {
    url: req.url,
    method: req.method,
    error: err,
  });
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
  });
}

function sendErrorProd(err: any, req: Request, res: Response) {
  logger.error("Uncaught Exception:", {
    url: req.url,
    method: req.method,
    error: err,
  });

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  console.error("Error: ", err);
  return res.status(err.statusCode).json({
    status: err.status,
    msg: "Server is down, Please try again later",
  });
}

function globalErrorHnadling(
  err: AppError, // Merehan
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error = Object.assign(err);

    if (error.name === "CastError") {
      // Handel Invalid Mongo ID
      error = MongooseError.handleInvalidMongoId(error);
    }

    // handle dublicate values using unique: true
    if (error.code === 11000 && error.statusCode === 500) {
      error = MongooseError.handleDublicateValues(error);
    }
    //Handling Mongoose Validation Errors
    if (error.name === "ValidationError" && error.statusCode === 500) {
      error = MongooseError.handelValidationError(error);
    }
    if (
      error.name === "JsonWebTokenError" &&
      err.message === "invalid signature"
    ) {
      error = JsonWebTokenError.JsonWebTokenError();
    }

    if (err.message === "jwt expired") {
      error = JsonWebTokenError.handelJwtExpired();
    }

    sendErrorProd(error, req, res);
  }
}

export default globalErrorHnadling;
