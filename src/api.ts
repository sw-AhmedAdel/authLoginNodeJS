import express from "express";
const api = express.Router();
import { authRouter } from "./Routes/auth.router";
import { adminRouter } from "./Routes/admin.router";
import { userRouter } from "./Routes/user.router";

// Dashboard Router
api.use("/admin", adminRouter);
// Auth Router
api.use("/auth", authRouter);
// User Router
api.use("/user", userRouter);

export default api;
