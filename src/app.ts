import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import routes from "./routes";
import { openapiSpec } from "./config/openapi";
import { errorHandler } from "./middlewares/error-handler";
import { defaultRateLimiter } from "./middlewares/rate-limit";
import { requestIdMiddleware } from "./middlewares/request-id";
import { logger } from "./config/logger";

const app = express();

app.use(requestIdMiddleware);
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));
app.use(defaultRateLimiter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/api", routes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

logger.info("app_initialized");

export default app;
