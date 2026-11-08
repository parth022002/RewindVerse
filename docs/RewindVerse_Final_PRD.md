# REWINDVERSE {.unnumbered .unlisted}

## Product Requirements Document (PRD) {.unnumbered .unlisted}
### Final Product Definition · Edition 4.1 {.unnumbered .unlisted}

**Product promise:** *Train a model, then replay how it learned.*  
**Brand tagline:** *Every Model Has a Story.*  
**Product category:** Interactive ML Training Replay, Learning and Experiment Intelligence Platform  
**Document status:** Final product requirements baseline; implementation and market evidence remain gated  
**Date:** 7 November 2026  
**Owner:** Product Owner / Technical Lead  
**Supersedes:** RewindVerse Final Master Project Development Document, Edition 2.0, as the product-facing requirements baseline. The project was previously developed under the working name **Modelverse**.

> **Status and truthfulness note:** This PRD defines what RewindVerse should become. It is not evidence that every feature is already implemented. Every capability must move through the statuses **Proposed → Designed → In progress → Implemented → Verified → Released**. Ratings above 8 are targets to be earned through test results, user evidence and reproducible delivery.

---

# Document control {.unnumbered .unlisted}

| Field | Definition |
|---|---|
| Product name | RewindVerse |
| Main application / workspace | Rewind Studio (working sub-brand; public use subject to trademark clearance) |
| Core computation layer | RewindML |
| Replay experience | Rewind Replay |
| Diagnostics and evidence | Rewind Insights |
| Guided learning | Rewind Academy |
| Experiment comparison | Rewind Compare |
| Primary product promise | Train a model, then replay how it learned |
| Primary users | Self-directed ML learners; ML instructors, teaching assistants and bootcamp mentors |
| Secondary users | Python ML developers who need to record, inspect and share training runs |
| Initial platform | Browser-first application; local-first processing; optional sharing service |
| Core technical asset | RewindVerse Training Trace Specification (RVTS) and capability-aware replay engine |
| Brand tagline | Every Model Has a Story. |
| Core experience | Experiment → record → validate → replay → inspect → explain → share/export |
| Delivery horizon | 24-week v1 plan, followed by gated expansion releases |
| Planned effort assumption | 15–20 focused hours per week; revise when actual capacity is known |
| Source baseline | Previous master specification and project blueprint (then named Modelverse), feature-improvement review and technical audit notes supplied in this conversation |

## Version history

| Version | Change |
|---|---|
| 1.0 | Initial product and engineering specification |
| 2.0 | Consolidated master development specification and remediation register |
| 3.0 | Reframed as a product requirements document; converted compatible former non-goals into staged product goals; clarified true non-goals; added feature portfolio, user stories, acceptance criteria, prioritisation and product-to-evidence traceability |
| 4.0 | Renamed the product to RewindVerse; defined the brand and product architecture; renamed product modules; specified RVTS transition from the former MVTS draft; added brand migration, technical identifier, legal-clearance and release consistency requirements |
| 4.1 | Finalised the RewindVerse brand system and product naming hierarchy; added brand story, positioning, messaging, visual identity direction and brand architecture diagram; corrected the Rewind Studio trademark due-diligence description; improved repository presentation and final document consistency |

## How to use this PRD

1. This document is the product source of truth. Architecture decision records (ADRs), RVTS technical specification, API contracts, design files and implementation tickets are subordinate artifacts.
2. Every requirement has an ID. Work must reference the IDs it implements and tests.
3. Product goals are not all v1 commitments. Each goal has a release horizon and a gate.
4. A feature is not “done” because the screen exists. It is done only when its acceptance criteria, tests, documentation and evidence are complete.
5. If an implementation trade-off changes a user-visible requirement, update this PRD through the change process in Section 25.

# Table of contents {.unnumbered .unlisted}

1. Executive summary
2. Product vision, positioning and principles
3. Problem statement and opportunity
4. Users, personas and jobs to be done
5. Goals, success outcomes and goal conversion
6. Product scope and release strategy
7. Product experience and information architecture
8. End-to-end user journeys
9. Functional requirements and acceptance criteria
10. Non-functional requirements and quality attributes
11. Product architecture and system boundaries
12. ML algorithms, datasets and computation rules
13. RVTS trace format and replay semantics
14. Diagnostics, explanations and learning design
15. Import centre and interoperability
16. Python SDK, CLI and developer experience
17. Data observatory and model intelligence roadmap
18. Sharing, collaboration and classroom roadmap
19. APIs, identity and data model
20. Security, privacy, safety and governance
21. UX, accessibility and visual design
22. Analytics, KPIs and market validation
23. Testing, performance and release quality
24. Delivery roadmap and prioritised backlog
25. Risks, dependencies, decisions and change control
26. Launch, operations and post-release plan
27. Product completeness and evidence scorecard
28. Glossary and appendices

---

# 1. Executive summary

RewindVerse is a browser-first platform for understanding how machine-learning models learn. Users can run supported experiments, capture the actual states produced by training, open a portable trace, replay it step by step, inspect metrics and available internal signals, and learn from evidence-backed events. Python developers can record selected information from supported local training workflows and use the same browser replay experience. Instructors can use guided experiments and share read-only traces.

The product's defining asset is not a collection of charts. It is the combination of:

- **RVTS:** a versioned, documented, capability-declared trace format;
- **Replay Engine:** a deterministic viewer that presents exactly what the trace supports;
- **Real experiment engine:** browser algorithms executed off the main UI thread;
- **Developer bridge:** Python SDK, CLI and importers that feed the same trace pipeline;
- **Learning layer:** guided experiments, prediction prompts, challenges and evidence-linked explanations.

The primary promise must remain honest: RewindVerse can replay recorded values and can recompute supported views only when the trace contains sufficient state and registered semantics. It must never invent unrecorded gradients, parameters, activations, samples or model internals.

## 1.1 One-line positioning

For people learning, teaching or debugging machine-learning training, RewindVerse turns supported training runs into portable, inspectable and replayable learning experiences—rather than leaving users with disconnected metric charts.

## 1.2 Strategic product decisions

| Decision | Final direction |
|---|---|
| Primary audience | Learners and instructors first; Python ML developers second |
| Product centre | Trace contract + replay engine |
| Product shape | One coherent product, not a collection of unrelated ML demos |
| Default execution | Browser Web Workers and local processing |
| Backend | Optional, narrow services for sharing and metadata; no hosted arbitrary code execution |
| Interoperability | CSV first; then selected TensorBoard/MLflow/W&B and Python recorder paths, each with a fidelity report |
| Diagnostics | Computed at read time from trace evidence; producer annotations remain distinguishable |
| Learning content | Predict → run → replay → explain → apply |
| Expansion | Data observability, model evaluation, experiment intelligence, classroom and transformer learning become staged future goals |
| Market proof | Interviews, task-based usability, repeat usage, instructor pilots and small learning evaluations |

## 1.3 What v1.0 must prove

A new user can start a supported experiment without an account, run a real algorithm, export a valid RVTS trace, reopen it, scrub the training timeline, inspect actual recorded values and understand at least one diagnostic. A Python-produced trace can be opened in the same viewer. A second developer can reproduce the workflow from the repository instructions. Real target users complete the core task without assistance.

---

# 2. Product vision, positioning and principles

## 2.1 Vision

Make machine-learning training behaviour inspectable and teachable. A user should be able to answer not only “what was the final score?” but also “what happened during learning, what evidence supports that explanation, and what should I investigate next?”

## 2.2 Product mission

Build the most approachable, transparent and portable way to replay supported ML training runs for learning, teaching and practical debugging.

## 2.3 Product principles

1. **Evidence before explanation.** Every plotted value and diagnostic must point to recorded or reproducibly computed evidence.
2. **Trace-first architecture.** Browser labs, Python recorders and importers produce the same versioned contract.
3. **Capability-aware rendering.** The viewer renders only panels supported by the trace's declared and validated capabilities.
4. **Real computation, not theatre.** Training controls execute actual algorithms and deterministic fixtures; no invented model state.
5. **Local-first by default.** Training and analysis happen locally unless a clearly disclosed feature requires a service.
6. **Learning over feature count.** Prefer a few complete journeys over a large number of shallow demos.
7. **Transparent limitations.** Show approximation, unsupported semantics, missing fields and detector uncertainty.
8. **Safe by design.** Never execute arbitrary uploaded code, pickle files or untrusted plugins.
9. **Accessible visualisation.** Charts have keyboard controls, textual summaries and data-table alternatives.
10. **Reproducible engineering.** Publish fixtures, numerical tolerances, benchmarks and release evidence.

## 2.4 Product category boundaries

RewindVerse is a learner-first replay and training-inspection layer. It may integrate with experiment trackers and model-development workflows, but it is not intended to replace TensorBoard, Weights & Biases, MLflow, a production model registry, a hosted notebook, a cloud GPU platform or a complete MLOps system.

## 2.5 Differentiation hypothesis

Existing tools can already record and visualise many metrics, gradients, artefacts and experiment comparisons. RewindVerse must therefore earn differentiation through a combined experience:

- replay-oriented step navigation;
- portable and capability-declared trace files;
- a single viewer for browser-generated, Python-recorded and imported runs;
- learner-first explanations grounded in exact step ranges;
- guided prediction and practice;
- honest fidelity reports for imported information.

This is a hypothesis to validate, not a “first”, “only” or “best” market claim.


## 2.6 Brand system and product naming

### 2.6.1 Official product identity

| Brand element | Approved product definition |
|---|---|
| Official platform name | **RewindVerse** |
| Wordmark treatment | `RewindVerse` in running text; `REWINDVERSE` may be used as a visual wordmark on the cover and product splash screen |
| Tagline | **Every Model Has a Story.** |
| Product promise | **Train a model, then replay how it learned.** |
| Product descriptor | Interactive ML Training Replay, Learning and Experiment Intelligence Platform |
| Primary application | **Rewind Studio** - the main interactive workspace and application shell |
| Core computation layer | **RewindML** - objective functions, datasets, losses, model implementations, optimizers and deterministic training execution |
| Replay experience | **Rewind Replay** - trace timeline, synchronized visualisations, step inspector and replay controls |
| Diagnostic layer | **Rewind Insights** - evidence-linked heuristic detectors, explanation cards and training reports |
| Comparison workspace | **Rewind Compare** - side-by-side runs, configuration differences and aligned metric/parameter views |
| Learning layer | **Rewind Academy** - lessons, prediction prompts, guided experiments and challenges |
| Future data capability | **Rewind Data Observatory** - dataset profiling, quality signals and governed data diagnostics |
| Future evaluation capability | **Rewind Model Intelligence** - model evaluation, calibration, error analysis and model cards |
| Trace interchange | **Rewind Trace**, formally the **RewindVerse Training Trace Specification (RVTS)** |

### 2.6.2 Brand architecture

RewindVerse is the single umbrella brand. The named capabilities above are modules within one product, not separate companies or independent products. Rewind Studio is the workspace users enter; it hosts the Lab, Import Center, Replay, Compare and Academy experiences. RewindML powers actual computation. Rewind Replay reads validated traces. Rewind Insights explains signals from the trace with explicit evidence and uncertainty. Rewind Data Observatory and Rewind Model Intelligence are staged expansion modules, not v1 commitments.

```text
RewindVerse  (platform brand)
└── Rewind Studio  (main application / workspace)
    ├── RewindML              (training and computation engine)
    ├── Rewind Replay         (trace viewer and step navigation)
    ├── Rewind Insights       (diagnostics and evidence reports)
    ├── Rewind Compare        (run comparison)
    ├── Rewind Academy        (lessons and challenges)
    ├── Rewind Data Observatory       (future data quality module)
    └── Rewind Model Intelligence     (future model evaluation module)

Rewind Trace / RVTS = the shared interchange contract used by all producers and consumers.
```

### 2.6.3 Naming and writing rules

- Write the platform name exactly as **RewindVerse** (no space, capital R and V). Do not alternate with ModelVerse, Rewind Verse or Rewindverse.
- Write module names exactly as **Rewind Studio**, **RewindML**, **Rewind Replay**, **Rewind Insights**, **Rewind Compare**, **Rewind Academy**, **Rewind Data Observatory** and **Rewind Model Intelligence**.
- Use “Rewind Trace” for user-facing language and “RVTS” for the formal trace specification after the technical migration is complete.
- Do not describe modules as independent products in the UI, documentation or marketing unless a future product decision approves that change.
- Use the tagline as a brand line, not as a technical guarantee. Use the product promise to describe the actual workflow.
- Brand voice: precise, curious, welcoming and transparent. Prefer “the trace indicates” or “may suggest” over definitive claims when describing heuristic diagnostics.
- Preserve the product's navy/blue/teal/amber technical visual language. Use one colour consistently for one semantic category; never rely on colour alone.

