import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { nexusRoutes } from "./routes/nexus";
import { calculateRoutes } from "./routes/calculate";
import { ratesRoutes } from "./routes/rates";

export async function buildServer(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
    },
  });

  // CORS — allow all origins by default (restrict in production as needed)
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "*",
    methods: ["GET", "POST", "OPTIONS"],
  });

  // API key auth (optional — set API_KEY env var to enable)
  const apiKey = process.env.API_KEY;
  if (apiKey) {
    fastify.addHook("onRequest", async (request, reply) => {
      // Allow health check without auth
      if (request.url === "/health" || request.url === "/") return;

      const providedKey =
        request.headers["x-api-key"] ??
        request.headers["authorization"]?.replace("Bearer ", "");

      if (providedKey !== apiKey) {
        return reply.status(401).send({ success: false, error: "Unauthorized — invalid or missing API key" });
      }
    });
  }

  // Health check
  fastify.get("/", async () => ({
    name: "Nexus Tax Engine",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  }));

  fastify.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }));

  // Register route modules
  await fastify.register(nexusRoutes);
  await fastify.register(calculateRoutes);
  await fastify.register(ratesRoutes);

  // Global error handler
  fastify.setErrorHandler((error, _request, reply) => {
    fastify.log.error(error);
    reply.status(error.statusCode ?? 500).send({
      success: false,
      error: error.message ?? "Internal server error",
    });
  });

  return fastify;
}
