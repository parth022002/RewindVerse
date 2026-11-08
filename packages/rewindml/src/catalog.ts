export type AlgorithmProvenance =
  | "native"
  | "adapter"
  | "imported"
  | "declarative-custom"
  | "illustrative";

export type AlgorithmCategory =
  | "Optimization"
  | "Supervised ML"
  | "Unsupervised ML"
  | "Deep Learning"
  | "Generative AI"
  | "Reinforcement Learning"
  | "Metrics & Diagnostics";

export type AlgorithmPriority = "P0" | "P1" | "P2" | "P3";

export interface HyperparameterMeta {
  name: string;
  type: "number" | "boolean" | "string" | "select";
  defaultVal: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  description: string;
}

export interface AlgorithmEntry {
  id: string;
  name: string;
  category: AlgorithmCategory;
  priority: AlgorithmPriority;
  provenance: AlgorithmProvenance;
  tagline: string;
  description: string;
  mathEquation: string;
  learningObjectives: string[];
  assumptions: string[];
  hyperparameters: HyperparameterMeta[];
  traceCapabilities: string[];
  visualizationModes: ("2D" | "3D" | "Auto")[];
  demoRoute?: string;
  forkable: boolean;
  status: "verified" | "preview" | "proposed";
}

export const ALGORITHM_CATALOG: AlgorithmEntry[] = [
  // --- OPTIMIZATION ---
  {
    id: "optim.sgd",
    name: "Stochastic Gradient Descent (SGD)",
    category: "Optimization",
    priority: "P0",
    provenance: "native",
    tagline: "First-order iterative gradient descent with batch sampling",
    description: "Updates model parameters in the opposite direction of the gradient of the objective function evaluated on a batch of training samples.",
    mathEquation: "\\theta_{t+1} = \\theta_t - \\eta g_t",
    learningObjectives: [
      "Observe learning rate sensitivity (divergence vs stagnation)",
      "Understand gradient noise and stochastic oscillations in ravines",
      "Inspect parameter step vectors along loss contours"
    ],
    assumptions: [
      "Objective is locally differentiable",
      "Stochastic mini-batch gradient is an unbiased estimator of true gradient",
      "Learning rate is bounded within Lipschitz continuity limits"
    ],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.1, min: 0.0001, max: 2.0, step: 0.01, description: "Step size scale factor" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot", "optimizer.learning_rate"],
    visualizationModes: ["2D", "3D", "Auto"],
    demoRoute: "/studio/lab?objective=quadratic&optimizer=sgd&lr=0.1",
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.momentum",
    name: "Polyak Momentum",
    category: "Optimization",
    priority: "P0",
    provenance: "native",
    tagline: "Accelerates gradient vectors in persistent directions",
    description: "Accumulates an exponentially decaying velocity vector in directions of consistent descent, dampening high-frequency oscillations across steep ravines.",
    mathEquation: "v_t = \\beta v_{t-1} + \\eta g_t, \\quad \\theta_{t+1} = \\theta_t - v_t",
    learningObjectives: [
      "Understand inertia and momentum velocity dampening",
      "Observe how momentum overcomes anisotropic ill-conditioned curvature",
      "Detect and inspect overshoot near sharp local minima"
    ],
    assumptions: [
      "Smooth underlying gradient surfaces",
      "Momentum parameter beta is within [0, 1)"
    ],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.08, min: 0.0001, max: 2.0, step: 0.01, description: "Base step size" },
      { name: "momentum", type: "number", defaultVal: 0.85, min: 0.0, max: 0.99, step: 0.05, description: "Exponential decay coefficient for velocity" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot", "optimizer.state.summary"],
    visualizationModes: ["2D", "3D", "Auto"],
    demoRoute: "/studio/lab?objective=quadratic&optimizer=momentum&lr=0.08&momentum=0.85",
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.adam",
    name: "Adam (Adaptive Moment Estimation)",
    category: "Optimization",
    priority: "P0",
    provenance: "native",
    tagline: "Computes adaptive learning rates from 1st & 2nd gradient moments",
    description: "Maintains exponential moving averages of both the gradient (1st moment) and the squared gradient (2nd uncentered moment), with step-wise bias correction.",
    mathEquation: "\\hat{m}_t = \\frac{m_t}{1-\\beta_1^t}, \\; \\hat{v}_t = \\frac{v_t}{1-\\beta_2^t}, \\; \\theta_{t+1} = \\theta_t - \\frac{\\eta \\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon}",
    learningObjectives: [
      "Analyze first moment (momentum) and second moment (variance) scaling",
      "Inspect initial step bias-correction curves",
      "Observe invariance to gradient scale across ill-conditioned coordinates"
    ],
    assumptions: [
      "Non-stationary objectives with sparse or noisy gradients",
      "Beta coefficients satisfy 0 <= beta1, beta2 < 1"
    ],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.1, min: 0.0001, max: 1.0, step: 0.01, description: "Base step size" },
      { name: "beta1", type: "number", defaultVal: 0.9, min: 0.5, max: 0.999, step: 0.01, description: "Exponential decay for 1st moment" },
      { name: "beta2", type: "number", defaultVal: 0.999, min: 0.8, max: 0.9999, step: 0.001, description: "Exponential decay for 2nd moment" },
      { name: "epsilon", type: "number", defaultVal: 1e-8, min: 1e-12, max: 1e-4, step: 1e-8, description: "Numerical division stability epsilon" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot", "optimizer.state.summary"],
    visualizationModes: ["2D", "3D", "Auto"],
    demoRoute: "/studio/lab?objective=quadratic&optimizer=adam&lr=0.1",
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.adamw",
    name: "AdamW (Decoupled Weight Decay)",
    category: "Optimization",
    priority: "P1",
    provenance: "native",
    tagline: "Decouples L2 regularization from adaptive gradient updates",
    description: "Fixes the weight decay distortion in classical Adam by subtracting the regularization term directly from parameters rather than blending into gradient moments.",
    mathEquation: "\\theta_{t+1} = \\theta_t - \\frac{\\eta \\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon} - \\eta \\lambda \\theta_t",
    learningObjectives: [
      "Differentiate between L2 gradient regularization and true weight decay",
      "Understand why decoupled decay yields superior generalization in deep networks",
      "Compare Adam vs AdamW parameter shrinkage paths"
    ],
    assumptions: [
      "Weight decay parameter lambda >= 0",
      "Decoupled penalty operates independently of historical gradient variance"
    ],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.05, min: 0.0001, max: 1.0, step: 0.01, description: "Learning rate" },
      { name: "weightDecay", type: "number", defaultVal: 0.01, min: 0.0, max: 0.2, step: 0.005, description: "Decoupled weight decay coefficient" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot", "optimizer.state.summary"],
    visualizationModes: ["2D", "3D", "Auto"],
    demoRoute: "/studio/lab?objective=quadratic&optimizer=adamw&lr=0.05",
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.rmsprop",
    name: "RMSProp",
    category: "Optimization",
    priority: "P1",
    provenance: "native",
    tagline: "Adaptive learning rate with exponentially discounted squared gradients",
    description: "Maintains a running average of squared gradients, dividing the step by the root of this average to resolve Adagrad's diminishing learning rate problem.",
    mathEquation: "v_t = \\alpha v_{t-1} + (1-\\alpha) g_t^2, \\quad \\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{v_t} + \\epsilon} g_t",
    learningObjectives: [
      "Inspect moving average variance adjustment",
      "Observe stabilization over non-stationary loss valleys",
      "Compare step sizes between steep and shallow coordinates"
    ],
    assumptions: ["Decay rate alpha in (0, 1), typically 0.9 or 0.99"],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.01, min: 0.0001, max: 1.0, step: 0.005, description: "Learning rate" },
      { name: "decayRate", type: "number", defaultVal: 0.99, min: 0.8, max: 0.999, step: 0.01, description: "Decay factor alpha" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot", "optimizer.state.summary"],
    visualizationModes: ["2D", "3D", "Auto"],
    demoRoute: "/studio/lab?objective=quadratic&optimizer=rmsprop&lr=0.01",
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.adagrad",
    name: "Adagrad",
    category: "Optimization",
    priority: "P1",
    provenance: "native",
    tagline: "Adapts learning rate to parameter update frequency",
    description: "Scales per-parameter learning rate inversely proportional to the square root of the sum of all historical squared gradients.",
    mathEquation: "G_t = G_{t-1} + g_t^2, \\quad \\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{G_t} + \\epsilon} g_t",
    learningObjectives: [
      "Observe monotonic accumulation of squared gradients",
      "Understand why early steep steps cause later learning rate starvation",
      "Contrast sparse coordinate acceleration against dense coordinate dampening"
    ],
    assumptions: ["Frequent features receive smaller updates; rare features receive larger updates"],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.1, min: 0.001, max: 1.0, step: 0.01, description: "Initial step scale" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    demoRoute: "/studio/lab?objective=quadratic&optimizer=adagrad&lr=0.1",
    forkable: true,
    status: "verified"
  },

  // --- SUPERVISED ML ---
  {
    id: "supervised.linear_regression",
    name: "Ordinary Least Squares (OLS) Linear Regression",
    category: "Supervised ML",
    priority: "P0",
    provenance: "native",
    tagline: "Fits linear hyperplanes by minimizing residual sum of squares",
    description: "Models continuous target variables as a weighted linear combination of input features with analytical normal equation or gradient descent fitting.",
    mathEquation: "\\hat{y} = Xw + b, \\quad J(w,b) = \\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2",
    learningObjectives: [
      "Understand residual sum of squares minimization",
      "Inspect parameter trajectory in coefficient space",
      "Examine residuals and leverage points"
    ],
    assumptions: [
      "Linear relationship between features and target",
      "Homoscedasticity (constant variance of errors)",
      "Zero collinearity among features"
    ],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.05, min: 0.001, max: 1.0, step: 0.01, description: "GD step rate" },
      { name: "maxEpochs", type: "number", defaultVal: 50, min: 10, max: 500, step: 10, description: "Training epochs" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot", "predictions.sample"],
    visualizationModes: ["2D", "3D", "Auto"],
    demoRoute: "/studio/lab",
    forkable: true,
    status: "verified"
  },
  {
    id: "supervised.ridge",
    name: "Ridge Regression (L2 Regularization)",
    category: "Supervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Linear regression with coefficient shrinkage via L2 penalty",
    description: "Penalizes large weights by adding the squared Euclidean norm of coefficients to the MSE objective, preventing overfitting and conditioning multicollinear data.",
    mathEquation: "J(w,b) = \\frac{1}{n}\\|y - (Xw + b)\\|^2_2 + \\lambda \\|w\\|^2_2",
    learningObjectives: [
      "Observe coefficient shrinkage toward zero as lambda increases",
      "Understand bias-variance tradeoff under L2 regularization",
      "Inspect spherical constraint boundary in parameter space"
    ],
    assumptions: ["Feature centering and standard scaling prior to penalty application"],
    hyperparameters: [
      { name: "lambda", type: "number", defaultVal: 0.1, min: 0.001, max: 10.0, step: 0.05, description: "L2 penalty strength" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    demoRoute: "/studio/lab",
    forkable: true,
    status: "verified"
  },
  {
    id: "supervised.lasso",
    name: "Lasso Regression (L1 Regularization)",
    category: "Supervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Sparse feature selection via L1 penalty",
    description: "Adds the absolute sum of coefficients to the loss, driving non-essential feature weights to exactly zero along diamond constraint corners.",
    mathEquation: "J(w,b) = \\frac{1}{n}\\|y - (Xw + b)\\|^2_2 + \\lambda \\|w\\|_1",
    learningObjectives: [
      "Observe exact coefficient zeroing (sparsity)",
      "Contrast L1 diamond geometry with L2 spherical contours",
      "Understand automatic feature selection properties"
    ],
    assumptions: ["Subgradient or coordinate descent optimization required at non-differentiable zero crossings"],
    hyperparameters: [
      { name: "lambda", type: "number", defaultVal: 0.05, min: 0.001, max: 5.0, step: 0.02, description: "L1 penalty strength" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    demoRoute: "/studio/lab",
    forkable: true,
    status: "verified"
  },
  {
    id: "supervised.logistic_regression",
    name: "Binary Logistic Regression",
    category: "Supervised ML",
    priority: "P0",
    provenance: "native",
    tagline: "Sigmoidal probability mapping for linear classification",
    description: "Applies the logistic sigmoid transformation to linear logits to output calibrated posterior class probabilities optimized via binary cross-entropy.",
    mathEquation: "p = \\sigma(Xw + b), \\quad J(w,b) = -\\frac{1}{n} \\sum_{i=1}^n [y_i \\log p_i + (1 - y_i) \\log(1 - p_i)]",
    learningObjectives: [
      "Observe decision boundary hyperplane rotation during training",
      "Examine probability field confidence and cross-entropy curvature",
      "Inspect classification accuracy and loss convergence synchronization"
    ],
    assumptions: [
      "Bernoulli distributed outcomes conditioned on input",
      "Linear log-odds relationship"
    ],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.2, min: 0.01, max: 2.0, step: 0.05, description: "Learning rate" },
      { name: "maxEpochs", type: "number", defaultVal: 40, min: 10, max: 200, step: 5, description: "Epochs" }
    ],
    traceCapabilities: ["metrics.loss", "metrics.task", "parameters.snapshot", "gradients.summary"],
    visualizationModes: ["2D", "3D", "Auto"],
    demoRoute: "/studio/lab",
    forkable: true,
    status: "verified"
  },
  {
    id: "supervised.knn",
    name: "k-Nearest Neighbors (kNN)",
    category: "Supervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Non-parametric instance-based majority voting",
    description: "Stores training instances and classifies query vectors based on the majority label among its k-nearest neighbors in metric space.",
    mathEquation: "\\hat{y}(x) = \\mathrm{mode} \\{ y_i : x_i \\in N_k(x) \\}",
    learningObjectives: [
      "Understand Voronoi tessellation and decision boundary complexity",
      "Observe the effect of k on boundary smoothness (overfitting vs underfitting)",
      "Inspect Euclidean vs Manhattan distance metrics"
    ],
    assumptions: ["Feature distances reflect meaningful semantic similarity; scaling is mandatory"],
    hyperparameters: [
      { name: "k", type: "number", defaultVal: 5, min: 1, max: 31, step: 2, description: "Number of nearest neighbors" }
    ],
    traceCapabilities: ["predictions.sample"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: false,
    status: "preview"
  },
  {
    id: "supervised.decision_tree",
    name: "Decision Tree (CART)",
    category: "Supervised ML",
    priority: "P1",
    provenance: "adapter",
    tagline: "Recursive axis-aligned feature space partitioning",
    description: "Recursively splits feature space into rectangular regions by maximizing information gain or minimizing Gini impurity at each decision node.",
    mathEquation: "\\mathrm{Gini}(D) = 1 - \\sum_{k=1}^K p_k^2, \\quad \\Delta \\mathrm{Gini} = \\mathrm{Gini}(D) - \\sum_v \\frac{|D_v|}{|D|} \\mathrm{Gini}(D_v)",
    learningObjectives: [
      "Visualize recursive rectangular space partitions",
      "Inspect tree depth vs overfitting trade-off",
      "Evaluate feature importance from impurity reduction"
    ],
    assumptions: ["Axis-aligned decision boundaries sufficient for target separation"],
    hyperparameters: [
      { name: "maxDepth", type: "number", defaultVal: 4, min: 1, max: 12, step: 1, description: "Maximum tree depth" }
    ],
    traceCapabilities: ["metrics.task", "predictions.sample"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: false,
    status: "preview"
  },

  // --- UNSUPERVISED ML ---
  {
    id: "unsupervised.kmeans",
    name: "K-Means Clustering",
    category: "Unsupervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Iterative expectation-maximization centroid partitioning",
    description: "Partitions n observations into k clusters by iteratively assigning each point to the closest centroid and recomputing centroids as cluster means.",
    mathEquation: "\\arg\\min_S \\sum_{i=1}^k \\sum_{x \\in S_i} \\|x - \\mu_i\\|^2",
    learningObjectives: [
      "Observe step-by-step centroid migration trajectories",
      "Inspect Voronoi boundary shifts at each assignment step",
      "Analyze sensitivity to initial centroid placement (K-Means++)"
    ],
    assumptions: ["Spherical clusters of similar variance and size", "Euclidean metric applicability"],
    hyperparameters: [
      { name: "k", type: "number", defaultVal: 3, min: 2, max: 8, step: 1, description: "Number of clusters" },
      { name: "maxIter", type: "number", defaultVal: 20, min: 5, max: 100, step: 5, description: "Max EM iterations" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot", "predictions.sample"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "unsupervised.pca",
    name: "Principal Component Analysis (PCA)",
    category: "Unsupervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Orthogonal linear projection onto maximum variance directions",
    description: "Computes orthogonal eigenvectors of the empirical covariance matrix, projecting high-dimensional data onto lower-dimensional principal components.",
    mathEquation: "X^T X v_i = \\lambda_i v_i, \\quad \\mathrm{EVR}_i = \\frac{\\lambda_i}{\\sum_j \\lambda_j}",
    learningObjectives: [
      "Understand variance preservation across orthogonal axes",
      "Inspect scree plot and cumulative explained variance ratio",
      "Interact with 2D and 3D projected point clouds"
    ],
    assumptions: ["Linear subspace captures the primary variance in the feature distribution"],
    hyperparameters: [
      { name: "nComponents", type: "number", defaultVal: 3, min: 2, max: 10, step: 1, description: "Number of principal axes to extract" }
    ],
    traceCapabilities: ["embeddings.snapshot", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    demoRoute: "/studio/embeddings",
    forkable: false,
    status: "verified"
  },

  // --- NEURAL NETWORKS ---
  {
    id: "neural.mlp",
    name: "Multi-Layer Perceptron (MLP)",
    category: "Deep Learning",
    priority: "P0",
    provenance: "native",
    tagline: "Feedforward dense network trained via backpropagation",
    description: "Composes affine linear transformations with non-linear activation functions (ReLU, GELU, Sigmoid) trained end-to-end using automatic reverse-mode differentiation.",
    mathEquation: "a^{(l)} = \\sigma(W^{(l)} a^{(l-1)} + b^{(l)}), \\quad \\delta^{(l)} = ((W^{(l+1)})^T \\delta^{(l+1)}) \\odot \\sigma'(z^{(l)})",
    learningObjectives: [
      "Inspect forward activation propagation and backward gradient flow",
      "Detect vanishing or exploding gradients across deep layers",
      "Observe non-linear decision boundary warping on complex datasets"
    ],
    assumptions: ["Continuous differentiability of activation functions almost everywhere"],
    hyperparameters: [
      { name: "hiddenUnits", type: "number", defaultVal: 16, min: 4, max: 64, step: 4, description: "Neurons per hidden layer" },
      { name: "learningRate", type: "number", defaultVal: 0.05, min: 0.001, max: 1.0, step: 0.01, description: "Step size" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.tensor", "activations.tensor", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "neural.attention",
    name: "Scaled Dot-Product Attention",
    category: "Deep Learning",
    priority: "P1",
    provenance: "native",
    tagline: "Contextual query-key-value routing mechanism",
    description: "Computes pairwise query-key compatibility scores scaled by the square root of key dimensionality, outputting a weighted sum over value vectors.",
    mathEquation: "\\mathrm{Attention}(Q, K, V) = \\mathrm{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}} + M\\right) V",
    learningObjectives: [
      "Inspect attention score heatmaps across sequence tokens",
      "Understand why scaling factor sqrt(d_k) prevents softmax saturation",
      "Observe causal mask dynamics in autoregressive sequence decoders"
    ],
    assumptions: ["Sequence elements can be embedded in shared metric representation space"],
    hyperparameters: [
      { name: "dk", type: "number", defaultVal: 64, min: 16, max: 256, step: 16, description: "Key dimension" }
    ],
    traceCapabilities: ["activations.tensor"],
    visualizationModes: ["2D", "Auto"],
    forkable: false,
    status: "preview"
  },

  // --- REINFORCEMENT LEARNING ---
  {
    id: "rl.qlearning",
    name: "Q-Learning (Temporal Difference Control)",
    category: "Reinforcement Learning",
    priority: "P2",
    provenance: "native",
    tagline: "Model-free off-policy temporal difference state-action value iteration",
    description: "Learns the optimal action-value function Q(s, a) directly without an environment transition model, updating towards the maximum estimated future reward.",
    mathEquation: "Q(s, a) \\leftarrow Q(s, a) + \\alpha [r + \\gamma \\max_{a'} Q(s', a') - Q(s, a)]",
    learningObjectives: [
      "Visualize Q-table value heatmaps across discrete grid environments",
      "Analyze exploration vs exploitation balance under epsilon-greedy policies",
      "Observe temporal-difference error propagation over episodes"
    ],
    assumptions: ["Markov Decision Process with finite state and action spaces"],
    hyperparameters: [
      { name: "alpha", type: "number", defaultVal: 0.1, min: 0.01, max: 1.0, step: 0.05, description: "Learning rate alpha" },
      { name: "gamma", type: "number", defaultVal: 0.95, min: 0.5, max: 0.999, step: 0.01, description: "Discount factor gamma" },
      { name: "epsilon", type: "number", defaultVal: 0.1, min: 0.0, max: 1.0, step: 0.05, description: "Exploration rate" }
    ],
    traceCapabilities: ["metrics.loss", "environment.rl", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "preview"
  }
];

export function getAlgorithmById(id: string): AlgorithmEntry | undefined {
  return ALGORITHM_CATALOG.find((entry) => entry.id === id);
}

export function getAlgorithmsByCategory(category: AlgorithmCategory): AlgorithmEntry[] {
  return ALGORITHM_CATALOG.filter((entry) => entry.category === category);
}