### 2.6.4 Brand clearance and release restriction

The selected platform identity for this PRD is **RewindVerse**. Its legal availability has not been certified. Public launch, paid distribution, formal logo registration and long-term domain commitment remain subject to exact/phonetic trademark, company-name, domain, package-registry and social-handle checks. A secondary Indian trademark index displays **REWIND STUDIO**, application 5976801, as registered in Class 41 and describes the specified services in the record as photography, videography, wedding and event management. That secondary record does not by itself determine whether the mark conflicts with RewindVerse software or educational uses; the official e-register record, exact specification, owner/status and legal similarity analysis must be checked by qualified trademark counsel before Rewind Studio is used publicly as a commercial sub-brand. This is a due-diligence flag, not a legal conclusion about infringement, ownership or availability.

Required before public launch:
1. Search exact, phonetic and confusingly similar marks for RewindVerse, Rewind Studio, RewindML, Rewind Replay and Rewind Insights in India and intended markets.
2. Review relevant classes, goods/services descriptions, owners, status and geographic scope with counsel.
3. Check company names, domains, package registries, GitHub organization/repository names and social handles.
4. Record the clearance decision and permitted usage in a brand ADR.
5. If Rewind Studio cannot be cleared, retain RewindVerse as the umbrella name and choose a cleared workspace sub-brand before public release.

