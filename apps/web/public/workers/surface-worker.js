/**
 * RewindVerse — High-Performance Surface Sampling Web Worker
 * Offloads dense grid computation (64x64, 128x128) from main UI thread.
 * Uses zero-copy Transferable ArrayBuffers for maximum 60 FPS fluidity.
 */

self.onmessage = function (e) {
  const { type, requestId, objectiveType, domain, resolution = 64 } = e.data;

  if (type === "CANCEL") {
    // Acknowledge cancellation
    self.postMessage({ type: "CANCELLED", requestId });
    return;
  }

  if (type === "SAMPLE_SURFACE") {
    const xMin = domain?.xMin ?? -4;
    const xMax = domain?.xMax ?? 4;
    const yMin = domain?.yMin ?? -4;
    const yMax = domain?.yMax ?? 4;

    const count = resolution * resolution;
    // Each vertex has 3 floats (x, y, z)
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const stepX = (xMax - xMin) / (resolution - 1);
    const stepY = (yMax - yMin) / (resolution - 1);

    const heightScale =
      objectiveType === "rosenbrock"
        ? 0.02
        : objectiveType === "quadratic"
        ? 0.18
        : 0.3;

    let ptr = 0;
    for (let r = 0; r < resolution; r++) {
      const v = yMin + r * stepY; // y (or z in 3D scene)
      for (let c = 0; c < resolution; c++) {
        const u = xMin + c * stepX; // x

        let val = 0;
        if (objectiveType === "quadratic") {
          val = 0.5 * (u * u + 10 * v * v);
        } else if (objectiveType === "rosenbrock") {
          const a = 1 - u;
          const b = v - u * u;
          val = a * a + 100 * b * b;
        } else {
          // Saddle
          val = u * u - v * v;
        }

        const clampedHeight = Math.max(-10, Math.min(15, val * heightScale));

        // Position: [x, height, z]
        positions[ptr * 3] = u;
        positions[ptr * 3 + 1] = clampedHeight;
        positions[ptr * 3 + 2] = v;

        // Color mapping: Cyan to Violet
        const normH = Math.max(0, Math.min(1, (clampedHeight + 5) / 15));
        // Approximate HSL to RGB for speed
        const rVal = normH;
        const gVal = 0.8 * (1 - normH);
        const bVal = 1.0;

        colors[ptr * 3] = rVal;
        colors[ptr * 3 + 1] = gVal;
        colors[ptr * 3 + 2] = bVal;

        ptr++;
      }
    }

    // Post back using Transferable Objects for zero-copy memory transfer
    self.postMessage(
      {
        type: "SURFACE_SAMPLED_SUCCESS",
        requestId,
        resolution,
        positions: positions.buffer,
        colors: colors.buffer,
      },
      [positions.buffer, colors.buffer]
    );
  }
};
