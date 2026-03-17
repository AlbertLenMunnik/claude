import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { STATE_TAX_RATES, getAllStates } from "../../data/stateTaxRates";
import { getEffectiveRate, RateType } from "../../services/calculationService";

export async function ratesRoutes(fastify: FastifyInstance) {
  /**
   * GET /rates
   * Returns tax rates for all states
   */
  fastify.get("/rates", async (_req: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      success: true,
      data: getAllStates(),
    });
  });

  /**
   * GET /rates/:state
   * Returns tax rate info for a specific state
   * Query param: ?rateType=combined_avg|state_only|combined_max
   */
  fastify.get(
    "/rates/:state",
    async (
      req: FastifyRequest<{
        Params: { state: string };
        Querystring: { rateType?: string };
      }>,
      reply: FastifyReply
    ) => {
      const abbr = req.params.state.toUpperCase();
      const rateInfo = STATE_TAX_RATES[abbr];

      if (!rateInfo) {
        return reply.status(404).send({ success: false, error: `State not found: ${abbr}` });
      }

      const validRateTypes: RateType[] = ["state_only", "combined_avg", "combined_max"];
      const rateType = req.query.rateType as RateType | undefined;

      if (rateType && !validRateTypes.includes(rateType)) {
        return reply.status(400).send({
          success: false,
          error: `rateType must be one of: ${validRateTypes.join(", ")}`,
        });
      }

      const effectiveRate = getEffectiveRate(abbr, rateType ?? "combined_avg");

      return reply.send({
        success: true,
        data: {
          ...rateInfo,
          effectiveRate,
          rateType: rateType ?? "combined_avg",
        },
      });
    }
  );

  /**
   * GET /rates/no-tax-states
   * Returns states with no sales tax
   */
  fastify.get("/rates/no-tax-states", async (_req: FastifyRequest, reply: FastifyReply) => {
    const noTaxStates = getAllStates().filter((s) => !s.hasSalesTax);
    return reply.send({
      success: true,
      data: noTaxStates,
      count: noTaxStates.length,
    });
  });
}
