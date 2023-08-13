import winston from "winston";
import expressWinston from "express-winston";

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint()
  ),
});

function expressWinstonMiddleWare(app) {
  app.use(
    expressWinston.errorLogger({
      transports: [new winston.transports.File({ filename: "error.log" })],
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.prettyPrint()
      ),
    })
  );
}

export { expressWinstonMiddleWare, logger };