Reference starting points: IP India official “Search Existing Trademarks” portal (https://www.ipindia.gov.in/trade-marks-before-you-apply-search-existing-trademarks) and IP India Public Search (https://tmrsearch.ipindia.gov.in/tmrpublicsearch/). The indexed Rewind Studio listing is secondary-source information and must be confirmed against the official register (https://www.registerkaro.in/trademark-search/rewind-studio-5976801; checked 7 November 2026).

### 2.6.5 Brand story and message hierarchy

**Brand idea:** Every supported training run contains a sequence of choices, parameter updates, losses, gradients and outcomes. RewindVerse makes that sequence inspectable and teachable. The word “Rewind” expresses replay and inspection; “Verse” expresses one coherent ecosystem of experiments, tools and learning experiences.

**Primary tagline:** *Every Model Has a Story.*

**Product promise:** *Train a model, then replay how it learned.*

**One-sentence description:** RewindVerse turns supported machine-learning training runs into portable experiences that people can replay, inspect, compare and learn from.

**Elevator pitch:** RewindVerse is a browser-first ML training replay and learning platform. It captures supported training runs as portable Rewind Traces, then lets learners, instructors and developers replay recorded steps, inspect the signals a trace actually contains, compare experiments and explain training behaviour using evidence. It does not claim to reconstruct information that was never recorded.

**Recommended website/product hero copy:**

- Headline: **Every Model Has a Story.**
- Supporting line: **Train a model, then replay how it learned.**
- Description: Run a supported experiment, inspect the recorded training steps, compare optimizer behaviour and share evidence-linked learning experiences.
- Primary action: **Open Rewind Studio** (use externally only after sub-brand clearance).
- Secondary action: **Explore a Rewind Trace**.

**Message hierarchy:** Platform name → tagline → product promise → product descriptor → specific module names. Do not put module names ahead of the RewindVerse platform identity on the public landing page.

### 2.6.6 Visual identity direction

The PRD establishes a design direction, not a finished registered logo. The proposed wordmark is **REWINDVERSE** as a display treatment and **RewindVerse** in running text. The proposed symbol direction is a compact rewind motif (two left-pointing chevrons) integrated with a simple sequence of connected nodes or a trace line. Avoid generic robot heads, brains, magic sparkles or imagery that suggests the product is an autonomous AI advisor.

| Token / element | Proposed direction | Usage rule |
|---|---|---|
| Navy `#1A3454` | Structure, headings and stable navigation | Primary brand anchor; use with verified text contrast |
| Blue `#295B8A` | Main actions, links and selected states | Consistent interaction colour; include shape/label cues |
| Teal `#23777D` | Validated/positive states and evidence paths | Never use colour alone to indicate success |
| Amber `#D18B32` | Warnings, attention and learning prompts | Pair with explicit warning text and icon |
| Slate `#5F6C7A` | Secondary labels and metadata | Maintain readable contrast on the selected surface |
| UI typography | Accessible sans-serif for interface; monospace for code, trace IDs and values | Use a clear hierarchy and avoid small dense labels |
| Charts and diagrams | Restrained gridlines, direct labels, clear units and step markers | Include keyboard navigation, accessible summaries and tabular alternatives |
| Iconography | Simple line icons based on replay, trace, compare, inspect and learn metaphors | Keep one visual language; do not rely on icon-only controls without labels |

All final colour pairs must pass the project's WCAG AA contrast checks. The values above are design tokens to validate, not a claim that every pairing already passes. User interfaces must continue to distinguish recorded data, computed diagnostics, imported/inferred values and missing capabilities through text and visual treatment, not colour alone.

### 2.6.7 Product naming and experience language

| User-facing term | Meaning in RewindVerse | Avoid using it to mean |
|---|---|---|
| Experiment | A configured training or learning run | A trace file itself |
| Run | One execution of an experiment | A guarantee of determinism across different hardware/frameworks |
| Rewind Trace | A portable record of a run and its declared data | A complete model checkpoint unless it explicitly contains one |
| Replay | Navigation through recorded states and supported derived views | Retraining or reconstruction of unrecorded states |
| Insight | A heuristic finding tied to evidence and limitations | A definitive diagnosis or causal explanation |
| Compare | Side-by-side analysis with declared step/metric alignment | An assumption that unlike step units are directly comparable |
| Lesson | A guided learning sequence with prediction, activity and reflection | A passive marketing page |

The RewindVerse naming hierarchy is shown below. Rewind Studio is the current working name for the user-facing workspace and remains subject to formal clearance.

![RewindVerse brand and product architecture](rewindverse_prd_assets/10_brand_architecture.png){width=6.3in}

### 2.6.8 Brand governance and release checks

- The platform is always named **RewindVerse**. Product modules inherit the platform identity and must not be represented as independent companies.
- Keep the tagline and product promise distinct: the tagline is a brand idea; the promise describes the actual workflow.
- Rewind Studio is a working sub-brand only until legal clearance is documented. If counsel advises against use, choose and clear an alternative workspace name without changing the RewindVerse umbrella brand.
- Before public release, validate the wordmark, logo, module names, domain, GitHub organisation/repository, Python package name, app-store/search presence and relevant social handles.
- Design files must specify light/dark usage, minimum logo size, clear space, approved colours, monochrome fallback, favicon/app icon and accessible text alternatives.
- Record approved names, ownership, permitted use and clearance date in ADR-011. Update the brand glossary and all customer-facing surfaces from one canonical naming source.



---

# 3. Problem statement and opportunity

## 3.1 Problem statement

ML learners often see an algorithm's formula, a final metric or a static chart, but struggle to connect parameter updates, gradient behaviour, optimisation choices and model outcomes over time. Instructors need reproducible demonstrations of these invisible processes. Python developers can inspect training logs in existing tools, but those records may not be portable, easy to replay as a learning experience, or explicit about which model internals were actually captured.

As a result, users can observe that training improved or failed without clearly understanding how it happened, at which step the behaviour changed, or what evidence supports the explanation.

## 3.2 User problems

| ID | User problem | Current consequence | Desired outcome |
|---|---|---|---|
| P-01 | Static charts hide the sequence of training updates | Learners do not connect a metric change to a specific step | Scrub and inspect any recorded step |
| P-02 | Parameters, gradients and metrics are disconnected across views | It is hard to understand why an optimizer behaved differently | Synchronized replay across available signals |
| P-03 | Many educational examples are isolated and non-reproducible | Users cannot inspect, save or share the exact run | Portable reproducible traces |
| P-04 | Existing logs do not always state what information is missing | Users may assume unrecorded internals can be reconstructed | Explicit capability and fidelity report |
| P-05 | Instructors need demonstrations that learners can manipulate | Static slides and videos provide limited exploration | Guided experiments and checkpoints |
| P-06 | Python developers need a bridge from local training to explanation | Training insight remains locked in a local workflow or tool | SDK and common trace viewer |
| P-07 | Importing existing logs can lose or misinterpret meaning | Different step units and aggregation conventions are confused | Mapping preview and import fidelity report |

## 3.3 Jobs to be done

- When I learn an algorithm, I want to change one parameter and observe how the training path changes, so I can understand the mechanism.
- When a run behaves unexpectedly, I want to locate the relevant step and inspect the evidence, so I can form a grounded hypothesis.
- When I teach a concept, I want a reproducible demonstration that students can explore, so the lesson is more than a static explanation.
- When I train locally in Python, I want to record selected states without rewriting my training loop, so I can replay and share the run.
- When I import an external log, I want to know what was preserved and discarded, so I do not mistake a partial record for a complete trace.

## 3.4 Assumptions to validate

| Assumption | Validation method | Decision rule |
|---|---|---|
| Learners struggle to connect update-level behaviour to outcomes | Past-behaviour interviews and task tests | Reposition if fewer than 4 of 10 target learners describe a recent concrete problem |
| Replay adds value beyond a conventional dashboard | Compare task completion with an existing workflow | Continue if users can explain the training event more accurately or efficiently |
| Instructors value reusable interactive traces | Two or more instructor pilots | Do not prioritise classroom tooling without repeat teaching use |
| Python recording is valuable after the replay viewer works | SDK prototype with Python developers | Keep SDK scope narrow if users prefer their existing tracking tools |
| Portable trace files reduce lock-in and simplify sharing | Independent producer/consumer tests | Do not market RVTS as an ecosystem standard until third parties use it |

---

# 4. Users, personas and jobs to be done

## 4.1 Primary persona: self-directed ML learner

**Profile:** Student or early-career practitioner learning supervised learning, optimisation and neural networks.  
**Goal:** Understand why a model converges, diverges, plateaus or overfits.  
**Pain points:** Formula-to-code disconnect, static graphs, terminology overload and difficulty reproducing examples.  
**Success:** Completes an experiment, predicts an outcome, replays the result and explains it using evidence.

## 4.2 Primary persona: instructor / teaching assistant

**Profile:** University instructor, TA, bootcamp mentor or technical educator.  
**Goal:** Demonstrate ML concepts accurately and allow learners to experiment safely.  
**Pain points:** Preparing reproducible demos, explaining model internals and assessing conceptual understanding.  
**Success:** Uses a lesson or shared trace in a teaching session and reuses it with minimal setup.

## 4.3 Secondary persona: Python ML developer

**Profile:** Developer or data scientist training models locally with NumPy, scikit-learn or PyTorch.  
**Goal:** Record, inspect, compare and communicate selected training behaviour.  
**Pain points:** Instrumentation overhead, tool-specific data, noisy logs and incomplete capture of model state.  
**Success:** Adds the recorder with low overhead, opens the trace in RewindVerse and shares a faithful view.

## 4.4 Future persona: course coordinator / classroom owner

**Profile:** Runs a course, bootcamp or internal training programme.  
**Goal:** Assign experiments, view participation and understand learning progress.  
**Horizon:** Post-v1 classroom goal, gated by instructor pilots and privacy review.

## 4.5 Stakeholders

- Product owner: scope, outcome measures and prioritisation.
- Technical lead: architecture, ADRs, quality gates and delivery risks.
- ML engineer: numerical methods, objectives, diagnostics and parity.
- Frontend engineer: usability, state management, visualisation and accessibility.
- Developer-experience owner: Python SDK, CLI and docs.
- Security/privacy reviewer: threat model, retention, sharing and data handling.
- Pilot users: learners, instructors and Python developers.

---

# 5. Goals, success outcomes and goal conversion

## 5.1 North-star outcome

**Replay-assisted understanding:** the proportion of first-time users in a measured usability cohort who can complete a core replay task and correctly explain the observed training event using trace evidence.

This is a product outcome, not a vanity traffic metric. It should be reported with sample size, task definition and confidence/limitations.

## 5.2 Product goals

| Goal ID | Goal | Target / evidence | Horizon |
|---|---|---|---|
| G-01 | Make the first experiment fast to start | Median time to first successful run under 60 seconds in observed usability tests | v0.1 |
| G-02 | Make training traces portable and valid | Browser trace passes TypeScript/Ajv and Python validation against the same conformance corpus | v0.1 |
| G-03 | Make replay faithful | Selected step values match source records; no implicit interpolation | v0.1 |
| G-04 | Make training behaviour understandable | Users correctly explain a tested event after replay; report measured result | v0.1–v1.0 |
| G-05 | Unify browser and Python workflows | Python-produced trace opens and replays in the browser with documented capability level | v1.0 |
| G-06 | Support existing tools | CSV plus selected tracker imports with field mapping and fidelity reports | v1.0–v1.2 |
| G-07 | Make RewindVerse useful to instructors | Reviewed lessons, challenges and reusable read-only traces | v0.2–v1.1 |
| G-08 | Make experiments comparable | Run comparison and configuration diffs with aligned step semantics | v0.2–v1.0 |
| G-09 | Surface training issues responsibly | Evidence-linked diagnostic detectors evaluated against labelled synthetic traces | v0.1–v1.0 |
| G-10 | Add data observability to explain model behaviour | Data profile, imbalance, missingness and cautious leakage warnings | v1.1+ |
| G-11 | Add model intelligence and evaluation | Baselines, learning curves, calibration, error slicing and model reports | v1.2+ |
| G-12 | Expand algorithm learning | Regularisation, bias-variance, trees, KNN, SVM, kernels and scheduler labs | v1.1+ |
| G-13 | Expand neural and transformer learning | Gradient-flow, initialization, CNN visualisation and bounded transformer demos | v1.2–v2 |
| G-14 | Build reusable teaching workflows | Classroom spaces, assignments and progress views | v2, after instructor validation |
| G-15 | Build a developer ecosystem | More framework adapters, Jupyter widget, stable API and governed extension interface | v1.2–v2 |
| G-16 | Enable safe knowledge sharing | Read-only share links, embeds, curated gallery and fork-from-template | v1.0–v2 |
| G-17 | Prove public product quality | Reproducible deployment, performance/security/accessibility reports and independent setup test | v1.0 |
| G-18 | Validate market readiness | Interviews, usability, beta retention and instructor-pilot evidence | v1.0 |

## 5.3 Explicit conversion of former non-goals into product goals

The previous development blueprint marked several capabilities as “non-goals for v1”. This PRD does not treat all of them as permanently excluded. It promotes the aligned opportunities into staged goals, while protecting v1 from scope explosion.

| Former non-goal / deferred area | New product goal | New horizon | Guardrail and scope boundary |
|---|---|---|---|
| Broad data preparation and feature engineering | **Data Observatory:** dataset profiling, missingness, duplicates, outliers, imbalance, type override, privacy hints and cautious leakage flags | v1.1+ | Begin with local profile-only processing; no attempt to become a full data-wrangling platform |
| General model evaluation | **Model Intelligence:** baseline comparison, learning curves, calibration, threshold analysis, error slices and model cards | v1.2+ | Metrics require appropriate held-out data and declared evaluation context; no unsupported causal or fairness claims |
| More algorithms beyond gradient descent/logistic regression/MLP | **Algorithm Studio:** bias-variance, regularisation, schedulers, decision trees, KNN, SVM, Naive Bayes and gradient boosting visualisations | v1.1+ | Each algorithm needs a complete lesson, correct computation and tests; do not add shallow catalogue entries |
| Transformer and LLM education | **Transformer Explorer:** tokenization, positional encoding, attention mechanics, multi-head comparison and decoding controls; optionally a small licensed pretrained model for inference demos | v1.2–v2 | No claim to explain commercial model reasoning; no large-model training or fine-tuning on shared infrastructure |
| Distributed and multi-framework training support | **Expanded recorder integrations:** Keras, Lightning, XGBoost and selected distributed metadata capture | v1.2+ | Support only tested configurations; record limitations and overhead; no universal compatibility claim |
| Notebook integrations | **Jupyter experience:** notebook widget or generated local viewer links | v1.2+ | Viewer remains the primary replay engine; notebooks are an integration surface, not a separate product |
| Full classroom LMS | **Classroom Mode:** cohorts, assignments, reusable traces, completion and progress summary | v2 | Does not attempt to replace LMS, grading, attendance or student-information systems |
| Public social/community features | **Curated Trace Gallery and Forkable Examples** | v2 | Moderated, read-only by default; no open-ended social feed or direct messaging in initial versions |
| User-uploaded plugins | **Governed extension system** | v2+ | Declarative, signed/allowlisted extension metadata first; no arbitrary code execution from uploaded plugins |
| 3D loss surfaces for all models | **Bounded 3D learning visualisations** for registered low-dimensional objectives | v1.1+ | Never imply a real high-dimensional neural network has a directly observable 3D loss surface |
| Hosted training | **Optional managed execution for approved, prebuilt recipes** only if demand justifies it | Post-v1 decision | Isolated ephemeral jobs, strict quotas and security review; never arbitrary user code or notebooks |
| Enterprise/organization controls | **Team administration and access controls** only if validated demand emerges | v2+ | Not a v1 requirement; no premature enterprise complexity |

### 5.3.1 Former non-goals that remain genuinely out of scope

These are not merely postponed; they conflict with the product's safety, focus or credibility unless a major future strategic decision is made:

- Executing arbitrary uploaded Python, notebooks, shell scripts, pickles or plugins in the product service.
- Training or fine-tuning large language models or large vision models as a hosted service.
- Replacing a complete production MLOps platform, model registry, feature store or deployment system.
- Claiming to reveal the private internal reasoning or “thoughts” of commercial LLMs.
- Blockchain, token systems, speculative marketplaces or unrelated social-network mechanics.
- Automatically asserting causal explanations, fairness compliance or model safety from limited metrics.
- Deserializing arbitrary pickle or executable model artifacts.

These exclusions are deliberate product boundaries. The future goals above are staged capabilities, not promises for the first release.

## 5.4 Goal hierarchy

- **Now:** prove training → trace → replay, establish numerical correctness, deliver first lesson and CSV entry path.
- **Next:** add logistic regression, run comparison, diagnostics maturity and Python recording.
- **Then:** add data observability, model intelligence and broader algorithm coverage based on user evidence.
- **Later:** expand classroom, transformer, integration and community experiences only when core product usage and maintenance capacity justify them.

---

# 6. Product scope and release strategy

## 6.1 v1.0 product scope

### Must ship for v1.0

- Browser-first application with no-account first-use path.
- Training Web Worker and deterministic supported algorithms.
- 2D objective lab with SGD, Momentum and Adam.
- RVTS stable v0.1 contract, schema, Python/TypeScript validators and conformance tests.
- Capability-aware replay viewer with timeline, metric chart, event annotations and recorded parameter/gradient panels where present.
- CSV metrics importer with mapping preview and fidelity report.
- Logistic regression lab and a small MLP training/replay path according to staged v0.2/v0.3 gates.
- At least three reviewed lessons and a basic challenge/predict-before-run flow.
- Python recorder for custom loops and a defined PyTorch subset; CLI validate/inspect/view.
- Run comparison for compatible traces.
- Evidence-linked initial diagnostics.
- Optional safe read-only sharing and embed, only after privacy/security gates.
- Accessibility, security, performance, user documentation and reproducible public deployment.

### Nice-to-have only if core gates pass

- TensorBoard scalar importer.
- MLflow/W&B import paths.
- Training Intelligence Report export.
- Social preview cards.
- Additional lesson packs.

## 6.2 Release tiers

| Release | Scope | Exit gate |
|---|---|---|
| v0.1 — Replay foundation | Optimizer lab, RVTS, validator, replay viewer, CSV import, one lesson, first diagnostics | Real run → valid trace → replay → export/reopen works end to end |
| v0.2 — Supervised learning | Logistic regression, decision boundary, threshold slider, two-run comparison, three lessons total | Objective and predictions pass parity tests; users complete tasks |
| v0.3 — Neural learning | Small MLP, forward/backprop summaries, activations and gradient-flow views | Gradient checks and snapshot/replay tests pass |
| v1.0 — Public product | Python SDK/CLI, defined PyTorch path, import maturity, diagnostics, sharing/embed, hardening, docs and pilots | Cross-language trace proof, security/accessibility/performance gates and user evidence complete |
| v1.1 — Data and algorithm expansion | Data Observatory profile, regularisation and bias-variance labs, learning-rate schedules, richer algorithm gallery | Research evidence and complete implementation capacity |
| v1.2 — Model intelligence | Baselines, calibration, learning curves, error slicing, model card and report export | Evaluation context and statistical caveats implemented and reviewed |
| v1.3 — Ecosystem | Jupyter widget, more adapters, stable API, lineage and selected experiment search visualisation | Developer demand, stable APIs and maintenance owner |
| v2.0 — Teaching and advanced learning | Classroom Mode, curated gallery/forking, transformer explorer, CNN/digit demo and bounded fairness/counterfactual lessons | Instructor pilots, security review and content review |

## 6.3 Product boundary by execution mode

| Capability | v1 default | Future possible state |
|---|---|---|
| Browser lab training | Local Web Worker | Expanded local WebGPU/WASM only after benchmark and support review |
| User's Python training | User's own environment + recorder | Additional framework adapters |
| Trace parsing | Local parser worker | Optional server-side validation mirror |
| Import | Local-first | Batch conversion CLI/API with explicit quota |
| Sharing | Optional read-only upload | Classroom/team spaces with retention and access policy |
| Hosted training | Not available | Only predefined, audited recipes; no arbitrary code execution |

---

# 7. Product experience and information architecture

## 7.1 Primary navigation

1. **Explore** — home, concept gallery and featured guided experiments.
2. **Labs** — Optimizer Lab, Logistic Regression Lab, Neural Network Lab and future Algorithm Studio.
3. **Import & Record** — Trace Import Center, CSV importer, Python SDK/CLI guidance and supported integrations.
4. **Replay** — open, scrub, inspect and annotate a trace.
5. **Compare** — compare compatible runs and configuration differences.
6. **Learn** — lessons, challenges, glossary and misconception demonstrations.
7. **Reports** — Training Intelligence Reports and future Model Cards.
8. **Share** — read-only links, embeds and curated gallery (release-gated).
9. **Docs** — user guides, RVTS specification, SDK/API docs and changelog.

## 7.2 Screen inventory

| Screen | Primary purpose | Required states |
|---|---|---|
| Landing / Explore | Explain promise and route to first action | New user, returning user, feature unavailable |
| Onboarding | Let user select learn/import/record path | Skip, guided, success, error |
| Optimizer Lab | Configure and run a real objective | Idle, configured, running, paused, complete, cancelled, failed |
| Logistic Regression Lab | Teach classification and decision boundaries | Data selected, training, prediction, comparison |
| Neural Network Lab | Show forward/backward behaviour | Architecture, training, activation/gradient inspection |
| Trace Import Center | Select file/source, map fields, validate and import | Drag/drop, preview, warning, invalid, imported |
| Replay Viewer | Inspect a valid trace | Loading, valid, partial, unsupported capability, corrupt/error |
| Run Compare | Compare compatible runs | Compatible, partially aligned, incompatible |
| Lesson / Challenge | Guide prediction, experiment and reflection | Start, checkpoint, feedback, completion |
| Training Report | Present result, events and limitations | Generated, exportable, incomplete data warning |
| Share Dialog | Publish read-only representation | Consent, expiry, delete, copied link, failure |
| Documentation | Explain usage and supported scope | Versioned docs, examples, troubleshooting |

## 7.3 Interaction standards

- Every long-running operation exposes progress, pause/cancel where meaningful and an actionable error.
- Every chart has an accessible textual summary and tabular alternative.
- Every diagnostic links to the relevant evidence range.
- Every imported trace shows its source and fidelity limitations.
- Every user-generated share is private until explicit confirmation.
- A user can always export a locally generated trace.
- Empty states explain the next useful action rather than showing blank panels.

---

# 8. End-to-end user journeys

## 8.1 Journey A — Learn by experimenting

1. User opens Explore without account creation.
2. Selects “Try gradient descent”.
3. Chooses an objective, starting point, learning rate, optimizer and seed.
4. Sees a short explanation of expected controls and the active objective.
5. Starts a run. Training runs in a Web Worker, not on the UI thread.
6. Worker streams batched progress and records actual values.
7. System produces an RVTS trace and validates it.
8. Viewer shows loss, parameter path, gradient summaries and event timeline only where available.
9. User scrubs to an event and inspects the exact recorded values.
10. Lesson asks the user to explain or predict the next behaviour.
11. User exports the trace or shares it after explicit privacy review.

**Success:** user completes a meaningful run in under 60 seconds median, then reopens the exported trace with the same evidence.

## 8.2 Journey B — Open an existing trace

1. User chooses Import.
2. Selects `.rvtrace`, `.rvtrace.gz` or a supported CSV/connector export.
3. Parser worker enforces file, line, depth, decompression and numeric limits.
4. Importer previews field mapping and flags ambiguous step units or dropped fields.
5. Validator returns structured errors/warnings.
6. User confirms conversion if needed.
7. Viewer creates a capability map and displays supported panels.
8. User exports the normalized trace or a fidelity report.

**Success:** no fabricated signals; every transformed/dropped field appears in the conversion report.

## 8.3 Journey C — Record from Python

1. Developer installs the supported `rewindverse-trace` package.
2. Adds a `RunRecorder` to a custom loop or supported PyTorch workflow.
3. Configures sampling/cadence and privacy level.
4. Recorder writes incrementally; logging errors do not mask the training exception.
5. Developer closes or recovers the partial trace.
6. CLI validates/inspects the file.
7. User opens it in the browser viewer.

**Success:** SDK integration test passes; overhead is benchmarked; unsupported internals are clearly declared.

## 8.4 Journey D — Compare two runs

1. User selects two traces.
2. System compares model/objective identity, step unit, series, data metadata and configurations.
3. Compatible series align according to explicit step semantics; incompatible units are not silently coerced.
4. UI highlights configuration differences and metric trajectories.
5. User inspects a divergence or event range.
6. Report explains which values are comparable and which are not.

## 8.5 Journey E — Instructor runs a lesson

1. Instructor selects a reviewed lesson.
2. Learner predicts the outcome before executing.
3. Learner manipulates a parameter and runs the experiment.
4. Replay shows the observed result and links it to the lesson concept.
5. A brief check tests understanding.
6. Learner exports or submits a trace only if the instructor workflow explicitly supports it.

## 8.6 Journey F — Data and model quality review (future)

1. User imports a supported CSV locally.
2. Data Observatory infers column types and lets the user override ambiguous choices.
3. It reports missingness, duplicates, constant columns, imbalance, outlier indicators and possible PII.
4. Optional leakage heuristics explain the features and checks that triggered a warning.
5. User reviews preprocessing diffs and selected transformations.
6. Model Intelligence evaluates against a declared holdout/split and baseline.
7. Report states dataset limitations and evaluation context.

This future journey must not imply that simple correlations prove leakage or that a model card guarantees responsible use.

---

# 9. Functional requirements and acceptance criteria

Priority legend: **P0** = must for first usable product; **P1** = required for v1.0; **P2** = planned expansion; **P3** = conditional future goal. Each item requires design, implementation, tests and docs before “Verified”.

## 9.1 Application and onboarding

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-APP-001 | Offer a no-account first-use path | P0 | User can start a sample lab and open a local trace without sign-in |
| FR-APP-002 | Provide clear navigation for Labs, Import, Replay, Compare and Learn | P0 | Each route works directly and has a meaningful empty state |
| FR-APP-003 | Explain product promise and supported workflows | P0 | New user identifies at least one valid next action in usability test |
| FR-APP-004 | Preserve user operation state safely | P1 | Refresh/reopen behaviour is documented; local data is versioned and recoverable where possible |
| FR-APP-005 | Provide onboarding path selection | P1 | User can choose experiment, import or Python recording without forced account creation |

## 9.2 Training and experiment engine

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-ML-001 | Run registered objective functions | P0 | Quadratic, Rosenbrock and saddle fixtures produce expected values and gradients |
| FR-ML-002 | Implement SGD, Momentum and Adam | P0 | Formula conventions documented and tested against fixed fixtures |
| FR-ML-003 | Run in Web Worker | P0 | Long run does not block keyboard/UI interaction; cancellation works |
| FR-ML-004 | Use seeded deterministic data generation | P0 | Same seed and config reproduce the same browser fixture under supported runtime assumptions |
| FR-ML-005 | Record actual run values | P0 | Trace values are produced by the computation engine, not by UI simulation |
| FR-ML-006 | Support pause/resume/cancel where algorithm permits | P1 | State transitions are deterministic and documented |
| FR-ML-007 | Add logistic regression and decision boundary | P1 | Predictions, loss and gradients pass tests; regularization and intercept conventions explicit |
| FR-ML-008 | Add small MLP with forward/backprop summaries | P1 | Gradient checks pass away from non-differentiable points; capture scope is explicit |
| FR-ML-009 | Add scheduler, regularisation and bias-variance demos | P2 | Each lesson is mathematically reviewed and has fixtures |
| FR-ML-010 | Add tree, KNN, SVM, Naive Bayes and boosting visualisations | P2 | Every algorithm has a bounded dataset, complexity budget and verified expected output |

## 9.3 Trace and replay

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-TRACE-001 | Generate a valid RVTS JSONL trace | P0 | Manifest first; records validate; footer/checksum rules followed when present |
| FR-TRACE-002 | Validate trace against canonical schema | P0 | TypeScript/Ajv 2020 and Python validator run shared fixtures |
| FR-TRACE-003 | Enforce semantic checks beyond JSON Schema | P0 | Step units, cadence, shapes, timestamps, finite-number encoding and limits checked |
| FR-TRACE-004 | Support bounded streaming parse | P0 | Large-file parse is incremental; memory and decompression limits are enforced |
| FR-TRACE-005 | Build capability map from validated content | P0 | Only supported panels appear; absent fields are never inferred |
| FR-TRACE-006 | Replay exact recorded steps | P0 | Selected step values match input values; no interpolation by default |
| FR-TRACE-007 | Provide scrubber, play/pause, speed and jump controls | P0 | Controls are keyboard accessible and synchronize all displayed series |
| FR-TRACE-008 | Export and reopen trace | P0 | Round-trip preserves semantic content and capability declaration |
| FR-TRACE-009 | Support snapshots/tensor artifacts | P1 | Encoding, limits and tensor metadata validated; binary artifact support versioned |
| FR-TRACE-010 | Support future trace migration | P2 | Explicit migration report and version compatibility policy |

## 9.4 Import and interoperability

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-IMP-001 | Import metrics CSV | P0 | Mapping preview includes step, series, aggregation and missing-value handling |
| FR-IMP-002 | Produce import fidelity report | P0 | Lists mapped, transformed, dropped and unsupported fields |
| FR-IMP-003 | Import TensorBoard scalar exports | P1 | Source step and tag are preserved; aggregation limitations shown |
| FR-IMP-004 | Import MLflow run metrics/artifacts | P1 | Run identity and artifact mappings documented; no unsupported internal state invented |
| FR-IMP-005 | Import W&B export data | P2 | Version-specific mapping tests and fidelity report |
| FR-IMP-006 | Maintain integration compatibility matrix | P1 | Every importer lists tested source versions and known limitations |

## 9.5 Python SDK and CLI

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-SDK-001 | Provide a `RunRecorder` API | P1 | Custom loop can log metrics, config, annotation and selected snapshots |
| FR-SDK-002 | Write incrementally | P1 | Interrupted run leaves a readable partial trace when possible |
| FR-SDK-003 | Avoid masking training errors | P1 | Recorder failure surfaces a warning and preserves original training exception |
| FR-SDK-004 | Provide sampling and batching controls | P1 | GPU synchronisation overhead is avoidable; overhead report published |
| FR-SDK-005 | Support defined PyTorch adapter | P1 | CI tests supported CPU path and explicitly scoped GPU path if available |
| FR-SDK-006 | Provide CLI validate/inspect/convert/view | P1 | Commands return stable exit codes and actionable errors |
| FR-SDK-007 | Support selected sklearn incremental estimators | P2 | Only estimators with genuine iterative state are described as stepwise; others are final-fit summaries |
| FR-SDK-008 | Add Keras/Lightning/XGBoost adapters | P2 | Each adapter has compatibility and overhead tests |
| FR-SDK-009 | Add Jupyter widget | P3 | Widget embeds viewer with same trace semantics, no duplicate replay implementation |

## 9.6 Diagnostics and explanations

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-DIAG-001 | Compute diagnostics from raw trace signals at read time | P0 | Finding identifies detector/version, signal requirements and evidence range |
| FR-DIAG-002 | Detect divergence/non-finite values | P0 | Synthetic tests detect labelled events and do not label ordinary finite changes |
| FR-DIAG-003 | Detect plateau | P0 | Configurable window, smoothing and patience are documented and tested |
| FR-DIAG-004 | Detect overfit onset | P1 | Requires train and validation signals; no inference when validation signal absent |
| FR-DIAG-005 | Detect gradient vanishing/explosion | P1 | Requires defined gradient summary; threshold and window visible |
| FR-DIAG-006 | Detect learning-rate instability | P1 | Requires learning-rate and compatible objective/training signals |
| FR-DIAG-007 | Provide template-based evidence narration | P1 | Text includes actual values and steps; language says “may indicate” |
| FR-DIAG-008 | Evaluate detectors quantitatively | P1 | Labeled synthetic corpus and precision/recall/false-positive report published |
| FR-DIAG-009 | Support AI-generated explanation | P3 | Only with grounding/citations to trace data, privacy controls and an explicit AI label |

## 9.7 Learning and teaching

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-LEARN-001 | Provide reviewed lessons | P0 | One complete lesson in v0.1; three by v0.2 |
| FR-LEARN-002 | Add predict-before-run prompt | P1 | User prediction is captured locally and compared with actual outcome |
| FR-LEARN-003 | Add challenge mode | P1 | Task has defined success conditions and no misleading scoring |
| FR-LEARN-004 | Add misconception examples | P2 | Examples reproduce the concept and are reviewed by an ML educator |
| FR-LEARN-005 | Add contextual glossary and formula-code-visual links | P2 | Terms and symbols open a relevant explanation without losing run state |
| FR-LEARN-006 | Add classroom assignments and progress | P3 | Privacy, consent, access and deletion workflows pass review |

## 9.8 Run comparison, reporting and sharing

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-COMP-001 | Compare two compatible traces | P1 | Compatibility check explains aligned and incompatible fields |
| FR-COMP-002 | Show config diff and metric overlays | P1 | Diff comes from explicit configuration/series values |
| FR-COMP-003 | Export Training Intelligence Report | P1 | Includes summary, key metrics, detected events, data limitations and trace provenance |
| FR-SHARE-001 | Publish read-only trace link | P1 | Explicit consent, expiry, delete and visibility controls exist |
| FR-SHARE-002 | Embed replay securely | P1 | Sandboxed iframe, strict content origin and documented postMessage contract |
| FR-SHARE-003 | Generate social preview card | P2 | Preview omits private data by default |
| FR-SHARE-004 | Curated public gallery and forkable examples | P3 | Moderation, takedown and attribution process exists |

## 9.9 Data Observatory and Model Intelligence (future product goals)

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-DATA-001 | Profile missingness, duplicates and constant columns | P2 | Results include column-level evidence and processing stays local by default |
| FR-DATA-002 | Detect imbalance and show distribution | P2 | Class counts/ratios visible; remedies are suggestions, not automatic claims |
| FR-DATA-003 | Detect outliers using IQR/z-score and optional isolation forest | P2 | Method and parameters are shown; before/after preview available |
| FR-DATA-004 | Allow type overrides and preprocessing diff | P2 | User can see original and transformed metadata |
| FR-DATA-005 | Flag possible data leakage | P2 | Heuristic wording, feature evidence and limitations shown; no definitive diagnosis from correlation alone |
| FR-DATA-006 | Warn about likely PII columns | P2 | Local detection, configurable confirmation and no automatic upload |
| FR-MI-001 | Show dummy baseline and learning curves | P2 | Split strategy and sample size visible |
| FR-MI-002 | Show calibration curve and threshold analysis | P2 | Requires probability outputs and declared holdout data |
| FR-MI-003 | Show error slices and fairness metrics | P2 | User-defined groups, minimum sample warnings, metric caveats and sensitive-data safeguards |
| FR-MI-004 | Generate model card | P2 | Intended use, data, evaluation, limitations and provenance are mandatory sections |
| FR-MI-005 | Support counterfactual and feature effect views | P3 | Assumptions, feasibility constraints and causal limitations explicit |
| FR-EXP-001 | Visualise hyperparameter search | P2 | Search objective, seed, trials and metric context preserved |
| FR-EXP-002 | Show experiment lineage | P2 | Dataset → preprocessing → model → run links are traceable and versioned |

---

# 10. Non-functional requirements and quality attributes

| ID | Quality | Requirement / target | Verification |
|---|---|---|---|
| NFR-PERF-001 | Interaction | UI interactions remain responsive during training and parsing | Playwright + browser performance profile |
| NFR-PERF-002 | First experience | Median time to first meaningful run under 60 seconds for target users | Moderated/unmoderated usability test |
| NFR-PERF-003 | Large trace | Publish benchmark at 100k steps for a declared L0/L1 trace profile | Reproducible benchmark on named hardware |
| NFR-PERF-004 | Memory | Parser memory remains bounded by documented chunk/window policy | Heap/memory profile; stress fixture |
| NFR-REL-001 | Failure isolation | Worker crash/error does not crash the main app | Fault injection tests |
| NFR-REL-002 | Trace integrity | Corrupt or partial trace returns useful error, not silent success | Parser and import tests |
| NFR-REL-003 | Local persistence | Storage schema versioned; quota/eviction warning and export path provided | Browser storage tests |
| NFR-SEC-001 | Untrusted files | File parser enforces compressed/decompressed size, line length, depth, value and ratio limits | Security fixture suite |
| NFR-SEC-002 | No arbitrary code | Uploaded traces and plugin metadata never execute code | Static review and penetration tests |
| NFR-SEC-003 | Sharing | User content stored on isolated origin with restrictive headers | Security header and embed tests |
| NFR-PRIV-001 | Data minimisation | Analytics never include trace contents, dataset rows or arbitrary user text | Event schema review |
| NFR-PRIV-002 | Consent | Sharing/upload actions require informed confirmation | E2E consent tests |
| NFR-ACC-001 | Accessibility | Target WCAG 2.2 AA for key journeys | Automated axe checks + manual keyboard/screen-reader review |
| NFR-PORT-001 | Browser support | Latest two stable releases of agreed desktop browsers, subject to documented matrix | Playwright browser matrix |
| NFR-PORT-002 | Responsive | Core view usable on desktop and tablet; mobile read-only where feasible | Responsive test matrix |
| NFR-MAINT-001 | Code quality | Strict TypeScript, lint/type-check, module boundaries and ADRs | CI gates and code review |
| NFR-OBS-001 | Observability | Errors and aggregate product events monitored without trace contents | Error monitoring and event allowlist audit |
| NFR-I18N-001 | Internationalisation readiness | User-visible copy separated from logic; no hard-coded assumptions in formatting | Code review; later localization test |

All numeric performance targets are hypotheses until a reproducible baseline is published. Do not market them as achieved before measurement.

---

# 11. Product architecture and system boundaries

## 11.1 Architecture overview

RewindVerse uses a modular browser-first architecture. The web UI orchestrates use cases; domain packages hold ML, trace and replay logic; dedicated workers handle computation and untrusted parsing; IndexedDB and file export provide local persistence; an optional narrow API manages user-consented share objects.

![RewindVerse product context](rewindverse_prd_assets/01_product_context.png){width=6.4in}

## 11.2 Component architecture

![RewindVerse logical component architecture](rewindverse_prd_assets/02_component_architecture.png){width=6.4in}

### Main modules

| Module | Responsibility | Must not do |
|---|---|---|
| Web application | Navigation, forms, state and orchestration | Perform long-running model training on main thread |
| ML Core | Objectives, models, loss, optimizers, RNG and fixtures | Depend on UI libraries |
| Training Worker | Run supported algorithms and stream batches | Access arbitrary user code |
| RVTS package | Parse, validate, encode, checksum, capabilities and limits | Execute extension payloads |
| Parser Worker | Decode/decompress and validate imported traces | Trust file-supplied HTML/code |
| Replay Engine | Step selection, alignment, capability map and derived diagnostics | Invent missing training states |
| Visualization layer | Charts, parameter path, event timeline and tables | Claim values not supplied by replay engine |
| Lesson engine | Prediction, checkpoints, prompts and completion state | Change algorithm results to fit teaching narrative |
| Python SDK | Record selected local state and produce RVTS | Mask training errors or force high-frequency GPU synchronisation |
| Optional Share API | Validate, publish, retrieve, expire and delete share objects | Run training jobs or execute uploaded content |
| Object storage | Store opaque read-only trace objects | Serve active HTML or script content from app origin |

## 11.3 Recommended technology choices

| Layer | Choice | Rationale / constraint |
|---|---|---|
| Frontend | React + TypeScript + Vite | Component ecosystem and fast build; strict typing |
| Styling | Tailwind CSS + accessible component primitives | Consistent visual system and keyboard states |
| State | Zustand or equivalent lightweight state store | Explicit UI and experiment state boundaries |
| Visualisation | D3 + SVG for charts; Canvas for dense plots | Precision and performance; chart data table alternative required |
| 3D | Optional Three.js later | Only for clearly bounded teaching use cases |
| Compute | Web Workers + TypedArrays/Float64Array | Keep main thread responsive |
| Persistence | IndexedDB, file export | Local-first and versioned migrations |
| Schema | JSON Schema Draft 2020-12 + Ajv 2020 + Python validator | Single contract; cross-language conformance suite |
| Python | NumPy, PyTorch adapters and scikit-learn limited support | Explicit version matrix and numerical parity |
| API | FastAPI or serverless endpoints | Choose using an ADR; do not create services without product need |
| Storage | S3-compatible object storage for opt-in share objects | Opaque object storage, expiry and deletion policy |
| Test | Vitest, Pytest, Playwright | Unit, integration and end-to-end coverage |
| CI/CD | GitHub Actions | Lint, types, schema tests, security and release artifacts |
| Monitoring | Privacy-configured error/analytics service | Never send trace contents or sensitive rows |

## 11.4 Main experiment sequence

![RewindVerse experiment sequence](rewindverse_prd_assets/03_experiment_sequence.png){width=6.4in}

## 11.5 Trace lifecycle

![RewindVerse trace lifecycle](rewindverse_prd_assets/04_trace_lifecycle.png){width=6.4in}

## 11.6 Deployment and trust boundaries

![RewindVerse deployment boundaries](rewindverse_prd_assets/05_deployment_boundaries.png){width=6.4in}

## 11.7 CI and release process

![RewindVerse CI and release flow](rewindverse_prd_assets/06_ci_release.png){width=6.4in}

## 11.8 Learning loop

![RewindVerse learning loop](rewindverse_prd_assets/07_learning_loop.png){width=6.4in}

## 11.9 Product information architecture

![RewindVerse product information architecture](rewindverse_prd_assets/08_product_information_architecture.png){width=6.4in}

## 11.10 Architecture rules

- UI packages may call domain packages; domain packages must not import UI code.
- All sources produce or convert into the same RVTS contract.
- Replay Engine is shared by browser-generated, Python-generated and imported traces.
- Parsing, decompression and training occur in workers or separate processes.
- Worker messages are batched; large numeric buffers use transferable ArrayBuffers when beneficial.
- No SharedArrayBuffer requirement in v1 unless cross-origin isolation is justified by benchmark.
- The optional backend does not run training or arbitrary user code.
- Every module exposes a documented error contract and test suite.

---

# 12. ML algorithms, datasets and computation rules

## 12.1 v1 objective registry

The first objective registry contains low-dimensional, inspectable functions suitable for 2D contour and trajectory visualisation.

### Quadratic bowl

For vector $\theta \in \mathbb{R}^2$:

$$
f(\theta)=\frac{1}{2}\theta^T A\theta+b^T\theta+c
$$

For symmetric positive-definite $A$, the function has a unique minimum. Gradient:

$$
\nabla f(\theta)=A\theta+b
$$

### Rosenbrock function

$$
f(x,y)=(a-x)^2+b(y-x^2)^2
$$

$$
\frac{\partial f}{\partial x}=-2(a-x)-4bx(y-x^2),\qquad
\frac{\partial f}{\partial y}=2b(y-x^2)
$$

This demonstrates a narrow curved valley and sensitivity to learning rate.

### Saddle function

$$
f(x,y)=x^2-y^2,\qquad \nabla f(x,y)=(2x,-2y)
$$

This demonstrates directions with opposite curvature.

## 12.2 Optimizer conventions

### SGD

$$
\theta_{t+1}=\theta_t-\eta g_t
$$

where $g_t$ is the current gradient or mini-batch estimate and $\eta$ is learning rate.

### Momentum

Use the explicitly selected PyTorch-style convention for v1:

$$
v_t=\mu v_{t-1}+g_t,\qquad \theta_{t+1}=\theta_t-\eta v_t
$$

No Nesterov variant in the initial parity contract.

### Adam

$$
m_t=\beta_1m_{t-1}+(1-\beta_1)g_t
$$
$$
v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2
$$
$$
\hat m_t=\frac{m_t}{1-\beta_1^t},\qquad \hat v_t=\frac{v_t}{1-\beta_2^t}
$$
$$
\theta_{t+1}=\theta_t-\eta\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}
$$

