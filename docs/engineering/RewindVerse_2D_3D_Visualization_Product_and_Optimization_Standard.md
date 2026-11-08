# RewindVerse — 2D/3D Visualization, Product Coverage & Optimization Standard

**Document type:** Product and Engineering Addendum  
**Product:** RewindVerse  
**Primary application:** Rewind Studio  
**Modules:** RewindML, Rewind Replay, Rewind Insights, Rewind Compare, Rewind Academy, Rewind Data Observatory, Rewind Model Intelligence  
**Trace contract:** Rewind Trace / RVTS  
**Version:** 1.0  
**Date:** 7 November 2026  
**Status:** Recommended implementation baseline; reconcile with the live repository before creating duplicate work  
**Audience:** Product owner, frontend and graphics engineers, ML engineers, data-visualization engineers, QA, security and design

---

## 1. Executive decision

RewindVerse must provide users with a clear choice of **2D, 3D or Auto view modes** wherever the underlying data has a valid representation in those modes.

The user's selected mode must be respected and remembered. RewindVerse must not silently force 3D because it looks impressive, nor should it hide 3D when it provides genuine analytical value. The application should offer 2D as a first-class visualization—not as a degraded fallback—and 3D as an additional analytical view where the data and task justify it.

### The product rule

> One source of truth. Multiple faithful views. The user chooses how to inspect it.

### Non-negotiable requirements

1. **2D is always available** for every visualization that has a valid 2D representation.
2. **3D is available only where the data supports a truthful 3D representation.** Do not invent a third axis or imply unmeasured structure.
3. A visualization may expose `2D`, `3D`, and `Auto`, or only `2D` when 3D is not meaningful.
4. A mode change must preserve the selected run, step, filters, visible series, units, data range, annotations and semantic meaning.
5. The active visualization must remain synchronized with Rewind Replay's selected training step.
6. Users must be able to switch modes without losing their place or configuration.
7. A text/table/data-inspection alternative must remain available for accessibility and precise reading.
8. Rendering must adapt to device and data size without compromising correctness or privacy.

---

## 2. Product positioning and market strategy

### 2.1 Market reality

Visualization breadth by itself is not a defensible differentiator. Established tools already provide substantial portions of the standard ML visualization surface:

- TensorBoard supports scalar/time-series views, histograms, images, computational graphs and embedding visualization. See the [TensorBoard overview](https://www.tensorflow.org/tensorboard/get_started), [TensorBoard repository](https://github.com/tensorflow/tensorboard) and [PyTorch TensorBoard integration](https://docs.pytorch.org/docs/main/utils/tensorboard.html).
- MLflow Tracking provides run exploration and comparison, parameter and metric visualization, artifact access, and dataset/model lineage. Its newer GenAI tooling also includes trace inspection and dashboard views. See [MLflow Tracking](https://mlflow.org/docs/latest/tracking/) and [MLflow trace UI](https://www.mlflow.org/docs/latest/genai/tracing/observe-with-traces/ui/).
- Neptune documents metric charts, histograms, scatter plots, dashboards, run comparison and report widgets. See [Neptune widgets](https://docs.neptune.ai/widgets), [dashboards](https://docs.neptune.ai/3.20251006/custom_dashboard) and [run comparison](https://docs.neptune.ai/select_runs).
- Plotly.js provides a broad catalogue of statistical and scientific charts, including 3D WebGL charts. See [Plotly JavaScript](https://plotly.com/javascript/).

These capabilities mean RewindVerse must not claim that ordinary loss curves, histograms, embeddings, run comparison or 3D plots are unique.

### 2.2 RewindVerse differentiation

The product should compete through the combination of:

1. **Synchronized replay:** a selected step drives all compatible 2D/3D panels, diagnostics and the event timeline.
2. **Capability-aware views:** only render information present in the trace or safely derived from declared information.
3. **2D/3D parity:** a user can change representation while retaining the same state and semantics.
4. **Learning-first interpretation:** explain what a visual pattern may indicate, show supporting evidence, and let users inspect the raw data.
5. **Portable traces:** a documented trace contract connects the browser lab, Python recorder and supported importers.
6. **Local-first interaction:** core replay and many visualizations work without a hosted training backend.
7. **Responsible visualization:** distinguish recorded values, derived diagnostics, dimensionality-reduction projections and illustrative geometry.

### 2.3 Product promise

**Train a model. Replay how it learned. Explore the evidence in 2D or 3D.**

### 2.4 Market claims policy

Do not use claims such as “all ML visualizations,” “first,” “only,” “best,” “complete MLOps replacement,” or “supports every model.” Use measurable claims tied to tested versions, supported data types and benchmark profiles.

---

## 3. User experience: 2D / 3D / Auto mode

### 3.1 Mode selector

For each visualization that supports multiple representations, place a compact selector in the visualization toolbar:

`[ 2D ] [ 3D ] [ Auto ]`

- **2D:** use the 2D representation explicitly. Do not automatically change it because the viewport is small.
- **3D:** use the 3D representation explicitly when the visualization supports it and the runtime can render it. If the device cannot render 3D, show a clear explanation and offer the 2D view; never leave a blank panel.
- **Auto:** choose the most appropriate supported view based on visualization capability, viewport, device performance and accessibility preferences. Auto must be deterministic enough to explain and must not override an explicit user choice.

For visualizations that have no meaningful 3D equivalent, display a `2D` mode indicator and a short explanation, rather than a disabled 3D button with no context.

### 3.2 Recommended default behavior

- First visit: `Auto` is allowed as the initial product default, but the user must be able to set a persistent global default.
- User explicitly selects 2D or 3D: remember that preference for that visualization type and current project.
- If the selected type has no 3D mode: use 2D and show “3D is not meaningful for this data view.”
- If 3D is selected but unsupported by the device: present a non-blocking fallback notice and preserve the user's preference so it can be honored on a capable device.
- If reduced motion is enabled: disable non-essential camera motion and animated transitions; still allow deliberate user-driven orbit/pan/zoom.
- Never silently replace an explicit `2D` selection with 3D, or an explicit `3D` selection with Auto.

### 3.3 Preference hierarchy

Resolve view mode in this order:

1. Explicit per-visualization selection in the current session.
2. Saved per-visualization preference for the current project.
3. User-level default view preference.
4. Product default (`Auto`).

Suggested preference model:

```ts
export type ViewMode = "2d" | "3d" | "auto";

export interface VisualizationPreferences {
  defaultMode: ViewMode;
  modeByVisualization: Record<string, ViewMode>;
  reducedMotion: boolean;
  highContrast: boolean;
  showDataTable: boolean;
  synchronizeReplay: boolean;
}
```

Persist local, non-sensitive preferences in IndexedDB or a small local preference store. If an authenticated account sync feature is added, sync only the preference metadata—not trace contents. Provide reset controls.

### 3.4 2D/3D parity contract

Switching representation must preserve:

- trace/run ID and selected run;
- exact selected step or timestamp;
- objective/model identity and declared parameterization;
- selected metric and series;
- filters, labels and class selections;
- axis units, normalization method and domain;
- annotations and diagnostic evidence ranges;
- highlighted points and compare-run selection;
- data provenance and approximation warnings.

The 3D scene may use camera projection, depth and occlusion, but must not change the underlying values. If downsampling or sampling is needed, display the method, sample count and original count.

### 3.5 Cross-view interactions

- Hovering or selecting a point in one view highlights the same underlying record in all linked views.
- Selecting a step in Replay updates all step-aware panels.
- Selecting a surface point displays its coordinates, objective value and gradient/update details if recorded or computed.
- Selecting a layer in the architecture view filters or focuses related activation/gradient summaries only when their trace references can be linked reliably.
- Keyboard focus and selection must work without relying on pointer hover.
- Provide `Reset view`, `Fit data`, `Reset camera`, `Copy coordinates`, and `Open data table` actions where relevant.

---

## 4. Visualization capability model

Every visualization must declare its capabilities before the UI renders the mode picker.

### 4.1 Capability descriptor

```ts
export interface VisualizationDescriptor {
  id: string;
  title: string;
  category: VisualizationCategory;
  supportedModes: Array<"2d" | "3d">;
  requiredCapabilities: string[];
  optionalCapabilities?: string[];
  minTraceLevel?: "L0" | "L1" | "L2" | "L3";
  dataRequirements: string[];
  recommendedFor: string[];
  caveats?: string[];
  estimatedCost: "low" | "medium" | "high";
}
```

The registry—not page-specific conditionals—determines if a visualization can render. Do not infer capabilities from a display name or assume every trace contains gradients, weights, activations, samples or checkpoints.

### 4.2 Data provenance labels

Every panel must label its information source using a consistent legend:

- **Recorded:** directly present in the trace.
- **Derived:** calculated deterministically from recorded values.
- **Projected:** dimensionality reduction or a geometric projection of higher-dimensional data.
- **Sampled:** selected subset of a larger dataset or trace.
- **Illustrative:** conceptual rendering not representing the user's actual model state.

Avoid blending these labels. Illustrative animations must never look like recorded model evidence.

### 4.3 3D eligibility rules

Offer 3D when at least one of these applies:

- data has three meaningful spatial dimensions;
- two independent model parameters form a valid surface domain and a third measured/derived value is used as height;
- a high-dimensional embedding has been projected to three dimensions with the algorithm and distortion caveats shown;
- a genuine 3D tensor/volume or spatial structure is available;
- a 3D network/graph layout adds useful spatial inspection and a 2D alternative remains available.

Do not offer 3D merely because three numerical columns exist. Check whether axes have meaningful semantics and whether the viewer could misinterpret the result.

---

## 5. Complete visualization catalogue and support matrix

This catalogue is intended to cover the broad set of useful visualizations expected in a modern ML learning, experiment-inspection and model-intelligence product. “Broad coverage” does not mean every visualization is useful for every model or trace. Each panel must be shown only when its data requirements are met.

Legend: **2D** = first-class 2D; **3D** = valid optional 3D; **Table** = precise data/table view; **Future** = later release after required data and evaluation are implemented.

### 5.1 Training dynamics and optimization

| Visualization | 2D | 3D | Required data | Notes |
|---|---:|---:|---|---|
| Training/validation loss curves | Yes | No | Scalar series with step unit | Core view; synchronized cursors |
| Accuracy/precision/recall/F1 curves | Yes | No | Evaluation metrics | Keep metric definitions and class averaging visible |
| Learning-rate schedule | Yes | No | Learning rate by step/epoch | Overlay with loss only when axes remain clear |
| Gradient norm over time | Yes | No | Gradient norm series | Identify layer/global scope |
| Weight/parameter norm over time | Yes | No | Parameter summary | Clearly define aggregation |
| Update-to-weight ratio | Yes | No | Update norm and parameter norm | Derived; display formula |
| Gradient distribution histogram | Yes | No | Gradient samples or histogram buckets | Do not claim per-weight data if only summary exists |
| Gradient box/violin plot | Yes | No | Distribution samples or quantiles | Keep exact sample/aggregation note |
| Weight/parameter distribution | Yes | No | Weight samples/histogram | Histogram snapshots by selected step |
| Per-layer gradient heatmap | Yes | Optional volume only | Layer summaries or sampled gradients | 2D is normally clearer |
| Parameter movement path | Yes | Yes | At least two registered parameters over steps | 2D line/contour and optional 3D surface path |
| Loss contour map | Yes | Optional paired view | Registered 2D objective or valid parameter slice | 2D is often the most readable |
| 3D loss surface | Optional paired view | Yes | Registered objective and declared two-parameter slice | Never imply full high-dimensional loss surface |
| Gradient vector field | Yes | Yes | Objective gradients on a 2D grid | 3D arrows only when depth adds meaning |
| Optimizer state/moment curves | Yes | No | Adam/Momentum state summaries | Show only if recorder captures them |
| Step-size/update-size plot | Yes | No | Per-update norm or scale | Derived with formula label |
| Convergence/plateau markers | Yes | No | Metric series + detector config | Diagnostic evidence, not a guaranteed conclusion |
| Learning-rate vs loss phase plot | Yes | Optional | Learning rate and loss paired by step | 3D rarely needed |

### 5.2 Model architecture and computation

| Visualization | 2D | 3D | Required data | Notes |
|---|---:|---:|---|---|
| Layer stack diagram | Yes | Optional | Architecture manifest | 2D is default for readability |
| Computation graph | Yes | Optional | Graph/operation metadata | Large graphs need collapse/search |
| Neural network node-link graph | Yes | Optional | Layer sizes and connectivity | Aggregate nodes for large layers |
| Tensor shape/data-flow diagram | Yes | No | Tensor metadata | Avoid exposing raw tensor values by default |
| Parameter-count by layer | Yes | No | Model metadata | Bar/treemap options |
| Model summary table | Yes | No | Architecture metadata | Accessible alternative |
| Activation heatmap by layer | Yes | No | Activation summaries or sampled activations | Mark sample/batch context |
| Activation distribution | Yes | No | Distribution or histogram | Per layer and selected step |
| Feature map grid | Yes | No | Image/CNN activation maps | 2D tiles are typically best |
| Convolution filter grid | Yes | No | Kernel weights | Normalize with explicit scale |
| Gradient flow by layer | Yes | No | Layer gradient norms | Log scale option, with clear units |
| 3D tensor/volume view | Optional slices | Yes | Actual volumetric tensor | Use slice plane and coordinate controls |
| Attention matrix | Yes | No | Attention weights | 2D heatmap; label layer/head/token positions |
| Attention head comparison | Yes | Optional graph | Multiple heads and metadata | Do not call attention a causal explanation |

### 5.3 Model evaluation and classification

| Visualization | 2D | 3D | Required data | Notes |
|---|---:|---:|---|---|
| Confusion matrix | Yes | No | Labels + predictions | Raw counts and normalized mode |
| ROC curve | Yes | No | Scores + labels | One-vs-rest/micro/macro semantics |
| Precision-recall curve | Yes | No | Scores + labels | Show prevalence baseline |
| Calibration/reliability curve | Yes | No | Probabilities + outcomes | Include binning method and sample count |
| Probability distribution | Yes | No | Predicted probabilities | Class-conditional views |
| Decision boundary | Yes | Yes | Two input features or declared projection | Surface is valid only for chosen feature pair |
| Residual plot | Yes | No | Predictions + target values | Regression diagnostics |
| Residual distribution | Yes | No | Prediction residuals | Include scale and outlier treatment |
| Error analysis by subgroup | Yes | No | Group metadata + outcomes | Privacy and fairness safeguards |
| Learning curve | Yes | No | Training set size + score | Dataset split definitions required |
| Validation curve | Yes | No | Hyperparameter + score | Preserve tested parameter range |
| Lift/gain chart | Yes | No | Scores + labels | Optional post-v1 |
| Regression predicted-vs-actual | Yes | No | Predictions + targets | 1:1 reference line |

### 5.4 Data exploration and data quality

| Visualization | 2D | 3D | Required data | Notes |
|---|---:|---:|---|---|
| Numeric histogram | Yes | No | Numeric column | Bins and missing-value policy visible |
| Box plot | Yes | No | Numeric column/group | Outlier definition visible |
| Violin plot | Yes | No | Distribution samples | Bandwidth and sample size noted |
| Scatter plot | Yes | Yes when 3 axes meaningful | At least two/three features | Overplotting and transparency controls |
| Scatter matrix/pair plot | Yes | No | Multiple numeric fields | Limit dimensions and allow search |
| Correlation heatmap | Yes | No | Numeric matrix | Correlation method and missing policy visible |
| Parallel coordinates | Yes | Optional 3D | Multiple normalized dimensions | Normalization can mislead; show axis scaling |
| Category frequency/bar chart | Yes | No | Categorical fields | Top-N + other and exact counts |
| Missingness matrix | Yes | No | Per-record missingness | Sensitive raw records must not be shared by default |
| Missingness summary | Yes | No | Column quality stats | Counts and percentages |
| Class balance | Yes | No | Target labels | Show class count and ratio |
| PCA projection | Yes | Yes | Feature matrix and fitted transform | Store method/variance metadata |
| t-SNE projection | Yes | Yes | Feature matrix and fitted transform | Explain stochastic/local structure and parameters |
| UMAP projection | Yes | Yes | Feature matrix and fitted transform | Explain parameters and projection caveats |
| Drift timeline | Yes | No | Time-bucketed distribution/summary | Method, baseline and threshold visible |
| Feature distribution shift | Yes | No | Reference/current samples | Same binning/scales for comparison |
| Geographic/map view | Yes | Optional globe | Geospatial data | Only if product later explicitly supports geospatial tasks |

### 5.5 Explainability and interpretability

| Visualization | 2D | 3D | Required data | Notes |
|---|---:|---:|---|---|
| Global feature importance | Yes | No | Importance values | State estimator/method |
| SHAP summary/beeswarm | Yes | No | SHAP values + feature values | Show sample count and background dataset |
| SHAP dependence plot | Yes | Optional surface | Feature values + SHAP values | 3D only for a meaningful second feature interaction |
| SHAP waterfall | Yes | No | Per-example SHAP values | Keep additive baseline and output units clear |
| PDP (partial dependence) | Yes | No | Model + dataset | State averaging assumptions |
| ICE curves | Yes | No | Model + dataset | Sample rows and show variability |
| Two-feature response surface | Yes | Yes | Two feature grid + model predictions | Distinguish prediction surface from training loss |
| Counterfactual path | Yes | Optional 3D | Valid counterfactual sequence | Include constraints and feasibility warnings |
| Feature attribution over image | Yes | No | Saliency/Grad-CAM-like output | Overlay plus raw input toggle |
| Token attribution | Yes | No | Token-level attribution values | Do not infer causal reasoning from saliency alone |

### 5.6 Computer vision

| Visualization | 2D | 3D | Required data | Notes |
|---|---:|---:|---|---|
| Image sample gallery | Yes | No | Image references | Privacy, licensing and payload limits |
| Prediction overlay | Yes | No | Image + prediction | Show confidence and model version |
| Segmentation mask | Yes | No | Input image + mask | Opacity and class toggles |
| Bounding boxes | Yes | No | Image + boxes | Class/color controls and table alternative |
| Saliency/Grad-CAM overlay | Yes | No | Attribution map | Label method and limitations |
| Feature map grid | Yes | No | Activation maps | Sampling/layer selector |
| Video frame timeline | Yes | No | Frame-indexed inference | Playback controls and frame sample policy |
| Volumetric medical/scientific view | Slice view | Yes | Actual 3D volume | Future scope; strict sensitive-data controls |

### 5.7 NLP, embeddings and transformer analysis

| Visualization | 2D | 3D | Required data | Notes |
|---|---:|---:|---|---|
| Token probability/logit chart | Yes | No | Token logits/probabilities | Top-k and temperature metadata |
| Token sequence/attribution view | Yes | No | Token metadata and scores | Preserve token boundaries |
| Attention heatmap | Yes | No | Attention values | Label layer/head and sequence positions |
| Attention flow graph | Yes | Optional | Aggregated attention links | Clearly mark aggregation choices |
| Embedding projector | Yes | Yes | Embeddings + IDs/metadata | PCA/UMAP/t-SNE metadata; privacy filtering |
| Similarity matrix | Yes | No | Embeddings | Similarity function and normalization |
| Nearest-neighbor map | Yes | Optional graph | Embeddings + neighbor index | Show distance metric |
| Sequence length distribution | Yes | No | Token counts | Histogram/quantiles |
| LLM trace/tool-call timeline | Yes | No | Span/step events | Preserve actual call order and duration |
| Token/cost/latency breakdown | Yes | No | Instrumented metrics | Do not invent cost or token figures |

### 5.8 System and training performance

| Visualization | 2D | 3D | Required data | Notes |
|---|---:|---:|---|---|
| Training throughput | Yes | No | Samples/sec or steps/sec | Define measurement window |
| GPU/CPU utilization | Yes | No | Telemetry series | Optional external telemetry integration |
| Memory usage | Yes | No | Process/device metrics | Units and sampling interval visible |
| Data-loader wait time | Yes | No | Timing spans | Requires instrumentation |
| Step-time distribution | Yes | No | Per-step durations | Histogram/box/violin |
| Profiler timeline/flame graph | Yes | No | Timed spans and hierarchy | Large trace virtualized |
| Queue/worker health | Yes | No | Application telemetry | Admin-only view, never user model internals |
| Storage/trace-size timeline | Yes | No | File metadata | No 3D needed |

### 5.9 Experiment comparison and reporting

| Visualization | 2D | 3D | Required data | Notes |
|---|---:|---:|---|---|
| Multi-run loss/metric overlay | Yes | No | Aligned metric series | Show missing/unaligned steps honestly |
| Small-multiple charts | Yes | No | Multiple runs/metrics | Shared or independent axes clearly labelled |
| Run comparison table | Yes | No | Parameters and metrics | Sort/filter/export |
| Parallel coordinates | Yes | Optional | Many parameters and outcomes | Normalize with visible settings |
| Parameter-vs-metric scatter | Yes | Optional | Run-level configs and metrics | Regression lines only when computed |
| Run lineage graph | Yes | Optional graph | Parent/child references | No invented parent relations |
| Before/after checkpoint comparison | Yes | Optional | Matching model states | Require architecture/parameter compatibility |
| Training report cards | Yes | No | Trace + diagnostics | Every statement links to evidence |

---

## 6. Recommended visualization stack

### 6.1 Keep one primary renderer per problem type

| Layer | Recommended technology | Responsibility |
|---|---|---|
| 2D custom ML charts | D3 + SVG | Axes, scales, curves, contours, annotations and interactions |
| Dense 2D point/heatmap rendering | Canvas 2D or WebGL-backed specialist renderer | Large point sets, dense heatmaps, fast pan/zoom |
| 3D scenes | Three.js | Scene graph, camera, geometry, materials and GPU rendering |
| React 3D integration | React Three Fiber | React composition of reusable 3D scenes |
| 3D helpers | Drei (selectively) | Controls, helpers, instancing utilities and common scene components |
| Numerical preprocessing | TypeScript packages + Web Workers | Sampling, transforms, grid generation and downsampling |
| Statistical/ML transforms | RewindML and dedicated tested packages | PCA/UMAP/t-SNE, diagnostics and objective calculations |
| Accessible data representation | HTML tables + textual summaries | Exact values and keyboard/screen-reader access |

Do not introduce D3, ECharts, Plotly, Recharts and Chart.js all into the same core interface without a documented reason. Multiple overlapping libraries increase bundle size, visual inconsistency, test burden and maintenance. Plotly.js is a capable alternative for scientific and 3D charts, but RewindVerse should prefer its existing Three.js/R3F scene layer for purpose-built synchronized 3D visualizations. Plotly can be used for a contained import/report use case only after bundle and interaction testing.

Sources: [D3 documentation](https://d3js.org/), [Plotly.js](https://plotly.com/javascript/), [Apache ECharts](https://echarts.apache.org/en/), [React Three Fiber performance guidance](https://r3f.docs.pmnd.rs/advanced/pitfalls).

### 6.2 Rendering decision tree

1. Small/medium 2D vector chart: SVG.
2. Dense 2D points or raster-like heatmap: Canvas or WebGL.
3. Interactive spatial or surface view: Three.js/R3F.
4. Large numerical transform: Web Worker before rendering.
5. Exact value inspection: table or accessible detail panel.
6. Unsupported data: explicit empty state explaining the missing capability.

---

## 7. Core 3D visualization specifications

### 7.1 3D loss landscape explorer

**Purpose:** explain the objective surface and optimizer movement for a valid two-parameter optimization problem or a declared two-dimensional slice of a higher-dimensional model.

Required controls:
- objective/surface selector;
- parameter x/y range and resolution;
- surface height/loss scale;
- camera orbit, pan, zoom and reset;
- contour overlay toggle;
- wireframe/surface toggle;
- grid and axis labels;
- selected step marker;
- optimizer trajectory show/hide;
- gradient vector toggle, if available;
- 2D contour / 3D surface switch;
- exact selected coordinate and objective value panel.

Correctness requirements:
- The surface function must be the same registered objective used by the training engine.
- The grid must record objective ID/version, parameter names, bounds, resolution and numeric precision.
- Do not interpolate a full-dimensional loss from two parameters unless a slice convention is explicitly defined.
- A slice must state what happens to all other parameters: fixed at initialization, fixed at selected checkpoint, projected, or another explicitly named convention.
- The trajectory marker must use recorded or deterministically derived parameter coordinates at the selected step.
- Do not draw missing trajectory points or invent unrecorded optimizer states.
- If the trace lacks parameter snapshots but has only scalar loss, show the loss chart and explain that a trajectory cannot be reconstructed.

Performance:
- Generate surface samples in a worker.
- Cache by objective version, parameter slice, bounds and resolution.
- Reuse geometry and material objects.
- Offer coarse/medium/high surface resolution tiers.
- Do not block the main thread during surface generation.

### 7.2 Optimizer trajectory viewer

**Purpose:** compare how optimizers traverse the same valid objective landscape.

Required controls:
- show/hide runs;
- selected run/optimizer;
- current step and play/pause;
- speed controls;
- trajectory tail length;
- 2D contour/3D surface;
- gradient direction and update vector toggles;
- step-by-step coordinate table;
- aligned run comparison.

Correctness requirements:
- All trajectories must share the same objective and compatible parameter coordinate system before overlay.
- If initial conditions differ, display them.
- Distinguish gradient vector from optimizer update vector. For momentum or Adam these are not generally identical.
- If one run has a different objective normalization, show a warning and prevent misleading overlays.

### 7.3 3D embeddings

Support three-dimensional projections of high-dimensional embeddings only when the trace or a supported transform provides them.

Required metadata:
- transform type and implementation/version;
- input feature dimension;
- sample count and sampling strategy;
- random seed when applicable;
- normalization and distance metric;
- relevant hyperparameters;
- label/color mapping;
- projection timestamp/source.

The UI must explain that 3D embedding coordinates are projections, may distort distances or global structure, and do not prove real clusters. Provide a 2D projection and a table/metadata option. Never silently re-project a saved embedding because the user switched views; that would change the meaning of the coordinates.

### 7.4 3D architecture explorer

Use 2D as the default for graph readability. Offer 3D only as an optional layout for users who benefit from spatial navigation.

Must support:
- collapse/expand layer groups;
- search for layer/operation names;
- selected layer details;
- input/output tensor shapes;
- parameter counts;
- connectivity and edge filtering;
- focus selected layer;
- keyboard selection and non-3D graph/table alternative.

Do not instantiate a separate mesh for every neuron/parameter in a large model. Aggregate, cluster, sample and virtualize. The details panel must say when a group represents an aggregate rather than every individual unit.

### 7.5 Volumetric and 3D tensor views

Only enable for actual 3D spatial/volumetric tensors or a well-defined volume representation. Provide slice planes, axis coordinates, voxel bounds, color map, opacity and exact selected value. Avoid volume rendering when a 2D heatmap or slice grid is clearer or more performant.

---

## 8. Replay synchronization architecture

### 8.1 Single selected-step state

The replay engine owns the selected step. Visualization panels subscribe to the same typed state; they must not maintain separate, competing step cursors.

```ts
export interface ReplayCursor {
  runId: string;
  stepIndex: number;
  stepValue: number;
  stepUnit: string;
  timestampMs?: number;
}

export interface VisualizationState {
  cursor: ReplayCursor;
  viewMode: ViewMode;
  selectedSeries: string[];
  selectedLayerId?: string;
  selectedDataPointId?: string;
  cameraPreset?: string;
}
```

### 8.2 Events

Recommended internal events:
- `replay:cursorChanged`
- `visualization:modeChanged`
- `visualization:selectionChanged`
- `visualization:cameraChanged`
- `trace:capabilitiesResolved`
- `trace:loaded`
- `trace:unloaded`
- `compare:runsChanged`

Use typed event contracts or a shared state store; do not use stringly typed global events throughout the app.

### 8.3 Step semantics

- Preserve the trace's declared step unit.
- Do not assume step index equals epoch, batch, iteration or optimizer update.
- Do not interpolate model parameters between snapshots unless the UI clearly labels the state as interpolated and the semantics permit it.
- For non-uniform logging cadence, show that data is missing between recorded samples.
- Cross-run alignment must use a declared alignment basis: update count, epoch, timestamp or another compatible unit.

---

## 9. Trace and capability requirements

The viewer must be capability-aware. A visualization may require scalar series, parameter snapshots, gradients, activations, images, labels, model graph metadata, prediction scores or external performance telemetry.

### 9.1 Minimum trace capabilities

- `metrics.scalar`
- `metrics.series`
- `parameters.summary`
- `parameters.snapshot`
- `gradients.summary`
- `gradients.snapshot`
- `activations.summary`
- `activations.snapshot`
- `model.graph`
- `model.layer_metadata`
- `evaluation.predictions`
- `evaluation.labels`
- `embeddings.vector`
- `dataset.summary`
- `dataset.samples` (privacy-sensitive; disabled for public traces by default)
- `system.telemetry`
- `objective.registered`
- `objective.slice_definition`
- `events.annotations`

Capabilities must be declared by the trace manifest or derived by a validated importer. Never infer that a trace contains full data because a single summary metric is present.

### 9.2 Import fidelity

For CSV, TensorBoard, MLflow or other supported source formats:
- show field mapping before import;
- show fields preserved, transformed, dropped and unsupported;
- preserve original step values and step units;
- warn about duplicate, missing or non-monotonic steps;
- retain source provenance and importer version;
- do not fabricate gradients, model parameters, activations or checkpoints;
- mark derived and sampled fields;
- report resulting trace conformance/capability level.

### 9.3 RVTS change management

If adding new 3D/embedding/volume requirements, update the RVTS specification and schema through versioned changes. Define whether data belongs inline or in external binary artifacts, how shape/dtype/byte length/checksum are declared, and how resource bounds are enforced. A visualization feature must not silently create a new unofficial trace field.

---

## 10. Performance and optimization strategy

### 10.1 Performance principles

1. Keep computation off the UI thread.
2. Load 3D code only when a 3D-capable view is opened or preloaded intentionally.
3. Avoid mounting multiple large WebGL canvases at once.
4. Pause rendering when the scene is hidden or not changing.
5. Reuse geometries, materials, textures and buffers.
6. Use instancing for repeated objects.
7. Avoid React state updates on every animation frame; update render objects through the graphics loop or a carefully scoped store.
8. Dispose GPU resources deterministically when a scene is released.
9. Use level-of-detail (LOD), sampling, virtualization and progressive rendering.
10. Make reduced-quality rendering an explicit, visible adaptation—not a change to the underlying data.

React Three Fiber's performance guidance specifically warns about expensive object creation, recommends reuse/instancing, and advises avoiding per-frame React state updates. See [R3F performance pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls) and [scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

### 10.2 Rendering profiles

| Profile | Typical target | Rendering behavior |
|---|---|---|
| High capability | Desktop/laptop with capable GPU | Full supported 3D, higher point/surface resolution |
| Standard | Typical modern laptop | Moderate scene complexity, capped point count and effects |
| Constrained | Low-power laptop/tablet | 2D default, lower geometry and reduced effects |
| Mobile | Phone | 2D default; 3D offered selectively if tested and responsive |
| No WebGL / context failure | Unsupported environment | Full 2D mode, informative explanation and retry option |

Do not rely on user-agent detection alone. Use feature detection and runtime performance signals. Keep the user's explicit preference, but explain when a requested 3D view cannot be rendered.

### 10.3 Data processing and downsampling

- Use Web Workers for surface generation, dimensionality reductions where feasible, large parsing and derived time-series calculations.
- Use typed arrays for numeric buffers.
- Transfer `ArrayBuffer` ownership where safe to avoid unnecessary copies; document ownership because transferred buffers are detached from the sender.
- Use a min/max or LTTB-style strategy for line-chart downsampling so important spikes and peaks are retained.
- For scatterplots, use deterministic sampling or density aggregation; indicate sample count and strategy.
- For histograms, compute bins from source values and preserve exact counts; do not downsample raw data before counting unless the method is explicitly approximate.
- For embeddings, persist transform metadata and deterministic seeds where applicable.
- For 3D surfaces, cap grid resolution per profile and reuse cached grids.

### 10.4 Initial performance targets

These are engineering targets to benchmark on named devices, not guarantees:

| Measurement | Initial target |
|---|---|
| Main-thread responsiveness during long computation | No long blocking computation; user input remains responsive |
| Typical 2D chart interaction | Smooth on the standard device profile |
| 3D scene interaction | Aim for 50–60 FPS on the high profile; graceful degradation on standard |
| Replay cursor propagation | Target under 100 ms for typical traces |
| Initial 3D code cost | Lazy-loaded; no 3D bundle on pages that do not need it |
| Surface generation | Worker-based with progress and cancellation |
| Memory | Record peak JS and GPU memory on benchmark fixtures; set budgets per supported device |
| Trace import | Streaming/worker-based for large files with explicit size limits |

Report median and p95 where measurable; record hardware, browser, data size, build version and rendering profile. Do not publish a benchmark number without its setup.

---

## 11. Responsive and accessible visualization UX

### 11.1 Responsive behavior

- **Desktop:** multi-panel workspace, side-by-side 2D/3D comparison where useful, full legends and controls.
- **Tablet:** one main visualization with collapsible inspector, reduced simultaneous scenes.
- **Mobile:** 2D-first, stacked panels, simplified controls, optional 3D for supported scenes, no hover-only features.
- All controls must remain reachable without horizontal page overflow.
- Use responsive camera defaults and touch-friendly hit areas.

### 11.2 Accessibility requirements

- Every chart/scene has a meaningful title, concise description and data summary.
- Provide a data table or equivalent structured list for exact values.
- Use keyboard navigation for mode selection, step selection, points/layers and camera reset.
- Do not use color as the only means of distinguishing runs/classes/series; add labels, line styles, markers or patterns.
- Maintain sufficient text/control contrast in dark and light modes.
- Respect `prefers-reduced-motion` and app-level reduced-motion preferences.
- Avoid automatic camera spins, flashing, constant particle motion and unnecessary parallax.
- Provide screen-reader labels for scene controls and status updates.
- For WebGL context loss, announce the failure and offer 2D fallback.
- Provide text explanations for depth and spatial relationships.

### 11.3 Visual design standards

- Keep RewindVerse's dark navy/slate foundation, cyan/blue/violet accents and semantic color tokens.
- Make grids, axes and annotations quiet but readable.
- Use glow sparingly; it must not lower contrast or obscure data.
- Reserve gradients for meaningful encoding or brand accents.
- Use consistent run colors across charts, 3D views, legends and reports.
- Provide colorblind-safe palettes and user-selectable themes.
- Use clear axis labels, units, range controls and zero/reference lines.

---

## 12. Security and privacy for visualizations

- Treat all imported traces, CSV files, images, tensors and model metadata as untrusted data.
- Validate schemas, data types, dimensions, declared byte lengths and maximum sizes before allocating large buffers.
- Prevent oversized arrays, decompression bombs and deeply nested payloads from exhausting memory.
- Never evaluate scripts, shader source, formulas, HTML, Python, JavaScript, notebooks or serialized executable objects embedded in trace files.
- Only use bundled, reviewed visualization components and shader programs.
- Sanitize user labels, layer names, annotations and chart titles before rendering as HTML.
- Escape text in tooltips; do not inject arbitrary trace strings as markup.
- Do not upload raw datasets, image samples, embeddings or trace content to analytics by default.
- Public sharing must strip or warn about sensitive fields and require explicit user confirmation.
- Set memory, point-count, mesh-resolution and texture-size limits.
- Avoid cross-origin asset loading from arbitrary trace-provided URLs.
- Use content-security policy and strict origin controls for any share viewer.

---

## 13. Product navigation and visualization workspace

Suggested Rewind Studio workspace structure:

```text
Rewind Studio
├── Overview
├── Experiments
│   ├── Runs
│   ├── Run comparison
│   └── Lineage
├── Replay
│   ├── Timeline
│   ├── Metrics
│   ├── Optimization
│   ├── 2D / 3D explorer
│   └── Events
├── Model Inspector
│   ├── Architecture
│   ├── Parameters
│   ├── Gradients
│   ├── Activations
│   └── Attention (supported models only)
├── Data Observatory
│   ├── Dataset summary
│   ├── Quality
│   ├── Distributions
│   ├── Embeddings
│   └── Drift
├── Evaluation
│   ├── Classification
│   ├── Regression
│   ├── Calibration
│   └── Explainability
├── Insights
│   ├── Diagnostics
│   └── Evidence reports
├── Academy
└── Settings
    ├── Visualization preferences
    ├── Accessibility
    └── Performance profile
```

Hide or mark unavailable modules when the current trace lacks the required data. Do not show empty feature panels that imply the user did something wrong.

---

## 14. Visualization design system and component contract

Each visualization component should expose a common interface. Prefer package-level contracts over one giant `Chart` component with dozens of unrelated optional props.

```ts
export interface VisualizationProps<TData> {
  data: TData;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  cursor?: ReplayCursor;
  capabilities: Set<string>;
  loading?: boolean;
  error?: VisualizationError;
  onSelectionChange?: (selection: VisualizationSelection) => void;
  onRequestTable?: () => void;
}

export interface VisualizationSelection {
  sourceId: string;
  stepIndex?: number;
  pointId?: string;
  coordinates?: Record<string, number>;
}
```

Required visual states:
- loading/progress;
- ready;
- empty/no data;
- unsupported capability;
- invalid data;
- worker failed/cancelled;
- WebGL unavailable/context lost;
- partial data;
- privacy restricted;
- stale/derived projection warning.

No component should silently substitute fabricated or random data in production. Demo data must be explicitly labelled as demo/sample data.

---

## 15. User stories and acceptance criteria

### US-VIS-001 — Choose 2D or 3D

**As a user**, I want to choose 2D or 3D for supported visualizations, so I can use the representation that helps me understand the data.

Acceptance:
- The selector appears on visualizations with multiple supported modes.
- Changing mode preserves selected step, filters, run, metric and annotations.
- The new mode reflects the same underlying values.
- The preference is remembered at the defined preference scope.
- Unsupported 3D views explain why 2D is the correct/available representation.

### US-VIS-002 — Replay synchronization

**As a user**, I want every linked panel to follow the same selected step, so I can compare training state across visualizations.

Acceptance:
- Moving the replay cursor updates all compatible panels.
- Missing samples are shown as missing; no implicit interpolation.
- The step unit is always visible.
- Selecting a point updates the common cursor when it maps to a trace step.

### US-VIS-003 — 3D loss landscape

**As a user**, I want to rotate and inspect the objective surface and optimizer path, so I can understand how updates move through the objective.

Acceptance:
- Only registered objectives/valid parameter slices can render.
- Axis names, units, objective ID and slice convention are visible.
- Selected training point maps to the actual recorded step state.
- Surface generation runs in a worker and can be cancelled.
- A linked 2D contour view exists.

### US-VIS-004 — Accessible alternative

**As a keyboard or screen-reader user**, I want to inspect chart data without relying on a 3D pointer interaction.

Acceptance:
- A structured table or equivalent is available.
- All important controls are keyboard accessible.
- Color is not the only encoding.
- Reduced motion is respected.

### US-VIS-005 — Performance fallback

**As a user on a constrained device**, I want the product to remain useful when 3D is unavailable or slow.

Acceptance:
- The application detects unsupported rendering or WebGL context loss.
- A working 2D equivalent is offered whenever valid.
- The current selection and replay cursor are preserved.
- The user receives a clear, non-alarming explanation.

---

## 16. Testing strategy

### 16.1 Numerical and semantic tests

- Surface values match the registered objective function within a defined tolerance.
- Finite-difference gradient checks validate computed gradients.
- Optimizer trajectory coordinates match recorded parameter snapshots.
- 2D and 3D modes use the same source records and selected-step semantics.
- Projection metadata is retained and visible.
- Axis units, sign, normalization and coordinate order are tested.
- Missing capability never results in fabricated data.

### 16.2 UI tests

- Switch 2D → 3D → 2D and verify state preservation.
- Change replay step and verify all linked panels update.
- Change run/series selection and verify stable color identity.
- Resize desktop/tablet/mobile and verify no overflow or unreachable controls.
- Enable reduced motion and verify non-essential movement stops.
- Simulate WebGL unsupported/context-loss states and verify fallback.
- Test keyboard-only operation and screen-reader descriptions.

### 16.3 Performance tests

Benchmark each visualization separately and in the maximum supported workspace combination:
- trace load/parse time;
- worker compute time;
- surface generation time;
- frame rate and long frames;
- memory/geometry/texture counts;
- replay cursor propagation latency;
- teardown and route navigation memory leaks;
- mobile performance and thermal/battery impact where feasible.

### 16.4 Security tests

- malicious labels and annotations;
- malformed trace dimensions;
- oversized point/mesh requests;
- gzip expansion limits;
- deeply nested JSON;
- invalid tensor dtypes/shapes;
- unsafe external URLs;
- CSP and origin controls;
- public share privacy filtering.

---

## 17. Implementation roadmap

This is an additive roadmap for the started project. Confirm the live repository state before assigning the work; an existing implementation may already satisfy some items.

### Phase 0 — Repository audit and alignment

- Inventory existing chart components, data contracts and state management.
- Confirm whether the replay engine already owns a canonical cursor.
- Confirm RVTS capabilities for parameters, objective metadata, snapshots, embeddings and evaluation predictions.
- Identify duplicated chart libraries and remove unnecessary overlap.
- Add a visualization capability registry and support matrix.

**Exit criteria:** every current visualization is mapped to data requirements, supported modes and a test owner.

### Phase 1 — Universal 2D/3D choice foundation (P0)

- Add common mode selector and preference model.
- Add capability-aware mode eligibility.
- Add synchronized selection and replay cursor contract.
- Build 2D table/accessible alternatives.
- Implement 2D/3D state parity tests.
- Add unsupported renderer fallback.

**Exit criteria:** user can choose modes for a prototype chart, switch repeatedly without state loss and verify the same step/value in both modes.

### Phase 2 — Core 3D optimization lab (P0)

- Add Three.js/R3F scene package.
- Build registered objective surface sampler.
- Add 3D loss surface + 2D contour paired view.
- Add optimizer trajectory from actual trace snapshots.
- Add selected-step marker and synchronized replay.
- Add worker computation, cache, quality profile and teardown tests.

**Exit criteria:** a deterministic training run can be replayed in both modes with mathematically verified coordinates and objective values.

### Phase 3 — Essential visual analytics (P1)

- Add metric curves, learning-rate, gradient norm, weight norm and update magnitude.
- Add gradient/weight distributions and histograms.
- Add run comparison, small multiples and parameter-vs-metric charts.
- Add classification and regression evaluation panels.
- Add architecture graph and layer summaries.

**Exit criteria:** the product covers the main needs for common training and evaluation workflows with valid capabilities and complete data inspection.

### Phase 4 — Data and explainability (P1/P2)

- Add dataset summary, class balance, missingness, correlation and distribution shift.
- Add PCA/UMAP/t-SNE embedding projector with method metadata and 2D/3D projection views.
- Add feature importance, PDP/ICE and SHAP-compatible imports/visualizations where values are actually supplied or computed by a trusted integration.
- Add privacy controls for sample data and embeddings.

**Exit criteria:** each diagnostic has provenance, limitations, and appropriate data requirements.

### Phase 5 — Deep learning and specialized views (P2)

- Add activation heatmaps, feature-map grids and gradient-flow summaries.
- Add attention matrix/head inspection for supported models.
- Add 3D volumetric views only for actual 3D tensor data.
- Add optional 3D architecture layout if user testing proves value.

**Exit criteria:** architecture and tensor views remain usable on representative model sizes and include aggregation/LOD explanations.

### Phase 6 — Market-ready visualization experience (P1/P2)

- User-selectable dashboards and saved layouts.
- Shareable read-only visualization reports with privacy review.
- Export charts and reports with provenance metadata.
- Keyboard shortcuts, responsive testing and accessibility audit.
- Public demo traces and guided lessons.
- User research comparing RewindVerse workflows with existing tools.

**Exit criteria:** target users complete real analysis tasks, understand the 2D/3D controls and can explain the value beyond standard tracking dashboards.

---

## 18. Market-readiness requirements

“Market available” should mean more than a long feature list. RewindVerse should be dependable for real workflows and clear about supported formats/model types.

### 18.1 Minimum market-ready visualization experience

- 2D metrics/optimization charts;
- selectable 2D/3D loss landscape for registered objectives;
- optimizer trajectory synchronized to replay;
- run comparison and diagnostics;
- architecture/layer summaries for supported model types;
- capability-aware import center;
- Python SDK and at least one tested framework integration;
- responsive 2D experience and selective mobile 3D;
- data table and export for charts;
- privacy-first share links;
- clear supported-format matrix and known limitations.

### 18.2 User validation programme

Conduct task-based tests with:
- ML learners;
- instructors/teaching assistants;
- Python/ML developers;
- users of TensorBoard, MLflow, W&B or similar tools.

Ask participants to:
1. inspect a loss curve and diagnose an issue;
2. switch the same objective between 2D and 3D;
3. identify the optimizer's current parameter state;
4. compare two runs;
5. explain a diagnostic and its evidence;
6. import a trace and identify which visualizations are supported.

Record completion, time, errors, confusion, assistance required and whether users can correctly explain what the chart does and does not prove.

### 18.3 Suggested target metrics

These are hypotheses to test, not guarantees:
- at least 80% of test participants complete the core 2D/3D switch and replay task without assistance in the final usability round;
- no loss of selected step or filters during mode changes;
- all displayed 3D points map to trace records or explicitly declared derived coordinates;
- 100% of supported visualization types have a data contract, empty/error state and test coverage;
- all public demo traces disclose sample/demo status;
- repeat use and share behaviour are measured during beta.

---

## 19. Product and engineering backlog

### P0 — Must ship before first advanced demo

- [ ] Audit repository and mark existing functionality accurately.
- [ ] Add a centralized visualization capability registry.
- [ ] Implement 2D/3D/Auto mode selector and saved preferences.
- [ ] Preserve current run, step, filters and selection when switching modes.
- [ ] Build 2D table/accessible alternative.
- [ ] Implement WebGL-unavailable/context-lost fallback.
- [ ] Implement 3D loss surface for registered toy objectives.
- [ ] Implement 2D contour and synchronized 3D trajectory.
- [ ] Compute surface/derived data in workers with cancellation.
- [ ] Add objective/gradient/trajectory numeric parity tests.
- [ ] Add GPU resource cleanup and leak tests.
- [ ] Add responsive desktop/tablet/mobile mode behavior.

### P1 — Product completeness

- [ ] Loss, metric, learning-rate, gradient norm and weight norm charts.
- [ ] Gradient/parameter histograms and distribution panels.
- [ ] Optimizer state summaries.
- [ ] Run overlay, small multiples and comparison table.
- [ ] Confusion matrix, ROC, PR, calibration and regression diagnostics.
- [ ] Model architecture graph with searchable/collapsible nodes.
- [ ] CSV import mapping and fidelity report.
- [ ] TensorBoard scalar importer or another validated importer.
- [ ] Python SDK recording examples and one framework integration.
- [ ] Data table/export for key charts.
- [ ] Accessibility and keyboard audits.

### P2 — Advanced ML visualization coverage

- [ ] PCA/UMAP/t-SNE projector, 2D and 3D.
- [ ] Data quality, missingness, correlation and drift views.
- [ ] Explainability views: SHAP-compatible summary/waterfall/dependence, PDP/ICE.
- [ ] Activation and gradient-flow panels.
- [ ] Feature-map/filter visualization.
- [ ] Attention matrix/head viewer for supported model traces.
- [ ] 3D volume view for genuine volumetric data.
- [ ] Decision surfaces for two-feature models.
- [ ] Rewind Insights evidence reports.
- [ ] Saved dashboards and report templates.

### P3 — Long-term platform depth

- [ ] Transformer internals and token-level analysis.
- [ ] CNN/vision activation exploration.
- [ ] Advanced model evaluation and subgroup analysis.
- [ ] Classroom workflows and guided challenges.
- [ ] Custom visualization plugin API with strict sandbox/security review.
- [ ] Optional WebGPU renderer after compatibility and benchmark gates.
- [ ] Advanced distributed training telemetry integrations.

---

## 20. Release gates

Do not declare visualization readiness based on screenshot quality alone.

### Gate A — Data correctness
- Every panel maps to declared trace fields/capabilities.
- No data is fabricated or silently interpolated.
- Axis units and transform metadata are correct.
- 2D and 3D views show the same selected record/state.

### Gate B — Interaction correctness
- Mode selection persists at the defined scope.
- Replay cursor remains synchronized.
- Keyboard and touch interactions work.
- Selection and filters survive route and mode changes.

### Gate C — Performance and resilience
- Worker operations can be cancelled.
- Large traces have limits and progressive loading.
- WebGL failure has a usable fallback.
- GPU resources are disposed and no route-navigation leaks are observed.

### Gate D — Security and privacy
- Untrusted data is validated and bounded.
- Arbitrary code/shaders are never executed.
- Private traces do not enter analytics payloads.
- Sharing is explicit and access-controlled.

### Gate E — User value
- Target users complete tasks successfully.
- 3D adds understanding beyond 2D for the use cases where it is offered.
- The interface explains when 2D is preferable or when 3D is only a projection.

---

## 21. Risks and mitigations

| Risk | Consequence | Mitigation |
|---|---|---|
| 3D added for every chart | More complexity without analytical value | Semantic 3D eligibility rules; keep 2D first-class |
| Misleading high-dimensional loss surface | Users misunderstand model optimization | Registered objective or explicit parameter slice; visible caveat |
| Excessive number of chart libraries | Bundle bloat and inconsistent UX | One primary 2D stack and one 3D stack |
| GPU memory leaks | Crashes and poor long-session performance | Resource lifecycle rules and browser tests |
| Large trace data | Freezes or high memory usage | Streaming parsing, workers, caps and progressive rendering |
| 3D-only interface | Excludes mobile/keyboard/low-power users | 2D and table alternatives; accessibility requirements |
| Embedding projection misread as ground truth | Incorrect conclusions | Show transform, seed, sample and distortion limitations |
| Capability overclaim | Users expect panels unsupported by trace | Capability registry and honest empty states |
| Privacy leakage through visuals | Exposure of sensitive samples/embeddings | Local-first defaults, share review and analytics minimization |
| Overbuilding visualization catalogue | Delays core product | Prioritized roadmap and release gates |

---

## 22. Definition of done for any new visualization

A visualization is not complete until all the following exist:

1. Product purpose and user task.
2. Data requirements and RVTS capability mapping.
3. 2D/3D support decision and rationale.
4. Mathematical/semantic definition and provenance label.
5. 2D implementation where meaningful.
6. 3D implementation only if valid and useful.
7. Mode switch with state parity where both modes exist.
8. Empty, loading, error, unsupported and privacy-restricted states.
9. Data table or equivalent precise inspection path.
10. Keyboard, screen-reader and reduced-motion behavior.
11. Responsive layouts and constrained-device fallback.
12. Numerical, interaction, security and performance tests.
13. Documentation and demo trace.
14. Benchmark results from named device profiles.
15. Clear known limitations.

---

## 23. Decisions to preserve across the project

- **2D and 3D are user choices**, not competing product modes.
- **Auto is optional convenience**, not a mechanism to override explicit preference.
- **2D remains the reliable baseline** for accessibility, mobile and many analytical tasks.
- **3D must be semantically justified** and may be unavailable for some chart families.
- **One replay cursor and one source of truth** drive all synchronized views.
- **Capability-aware rendering** determines what can be shown.
- **Data provenance is visible**: recorded, derived, projected, sampled or illustrative.
- **Do not invent data** to fill an impressive visualization.
- **Performance is part of product quality**, not a later optimization.
- **Market readiness is demonstrated by user tasks and verified interoperability**, not the number of chart types in a menu.

---

## 24. Reference material

### ML visualization products and market patterns

- [TensorBoard — Get started](https://www.tensorflow.org/tensorboard/get_started)
- [TensorBoard project](https://github.com/tensorflow/tensorboard)
- [PyTorch TensorBoard utilities](https://docs.pytorch.org/docs/main/utils/tensorboard.html)
- [MLflow Tracking](https://mlflow.org/docs/latest/tracking/)
- [MLflow trace UI](https://www.mlflow.org/docs/latest/genai/tracing/observe-with-traces/ui/)
- [Neptune widgets](https://docs.neptune.ai/widgets)
- [Neptune dashboards](https://docs.neptune.ai/3.20251006/custom_dashboard)
- [Neptune run comparison](https://docs.neptune.ai/select_runs)

### Visualization technologies

- [D3](https://d3js.org/)
- [Three.js](https://threejs.org/docs/)
- [React Three Fiber](https://r3f.docs.pmnd.rs/)
- [R3F performance pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls)
- [R3F scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [Plotly.js](https://plotly.com/javascript/)
- [Apache ECharts](https://echarts.apache.org/en/)

### Implementation note

Library APIs, supported browser features, licenses and performance characteristics change. Before implementation, verify the current official documentation and lock supported versions in the repository. Benchmark the actual application and real trace fixtures; documentation statements do not replace project testing.

---

## 25. Final recommendation

Do not try to ship every visualization type at once. Build a visualization platform that can grow without losing correctness:

1. Implement the universal 2D/3D/Auto choice and capability registry.
2. Complete the synchronized 2D chart + 3D loss landscape + optimizer replay vertical slice.
3. Add the high-value 2D ML analytics catalogue.
4. Add embeddings, data quality, evaluation and explainability views.
5. Add advanced architecture, activation, attention and volumetric experiences only for supported trace data.
6. Validate with real learners, instructors and Python ML developers.

The goal is not to make RewindVerse the product with the most visual effects. The goal is to make it one of the clearest places to understand, inspect, replay and explain machine-learning behavior—whether the user chooses 2D or 3D.
