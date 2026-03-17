import { buildServer } from "./api/server";

const PORT = parseInt(process.env.PORT ?? "3000", 10);
const HOST = process.env.HOST ?? "0.0.0.0";

async function main() {
  const server = await buildServer();

  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`\n🚀 Nexus Tax Engine running at http://${HOST}:${PORT}\n`);
    console.log("Endpoints:");
    console.log("  GET  /health                — Health check");
    console.log("  GET  /rates                 — All state tax rates");
    console.log("  GET  /rates/:state          — Rate for a specific state");
    console.log("  GET  /rates/no-tax-states   — States with no sales tax");
    console.log("  GET  /nexus/thresholds      — All economic nexus thresholds");
    console.log("  GET  /nexus/thresholds/:state — Threshold for a specific state");
    console.log("  POST /nexus/check           — Check nexus for one state");
    console.log("  POST /nexus/bulk-check      — Check nexus across all states");
    console.log("  POST /calculate             — Calculate tax for one transaction");
    console.log("  POST /calculate/bulk        — Calculate tax for up to 1000 transactions\n");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
