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

// const corsOrigins = env.CORS_ORIGIN === "*" 
// 	? "*" 
// 	: env.CORS_ORIGIN.split(",").map(origin => origin.trim());

const corsOrigins =
	env.CORS_ORIGIN === "*"
		? "*"
		: env.CORS_ORIGIN
			.split(",")
			.map((o) => o.trim())
			.filter(Boolean);

// const allowlist =
// 	env.CORS_ORIGIN === "*"
// 		? null
// 		: env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);



app.use(cors({
	origin: corsOrigins === "*" ? true : corsOrigins,
	credentials: true
}));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(defaultRateLimiter);
app.set('trust proxy', 1);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/api", routes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

logger.info("app_initialized");

export default app;
