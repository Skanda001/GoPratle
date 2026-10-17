import { createServer } from "http";
import app from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function main() {
  await connectDB();

  const server = createServer(app);

  server.listen(env.PORT, () => {
    console.info(`🚀 Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  // ---------------------------------------------------------------------------
  // Graceful shutdown
  // ---------------------------------------------------------------------------
  const shutdown = async (signal: string) => {
    console.info(`\n${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });

    // Force exit after 10 seconds if graceful close hangs
    setTimeout(() => {
      console.error("Forced exit after timeout");
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
