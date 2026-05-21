// app/config/presaleConfig.ts

export const PRESALE_CONFIG = {
  TOTAL_BATCHES: 40,
  TOKENS_PER_BATCH: 2_560_000, // DDC po batch-u
  START_PRICE_USDT: 0.01,      // batch #1
  END_PRICE_USDT: 0.79,        // batch #40
  PRICE_STEP_USDT: 0.02,       // each next batch +0.02
  BATCH_DURATION_HOURS: 0.0166667,
};

// Helper functions

export function getBatchPrice(batchId: number): number {
  // batchId je 1–40
  const { START_PRICE_USDT, PRICE_STEP_USDT, TOTAL_BATCHES } = PRESALE_CONFIG;

  if (batchId < 1) batchId = 1;
  if (batchId > TOTAL_BATCHES) batchId = TOTAL_BATCHES;

  return START_PRICE_USDT + (batchId - 1) * PRICE_STEP_USDT;
}

export function getAllBatches() {
  const { TOTAL_BATCHES, TOKENS_PER_BATCH } = PRESALE_CONFIG;

  return Array.from({ length: TOTAL_BATCHES }, (_, i) => {
    const id = i + 1;
    return {
      id,
      priceUsdt: getBatchPrice(id),
      tokensPerBatch: TOKENS_PER_BATCH,
    };
  });
}
