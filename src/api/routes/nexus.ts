import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { checkNexus, checkBulkNexus } from "../../services/nexusService";
import { NEXUS_THRESHOLDS } from "../../data/nexusThresholds";

export async function nexusRoutes(fastify: FastifyInstance) {
  /**
   * GET /nexus/thresholds
   * Returns all state economic nexus thresholds
   */
  fastify.get("/nexus/thresholds", async (_req: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      success: true,
      data: Object.values(NEXUS_THRESHOLDS),
    });
  });

  /**
   * GET /nexus/thresholds/:state
   * Returns nexus threshold for a specific state
   */
  fastify.get(
    "/nexus/thresholds/:state",
    async (req: FastifyRequest<{ Params: { state: string } }>, reply: FastifyReply) => {
      const abbr = req.params.state.toUpperCase();
      const threshold = NEXUS_THRESHOLDS[abbr];
      if (!threshold) {
        return reply.status(404).send({ success: false, error: `State not found: ${abbr}` });
      }
      return reply.send({ success: true, data: threshold });
    }
  );

  /**
   * POST /nexus/check
   * Check nexus for a single state
   *
   * Body: { stateAbbreviation, totalSales, totalTransactions, hasPhysicalPresence? }
   */
  fastify.post(
    "/nexus/check",
    async (
      req: FastifyRequest<{
        Body: {
          stateAbbreviation: string;
          totalSales: number;
          totalTransactions: number;
          hasPhysicalPresence?: boolean;
        };
      }>,
      reply: FastifyReply
    ) => {
      const { stateAbbreviation, totalSales, totalTransactions, hasPhysicalPresence } = req.body;

      if (!stateAbbreviation) {
        return reply.status(400).send({ success: false, error: "stateAbbreviation is required" });
      }
      if (typeof totalSales !== "number" || totalSales < 0) {
        return reply.status(400).send({ success: false, error: "totalSales must be a non-negative number" });
      }
      if (typeof totalTransactions !== "number" || totalTransactions < 0) {
        return reply.status(400).send({ success: false, error: "totalTransactions must be a non-negative number" });
      }

      try {
        const result = checkNexus({ stateAbbreviation, totalSales, totalTransactions, hasPhysicalPresence });
        return reply.send({ success: true, data: result });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return reply.status(400).send({ success: false, error: message });
      }
    }
  );

  /**
   * POST /nexus/bulk-check
   * Check nexus across all states in one call
   *
   * Body: {
   *   salesByState: { "CA": { totalSales: 600000, totalTransactions: 250 }, ... },
   *   physicalPresenceStates?: ["CA", "TX"]
   * }
   */
  fastify.post(
    "/nexus/bulk-check",
    async (
      req: FastifyRequest<{
        Body: {
          salesByState: Record<string, { totalSales: number; totalTransactions: number }>;
          physicalPresenceStates?: string[];
        };
      }>,
      reply: FastifyReply
    ) => {
      const { salesByState, physicalPresenceStates } = req.body;

      if (!salesByState || typeof salesByState !== "object") {
        return reply.status(400).send({ success: false, error: "salesByState is required and must be an object" });
      }

      try {
        const result = checkBulkNexus({ salesByState, physicalPresenceStates });
        return reply.send({ success: true, data: result });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return reply.status(400).send({ success: false, error: message });
      }
    }
  );
}