Epsilon is added after square root of the bias-corrected second moment. AMSGrad and weight decay are excluded from the initial contract unless added in a versioned algorithm specification.

## 12.3 Logistic regression

- Binary prediction: $p(y=1|x)=\sigma(w^Tx+b)$.
- Binary cross-entropy is the data loss.
- L2 regularisation is explicitly defined and the intercept treatment is documented.
- The browser implementation must not claim exact parity with scikit-learn unless objective scaling, solver, intercept and regularisation conventions match.
- Decision boundary and threshold controls must update from the actual model parameters.

## 12.4 Small multilayer perceptron

- Small dense network with registered layer shapes and supported activations.
- Forward pass captures selected activations only when enabled.
- Backprop summaries include per-layer gradient norms and selected parameter summaries.
- Avoid storing full tensors by default; sampling, cadence and privacy are explicit.
- Gradient checking uses central finite differences in float64 away from non-differentiable activation kinks.

## 12.5 Future algorithm modules

- Optimizer comparison: SGD, Momentum, RMSProp and Adam on identical initial conditions and objective fixtures.
- Learning-rate schedules: step, cosine and warmup with schedule shown over the trace.
- Regularisation lab: L1/L2 effects on coefficients and decision boundaries.
- Bias-variance explorer: model complexity slider and separate train/validation curves.
- Decision trees: split-by-split visualisation on small datasets.
- KNN: distance and neighborhood view.
- SVM: margin and kernel mapping demonstration.
- Naive Bayes and gradient boosting: only after test coverage and learning value are defined.
- Transformer explorer: tokenizer, positional encoding, attention computation and decoding distribution; claims are bounded to the visible mechanism.

