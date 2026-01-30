import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

const port = Number(env.PORT);

app.listen(port, () => {
  logger.info("server_started", { port });
});
