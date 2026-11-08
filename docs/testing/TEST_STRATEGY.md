# RewindVerse — Test Strategy & Quality Assurance Plan

## 1. Test Pyramid Overview

```
          ┌────────────────┐
          │   E2E Tests    │ Playwright (Full User Journey)
          ├────────────────┤
          │  Integration   │ Multi-run comparison, CSV to RVTS, Fit Lab
          ├────────────────┤
          │   Unit Tests   │ Vitest (Optimizers, Math, CSV, AST, Framing)
          └────────────────┘
```

## 2. Test Execution Commands

```bash
# Run complete Vitest unit test suite (30/30 passing)
pnpm test

# Run Python SDK unit tests
pnpm test:python

# Verify cloud integration credentials and read-only shares
pnpm cloud:verify

# Run TypeScript compiler verification (0 errors)
pnpm --filter @rewindverse/web exec tsc --noEmit
```

## 3. Test Suites & Coverage
1. `tests/unit/csv.test.ts`: Formula injection protection, null handling, delimiter parsing.
2. `tests/unit/rvts.test.ts`: Header framing, monotonic iteration checks, capability gating.
3. `tests/unit/optimizers.test.ts`: SGD, Polyak Momentum, Adam, AdamW numerical parity.
4. `tests/unit/rewindml.test.ts`: Continuous loss surface generation, gradient accuracy.
5. `tests/unit/diagnostics.test.ts`: Divergence, loss plateaus, vanishing/exploding gradients.
6. `tests/unit/forge.test.ts`: AST token allowlisting, safety checks, cycle detection.
