import { Router } from "express";

import {
  Register,
  Login,
  confirmEmail,
  resendConfirmEmail,
  Logout,
  authenticateByGoogle,
  authenticateByFacebook,
  requestResetPassword,
  resetPassword,
  authenticateByKeycloak,
  logoutByKeycloak,
} from "../Controllers/auth.controller";
import { authRoleMiddleware } from "../Middlewares/auth.middleware";
import catchAsync from "../Utils/catchAsync";

export const authRouter = Router();
authRouter.post("/login", catchAsync(Login));
authRouter.post("/register", catchAsync(Register));

authRouter.patch("/logout", authRoleMiddleware(["User", "Admin"]), Logout);

authRouter.get("/confirmEmail/:token", confirmEmail);
authRouter.get("/resendConfirmEmail/:userId", resendConfirmEmail);

authRouter.post("/requestResetPassword", requestResetPassword);
authRouter.post("/passwordReset", resetPassword);

authRouter.get("/google", authenticateByGoogle);
authRouter.get("/facebook", authenticateByFacebook);

authRouter.get("/keycloak", authenticateByKeycloak);
authRouter.get("/keycloak/logout", logoutByKeycloak);
