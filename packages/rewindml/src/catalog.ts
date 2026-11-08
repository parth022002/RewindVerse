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
  },

  // --- MODERN FIRST-ORDER OPTIMIZERS (CATALOG EXPANSION) ---
  {
    id: "optim.nag",
    name: "Nesterov Accelerated Gradient (NAG)",
    category: "Optimization",
    priority: "P1",
    provenance: "native",
    tagline: "Lookahead momentum calculation with anticipatory gradient correction",
    description: "Evaluates the objective gradient at an anticipated lookahead position theta - gamma * v, preventing momentum overshoot before reaching valley floors.",
    mathEquation: "v_t = \\gamma v_{t-1} + \\eta \\nabla f(\\theta_t - \\gamma v_{t-1}), \\quad \\theta_{t+1} = \\theta_t - v_t",
    learningObjectives: [
      "Understand lookahead positioning and damping of inertia overshoots",
      "Compare convergence trajectories against standard Polyak momentum",
      "Inspect acceleration in ill-conditioned convex quadratics"
    ],
    assumptions: ["Objective function is convex and has Lipschitz-continuous gradients"],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.05, min: 0.0001, max: 1.0, step: 0.01, description: "Base step size" },
      { name: "momentum", type: "number", defaultVal: 0.9, min: 0.1, max: 0.99, step: 0.05, description: "Nesterov lookahead momentum coefficient" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.lion",
    name: "Lion (EvoLved Sign Momentum)",
    category: "Optimization",
    priority: "P1",
    provenance: "native",
    tagline: "Memory-efficient sign-based momentum discovered via evolutionary AutoML",
    description: "Tracks only first-order momentum and updates weights with uniform magnitudes via the sign operation, decoupled with weight decay.",
    mathEquation: "c_t = \\mathrm{sign}(\\beta_1 m_{t-1} + (1-\\beta_1) g_t), \\quad \\theta_{t+1} = \\theta_t - \\eta (c_t + \\lambda \\theta_t)",
    learningObjectives: [
      "Understand sign-based uniform update magnitudes across disparate dimensions",
      "Observe 50% memory savings compared to Adam (no second-moment buffer)",
      "Analyze stability differences on noisy stochastic loss landscapes"
    ],
    assumptions: ["Gradient noise is bounded; decoupled weight decay lambda is regularized"],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.0001, min: 0.00001, max: 0.01, step: 0.0001, description: "Step size (typically 3-10x smaller than Adam)" },
      { name: "beta1", type: "number", defaultVal: 0.9, min: 0.5, max: 0.99, step: 0.01, description: "Interpolation momentum parameter" },
      { name: "beta2", type: "number", defaultVal: 0.99, min: 0.5, max: 0.999, step: 0.01, description: "EMA momentum update parameter" },
      { name: "weightDecay", type: "number", defaultVal: 0.01, min: 0.0, max: 0.5, step: 0.01, description: "Decoupled weight decay coefficient" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "neural.cnn",
    name: "2D Convolutional Layer & Spatial Feature Maps",
    category: "Deep Learning",
    priority: "P1",
    provenance: "native",
    tagline: "Translation-invariant local receptive field spatial feature extraction",
    description: "Convolves learnable 2D kernel tensors across input channels to extract edges, textures, and high-level spatial representations.",
    mathEquation: "(I * K)(i, j) = \\sum_m \\sum_n I(i-m, j-n) K(m, n)",
    learningObjectives: [
      "Inspect spatial activation maps across depth channels",
      "Understand receptive field growth through progressive convolutions",
      "Analyze edge-detector and Sobel kernel activations interactively"
    ],
    assumptions: ["Spatial locality and translation equivariance in input tensors"],
    hyperparameters: [
      { name: "kernelSize", type: "number", defaultVal: 3, min: 1, max: 7, step: 2, description: "Spatial filter dimension (odd integer)" },
      { name: "stride", type: "number", defaultVal: 1, min: 1, max: 3, step: 1, description: "Kernel slide stride" }
    ],
    traceCapabilities: ["activations.tensor"],
    visualizationModes: ["2D", "Auto"],
    demoRoute: "/studio/insights",
    forkable: false,
    status: "verified"
  },
  // --- ADDITIONAL OPTIMIZERS (P0, P1, P2) ---
  {
    id: "optim.bgd",
    name: "Batch Gradient Descent (BGD)",
    category: "Optimization",
    priority: "P0",
    provenance: "native",
    tagline: "Exact full-batch empirical risk gradient descent",
    description: "Evaluates the exact empirical gradient over the entire dataset before applying each deterministic parameter update.",
    mathEquation: "\\theta_{t+1} = \\theta_t - \\eta \\frac{1}{N} \\sum_{i=1}^N \\nabla_\\theta \\ell(f(x_i; \\theta), y_i)",
    learningObjectives: [
      "Understand deterministic descent trajectories without mini-batch noise",
      "Inspect orthogonal steps relative to loss contour lines",
      "Observe computational cost scaling linearly with dataset size N"
    ],
    assumptions: ["Objective function is continuously differentiable; full dataset fits in memory"],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.05, min: 0.0001, max: 2.0, step: 0.01, description: "Step size scale factor" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.minibatch",
    name: "Mini-Batch Gradient Descent",
    category: "Optimization",
    priority: "P0",
    provenance: "native",
    tagline: "Stochastic mini-batch gradient descent with variance reduction",
    description: "Computes parameter updates over uniformly sampled sub-batches B of size |B|, balancing computational efficiency with gradient variance reduction.",
    mathEquation: "\\theta_{t+1} = \\theta_t - \\eta \\frac{1}{|B|} \\sum_{i \\in B} \\nabla_\\theta \\ell(f(x_i; \\theta), y_i)",
    learningObjectives: [
      "Observe variance reduction as batch size scales from 1 to N",
      "Understand escape from saddle points facilitated by stochastic mini-batch noise",
      "Inspect memory efficiency and GPU parallel throughput tradeoffs"
    ],
    assumptions: ["Sub-batches are independent identically distributed uniform samples"],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.05, min: 0.0001, max: 2.0, step: 0.01, description: "Base step size" },
      { name: "batchSize", type: "number", defaultVal: 32, min: 2, max: 512, step: 2, description: "Mini-batch sample size |B|" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.adadelta",
    name: "AdaDelta",
    category: "Optimization",
    priority: "P2",
    provenance: "native",
    tagline: "Adaptive learning rate method eliminating monotonic step decay",
    description: "Restricts accumulation of past gradients to a fixed window using exponential moving averages and matches update units using RMS parameter step history.",
    mathEquation: "\\Delta \\theta_t = - \\frac{\\sqrt{RMS[\\Delta \\theta]_{t-1} + \\epsilon}}{\\sqrt{RMS[g]_t + \\epsilon}} g_t, \\quad \\theta_{t+1} = \\theta_t + \\Delta \\theta_t",
    learningObjectives: [
      "Observe how AdaDelta eliminates the need for an explicit global learning rate hyperparameter",
      "Understand unit matching between parameter gradients and step increments",
      "Compare robustness against AdaGrad's premature learning rate freeze"
    ],
    assumptions: ["Gradient history window can be approximated via exponential decay rho"],
    hyperparameters: [
      { name: "rho", type: "number", defaultVal: 0.95, min: 0.8, max: 0.999, step: 0.01, description: "Decay rate parameter for moving average of squared gradients" },
      { name: "epsilon", type: "number", defaultVal: 1e-6, min: 1e-9, max: 1e-3, step: 1e-6, description: "Numerical stability constant" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.amsgrad",
    name: "AMSGrad",
    category: "Optimization",
    priority: "P2",
    provenance: "native",
    tagline: "Guaranteed convergence adaptive optimizer with non-decreasing second moments",
    description: "Modifies Adam to maintain a monotonic maximum of all past squared gradient estimates, preventing step size explosion in non-convex settings.",
    mathEquation: "\\hat{v}_t = \\max(\\hat{v}_{t-1}, v_t), \\quad \\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} m_t",
    learningObjectives: [
      "Understand the counter-examples where standard Adam fails to converge",
      "Inspect the non-decreasing second-moment envelope over non-convex ravines",
      "Compare trajectory dampening against standard Adam"
    ],
    assumptions: ["Bounded gradient variance across parameter space"],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.001, min: 0.00001, max: 0.5, step: 0.0005, description: "Base step size" },
      { name: "beta1", type: "number", defaultVal: 0.9, min: 0.5, max: 0.999, step: 0.01, description: "First moment decay" },
      { name: "beta2", type: "number", defaultVal: 0.999, min: 0.5, max: 0.9999, step: 0.001, description: "Second moment decay" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.nadam",
    name: "NAdam (Nesterov-accelerated Adaptive Moment Estimation)",
    category: "Optimization",
    priority: "P2",
    provenance: "native",
    tagline: "Incorporates Nesterov momentum directly into the Adam adaptive update",
    description: "Combines Adam with Nesterov accelerated gradient by evaluating momentum at the current look-ahead step, accelerating convergence in steep valleys.",
    mathEquation: "\\bar{m}_t = \\beta_1 \\hat{m}_t + \\frac{(1 - \\beta_1) g_t}{1 - \\beta_1^t}, \\quad \\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\bar{m}_t",
    learningObjectives: [
      "Understand the integration of Nesterov momentum into adaptive gradient scalers",
      "Compare convergence speed in Rosenbrock valley landscapes",
      "Observe dampening of overshoot oscillations"
    ],
    assumptions: ["Locally smooth objective; bounded gradient noise"],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.002, min: 0.0001, max: 0.1, step: 0.0005, description: "Base step size" },
      { name: "beta1", type: "number", defaultVal: 0.9, min: 0.5, max: 0.99, step: 0.01, description: "First moment decay" },
      { name: "beta2", type: "number", defaultVal: 0.999, min: 0.5, max: 0.9999, step: 0.001, description: "Second moment decay" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.lbfgs",
    name: "L-BFGS (Limited-memory BFGS)",
    category: "Optimization",
    priority: "P2",
    provenance: "native",
    tagline: "Quasi-Newton optimization using limited history curvature approximations",
    description: "Approximates inverse Hessian curvature matrices using a sliding window of past parameter increments and gradient displacements, achieving superlinear convergence.",
    mathEquation: "H_{k+1} \\approx H_k + \\frac{s_k y_k^T + y_k s_k^T}{s_k^T y_k} - \\dots, \\quad \\theta_{t+1} = \\theta_t - H_k \\nabla f(\\theta_t)",
    learningObjectives: [
      "Understand quasi-Newton second-order curvature approximations without explicit Hessian inversion",
      "Observe superlinear convergence on ill-conditioned convex quadratic landscapes",
      "Inspect memory-scaling trade-offs governed by history buffer m"
    ],
    assumptions: ["Twice continuously differentiable objective; strictly positive-definite curvature updates s_k^T y_k > 0"],
    hyperparameters: [
      { name: "historySize", type: "number", defaultVal: 10, min: 3, max: 50, step: 1, description: "Number of past vector pairs (s_k, y_k) to retain in memory" },
      { name: "tolerance", type: "number", defaultVal: 1e-5, min: 1e-9, max: 1e-2, step: 1e-5, description: "Gradient norm convergence threshold" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.newton",
    name: "Newton-Raphson Method",
    category: "Optimization",
    priority: "P2",
    provenance: "native",
    tagline: "Second-order optimization using exact Hessian curvature matrices",
    description: "Applies exact second derivative curvature information to take quadratic model minimizer steps directly towards stationary points.",
    mathEquation: "\\theta_{t+1} = \\theta_t - [\\nabla^2 f(\\theta_t)]^{-1} \\nabla f(\\theta_t)",
    learningObjectives: [
      "Observe one-step convergence on pure quadratic bowl functions",
      "Understand pathological behavior when the Hessian is indefinite or near saddle points",
      "Inspect Hessian condition numbers and eigenvalue conditioning"
    ],
    assumptions: ["Objective function is twice differentiable; Hessian is positive-definite and non-singular"],
    hyperparameters: [
      { name: "damping", type: "number", defaultVal: 1e-4, min: 0.0, max: 1.0, step: 1e-4, description: "Levenberg-Marquardt diagonal regularization parameter (H + lambda * I)" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.coordinate_descent",
    name: "Coordinate Descent",
    category: "Optimization",
    priority: "P2",
    provenance: "native",
    tagline: "Successive line search along individual coordinate axes",
    description: "Optimizes multi-variable loss functions by successively minimizing along one coordinate dimension at a time while holding all others fixed.",
    mathEquation: "\\theta_j^{(t+1)} = \\arg\\min_z f(\\theta_1^{(t+1)}, \\dots, \\theta_{j-1}^{(t+1)}, z, \\theta_{j+1}^{(t)}, \\dots, \\theta_d^{(t)})",
    learningObjectives: [
      "Observe orthogonal axis-aligned staircase trajectories on 2D contours",
      "Understand failure modes when ravines are non-separable and non-smooth",
      "Observe exact analytical closed-form updates in Lasso and Elastic Net problems"
    ],
    assumptions: ["Objective is coordinate-wise strictly convex or separable"],
    hyperparameters: [
      { name: "maxCycles", type: "number", defaultVal: 100, min: 10, max: 1000, step: 10, description: "Maximum coordinate sweep cycles" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "optim.proximal_gradient",
    name: "Proximal Gradient Descent (ISTA)",
    category: "Optimization",
    priority: "P2",
    provenance: "native",
    tagline: "Composite optimization for non-smooth penalties via soft-thresholding",
    description: "Splits composite objectives into smooth f(theta) and non-smooth g(theta) terms, executing a gradient step on f followed by a proximal soft-thresholding operator on g.",
    mathEquation: "\\theta_{t+1} = \\mathrm{prox}_{\\eta g}(\\theta_t - \\eta \\nabla f(\\theta_t)) = \\mathrm{sign}(\\cdot) \\max(0, |\\cdot| - \\eta \\lambda)",
    learningObjectives: [
      "Understand why subgradient descent is slow compared to proximal operators",
      "Observe exact sparse zero-parameter setting during iterative soft-thresholding",
      "Compare convergence with accelerated proximal methods (FISTA)"
    ],
    assumptions: ["Smooth component f is convex with Lipschitz gradient; regularizer g is convex and prox-friendly"],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.05, min: 0.0001, max: 1.0, step: 0.01, description: "Step size for smooth gradient update" },
      { name: "lambda", type: "number", defaultVal: 0.1, min: 0.0, max: 5.0, step: 0.05, description: "Non-smooth regularizer penalty strength" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  // --- ADDITIONAL SUPERVISED ML ---
  {
    id: "supervised.polynomial_regression",
    name: "Polynomial Regression",
    category: "Supervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Non-linear feature expansion via polynomial basis transformations",
    description: "Transforms input features into degree-d polynomial monomials before fitting an ordinary least squares regression hyperplane, capturing non-linear curvatures.",
    mathEquation: "\\hat{y} = w_0 + w_1 x + w_2 x^2 + \\dots + w_d x^d = \\Phi(x)^T w",
    learningObjectives: [
      "Observe bias-variance trade-offs as polynomial degree d increases",
      "Understand Runge's phenomenon and severe edge oscillations under high degree",
      "Inspect the condition number explosion of the Vandermonde matrix"
    ],
    assumptions: ["Continuously differentiable underlying non-linear relationship"],
    hyperparameters: [
      { name: "degree", type: "number", defaultVal: 2, min: 1, max: 10, step: 1, description: "Maximum polynomial monomial power" },
      { name: "includeBias", type: "boolean", defaultVal: true, description: "Include intercept column x^0" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "supervised.elastic_net",
    name: "Elastic Net Regularization",
    category: "Supervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Convex combination of L1 (Lasso) and L2 (Ridge) penalties",
    description: "Balances feature selection sparsity with grouping effects among highly correlated predictors by combining L1 and L2 penalties in a single convex loss.",
    mathEquation: "\\min_w \\frac{1}{2n} \\|y - Xw\\|_2^2 + \\lambda \\left(\\alpha \\|w\\|_1 + \\frac{1-\\alpha}{2} \\|w\\|_2^2\\right)",
    learningObjectives: [
      "Observe grouping effect: correlated features are selected together rather than randomly chosen",
      "Trace coefficient paths as the mixing parameter alpha sweeps from 0 (Ridge) to 1 (Lasso)",
      "Understand singular vs round regularizer contour geometries"
    ],
    assumptions: ["Linear response model; standardized feature scale"],
    hyperparameters: [
      { name: "alpha", type: "number", defaultVal: 0.5, min: 0.0, max: 1.0, step: 0.05, description: "L1 ratio (1 = Lasso, 0 = Ridge)" },
      { name: "lambda", type: "number", defaultVal: 0.1, min: 0.001, max: 5.0, step: 0.01, description: "Overall regularization penalty intensity" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "supervised.gaussian_nb",
    name: "Gaussian Naive Bayes",
    category: "Supervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Probabilistic classifier with conditional independence and Gaussian likelihoods",
    description: "Computes posterior class probabilities using Bayes theorem under the assumption that continuous features within each class follow independent normal distributions.",
    mathEquation: "P(y|x) \\propto P(y) \\prod_{j=1}^d \\frac{1}{\\sqrt{2\\pi \\sigma_{y,j}^2}} \\exp\\left(-\\frac{(x_j - \\mu_{y,j})^2}{2\\sigma_{y,j}^2}\\right)",
    learningObjectives: [
      "Understand closed-form maximum likelihood estimation of class priors, means, and variances",
      "Inspect parabolic and linear decision boundaries under equal vs unequal covariance",
      "Observe robustness against the curse of dimensionality despite feature correlation violations"
    ],
    assumptions: ["Features are conditionally independent given class label y; Gaussian marginal distributions"],
    hyperparameters: [
      { name: "varSmoothing", type: "number", defaultVal: 1e-9, min: 1e-12, max: 1e-2, step: 1e-9, description: "Portion of largest variance added for numerical stability" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "supervised.multinomial_nb",
    name: "Multinomial Naive Bayes",
    category: "Supervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Discrete frequency event model with Laplace smoothing",
    description: "Models discrete count vectors (such as word frequencies in document classification) through multinomially distributed feature likelihoods.",
    mathEquation: "P(y|x) \\propto P(y) \\prod_{j=1}^d \\theta_{y, j}^{x_j}, \\quad \\theta_{y, j} = \\frac{N_{y,j} + \\alpha}{N_y + \\alpha d}",
    learningObjectives: [
      "Understand Laplace and Lidstone smoothing to prevent zero-probability lockouts",
      "Inspect log-sum-exp numerical stabilization for high-dimensional text token vectors",
      "Analyze relative token importance across topic classes"
    ],
    assumptions: ["Feature vectors represent non-negative discrete counts generated by a multinomial process"],
    hyperparameters: [
      { name: "alpha", type: "number", defaultVal: 1.0, min: 0.01, max: 5.0, step: 0.1, description: "Additive Laplace smoothing parameter" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "supervised.svm_linear",
    name: "Linear Support Vector Machine (SVM)",
    category: "Supervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Maximum margin separating hyperplane with soft slack penalty",
    description: "Finds the optimal separating hyperplane that maximizes the geometric margin between two classes, penalizing boundary violations via hinge loss.",
    mathEquation: "\\min_{w, b, \\xi} \\frac{1}{2}\\|w\\|^2 + C \\sum_{i=1}^n \\xi_i \\quad \\text{s.t. } y_i(w^T x_i + b) \\ge 1 - \\xi_i, \\; \\xi_i \\ge 0",
    learningObjectives: [
      "Identify active support vectors lying on or within the margin boundary",
      "Inspect margin thickness 2/||w|| response to varying penalty hyperparameter C",
      "Understand primal quadratic programming formulation vs dual representation"
    ],
    assumptions: ["Classes are approximately linearly separable in feature space"],
    hyperparameters: [
      { name: "C", type: "number", defaultVal: 1.0, min: 0.01, max: 100.0, step: 0.1, description: "Slack penalty cost trading margin width against training errors" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "supervised.svm_rbf",
    name: "Kernel SVM (Radial Basis Function)",
    category: "Supervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Non-linear classification via infinite-dimensional Gaussian kernel mapping",
    description: "Maps inputs implicitly into an infinite-dimensional Hilbert space via the RBF kernel trick, constructing complex curved non-linear decision boundaries.",
    mathEquation: "K(x, x') = \\exp(-\\gamma \\|x - x'\\|^2), \\quad f(x) = \\mathrm{sign}\\left(\\sum_{i=1}^n \\alpha_i y_i K(x_i, x) + b\\right)",
    learningObjectives: [
      "Understand the kernel trick and dual representation without explicit feature coordinate expansion",
      "Observe the interaction between kernel bandwidth gamma and margin penalty C",
      "Inspect island formation and overfitting under overly large gamma values"
    ],
    assumptions: ["Labels are separable in reproducing kernel Hilbert space (RKHS)"],
    hyperparameters: [
      { name: "C", type: "number", defaultVal: 1.0, min: 0.01, max: 50.0, step: 0.1, description: "Regularization parameter" },
      { name: "gamma", type: "number", defaultVal: 0.5, min: 0.01, max: 10.0, step: 0.05, description: "Kernel coefficient determining single-sample radius of influence" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "supervised.random_forest",
    name: "Random Forest Classifier",
    category: "Supervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Bagging ensemble of decorrelated decision trees with random subspace sampling",
    description: "Constructs an ensemble of deep decision trees trained on bootstrap resamples with randomized feature subsets, drastically reducing variance through majority voting.",
    mathEquation: "\\hat{f}(x) = \\frac{1}{B} \\sum_{b=1}^B T_b(x; \\Theta_b), \\quad \\Theta_b \\sim \\text{Bootstrap + Random Subspace}",
    learningObjectives: [
      "Understand variance reduction through tree decorrelation and bootstrap aggregation (bagging)",
      "Inspect out-of-bag (OOB) error estimates as an unbiased internal validation metric",
      "Evaluate Gini importance and mean decrease in impurity across features"
    ],
    assumptions: ["Individual decision trees are sufficiently deep and decorrelated"],
    hyperparameters: [
      { name: "nEstimators", type: "number", defaultVal: 50, min: 10, max: 300, step: 10, description: "Number of ensemble trees" },
      { name: "maxDepth", type: "number", defaultVal: 6, min: 2, max: 20, step: 1, description: "Maximum split depth per tree" },
      { name: "maxFeatures", type: "number", defaultVal: 2, min: 1, max: 10, step: 1, description: "Random subset feature count sampled per split" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "supervised.gbdt",
    name: "Gradient Boosted Decision Trees (GBDT)",
    category: "Supervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Sequential additive boosting fitting weak learners to pseudo-residuals",
    description: "Builds an additive model in a forward stage-wise manner by fitting shallow decision trees iteratively to negative loss gradients (pseudo-residuals).",
    mathEquation: "F_m(x) = F_{m-1}(x) + \\nu \\sum_{j=1}^{J_m} \\gamma_{jm} \\mathbf{1}(x \\in R_{jm}), \\quad r_{im} = -\\left[\\frac{\\partial L(y_i, F(x_i))}{\\partial F(x_i)}\\right]_{F=F_{m-1}}",
    learningObjectives: [
      "Understand gradient descent in function space",
      "Observe learning rate shrinkage nu preventing individual tree dominance",
      "Compare residual shrinkage progression across successive boosting iterations"
    ],
    assumptions: ["Differentiable loss function L(y, F); weak learners have bounded depth"],
    hyperparameters: [
      { name: "nEstimators", type: "number", defaultVal: 40, min: 10, max: 200, step: 5, description: "Number of boosting stages" },
      { name: "learningRate", type: "number", defaultVal: 0.1, min: 0.01, max: 1.0, step: 0.02, description: "Shrinkage factor scaling tree contributions" },
      { name: "maxDepth", type: "number", defaultVal: 3, min: 1, max: 8, step: 1, description: "Maximum depth of individual regression trees" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  // --- ADDITIONAL UNSUPERVISED ML ---
  {
    id: "unsupervised.gmm",
    name: "Gaussian Mixture Model (GMM) with EM",
    category: "Unsupervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Soft probabilistic clustering using Expectation-Maximization",
    description: "Represents data as a weighted sum of K multivariate Gaussian distributions, iteratively alternating between computing posterior responsibilities (E-step) and updating parameters (M-step).",
    mathEquation: "p(x) = \\sum_{k=1}^K \\pi_k \\mathcal{N}(x; \\mu_k, \\Sigma_k), \\quad \\gamma_{ik} = \\frac{\\pi_k \\mathcal{N}(x_i; \\mu_k, \\Sigma_k)}{\\sum_{j=1}^K \\pi_j \\mathcal{N}(x_i; \\mu_j, \\Sigma_j)}",
    learningObjectives: [
      "Understand soft probabilistic cluster assignment vs hard K-Means Voronoi partitions",
      "Observe covariance shape flexibility (spherical, diagonal, full ellipsoidal)",
      "Track log-likelihood monotonicity guaranteed by Jensen's inequality in EM"
    ],
    assumptions: ["Data points are independently sampled from a mixture of K Gaussian components"],
    hyperparameters: [
      { name: "k", type: "number", defaultVal: 3, min: 2, max: 10, step: 1, description: "Number of mixture components" },
      { name: "maxIter", type: "number", defaultVal: 50, min: 10, max: 200, step: 10, description: "Maximum EM iterations" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "unsupervised.dbscan",
    name: "DBSCAN (Density-Based Spatial Clustering)",
    category: "Unsupervised ML",
    priority: "P1",
    provenance: "native",
    tagline: "Arbitrary-shaped density clustering with robust noise detection",
    description: "Groups together points that are closely packed within neighborhood radius epsilon, discovering arbitrary non-convex geometries and isolating low-density outliers.",
    mathEquation: "N_\\epsilon(p) = \\{q \\in D \\mid \\mathrm{dist}(p, q) \\le \\epsilon\\}, \\quad |N_\\epsilon(p)| \\ge \\mathrm{MinPts}",
    learningObjectives: [
      "Identify core points, border points, and unassigned noise points",
      "Observe discovery of concentric ring and spiral clusters where K-Means fails",
      "Understand sensitivity to neighborhood distance scale epsilon"
    ],
    assumptions: ["Dense cluster regions are separated by lower density regions"],
    hyperparameters: [
      { name: "eps", type: "number", defaultVal: 0.35, min: 0.05, max: 2.0, step: 0.05, description: "Maximum distance radius between two samples for neighborhood consideration" },
      { name: "minSamples", type: "number", defaultVal: 5, min: 2, max: 20, step: 1, description: "Minimum sample count required to form a core point" }
    ],
    traceCapabilities: ["parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "unsupervised.tsne",
    name: "t-SNE (t-Distributed Stochastic Neighbor Embedding)",
    category: "Unsupervised ML",
    priority: "P2",
    provenance: "native",
    tagline: "Non-linear manifold dimensionality reduction preserving local neighborhoods",
    description: "Converts pairwise high-dimensional Euclidean distances into probabilities and minimizes the Kullback-Leibler divergence with low-dimensional Student-t probabilities.",
    mathEquation: "p_{j|i} = \\frac{\\exp(-\\|x_i - x_j\\|^2 / 2\\sigma_i^2)}{\\sum_{k \\neq i} \\exp(-\\|x_i - x_k\\|^2 / 2\\sigma_i^2)}, \\quad q_{ij} = \\frac{(1 + \\|y_i - y_j\\|^2)^{-1}}{\\sum_{k \\neq l} (1 + \\|y_k - y_l\\|^2)^{-1}}",
    learningObjectives: [
      "Understand the crowding problem and why Student-t distributions alleviate local crushing",
      "Inspect gradient descent forces: attractive springs vs repulsive charges",
      "Analyze the impact of perplexity hyperparameter on cluster separation"
    ],
    assumptions: ["High-dimensional data lies on or near an embedded non-linear manifold"],
    hyperparameters: [
      { name: "perplexity", type: "number", defaultVal: 30, min: 5, max: 50, step: 5, description: "Effective number of local nearest neighbors" },
      { name: "learningRate", type: "number", defaultVal: 200, min: 10, max: 1000, step: 10, description: "Gradient descent step size in embedding space" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  // --- ADDITIONAL DEEP LEARNING ARCHITECTURES ---
  {
    id: "neural.residual_block",
    name: "ResNet Residual Block",
    category: "Deep Learning",
    priority: "P1",
    provenance: "native",
    tagline: "Skip identity connection enabling training of very deep networks",
    description: "Introduces identity shortcut mappings that add the input directly to the residual function F(x), ensuring unbroken gradient flow during backpropagation.",
    mathEquation: "y = \\mathcal{F}(x, \\{W_i\\}) + x, \\quad \\frac{\\partial \\mathcal{E}}{\\partial x} = \\frac{\\partial \\mathcal{E}}{\\partial y}\\left(\\frac{\\partial \\mathcal{F}}{\\partial x} + I\\right)",
    learningObjectives: [
      "Inspect gradient highway dynamics preventing vanishing gradients across hundreds of layers",
      "Understand why residual learning makes learning identity functions trivially easy (F(x) -> 0)",
      "Compare convergence trajectories with plain un-skipped feedforward networks"
    ],
    assumptions: ["Input and output feature maps share compatible dimensional channel shapes"],
    hyperparameters: [
      { name: "channels", type: "number", defaultVal: 64, min: 16, max: 512, step: 16, description: "Internal feature channel width" },
      { name: "bottleneck", type: "boolean", defaultVal: false, description: "Use 1x1-3x3-1x1 bottleneck architecture" }
    ],
    traceCapabilities: ["activations.tensor", "gradients.summary"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "neural.multihead_attention",
    name: "Multi-Head Scaled Dot-Product Attention",
    category: "Deep Learning",
    priority: "P1",
    provenance: "native",
    tagline: "Parallel representation subspaces capturing multi-faceted token relationships",
    description: "Projects queries, keys, and values h times with independent learned linear projections, computing scaled dot-product attention concurrently across diverse representation subspaces.",
    mathEquation: "\\mathrm{MultiHead}(Q, K, V) = \\mathrm{Concat}(\\mathrm{head}_1, \\dots, \\mathrm{head}_h) W^O, \\quad \\mathrm{head}_i = \\mathrm{softmax}\\left(\\frac{Q W_i^Q (K W_i^K)^T}{\\sqrt{d_k}}\\right) V W_i^V",
    learningObjectives: [
      "Understand why 1/sqrt(d_k) scaling prevents softmax gradient vanishing at large dimensions",
      "Inspect individual attention head maps focusing on syntax, positioning, and semantics",
      "Analyze full O(N^2) quadratic sequence length memory and compute scaling"
    ],
    assumptions: ["Inputs are projected into unified embedding dimensional space"],
    hyperparameters: [
      { name: "numHeads", type: "number", defaultVal: 4, min: 1, max: 16, step: 1, description: "Number of parallel attention heads" },
      { name: "dModel", type: "number", defaultVal: 64, min: 16, max: 512, step: 16, description: "Total embedding feature dimension" }
    ],
    traceCapabilities: ["activations.tensor", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "neural.layernorm",
    name: "Layer Normalization & RMSNorm",
    category: "Deep Learning",
    priority: "P1",
    provenance: "native",
    tagline: "Sequence token normalization across feature dimensions",
    description: "Normalizes the activations across all feature channels for each individual token independently of mini-batch size, stabilizing deep transformer training.",
    mathEquation: "y = \\frac{x - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}} \\odot \\gamma + \\beta, \\quad \\mathrm{RMSNorm}(x) = \\frac{x}{\\sqrt{\\frac{1}{d}\\sum_{i=1}^d x_i^2 + \\epsilon}} \\odot \\gamma",
    learningObjectives: [
      "Observe invariance to shift and scaling in activation inputs",
      "Compare standard LayerNorm with zero-centering vs lightweight RMSNorm",
      "Understand why LayerNorm succeeds in recurrent and transformer settings where BatchNorm fails"
    ],
    assumptions: ["Feature dimension d is sufficient for reliable empirical variance estimation"],
    hyperparameters: [
      { name: "epsilon", type: "number", defaultVal: 1e-5, min: 1e-8, max: 1e-3, step: 1e-5, description: "Numerical variance stabilization constant" },
      { name: "mode", type: "select", defaultVal: "LayerNorm", options: ["LayerNorm", "RMSNorm"], description: "Normalization formulation" }
    ],
    traceCapabilities: ["activations.tensor"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "neural.positional_encoding",
    name: "Sinusoidal Positional Encoding",
    category: "Deep Learning",
    priority: "P1",
    provenance: "native",
    tagline: "Deterministic trigonometric order representation for permutation-invariant attention",
    description: "Adds static sinusoidal frequency waves of varying wavelengths to token embeddings, imparting sequential order awareness to self-attention mechanisms.",
    mathEquation: "PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right), \\quad PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d}}\\right)",
    learningObjectives: [
      "Understand why dot products between PE vectors depend solely on relative distance (k - j)",
      "Inspect geometric frequency wave patterns across sequence positions",
      "Analyze sequence length extrapolation properties beyond fixed training windows"
    ],
    assumptions: ["Linear combination with token embedding retains semantic information"],
    hyperparameters: [
      { name: "maxLen", type: "number", defaultVal: 128, min: 16, max: 2048, step: 16, description: "Maximum supported context sequence length" },
      { name: "dModel", type: "number", defaultVal: 64, min: 16, max: 512, step: 16, description: "Embedding vector dimension" }
    ],
    traceCapabilities: ["activations.tensor"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "neural.rnn_lstm",
    name: "Long Short-Term Memory (LSTM)",
    category: "Deep Learning",
    priority: "P1",
    provenance: "native",
    tagline: "Gated recurrent neural network maintaining constant error carousels",
    description: "Controls the flow of temporal information across long sequential time horizons using forget, input, and output gates that update an explicit cell memory state.",
    mathEquation: "f_t = \\sigma(W_f x_t + U_f h_{t-1} + b_f), \\quad c_t = f_t \\odot c_{t-1} + i_t \\odot \\tanh(W_c x_t + U_c h_{t-1} + b_c), \\quad h_t = o_t \\odot \\tanh(c_t)",
    learningObjectives: [
      "Inspect constant error carousels preventing exponential vanishing of gradients through time",
      "Observe gate activation patterns (forget vs write vs expose) during pattern recall",
      "Compare memory persistence against vanilla RNN units"
    ],
    assumptions: ["Sequential dependency in input token streams"],
    hyperparameters: [
      { name: "hiddenDim", type: "number", defaultVal: 32, min: 8, max: 256, step: 8, description: "Hidden state and cell vector dimension" }
    ],
    traceCapabilities: ["activations.tensor", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  // --- GENERATIVE AI ---
  {
    id: "genai.vae",
    name: "Variational Autoencoder (VAE)",
    category: "Generative AI",
    priority: "P2",
    provenance: "native",
    tagline: "Stochastic latent variable generative model optimized via the ELBO",
    description: "Encodes inputs into parameterized Gaussian distributions in latent space, using the reparameterization trick to backpropagate through reconstruction loss and KL divergence.",
    mathEquation: "\\mathcal{L}_{\\text{ELBO}}(\\theta, \\phi; x) = \\mathbb{E}_{q_\\phi(z|x)}[\\log p_\\theta(x|z)] - D_{\\mathrm{KL}}(q_\\phi(z|x) \\,\\|\\, p(z)), \\quad z = \\mu + \\sigma \\odot \\epsilon",
    learningObjectives: [
      "Understand the reparameterization trick separating stochastic randomness epsilon from parameters",
      "Inspect latent manifold continuity and smooth linear interpolations between data modes",
      "Analyze KL divergence regularization forcing the latent space into an isotropic standard normal prior"
    ],
    assumptions: ["Latent prior follows a standard multivariate Gaussian p(z) = N(0, I)"],
    hyperparameters: [
      { name: "latentDim", type: "number", defaultVal: 2, min: 2, max: 64, step: 1, description: "Latent space bottleneck dimension" },
      { name: "klWeight", type: "number", defaultVal: 1.0, min: 0.0, max: 5.0, step: 0.1, description: "Beta-VAE hyperparameter balancing reconstruction fidelity vs prior alignment" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot", "activations.tensor"],
    visualizationModes: ["2D", "3D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "genai.diffusion_ddpm",
    name: "Denoising Diffusion Probabilistic Model (DDPM)",
    category: "Generative AI",
    priority: "P3",
    provenance: "native",
    tagline: "Iterative reverse Langevin sampling from forward Gaussian noise schedules",
    description: "Destroys data structure over T steps via forward Gaussian noise addition, then trains a neural network to predict and subtract noise at each reverse step.",
    mathEquation: "q(x_t|x_0) = \\mathcal{N}(x_t; \\sqrt{\\bar{\\alpha}_t} x_0, (1 - \\bar{\\alpha}_t) I), \\quad L_{\\text{simple}}(\\theta) = \\mathbb{E}_{t, x_0, \\epsilon} [\\|\\epsilon - \\epsilon_\\theta(x_t, t)\\|^2]",
    learningObjectives: [
      "Understand forward analytical diffusion at arbitrary timestep t without evaluating prior steps",
      "Inspect score matching and reverse Langevin sampling trajectories from white noise to data",
      "Observe sampling quality vs step count trade-offs"
    ],
    assumptions: ["Forward noise transition kernels are Gaussian; reverse transitions approximate Gaussians for small beta"],
    hyperparameters: [
      { name: "timesteps", type: "number", defaultVal: 50, min: 10, max: 1000, step: 10, description: "Total forward and reverse diffusion steps T" },
      { name: "betaStart", type: "number", defaultVal: 0.0001, min: 0.00001, max: 0.001, step: 0.00005, description: "Initial variance schedule" },
      { name: "betaEnd", type: "number", defaultVal: 0.02, min: 0.005, max: 0.1, step: 0.005, description: "Final variance schedule" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  // --- REINFORCEMENT LEARNING ---
  {
    id: "rl.bandit_ucb",
    name: "UCB1 Multi-Armed Bandit",
    category: "Reinforcement Learning",
    priority: "P2",
    provenance: "native",
    tagline: "Optimism in the face of uncertainty for multi-armed bandit exploration",
    description: "Selects actions that maximize the upper bound of a confidence interval, balancing empirical estimated payout with an exploration bonus derived from Hoeffding's inequality.",
    mathEquation: "A_t = \\arg\\max_a \\left[ Q_t(a) + c \\sqrt{\\frac{\\ln t}{N_t(a)}} \\right]",
    learningObjectives: [
      "Understand logarithmic cumulative regret bounds over time",
      "Observe how infrequently pulled arms receive boosted exploration bonuses",
      "Compare exploitation vs exploration dynamics against epsilon-greedy policies"
    ],
    assumptions: ["Rewards are bounded within [0, 1] and stationary"],
    hyperparameters: [
      { name: "explorationConst", type: "number", defaultVal: 1.414, min: 0.1, max: 5.0, step: 0.1, description: "Exploration scale parameter c (theoretical sqrt(2))" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "rl.sarsa",
    name: "SARSA (On-Policy Temporal Difference)",
    category: "Reinforcement Learning",
    priority: "P2",
    provenance: "native",
    tagline: "On-policy TD control evaluating state-action-reward-state-action tuples",
    description: "Updates state-action Q-values using the actual next action chosen by the behavior policy, making it cautious near dangerous environment cliffs.",
    mathEquation: "Q(S_t, A_t) \\leftarrow Q(S_t, A_t) + \\alpha [R_{t+1} + \\gamma Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t)]",
    learningObjectives: [
      "Observe on-policy conservative paths avoiding cliff edges under exploratory noise",
      "Compare policy paths and convergence trajectories with off-policy Q-Learning",
      "Inspect eligibility traces and temporal credit assignment"
    ],
    assumptions: ["Markov decision process with discrete state and action spaces"],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.1, min: 0.01, max: 1.0, step: 0.05, description: "TD update step size alpha" },
      { name: "gamma", type: "number", defaultVal: 0.95, min: 0.5, max: 0.999, step: 0.01, description: "Future discount factor" },
      { name: "epsilon", type: "number", defaultVal: 0.1, min: 0.0, max: 0.5, step: 0.05, description: "Epsilon-greedy exploration probability" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "rl.dqn",
    name: "Deep Q-Network (DQN)",
    category: "Reinforcement Learning",
    priority: "P3",
    provenance: "native",
    tagline: "Deep reinforcement learning with experience replay and target networks",
    description: "Approximates high-dimensional state-action values using deep neural networks, breaking autocorrelation with an experience replay buffer and stabilizing targets with delayed parameter copies.",
    mathEquation: "L_i(\\theta_i) = \\mathbb{E}_{(s, a, r, s')} \\left[ \\left( r + \\gamma \\max_{a'} Q(s', a'; \\theta_i^-) - Q(s, a; \\theta_i) \\right)^2 \\right]",
    learningObjectives: [
      "Understand why naive neural TD learning diverges without experience replay decorrelation",
      "Observe how periodic target network updates freeze target targets for stable regression",
      "Analyze policy performance and score growth across training episodes"
    ],
    assumptions: ["Environment transitions conform to an unknown MDP"],
    hyperparameters: [
      { name: "learningRate", type: "number", defaultVal: 0.0005, min: 0.00005, max: 0.01, step: 0.0001, description: "Optimizer learning rate" },
      { name: "gamma", type: "number", defaultVal: 0.99, min: 0.8, max: 0.999, step: 0.01, description: "Discount factor" },
      { name: "targetUpdateFreq", type: "number", defaultVal: 50, min: 10, max: 500, step: 10, description: "Timestep interval for syncing target network weights" }
    ],
    traceCapabilities: ["metrics.loss", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "rl.ppo",
    name: "Proximal Policy Optimization (PPO)",
    category: "Reinforcement Learning",
    priority: "P3",
    provenance: "native",
    tagline: "Clipped surrogate policy gradient ensuring monotonic policy improvements",
    description: "Maximizes a clipped surrogate objective that penalizes policy changes moving probability ratios outside an interval [1 - epsilon, 1 + epsilon], preventing destructive updates.",
    mathEquation: "L^{\\text{CLIP}}(\\theta) = \\hat{\\mathbb{E}}_t \\left[ \\min\\left(r_t(\\theta)\\hat{A}_t, \\, \\mathrm{clip}(r_t(\\theta), 1-\\epsilon, 1+\\epsilon)\\hat{A}_t\\right) \\right]",
    learningObjectives: [
      "Understand trust-region policy updates without expensive second-order conjugate gradient matrix inversions",
      "Inspect probability ratio clipping when advantage estimates are positive vs negative",
      "Observe stable sample-efficient policy training on continuous and discrete control tasks"
    ],
    assumptions: ["Generalized Advantage Estimation (GAE) provides reliable variance-reduced advantage estimates"],
    hyperparameters: [
      { name: "clipEpsilon", type: "number", defaultVal: 0.2, min: 0.05, max: 0.4, step: 0.05, description: "Clipping threshold epsilon for surrogate ratio r_t(theta)" },
      { name: "learningRate", type: "number", defaultVal: 0.0003, min: 0.00001, max: 0.01, step: 0.00005, description: "Actor-critic optimizer step size" }
    ],
    traceCapabilities: ["metrics.loss", "gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  // --- EXPLAINABILITY & DIAGNOSTICS ---
  {
    id: "xai.shap",
    name: "SHAP (SHapley Additive exPlanations)",
    category: "Metrics & Diagnostics",
    priority: "P2",
    provenance: "native",
    tagline: "Game-theoretic local feature attribution satisfying axiomatic efficiency",
    description: "Computes fair Shapley attribution values across all feature coalition subsets, allocating exact credit to each feature for pushing predictions away from the base value.",
    mathEquation: "\\phi_i(v) = \\sum_{S \\subseteq N \\setminus \\{i\\}} \\frac{|S|!(|N|-|S|-1)!}{|N|!} (v(S \\cup \\{i\\}) - v(S))",
    learningObjectives: [
      "Understand the four fundamental Shapley axioms: Efficiency, Symmetry, Dummy, and Additivity",
      "Inspect beeswarm plots and waterfall charts showing directional feature pushes",
      "Compare exact exponential coalition evaluation against KernelSHAP sampling approximations"
    ],
    assumptions: ["Feature interaction games satisfy cooperative game theory assumptions"],
    hyperparameters: [
      { name: "nSamples", type: "number", defaultVal: 100, min: 20, max: 1000, step: 20, description: "Monte Carlo background sample size for marginal expectation evaluations" }
    ],
    traceCapabilities: ["parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "xai.integrated_gradients",
    name: "Integrated Gradients",
    category: "Metrics & Diagnostics",
    priority: "P2",
    provenance: "native",
    tagline: "Path-integral axiomatic attribution for differentiable neural networks",
    description: "Integrates gradients along the straight-line interpolation path from a neutral reference baseline to the input, satisfying Completeness and Implementation Invariance.",
    mathEquation: "\\mathrm{IG}_i(x) = (x_i - x_i') \\times \\int_0^1 \\frac{\\partial F(x' + \\alpha(x - x'))}{\\partial x_i} d\\alpha",
    learningObjectives: [
      "Understand why standard input gradients suffer from saturation and fail the sensitivity axiom",
      "Observe numerical Gauss-Legendre quadrature along the interpolation trajectory",
      "Verify the completeness axiom: sum of attributions exactly equals F(x) - F(x_baseline)"
    ],
    assumptions: ["Prediction function F is continuously differentiable almost everywhere along straight path from baseline"],
    hyperparameters: [
      { name: "steps", type: "number", defaultVal: 50, min: 10, max: 200, step: 10, description: "Riemann or Gauss quadrature integration step count" }
    ],
    traceCapabilities: ["gradients.summary", "parameters.snapshot"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  },
  {
    id: "xai.permutation_importance",
    name: "Permutation Feature Importance",
    category: "Metrics & Diagnostics",
    priority: "P1",
    provenance: "native",
    tagline: "Model-agnostic feature importance via test feature shuffling",
    description: "Measures the increase in prediction error after randomly permuting the values of a feature, breaking its relationship with the target.",
    mathEquation: "I(f_j) = L(X^{\\text{perm}(j)}, y) - L(X, y)",
    learningObjectives: [
      "Observe global importance rankings across black-box models without architectural assumptions",
      "Understand how collinear features share permutation drop and dilute individual scores",
      "Inspect statistical confidence intervals over repeated random permutations"
    ],
    assumptions: ["Evaluation partition is representative and independent of training partition"],
    hyperparameters: [
      { name: "nRepeats", type: "number", defaultVal: 5, min: 1, max: 30, step: 1, description: "Number of random permutation repeats per column" }
    ],
    traceCapabilities: ["metrics.loss"],
    visualizationModes: ["2D", "Auto"],
    forkable: true,
    status: "verified"
  }
];

export function getAlgorithmById(id: string): AlgorithmEntry | undefined {
  return ALGORITHM_CATALOG.find((entry) => entry.id === id);
}

export function getAlgorithmsByCategory(category: AlgorithmCategory): AlgorithmEntry[] {
  return ALGORITHM_CATALOG.filter((entry) => entry.category === category);
}

