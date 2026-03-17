import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { calculateTax, calculateBulkTax, RateType } from "../../services/calculationService";

export async function calculateRoutes(fastify: FastifyInstance) {
  /**
   * POST /calculate
   * Calculate sales tax for a single transaction
   *
   * Body: { destinationState, saleAmount, rateType?, quantity? }
   */
  fastify.post(
    "/calculate",
    async (
      req: FastifyRequest<{
        Body: {
          destinationState: string;
          saleAmount: number;
          rateType?: RateType;
          quantity?: number;
        };
      }>,
      reply: FastifyReply
    ) => {
      const { destinationState, saleAmount, rateType, quantity } = req.body;

      if (!destinationState) {
        return reply.status(400).send({ success: false, error: "destinationState is required" });
      }
      if (typeof saleAmount !== "number" || saleAmount < 0) {
        return reply.status(400).send({ success: false, error: "saleAmount must be a non-negative number" });
      }

      const validRateTypes: RateType[] = ["state_only", "combined_avg", "combined_max"];
      if (rateType && !validRateTypes.includes(rateType)) {
        return reply.status(400).send({
          success: false,
          error: `rateType must be one of: ${validRateTypes.join(", ")}`,
        });
      }

      try {
        const result = calculateTax({ destinationState, saleAmount, rateType, quantity });
        return reply.send({ success: true, data: result });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return reply.status(400).send({ success: false, error: message });
      }
    }
  );

  /**
   * POST /calculate/bulk
   * Calculate tax for multiple transactions at once
   *
   * Body: {
   *   transactions: [
   *     { id: "order-1", destinationState: "CA", saleAmount: 199.99, rateType?: "combined_avg" },
   *     ...
   *   ]
   * }
   */
  fastify.post(
    "/calculate/bulk",
    async (
      req: FastifyRequest<{
        Body: {
          transactions: Array<{
            id: string;
            destinationState: string;
            saleAmount: number;
            rateType?: RateType;
          }>;
        };
      }>,
      reply: FastifyReply
    ) => {
      const { transactions } = req.body;

      if (!Array.isArray(transactions) || transactions.length === 0) {
        return reply.status(400).send({ success: false, error: "transactions must be a non-empty array" });
      }

      if (transactions.length > 1000) {
        return reply.status(400).send({ success: false, error: "Maximum 1000 transactions per bulk request" });
      }

      try {
        const result = calculateBulkTax({ transactions });
        return reply.send({ success: true, data: result });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return reply.status(400).send({ success: false, error: message });
      }
    }
  );
}
