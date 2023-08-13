import express, { Request, Response, NextFunction } from "express";
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import passport from "./Config/passport";
import { mongoConnect } from "./DB/connect.db";
import { thirdPartyRouter } from "./Routes/thirdPartyCallback.router";
import globalErrorHnadling from "./Utils/defaultErrorHandler";
import AppError from "./Utils/appErorr";
import api from "./api";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests",
});

app.use(limiter);
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_2],
  })
);

app.use(compression());
app.use(cookieParser());

app.use(passport.initialize());

// For Unexcepted Error
// Handel UncaughtException Exception
process.on("uncaughtException", (exception) => {
  console.log(exception);
  console.log("Error From uncaughtException");
});
// Handle UnhandledRejection Exception
process.on("unhandledRejection", (exception) => {
  console.log(exception);
  console.log("Promise Rejection");
});

app.use("/auth", thirdPartyRouter);
app.use("/api/v1", api);

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Catch end points do not exits
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError("Rouut is not exits!", 404));
});

app.use(globalErrorHnadling);
console.log(process.env.NODE_ENV);

async function startServer() {
  await mongoConnect(); // wait till mongo is ready
  server.listen(PORT, () => {
    console.log("Server Running on http://localhost:" + PORT);
  });
}

startServer();