## 12.6 Data generation and reproducibility

- Use a seeded PRNG with a documented algorithm for browser-generated data.
- Do not expect browser `Math.random`, NumPy and PyTorch streams to match.
- Strict parity tests inject identical dataset, initial weights, mini-batch order and optimizer state fixtures.
- Record dtype and tolerance; Float64 browser calculations and Float32 framework calculations need different tolerances.
- Record algorithm name/version, objective ID/version, seed and config in trace metadata.
- State what determinism is guaranteed and what may vary across runtime/library versions.

## 12.7 Numerical parity report

Each algorithm report must include equation, implementation version, reference implementation, data type, fixture IDs, test count, tolerance, maximum observed error, pass rate, runtime and commit hash. The same report is required for a release candidate before numerical claims are published.

---

# 13. RVTS trace format and replay semantics

## 13.1 Purpose

RVTS is a project-owned, versioned format for training-run information. It is not an industry standard until independent producers and consumers demonstrate interoperability.


## 13.1.1 Rebrand migration and legacy compatibility

The project was originally prototyped under the working name **Modelverse**, and the initial draft interchange format was called **MVTS v0.1**. This PRD adopts **RewindVerse** and the formal name **RewindVerse Training Trace Specification (RVTS)**. The current draft has not yet established a deployed public ecosystem, so the naming migration must be completed before the first stable public RVTS release.

| Former draft identifier | RewindVerse identifier | Migration rule |
|---|---|---|
| Modelverse Training Trace Specification (MVTS) | RewindVerse Training Trace Specification (RVTS) | Use RVTS in current product docs and new implementation work |
| `.mvtrace` / `.mvtrace.gz` | `.rvtrace` / `.rvtrace.gz` | New exports use `.rvtrace`; legacy files remain readable through an explicit compatibility path |
| `application/vnd.modelverse.trace+jsonl` | `application/vnd.rewindverse.trace+jsonl` | New media type for RVTS; legacy media type accepted only where needed for import |
| `mvts-0.1.schema.json` | `rvts-0.1.schema.json` | Rename and update schema `$id`, title, producer examples and fixtures before stable release |
| `modelverse-trace` / `modelverse_trace` | `rewindverse-trace` / `rewindverse_trace` | The old package name was proposed, not confirmed as published; adopt the RewindVerse package name before first PyPI release |
| `modelverse/` repository namespace | `rewindverse/` | Adopt the new repository and package namespace before public v1.0 |

