import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";

async function bootstrap() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Contact extension API listening on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start application", error);
  process.exit(1);
});