Compatibility requirements:
- The importer must recognise legacy MVTS v0.1 files and report them as **legacy input**, not silently pretend they are native RVTS files.
- Conversion must be explicit, produce a fidelity report and preserve source provenance, step units, unsupported fields and original identifiers.
- Do not change existing fixture bytes in place. Keep a frozen legacy fixture corpus for regression testing.
- New documentation, APIs, examples and public exports use RewindVerse / RVTS identifiers only after the renamed schema and validators pass the full conformance suite.
- If an external consumer adopts the old draft before migration, stop and define a compatibility policy before changing the wire format.
- The rename does not change mathematical semantics, step meaning, privacy rules or replay truthfulness requirements.

## 13.2 Container

- UTF-8 JSON Lines file, extension `.rvtrace`; optional gzip-compressed `.rvtrace.gz`.
- Manifest is the first record.
- Optional footer is the final record.
- Non-finite numeric values use a tagged representation such as `{ "$num": "NaN" }`; JSON `NaN`/`Infinity` literals are not accepted.
- Footer SHA-256, when present, covers the defined prior uncompressed canonical line sequence. A checksum detects accidental corruption; it does not authenticate the producer.

## 13.3 Core record types

- `manifest`: format version, run identity, producer, step unit, series catalogue, model/objective metadata, privacy level and declared capabilities.
- `step`: step index/unit, metrics and optional optimizer/training state summaries.
- `snapshot`: selected parameter/activation/tensor state subject to limits and privacy rules.
- `annotation`: user or producer annotation, clearly distinguished from viewer-computed diagnostics.
- `footer`: record count and checksum data according to the frozen contract.
- `x-*`: namespaced inert JSON extension data; never executable behaviour.

## 13.4 Step semantics

- The step unit is explicit: optimizer update, batch, epoch, iteration or another registered unit.
- Step `k` means the state after `k` declared units, as specified by the frozen contract.
- The viewer does not infer or interpolate missing steps by default.
- Non-monotonic, duplicated or missing steps produce explicit validation outcomes.
- Compare operations align only semantically compatible step units or show a documented conversion rule.

## 13.5 Capability levels

| Level | Meaning | Viewer may show |
|---|---|---|
| L0 | Scalar metrics | Metric series and timeline |
| L1 | Gradient/parameter/update summaries | Scalar summaries and available diagnostics |
| L2 | Selected snapshots | Recorded parameter/activation snapshots and registered visualisers |
| L3 | Registered replay semantics plus sufficient declared state | Recomputed registered views where exact inputs and model semantics are available |

Unknown models remain inspectable as recorded data. Model-specific rich views require a registered model/objective definition or an explicitly precomputed artifact.

## 13.6 Privacy levels

- `no_data`: no raw samples or feature rows.
- `summary_only`: aggregate statistics and metadata only.
- `includes_samples`: data samples included only by explicit user action and warning.

Default should be `no_data` or `summary_only` for shareable traces.

## 13.7 Trace validation and hardening

Before public stable release, freeze and test:

- JSON Schema Draft 2020-12 as canonical structural contract.
- TypeScript/Ajv 2020 and Python validation against the same fixture corpus.
- Semantic checks for cadence, batch indexing, theta/tensor shape, timestamps, integer ranges and extension boundaries.
- Line length, JSON depth, encoding/BOM, invalid UTF-8, truncated JSON and malformed footer.
- Compressed and decompressed size, expansion ratio and gzip truncation.
- Streaming parse and early abort behaviour.
- Checksum canonicalization and cross-platform reproducibility.
- Robust schema-resource paths in installed Python packages.

## 13.8 Replay truthfulness contract

- Recorded values are shown as recorded.
- Derived values are labelled as derived and include derivation/version metadata.
- Viewer-computed diagnostics are separate from producer annotations.
- A missing gradient is shown as unavailable, never inferred from a loss curve alone.
- Model reconstruction requires a registered model definition and complete required state.
- “Replay” means replay of recorded training states and supported views; it does not imply rerunning the original training process.

---

# 14. Diagnostics, explanations and learning design

## 14.1 Initial diagnostic catalogue

| Detector | Required signals | Output evidence | Limitation |
|---|---|---|---|
| Non-finite/divergence | Loss or parameter/gradient numeric series | First non-finite step, preceding trend | Non-finite may be caused by source logging; show raw value |
| Plateau | Loss series | Smoothing window, tolerance, patience and step range | Plateau may be intentional or near optimum |
| Overfit onset | Train and validation metrics | Divergence in validation vs training trend | No inference without both signals and known split context |
| Vanishing gradient | Per-layer gradient summaries | Layer/time range and threshold | Requires comparable layer summaries and declared architecture |
| Exploding gradient | Gradient norms | Spike/range and threshold | Threshold is model/data dependent |
| Learning-rate instability | Learning rate + loss/gradient signals | Rate changes near instability evidence | Association is not proof of causation |

## 14.2 Detector contract

Each detector includes ID, version, required series, step-unit assumptions, window size, smoothing, patience, threshold, evidence range and severity. Detector thresholds must be configurable and documented. Every result uses cautious wording such as “may indicate”.

## 14.3 Detector validation

- Build labelled synthetic traces with known event locations and non-event controls.
- Measure precision, recall and false-positive rate per detector.
- Test noisy, missing and irregularly sampled series.
- Publish corpus size, detector version and threshold choices.
- Keep a regression corpus for each changed detector.

## 14.4 Explanation approach

Initial narration is deterministic and template-based. It may say, for example: “Validation loss began increasing while training loss continued to decrease between steps 450 and 520. This pattern may indicate overfitting.” The text links to the exact evidence range and does not claim certainty.

LLM assistance is a later optional enhancement. It must be grounded in selected trace values, show which values support the explanation, be labelled as AI-generated and not receive private traces without consent.

## 14.5 Learning design

The standard learning loop is:

1. **Predict:** ask the learner what they expect.
2. **Configure:** allow a small number of meaningful controls.
3. **Run:** execute a real algorithm.
4. **Replay:** expose the step-by-step sequence.
5. **Explain:** connect the result to a formula and evidence.
6. **Apply:** ask the learner to change a parameter or diagnose a new trace.
7. **Reflect:** capture a short explanation or quiz result.

Lessons must be technically reviewed, include learning objectives, prerequisites, expected misconceptions, reproducible experiment configs and assessment questions.

---

# 15. Import centre and interoperability

## 15.1 Import priority

1. Metrics CSV — required for v0.1.
2. RVTS native trace — required for v0.1.
3. TensorBoard scalar exports — v1.0/v1.1 depending on capacity.
4. MLflow run exports — v1.1+.
5. Weights & Biases export — v1.2+.
6. Framework-specific trace adapters — as user demand and tests justify.

## 15.2 Import pipeline

1. Select source/file.
2. Validate file type and size; do not trust extension alone.
3. Parse in worker/process with bounded resources.
4. Preview inferred fields and mapping.
5. Confirm step unit, duplicate and non-monotonic semantics.
6. Convert to RVTS with source provenance.
7. Validate converted trace.
8. Produce fidelity report.
9. Open in replay viewer.

## 15.3 Import fidelity report

Must contain source format/version, original identifiers, mapped fields, transformed fields, dropped fields, unsupported fields, inferred step units, aggregation choices, warnings, privacy classification and resulting RVTS conformance level. No importer may fabricate missing gradients, parameters, activations, snapshots or training internals.

## 15.4 Interoperability claims

Use “supports import of X export version Y under these fields” rather than “fully integrates with X” unless full integration has been tested. Publish exact tested versions and sample fixtures.

---

# 16. Python SDK, CLI and developer experience

## 16.1 Package

Proposed package: `rewindverse-trace` (name availability must be checked before publishing).

## 16.2 Recorder API surface

- `RunRecorder(...)` context manager.
- `log_params(...)` for run configuration.
- `log_metrics(step, **metrics)`.
- `log_summary(...)` for aggregate values.
- `log_snapshot(...)` for selected allowed tensors/arrays.
- `annotate(step, message, kind=...)`.
- `flush()` and `close()`.
- `every_n_steps`, sampling and buffering controls.

## 16.3 Support matrix

| Source | v1 intent | Notes |
|---|---|---|
| Custom Python loop | Supported | Most reliable generic path |
| PyTorch small models | Supported subset | Metrics, sampled gradients and selected parameters/activations |
| scikit-learn incremental estimators | Limited | Use genuine `partial_fit` state where available |
| scikit-learn final-fit estimators | Summary-only | Do not claim per-iteration trace when estimator exposes no iterative state |
| Keras/Lightning/XGBoost | Later adapters | Version and overhead tests required |
| Distributed/DataParallel/mixed precision | Not v1 guarantee | Support only after reproducible tests |

## 16.4 Recorder reliability

- Recorder exceptions must not hide the model training exception.
- Logging is incremental; use recoverable partial traces where possible.
- Avoid `.item()`/`.cpu()` on every GPU step if this creates synchronization overhead.
- Sampling, aggregation and lazy transfer options are documented.
- Publish overhead benchmark for supported workflows.
- Package distribution should use a trusted publishing flow when supported by the release environment.

## 16.5 CLI

Commands: `validate`, `inspect`, `convert`, `view`, and later `diff`. Stable exit codes, useful error messages and `--json` output should be available for automation.

## 16.6 Developer documentation

Quick start, API reference, supported versions, examples, privacy notes, overhead guide, compatibility matrix, troubleshooting, changelog and migration guide are release requirements.

---

# 17. Data Observatory and Model Intelligence roadmap

These are now explicit product goals, but they are not prerequisites for the first replay product. They must integrate with the trace/replay core and should be built only after learner/instructor value is established.

## 17.1 Data Observatory modules

- Dataset profile: rows, columns, missingness, duplicates, unique counts, constant features and inferred types.
- Type override: user can correct categorical/numeric/date inference.
- Class imbalance: counts, ratios and warnings for classification tasks.
- Outlier inspection: IQR and z-score first; isolation forest only when a suitable runtime is available.
- Leakage warning: near-perfect target association, ID-like fields and time-order concerns as heuristics with explanation.
- Privacy scan: likely emails, phone numbers and identifiers; user confirms before any sharing.
- Preprocessing diff: before/after metadata and transformations.
- Sample datasets with a story, license and known expected result.

**Boundary:** Data Observatory starts with local profile and educational warnings. It is not a full data cleaning or feature engineering suite.

## 17.2 Model Intelligence modules

- Baseline model comparison.
- Learning curves.
- Calibration curves.
- Threshold/cost trade-off explorer.
- Error slicing by user-selected segment.
- Permutation importance and partial dependence/ICE where computationally appropriate.
- Fairness metrics with small-sample caveats and policy/ethics context.
- Counterfactual examples with feasibility and causal caveats.
- Model card generation with intended use, data, metrics, limitations and provenance.
- Uncertainty/conformal prediction only with valid assumptions and calibration data.

**Boundary:** Explain outputs and limitations. Never imply a metric alone establishes fairness, safety or causality.

## 17.3 Experiment Intelligence modules

- Configuration and parameter diff.
- Compatible run overlay and statistical comparison.
- Hyperparameter search visualisation for grid/random search initially; Bayesian/Optuna integration later.
- Experiment lineage: dataset → preprocessing → model/config → run → report.
- Environment/version capture and optional lockfile metadata.
- Exportable Markdown/HTML/PDF report.

---

# 18. Sharing, collaboration and classroom roadmap

## 18.1 Sharing v1

- Read-only share link.
- Explicit publish confirmation.
- Expiry and delete controls.
- Default privacy level no raw samples.
- Opaque content-addressed object IDs where applicable.
- Rate/size limits, abuse reporting and takedown workflow.
- Separate content origin from main application.
- Strict CSP, `nosniff`, restrictive iframe sandbox and documented embed messaging.

## 18.2 Future community features

- Curated gallery with reviewed sample traces.
- Fork-from-template; original remains immutable.
- Social preview cards with no private values.
- Optional comments on a timestamp only after moderation and abuse design.
- No open-ended feed or direct messages in initial versions.

## 18.3 Classroom Mode

- Course/cohort spaces.
- Assignments containing lesson configs and expected learning objectives.
- Learner completion state and optional exported trace submissions.
- Instructor overview with minimal data collection.
- Retention/deletion and access controls.
- LMS integration only after core workflow proves useful.

Classroom Mode is not a replacement for an LMS, grading suite or student information system.

---

# 19. APIs, identity and data model

## 19.1 Identity model

- Core local workflows do not require an account.
- Optional identity is introduced only for user-owned share links, classroom access or future sync.
- Public share token must be unguessable and revocable.
- Access policy distinguishes owner, public read-only, unlisted read-only and future class participant.
- Avoid enterprise RBAC until validated need exists.

## 19.2 Core entities

| Entity | Important fields |
|---|---|
| Experiment | id, name, config, seed, objective/model reference, created_at |
| Run | id, experiment_id, status, start/end time, producer, environment metadata |
| Trace | run_id, RVTS version, conformance level, privacy level, checksum, size |
| Series | key, display name, role, dtype, cadence, unit |
| Step record | step index/unit, series values, event metadata |
| Snapshot | step, tensor/parameter identifier, shape, dtype, encoding and privacy flag |
| Diagnostic | detector id/version, severity, evidence range, parameters and message |
| Lesson | id, version, objective, content, experiment config, checkpoints |
| Import report | source, mapping, transformations, dropped fields and warnings |
| Share object | object id, trace reference, visibility, expiry, owner and deletion state |
| Model report | run/trace reference, evaluation context, findings and limitations |

## 19.3 API design rules

- Version paths or media types for breaking changes.
- Strict request/response schemas.
- Idempotency for upload/publish operations.
- Pagination for lists.
- Rate and size limits.
- Structured error envelope: `code`, `message`, `details`, `request_id`.
- No trace contents or sample data in logs.

## 19.4 Proposed narrow sharing endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/v1/shares` | Validate and publish a user-approved trace |
| GET | `/v1/shares/{share_id}` | Retrieve share metadata/read-only content |
| DELETE | `/v1/shares/{share_id}` | Revoke and delete a share |
| GET | `/v1/health` | Liveness/readiness |

Do not build a general experiment tracking backend in v1.

---

# 20. Security, privacy, safety and governance

## 20.1 Threat model

Assets include trace files, dataset samples, model metadata, share tokens, user identity, lesson content and API credentials. Threat actors include malicious uploaders, automated spam, unauthorized viewers, compromised dependencies and accidental data sharers.

## 20.2 Required controls

- Treat every imported trace and metadata field as untrusted data.
- Parse in a worker/process with decompressed size, ratio, line-length, depth and numeric bounds.
- Never render trace text as raw HTML or insert using unsafe HTML APIs.
- Avoid unsafe object merging/prototype pollution.
- Never deserialize arbitrary pickle or executable model objects.
- Never execute user-uploaded plugins or training scripts.
- Keep user content off the application origin where shared.
- Apply CSP, `nosniff`, frame restrictions, strict CORS and secure cookies/tokens as appropriate.
- Rotate/revoke share tokens; expire objects; provide deletion path.
- Apply rate limits, quota, upload limits, abuse report and takedown process.
- Dependency scanning, secret scanning, pinned/reviewed dependencies and release provenance.
- Keep privacy-safe operational logs; do not log raw trace contents.

## 20.3 Data minimisation and privacy defaults

- Browser lab: local by default.
- Import: process locally unless user explicitly opts into sharing.
- Python SDK: writes to developer-controlled storage.
- Share: explicit confirmation and privacy summary before upload.
- Analytics: allowlisted event names and numeric/enum properties only; no traces, dataset rows or arbitrary text.
- Retention: documented and enforced by scheduled cleanup, not merely a database expiry field.
- Data deletion: test the full deletion path and backup retention semantics.

## 20.4 Responsible ML claims

- Diagnostics are heuristics, not definitive diagnoses.
- Correlation is not proof of data leakage or causation.
- Attention maps are not full explanations of transformer reasoning.
- Fairness metrics depend on group definitions, sample size and context.
- Counterfactuals must not be described as causal facts without appropriate evidence.
- Model cards document limits; they do not certify safe deployment.

---

# 21. UX, accessibility and visual design

## 21.1 Visual direction

Use a clean technical-learning interface: generous workspace, clear labels, readable formulas, consistent colors for metrics/events, restrained motion and no decorative data ink that competes with the model behaviour.

## 21.2 Accessibility requirements

- Keyboard access to all controls, including timeline and chart selection.
- Visible focus state and logical focus order.
- Sufficient text and chart contrast.
- Chart summaries and equivalent data tables.
- Live region announcement for run state and important diagnostics.
- Reduced-motion support.
- Labels and error messages associated with controls.
- No information conveyed by color alone.
- Test with keyboard and screen reader on core journeys.

## 21.3 Responsive behaviour

- Desktop: full lab, replay, comparison and inspector layouts.
- Tablet: collapsible inspector and stacked charts.
- Mobile: read-only trace review and lesson reading first; advanced training controls may be simplified rather than compressed into unusable layouts.

## 21.4 Design system components

Buttons, inputs, segmented controls, tabs, cards, badges, alerts, tooltips, dialogs, timeline, metric chart, data table, inspector panel, diagnostic card, empty state, file upload, progress, error summary and share dialog. Components must have loading, disabled, error and focus states.

---

# 22. Analytics, KPIs and market validation

## 22.1 North-star metric

Replay-assisted understanding rate in a defined task cohort.

## 22.2 Product funnel

1. Visit Explore.
2. Start lab/import/lesson.
3. Complete first run or import.
4. Open replay.
5. Interact with timeline/inspector.
6. Complete explanation/checkpoint.
7. Export/share/return.

## 22.3 KPI dictionary

| KPI | Definition | Proposed target / use |
|---|---|---|
| Time to first run | Time from first app action to successful run | Median under 60 seconds in usability cohort |
| First-run completion | Successful first run / users who started | Track with denominator and cohort |
| Replay engagement | Users who seek/scrub/inspect / users who open replay | Baseline, then set target from beta |
| Learning checkpoint completion | Completed checkpoints / started checkpoints | Track lesson-by-lesson |
| Export/share rate | Unique users who export/share / users with completed replay | Hypothesis; no vanity target before baseline |
| 7-day return | Users returning within 7 days / activated cohort | Cohort-based; report sample size |
| Import success | Successfully normalized imports / import attempts | Segment by importer and source version |
| SDK activation | Successful recorded Python run / package install cohort where measurable | Use package telemetry only with consent/privacy review |
| Diagnostic quality | Precision/recall on labelled corpus | Publish per detector |
| Support burden | Repeated unresolved issues per active user cohort | Helps assess product readiness |

## 22.4 Analytics privacy rules

Do not send trace content, dataset samples, raw user text, model parameters or private labels to analytics. Use allowlisted events such as `experiment_started`, `run_completed`, `trace_opened`, `replay_scrubbed`, `lesson_completed`, `trace_exported` and `share_published` with coarse non-sensitive properties only.

## 22.5 Market validation programme

### Discovery interviews

Target 15–18 interviews: 8 learners, 4 instructors/teaching assistants/bootcamp mentors, 4 Python ML developers. Ask about actual past behaviour, not hypothetical interest. Document the last training problem, tools used, missing information, time spent and current workaround.

### Task-based usability

Ask users to: start a run; locate a change in training behaviour; explain it from replay evidence; export/reopen a trace. Observe completion, time, confusion, errors and requests for help.

### Instructor pilots

At least two instructors try a lesson in a real or realistic teaching session. Record prep time, learner task completion, repeated use and feedback.

### Four-week beta

Recruit approximately 25–40 target users if feasible. Measure first-run, replay interaction, repeat use, imports, shares, failures and learning checkpoints. Report cohort sizes and uncertainty; do not overgeneralise from a small sample.

### Learning evaluation

Use a small pre/post set of 3–5 concept questions or applied tasks. Report the instrument, sample, limitations and observed changes. Do not claim broad causal learning impact from a convenience sample.

## 22.6 Go/no-go rules

- If fewer than 4 of 10 target learners report a recent concrete problem with understanding training behaviour, revisit positioning.
- If fewer than 3 of 5 prototype users complete the replay journey without help, fix UX before adding modules.
- If users consistently say their current tracker and learning resources already solve the same problem, test the incremental value of step replay and guided explanation.
- If instructors do not reuse lessons, do not prioritise classroom administration.
- If imports repeatedly lose essential step semantics, narrow supported source claims rather than silently normalising data.

---

# 23. Testing, performance and release quality

## 23.1 Test pyramid

- Unit: objective functions, optimizer steps, parser utilities, state transitions and detectors.
- Property-based: trace record invariants, step ordering, shape and numeric constraints.
- Numerical: gradient finite differences, optimizer parity and model-output fixtures.
- Integration: training → trace → validation → replay; Python record → browser replay.
- End-to-end: primary journeys in supported browsers.
- Security: malformed file, gzip bomb, HTML/script-like metadata, share access and upload limits.
- Accessibility: axe automation plus manual keyboard/screen-reader review.
- Visual regression: core chart, replay and responsive layouts.
- Performance: 100k-step trace profile, memory, parsing, scrubbing and worker responsiveness.
- Soak/load: share API only after it exists and has a deployment boundary.

## 23.2 Required numerical cases

- Analytical gradient vs central finite difference.
- SGD update exact fixture.
- Momentum state and update fixture.
- Adam bias correction and epsilon placement fixture.
- Logistic regression loss, gradient and decision boundary fixtures.
- MLP forward and backprop fixtures.
- Deterministic seeds and fixed minibatch order.
- Float64 vs Float32 tolerance by implementation.

## 23.3 Parser and import edge cases

Malformed JSON, invalid UTF-8, BOM, duplicate keys, very long lines, deep nesting, huge arrays, NaN/Infinity raw tokens, tagged non-finite values, integer precision boundaries, truncated gzip, high expansion ratio, wrong footer count/checksum, duplicate steps, non-monotonic steps, invalid cadence, malformed timestamps and unknown extensions.

## 23.4 Release pipeline

![RewindVerse delivery roadmap](rewindverse_prd_assets/09_delivery_roadmap.png){width=6.4in}

CI must run formatter/linter, type-check, unit tests, Python tests, schema fixtures in both languages, numerical tests, build, browser E2E, accessibility checks, dependency/security scans and release packaging. Release candidate requires test report, benchmark report, known limitations, changelog, rollback plan and evidence ledger update.

## 23.5 Performance benchmark protocol

Record CPU, memory, OS, browser/runtime, app commit, trace version, trace size, record count, series count and snapshot payload. Measure parse duration, peak memory, first render, scrub response, worker throughput, dropped frames and export time. Publish raw measurement method and repeat count.

---

# 24. Delivery roadmap and prioritised backlog

## 24.1 Revised 24-week roadmap

| Period | Focus | Deliverables / gate |
|---|---|---|
| Weeks 1–2 | Discovery + specification freeze | 15–18 interview target; user-task prototype; RVTS semantics and ADRs frozen |
| Weeks 3–5 | Walking skeleton + ML core | Deployed shell, CI, Web Worker, objective registry, optimizer parity fixtures |
| Weeks 6–8 | Replay foundation | RVTS TS/Python validator, real training trace, replay, CSV import, one lesson |
| Weeks 9–12 | Supervised learning | Logistic regression, decision boundary, compare, diagnostics corpus, three lessons |
| Weeks 13–16 | Neural model + Python | Small MLP, gradient checks, recorder SDK/CLI, PyTorch supported path |
| Weeks 17–20 | Product readiness | Import maturity, sharing/embed if gated, reporting, security/accessibility/performance, instructor pilots |
| Weeks 21–24 | v1.0 hardening | Independent reproduction, beta evidence, published benchmark, release docs and tagged release |

The timeline is a planning baseline, not a fixed promise. If a gate fails, move the release date or reduce scope; do not waive correctness to meet a calendar date.

## 24.2 P0 backlog

1. Confirm target user and first core task.
2. Freeze RVTS v0.1 container, non-finite values, step semantics, cadence, checksum and capability levels.
3. Fix validator packaging and schema-resource path.
4. Implement Ajv Draft 2020 validator and shared conformance corpus.
5. Add semantic and malformed/oversized file fixtures.
6. Implement streaming parser worker and transfer-safe data path.
7. Build deterministic objective registry and seeded fixture generator.
8. Implement SGD, Momentum and Adam with exact conventions.
9. Add gradient checks and optimizer parity report.
10. Implement actual training trace generation.
11. Implement replay timeline, synchronized charts and event inspector.
12. Implement CSV importer and fidelity report.
13. Complete one reviewed lesson and task-based usability test.
14. Build full CI pipeline and a live deployable shell.

## 24.3 P1 backlog

- Logistic regression and decision boundary.
- Run comparison and configuration diff.
- Three reviewed lessons and challenge mode.
- Small MLP and gradient diagnostics.
- Python SDK and CLI; supported PyTorch adapter.
- TensorBoard scalar import if capacity allows.
- Training Intelligence Report.
- Read-only sharing and embed after security approval.
- Instructor pilot and beta cohort.
- Full accessibility/performance/security test report.

## 24.4 P2/P3 backlog

- Data Observatory.
- Model Intelligence and model cards.
- Expanded algorithms and optimizer schedule labs.
- MLflow/W&B importers and additional framework adapters.
- Jupyter widget, REST API expansion and experiment lineage.
- Transformer explorer, CNN and draw-a-digit playground.
- Classroom Mode, curated gallery and governed extension system.
- Optional constrained managed execution only after threat/cost review.

## 24.5 Definition of Ready

A backlog item is ready only if it has user/problem rationale, requirement ID, priority, acceptance criteria, design or API contract, dependencies, data/privacy implications and test approach.

## 24.6 Definition of Done

A backlog item is done only if code is merged, tests pass, accessibility/edge cases are addressed, errors are documented, telemetry is privacy-safe, docs are updated, acceptance criteria are demonstrated and release evidence is attached.

---

# 25. Risks, dependencies, decisions and change control

## 25.1 Risk register

| Risk | Probability / impact | Mitigation |
|---|---|---|
| Scope grows beyond achievable 24-week effort | High / High | Release tiers, acceptance gates and explicit deferred goals |
| Users do not value replay beyond existing tools | Medium / High | Early interviews and side-by-side task testing |
| RVTS changes break producers/consumers | Medium / High | Versioning, schema governance, fixtures and migration rules |
| Numerical mismatch undermines trust | Medium / High | Fixed fixtures, parity report and tolerance policy |
| Imported logs lose semantic meaning | High / Medium | Mapping preview and fidelity report; preserve source metadata |
| Trace files are malicious/oversized | Medium / High | Bounded parser, worker isolation, no code execution and security tests |
| Recorder overhead slows GPU jobs | Medium / High | Sampling, batching, lazy transfer and benchmark |
| Sharing service abused | Medium / High | Limits, expiry, moderation, separate origin and takedown process |
| Diagnostic false positives reduce trust | Medium / High | Labelled tests, precision/recall and cautious language |
| Brand or sub-brand conflict | Medium / High | Trademark/domain/package clearance; keep Rewind Studio a working label until formal review |
| Data quality/fairness features overclaim | Medium / High | Evidence, minimum sample warnings and human review |
| Timeline slips | High / Medium | Gate-driven release; reduce scope rather than quality |

## 25.2 Key dependencies

- RVTS semantics must stabilise before multiple producers are built.
- Replay Engine must exist before Python/CSV/trackers add value.
- Numerical parity tests must precede claims about algorithm correctness.
- Privacy and security architecture must precede public sharing and classroom accounts.
- User research must precede expensive expansion into Data Observatory, Model Intelligence or classroom tools.

## 25.3 Architecture decision records required

| ADR | Decision |
|---|---|
| ADR-001 | RVTS JSONL container and versioning policy |
| ADR-002 | Canonical schema and cross-language validator strategy |
| ADR-003 | Worker protocol, batching and transferable buffer policy |
| ADR-004 | Replay vs recomputation semantics |
| ADR-005 | Local storage, migration and export policy |
| ADR-006 | Sharing backend and isolated content origin |
| ADR-007 | Python recorder sampling and error policy |
| ADR-008 | Importer field mapping and fidelity contract |
| ADR-009 | Diagnostics versioning and threshold policy |
| ADR-010 | Analytics privacy and event allowlist |
| ADR-011 | RewindVerse brand architecture, naming governance and trademark clearance |
| ADR-012 | MVTS v0.1 to RVTS naming, schema and file-compatibility migration |
| ADR-013 | Final RewindVerse brand story, visual identity, product naming and interface terminology |

## 25.4 Change control

A requirement change must state: reason, affected users, goal/requirement IDs, scope impact, technical/data/security impact, migration impact, test changes, roadmap impact and approver. Schema breaking changes require a new RVTS major version or explicit compatibility plan. No silent behaviour change in replay or step semantics. The RewindVerse naming migration must not erase legacy identifiers from import compatibility fixtures or source history.

---

# 26. Launch, operations and post-release plan

## 26.1 Launch gates
- Brand clearance gate: RewindVerse and all public-facing sub-brand names reviewed for relevant trademark, domain, package and repository availability; Rewind Studio remains provisional until this is recorded in ADR-011.

- Core user journey is complete and independently reproducible.
- No open critical/high security issues.
- Numerical parity and trace conformance reports are published.
- Main journey passes accessibility review.
- Benchmarks describe supported hardware/trace profiles.
- Share functionality has privacy, expiry, deletion and abuse controls—or remains disabled.
- User docs, SDK docs, support path, status and known limitations are published.
- Product analytics are privacy reviewed.
- Rollback plan and issue response process exist.

## 26.2 Environments

- Local development.
- Preview/staging from release candidates.
- Production static web app.
- Optional share API and object storage, deployed separately from the app origin.

## 26.3 Observability

Monitor application errors, worker crashes, parser failures, import success/failure, share API errors, latency, quota and storage usage. Logs and events must not contain raw traces, sample rows or private user text. Provide a runbook for rollback, storage incident, share takedown, parser vulnerability and corrupted release.

## 26.4 Support and maintenance

- Issue templates for bug, feature request, security disclosure and trace interoperability issue.
- Security disclosure route and response policy.
- Changelog and compatibility matrix.
- Dependency updates and supported-version policy.
- Deprecation and migration notices for RVTS and SDK.
- Monthly product evidence review after launch.

## 26.5 Post-release review

Within 30 days of public v1.0, review funnel metrics, support cases, user interviews, repeat usage, performance and detector quality. Decide whether the next release should improve replay, imports, lessons or pursue one of the newly promoted product goals. Do not automatically build the next roadmap tier.

---

# 27. Product completeness and evidence scorecard

## 27.1 Rating targets

| Category | Target | Evidence required |
|---|---:|---|
| Product vision | 9.0+ | Clear promise, audience and coherent product pillars |
| Problem validation | 8.5+ | Documented interviews and recurring behaviour evidence |
| Market readiness | 8.5+ | Usability completion, beta repeat usage, instructor pilots and support readiness |
| Implementation evidence | 8.5+ | Working app, E2E, cross-language trace flow and independent reproduction |
| Architecture | 9.0+ | ADRs, modular boundaries, system diagrams and justified trade-offs |
| ML depth | 9.0+ | Optimizer parity, gradient checks, model tests and diagnostic evaluation |
| Feature completeness | 8.5+ | Complete must-have journeys and traceable acceptance criteria |
| UX | 8.5+ | First-use completion, user testing and error/empty states |
| Performance | 8.5+ | Reproducible load/replay/worker benchmarks |
| Security/privacy | 9.0+ | Threat tests, safe parser, privacy audit and share controls |
| Interoperability | 8.5+ | Python producer, browser consumer and tested importer path |
| Reliability/testing | 9.0+ | CI, regression corpus, browser E2E and release reports |
| Documentation | 9.0+ | Product docs, architecture, SDK/API, tutorials and migration guidance |
| Portfolio/recruiter impact | 9.0+ | Live demo, public repository, design decisions and measured technical results |

## 27.2 Rating rules

- Target scores are not current scores.
- No score above 8 is awarded without at least one concrete, inspectable evidence artifact for that category.
- Market readiness cannot be rated from a polished landing page or positive comments alone.
- Implementation evidence cannot be rated from a design or code skeleton alone.
- Missing evidence caps that category at 5 until evidence exists, regardless of the quality of the written plan.
- Critical correctness/security failures block release and cannot be offset by high scores elsewhere.

## 27.3 Evidence ledger

| Claim | Required evidence | Owner | Status |
|---|---|---|---|
| Training uses real algorithms | Source, tests, fixed fixtures and demo | ML engineer | Pending |
| Optimizers are numerically correct | Parity report with tolerances | ML engineer | Pending |
| RVTS is interoperable | TypeScript/Python conformance + independent producer/consumer | Format owner | Partial/pending revalidation |
| Replay is faithful | Round-trip E2E and step-value assertions | Frontend/ML | Pending |
| Python recorder is practical | Installable package, overhead report and integration example | SDK owner | Pending |
| Diagnostics are reliable enough to show | Labelled corpus, precision/recall and caveats | ML engineer | Pending |
| Product is usable | Task-based studies and completion data | Product owner | Pending |
| Market is validated | Interviews, beta cohorts and instructor pilots | Product owner | Pending |
| System is production-ready | Security, accessibility, performance, operations and rollback reports | Technical lead | Pending |

---

# 28. Glossary and appendices

## 28.1 Glossary

- **RVTS:** RewindVerse Training Trace Specification; the legacy draft was named MVTS v0.1.
- **Trace:** portable record of a training run and its declared information.
- **Step unit:** meaning of the step index, such as optimizer update or epoch.
- **Capability-aware viewer:** viewer that renders only panels supported by validated trace content.
- **Conformance level:** declared depth of information and replay support in a trace.
- **Fidelity report:** explanation of fields preserved, transformed, inferred or dropped during import.
- **Replay:** navigation through recorded training states and registered derived views; not necessarily retraining.
- **Diagnostic:** heuristic finding computed from available signals and tied to evidence.
- **Model card:** structured report describing model purpose, data, evaluation, intended use and limitations.
- **Local-first:** core user workflow runs on the user's device and does not upload data by default.

## 28.2 Repository structure baseline

```text
rewindverse/
  apps/
    web/                    # React + TypeScript application
    share-api/               # Optional narrow sharing service
  packages/
    ml-core/                 # Objectives, models, losses, optimizers, RNG
    rvts-schema/             # JSON Schema and fixtures
    rvts-ts/                 # TypeScript parser/validator/encoder
    replay-engine/           # Capability map, alignment and diagnostics
    visualization/           # Reusable chart and inspector components
    lesson-engine/           # Lesson and challenge definitions
  python/
    rewindverse_trace/       # Recorder, adapters and CLI
    tests/
  docs/
    prd/                     # This PRD and product decisions
    architecture/            # ADRs and diagrams
    rvts/                    # Specification, examples and migration
    user/                    # Tutorials and help
    api/                     # API references
  fixtures/
    valid/
    invalid/
    numerical/
    diagnostics/
  benchmarks/
  .github/
    workflows/
    ISSUE_TEMPLATE/
```

## 28.3 First two-week execution checklist

- [ ] Confirm one primary learner problem through past-behaviour interviews.
- [ ] Recruit interview participants and schedule usability prototype tests.
- [ ] Freeze v0.1 objective and optimizer formulas.
- [ ] Freeze RVTS step unit, non-finite value, cadence, footer and capability semantics.
- [ ] Define one golden end-to-end trace fixture.
- [ ] Build an app shell deployed through CI.
- [ ] Implement one objective and one optimizer with tests.
- [ ] Implement Web Worker request/progress/cancel protocol.
- [ ] Generate a first trace and open it in a minimal replay viewer.
- [ ] Add a known-good CSV fixture and mapping preview.
- [ ] Document unresolved risks and record ADRs before expanding.

## 28.4 Final product acceptance checklist

### Product
- [ ] User understands the core promise and can start without forced sign-up.
- [ ] Core lab → trace → replay → export/reopen journey works.
- [ ] Imported trace displays source and fidelity limitations.
- [ ] Lessons contain prediction, run, replay and reflection.
- [ ] Comparison prevents invalid step alignment.

### Engineering
- [ ] Worker training and parsing are isolated from UI thread.
- [ ] Numerical parity and gradient checks pass.
- [ ] RVTS validators share fixtures and semantic rules.
- [ ] Python SDK records and browser opens the same trace.
- [ ] Performance benchmark is published.

### Safety and operations
- [ ] Untrusted files are bounded and safely parsed.
- [ ] No arbitrary uploaded code executes.
- [ ] Sharing is opt-in, revocable, expiring and moderated.
- [ ] Privacy-safe analytics and error reporting pass review.
- [ ] Accessibility audit and manual review pass.
- [ ] Release rollback and support runbooks exist.

### Market
- [ ] Interviews documented.
- [ ] Usability tasks completed and failure points addressed.
- [ ] Instructor pilots conducted.
- [ ] Beta cohort and repeat usage measured.
- [ ] Learning evaluation is reported with limitations.

---

## Final product decision

RewindVerse is a **training replay and learning platform first**. Its long-term vision now includes data observability, model intelligence, advanced algorithm and transformer education, experiment intelligence, developer integrations, classroom workflows and safe community sharing. These are real product goals with explicit horizons—not vague aspirations—but they will be added only when the replay foundation and user evidence justify them.

The project must protect its defining promise: **a user can inspect what actually happened during supported model training, understand the evidence, and share or reproduce that experience without the product inventing information.**
