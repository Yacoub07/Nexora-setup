import {
  PipelineStep,
  ForgeCommandSpec,
  AiAgentSpec,
  QualityGateRule,
  ModuleTemplateNode
} from '../types/eif';

export const EIF_PIPELINE_STEPS: PipelineStep[] = [
  {
    stepNumber: 1,
    id: 'step-01',
    name: 'Business Analysis',
    category: 'Strategy & Domain',
    description: 'Elicits strategic objectives, identifies target personas, maps business KPIs, and establishes financial/ROI boundaries.',
    deliverables: ['Business Requirements Document (BRD)', 'KPI Impact Matrix', 'Value Stream Mapping'],
    qualityGates: ['Approved by Product Director', 'ROI Alignment > 15%', 'SLA Boundary Definition'],
    acceptanceCriteria: ['All user personas documented with quantitative success metrics.', 'Clear regulatory and compliance constraints defined.'],
    forgeCommand: 'nexora module analyze --spec brd.json',
    aiAgentRole: 'ChatGPT Enterprise Strategist'
  },
  {
    stepNumber: 2,
    id: 'step-02',
    name: 'Functional Specification',
    category: 'Strategy & Domain',
    description: 'Translates business goals into granular use cases, system interactions, state transitions, and user flow diagrams.',
    deliverables: ['Functional Spec Document (FSD)', 'System State Transition Matrix', 'User Journey Diagrams'],
    qualityGates: ['Architecture Board Sign-off', 'Zero Unhandled State Transitions'],
    acceptanceCriteria: ['Every input state mapped to explicit output behavior.', 'Zero ambiguous functional requirements.'],
    forgeCommand: 'nexora module spec --fsd fsd.yaml',
    aiAgentRole: 'ChatGPT Enterprise Strategist'
  },
  {
    stepNumber: 3,
    id: 'step-03',
    name: 'Domain Model (DDD)',
    category: 'Strategy & Domain',
    description: 'Defines Bounded Context boundaries, Aggregate Roots, Domain Entities, Value Objects, and canonical Domain Events.',
    deliverables: ['EDM Aggregate Definitions', 'Bounded Context Map', 'Domain Event Catalog'],
    qualityGates: ['Zero Bounded Context Circular Dependencies', 'Strict EDM Specification Compliance'],
    acceptanceCriteria: ['Aggregate Roots encapsulate state transitions via strict methods.', 'Ubiquitous Language verified with domain experts.'],
    forgeCommand: 'nexora module domain --aggregate Order',
    aiAgentRole: 'Gemini / Google AI Studio Architect'
  },
  {
    stepNumber: 4,
    id: 'step-04',
    name: 'Database Design',
    category: 'Engineering & Code',
    description: 'Designs physical PostgreSQL relational schemas, indexes, foreign keys, constraints, pgvector dimensions, and Drizzle/SQLAlchemy ORM models.',
    deliverables: ['PostgreSQL DDL Migration Scripts', 'ER Diagrams', 'Index Optimization Plan'],
    qualityGates: ['Snake_case Plural Naming', 'UUID v4 Primary Keys', 'Zero Unindexed Foreign Keys'],
    acceptanceCriteria: ['All foreign keys indexed for sub-5ms join latency.', 'Migration scripts pass forward and rollback dry-run tests.'],
    forgeCommand: 'nexora db migrate --generate',
    aiAgentRole: 'Codex / Cursor Backend Architect'
  },
  {
    stepNumber: 5,
    id: 'step-05',
    name: 'API Design',
    category: 'Engineering & Code',
    description: 'Crafts OpenAPI 3.1 REST contracts, gRPC Protobuf definitions, GraphQL schemas, and rate-limiting rules.',
    deliverables: ['OpenAPI 3.1 YAML Specification', 'Protobuf Schema Files', 'API Mock Server'],
    qualityGates: ['Strict /api/v1/ Endpoint Naming', 'WCAG and RFC 7807 Error Response Specs'],
    acceptanceCriteria: ['Contract validated with Spectral linter.', '100% endpoint coverage with mock handlers.'],
    forgeCommand: 'nexora api generate --openapi openapi.yaml',
    aiAgentRole: 'Gemini / Google AI Studio Architect'
  },
  {
    stepNumber: 6,
    id: 'step-06',
    name: 'Backend Services',
    category: 'Engineering & Code',
    description: 'Implements async Python FastAPI controllers, application services, domain handlers, and repository layers.',
    deliverables: ['FastAPI Service Handlers', 'Pydantic DTOs', 'Repository Implementation'],
    qualityGates: ['SOLID Code Principles', '100% Async Non-blocking I/O', 'Static Type Checking (mypy --strict)'],
    acceptanceCriteria: ['Sub-20ms p95 execution latency on core read endpoints.', 'Zero bare exception catches.'],
    forgeCommand: 'nexora service add --type fastapi',
    aiAgentRole: 'Codex / Cursor Backend Engineer'
  },
  {
    stepNumber: 7,
    id: 'step-07',
    name: 'Frontend Components',
    category: 'Engineering & Code',
    description: 'Builds modular React components styled with NEXORA Design System Tailwind tokens and Lucide icons.',
    deliverables: ['React UI Components', 'Custom Hooks', 'Storybook Stories'],
    qualityGates: ['Zero Hardcoded Text (i18n Ready)', 'WCAG AAA 7:1 Contrast', 'Strict TypeScript Named Exports'],
    acceptanceCriteria: ['Components render without layout shifts (CLS < 0.05).', 'Full keyboard navigation support.'],
    forgeCommand: 'nexora component add --name DataGrid',
    aiAgentRole: 'Lovable / Base44 Frontend Specialist'
  },
  {
    stepNumber: 8,
    id: 'step-08',
    name: 'Mobile Support',
    category: 'Engineering & Code',
    description: 'Ensures responsive viewport adaptation, touch target dimensions (>=44px), and offline PWA service worker caching.',
    deliverables: ['Responsive Media Query Rules', 'Touch Event Handlers', 'PWA Manifest & Workers'],
    qualityGates: ['Touch Target Size >= 44x44px', 'Lighthouse Mobile Score > 90'],
    acceptanceCriteria: ['Flawless rendering on viewports from 320px to 3840px.', 'Offline capability for cached resources.'],
    forgeCommand: 'nexora mobile verify',
    aiAgentRole: 'Lovable / Base44 Mobile UX'
  },
  {
    stepNumber: 9,
    id: 'step-09',
    name: 'RBAC & Security',
    category: 'Engineering & Code',
    description: 'Configures Open Policy Agent (OPA) fine-grained ABAC policies, OAuth2 scopes, MFA checks, and input sanitization.',
    deliverables: ['OPA Rego Policy Files', 'MFA Auth Handlers', 'Sanitization Middleware'],
    qualityGates: ['Zero OPA Policy Bypasses', 'OWASP Top 10 Security Audit Passed'],
    acceptanceCriteria: ['All endpoints protected by bearer JWT and permission scopes.', 'Zero SQL injection or XSS vulnerabilities.'],
    forgeCommand: 'nexora security audit',
    aiAgentRole: 'ChatGPT Security Guardian'
  },
  {
    stepNumber: 10,
    id: 'step-10',
    name: 'AI Integration',
    category: 'Engineering & Code',
    description: 'Hooks server-side Gemini 2.5 Flash API proxies, vector embedding pipelines, RAG retrieval grounding, and function calling.',
    deliverables: ['Gemini Model Proxy', 'pgvector Index Pipelines', 'Tool Execution Sandbox'],
    qualityGates: ['Zero Client-Side API Key Leaks', 'Prompt Injection Defense Validation'],
    acceptanceCriteria: ['LLM responses grounded in vector knowledge base.', 'Graceful fallback on rate limits.'],
    forgeCommand: 'nexora ai hook --model gemini-2.5-flash',
    aiAgentRole: 'Gemini / Google AI Studio Specialist'
  },
  {
    stepNumber: 11,
    id: 'step-11',
    name: 'Internationalization (i18n)',
    category: 'Engineering & Code',
    description: 'Generates translation dictionary JSON files for en, fr, ar, es, pt, bm and configures dynamic LTR/RTL rendering.',
    deliverables: ['Locale JSON Files (en, fr, ar, es, pt, bm)', 'i18n Key Index'],
    qualityGates: ['100% Key Coverage Across All 6 Locales', 'RTL Layout Mirror Verification'],
    acceptanceCriteria: ['Zero fallback warnings on missing key rendering.', 'RTL switches instantly without refresh.'],
    forgeCommand: 'nexora i18n sync',
    aiAgentRole: 'OpenHands / Gemini i18n Engineer'
  },
  {
    stepNumber: 12,
    id: 'step-12',
    name: 'Unit Tests',
    category: 'Validation & Testing',
    description: 'Writes isolated pytest suites for Python backend services and Vitest suites for React frontend components.',
    deliverables: ['Pytest Unit Suites', 'Vitest Component Suites'],
    qualityGates: ['Unit Code Coverage >= 85%', 'Zero Flaky Tests'],
    acceptanceCriteria: ['All tests execute in < 15 seconds locally.', 'Every domain rule guarded by isolated assertion.'],
    forgeCommand: 'nexora test unit',
    aiAgentRole: 'Codex Test Engineer'
  },
  {
    stepNumber: 13,
    id: 'step-13',
    name: 'Integration Tests',
    category: 'Validation & Testing',
    description: 'Tests API endpoints, database transactions, Redis cache invalidation, and NATS message bus events using Testcontainers.',
    deliverables: ['API Integration Suites', 'Database Transaction Tests'],
    qualityGates: ['100% Integration Endpoint Coverage', 'Clean Database Isolation'],
    acceptanceCriteria: ['Real PostgreSQL database spun up and cleaned per test suite run.', 'Event bus pub/sub validated.'],
    forgeCommand: 'nexora test integration',
    aiAgentRole: 'Codex Test Engineer'
  },
  {
    stepNumber: 14,
    id: 'step-14',
    name: 'End-to-End Tests',
    category: 'Validation & Testing',
    description: 'Executes Playwright browser test automation across full user journeys, authentication flows, and dashboard interactions.',
    deliverables: ['Playwright E2E Test Scripts', 'Video Recording & Traces'],
    qualityGates: ['100% Critical Path E2E Success', 'Execution Time < 3 Minutes'],
    acceptanceCriteria: ['Complete user journeys pass on Chrome, Firefox, and Safari viewports.', 'Zero visual regressions.'],
    forgeCommand: 'nexora test e2e',
    aiAgentRole: 'OpenHands Automation Specialist'
  },
  {
    stepNumber: 15,
    id: 'step-15',
    name: 'Documentation',
    category: 'Ops & Monitoring',
    description: 'Generates API Swagger docs, Architecture Decision Records (ADRs), developer onboarding guides, and README files.',
    deliverables: ['OpenAPI Swagger Specs', 'ADR Documents', 'Developer Guide'],
    qualityGates: ['Spectral OpenAPI Validation Passed', 'Zero Broken Links'],
    acceptanceCriteria: ['New developers can spin up module in < 5 minutes using documentation.'],
    forgeCommand: 'nexora doc generate',
    aiAgentRole: 'Gemini Technical Writer'
  },
  {
    stepNumber: 16,
    id: 'step-16',
    name: 'CI/CD Pipeline',
    category: 'Ops & Monitoring',
    description: 'Configures GitHub Actions workflows for automated linting, security scanning, docker building, and image registry publishing.',
    deliverables: ['GitHub Actions Workflow YAMLs', 'Dockerfiles'],
    qualityGates: ['Multi-Stage Docker Optimization', 'Container Vulnerability Scan (Trivy) Clean'],
    acceptanceCriteria: ['Pipeline completes build and test stage in < 4 minutes.', 'Images published with semver tags.'],
    forgeCommand: 'nexora pipeline create --type github-actions',
    aiAgentRole: 'OpenHands DevOps Engineer'
  },
  {
    stepNumber: 17,
    id: 'step-17',
    name: 'Deployment',
    category: 'Ops & Monitoring',
    description: 'Executes Terraform IaC provisioning and deploys Cloud Run container revisions using blue-green deployment strategy.',
    deliverables: ['Terraform IaC Manifests', 'Helm Charts', 'Cloud Run Manifest'],
    qualityGates: ['Zero-Downtime Deployment Passed', 'Automatic Health Check Verification'],
    acceptanceCriteria: ['Traffic shifted seamlessly to new revision.', 'Automatic rollback triggered if health check fails.'],
    forgeCommand: 'nexora deploy --env production',
    aiAgentRole: 'OpenHands DevOps Engineer'
  },
  {
    stepNumber: 18,
    id: 'step-18',
    name: 'Monitoring',
    category: 'Ops & Monitoring',
    description: 'Instruments OpenTelemetry metrics, structured JSON logs, Grafana dashboards, and Prometheus latency probes.',
    deliverables: ['Grafana Dashboard JSON', 'Prometheus Alert Rules', 'OTel Collector Config'],
    qualityGates: ['Golden Signals Telemetry Online (Latency, Traffic, Errors, Saturation)'],
    acceptanceCriteria: ['PagerDuty alerts trigger within 30s of error rate spike > 1%.'],
    forgeCommand: 'nexora monitor setup',
    aiAgentRole: 'OpenHands SRE'
  },
  {
    stepNumber: 19,
    id: 'step-19',
    name: 'Performance Validation',
    category: 'Ops & Monitoring',
    description: 'Runs k6 load testing scripts to simulate 10,000 concurrent users and verify p99 latency SLAs.',
    deliverables: ['k6 Load Test Scripts', 'Performance Analysis Report'],
    qualityGates: ['p95 Latency < 50ms', 'p99 Latency < 150ms', 'Zero Memory Leaks'],
    acceptanceCriteria: ['System sustains 5,000 RPS without dropping requests or breaching SLA.'],
    forgeCommand: 'nexora perf test --concurrent 10000',
    aiAgentRole: 'Codex Performance Specialist'
  },
  {
    stepNumber: 20,
    id: 'step-20',
    name: 'Release & Versioning',
    category: 'Ops & Monitoring',
    description: 'Publishes semantic version tags, updates CHANGELOG.md, creates GitHub Release notes, and notifies stakeholders.',
    deliverables: ['Semantic Version Tag (v1.2.0)', 'CHANGELOG.md Update', 'Release Announcement'],
    qualityGates: ['All 19 Prior Quality Gates Passed', 'Signed Git Tag'],
    acceptanceCriteria: ['Release tag published to GitHub.', 'Artifact published to enterprise registry.'],
    forgeCommand: 'nexora release create --version 1.0.0',
    aiAgentRole: 'ChatGPT Product Director'
  }
];

export const FORGE_COMMANDS_CATALOG: ForgeCommandSpec[] = [
  {
    command: 'nexora module create',
    description: 'Scaffolds a complete enterprise-compliant NEXORA business module with domain layer, DB migrations, API routes, and UI components.',
    inputs: [
      { flag: '--name', type: 'string', description: 'Name of the business module (e.g. inventory)', required: true },
      { flag: '--pillar', type: 'string', description: 'Target pillar (forge | sdk | studio | platform)', required: true },
      { flag: '--template', type: 'string', description: 'Module template type (crud | workflow | ai-agent)', required: false }
    ],
    outputs: [
      'Scaffolded folder directory structure under /src/modules/<name>',
      'Generated Drizzle database schema & initial SQL migration script',
      'FastAPI async service handlers & Pydantic DTO contracts',
      'React UI pages, components & i18n translation entries'
    ],
    generatedFiles: [
      'src/modules/<name>/domain/<name>.entity.ts',
      'src/modules/<name>/services/<name>.service.ts',
      'src/modules/<name>/api/<name>.router.ts',
      'src/modules/<name>/ui/<Name>Page.tsx',
      'src/modules/<name>/locales/en.json'
    ],
    validationRules: [
      'Module name must be lower_snake_case and alphanumeric.',
      'Must verify that no conflicting module exists in current workspace.',
      'Must pass initial mypy and tsc checks.'
    ],
    dependencies: ['NEXORA SDK Libraries v3.0+', 'FastAPI v0.100+', 'React v18+'],
    rollbackStrategy: 'Automatically deletes generated directory tree and reverts git working index if any step fails during generation.'
  },
  {
    command: 'nexora app create',
    description: 'Generates a full-stack production-ready micro-application integrated with NEXORA CORE mesh and IAM.',
    inputs: [
      { flag: '--app-id', type: 'string', description: 'Unique application identifier slug', required: true },
      { flag: '--domain', type: 'string', description: 'Associated domain context', required: true }
    ],
    outputs: ['Standalone microservice repository folder', 'Container build scripts', 'Kubernetes Helm charts'],
    generatedFiles: ['server.ts', 'Dockerfile', 'helm/Chart.yaml', 'src/App.tsx'],
    validationRules: ['App ID must match NEXORA product slug rules.', 'Port 3000 ingress must be bound.'],
    dependencies: ['Docker Engine', 'Helm 3', 'Node.js 20+'],
    rollbackStrategy: 'Removes scaffolded application root directory and cancels register API calls.'
  },
  {
    command: 'nexora doctor',
    description: 'Executes comprehensive diagnostic health check across local environment dependencies, permissions, and standards compliance.',
    inputs: [
      { flag: '--fix', type: 'boolean', description: 'Automatically repair fixable environment issues', required: false }
    ],
    outputs: ['Environment Diagnostic Report', 'Dependency Health Matrix', 'Automated Fix Execution Logs'],
    generatedFiles: ['doctor-report.json'],
    validationRules: ['Requires root or sudo permission for socket repairs if selected.'],
    dependencies: ['Python 3.11+', 'Docker Socket'],
    rollbackStrategy: 'Restores original config files from backup snapshot before fix execution.'
  },
  {
    command: 'nexora release create',
    description: 'Orchestrates full release process: runs quality gates, tags git commit, generates CHANGELOG, and triggers deployment.',
    inputs: [
      { flag: '--version', type: 'string', description: 'Target semantic version (e.g. 2.1.0)', required: true },
      { flag: '--stage', type: 'string', description: 'Target environment (staging | production)', required: true }
    ],
    outputs: ['Git release tag', 'Published container image artifact', 'Deployment trigger notification'],
    generatedFiles: ['CHANGELOG.md', 'release-manifest.json'],
    validationRules: ['All 20 EIF Quality Gates MUST be 100% green before tagging.'],
    dependencies: ['GitHub CLI', 'Docker Registry Credentials'],
    rollbackStrategy: 'Deletes remote git tag and triggers automated rollbacks on target Cloud Run environment.'
  }
];

export const AI_FACTORY_AGENTS: AiAgentSpec[] = [
  {
    name: 'ChatGPT Enterprise Strategist',
    alias: 'ChatGPT-v4o',
    specialization: 'Enterprise Architecture, BRD/FSD Specifications, Security & Regulatory Reviews',
    responsibilities: [
      'Translates executive requirements into formal BRD/FSD specifications',
      'Conducts architectural feasibility and risk assessments',
      'Performs zero-trust security rule reviews and compliance checks'
    ],
    githubWorkflowRole: 'Lead Architect & PR Reviewer (Architecture Branch)',
    primaryTools: ['OpenAPI Spec Parser', 'TOGAF Matrix Generator', 'Rego Policy Evaluator'],
    qualityGateFocus: 'Business Strategy & Architecture Gate (Steps 1, 2, 20)'
  },
  {
    name: 'Gemini / Google AI Studio Architect',
    alias: 'Gemini 2.5 Flash',
    specialization: 'Enterprise Domain Models (EDM), Vector RAG, Documentation & UML Diagrams',
    responsibilities: [
      'Generates high-dimensional pgvector index pipelines and RAG prompts',
      'Renders Mermaid and PlantUML architecture layer diagrams',
      'Authoring comprehensive OpenAPI docs and Developer Onboarding Guides'
    ],
    githubWorkflowRole: 'Docs & System Architect PR Author',
    primaryTools: ['@google/genai SDK', 'pgvector Query Engine', 'Mermaid Spec Generator'],
    qualityGateFocus: 'Domain Model & Documentation Gate (Steps 3, 5, 10, 15)'
  },
  {
    name: 'Codex / Cursor Backend Architect',
    alias: 'Codex / Cursor',
    specialization: 'Python FastAPI Microservices, PostgreSQL Schemas, Pytest & Performance',
    responsibilities: [
      'Writes async FastAPI controllers, Pydantic DTOs, and Drizzle/SQLAlchemy ORMs',
      'Optimizes SQL database indexing for sub-5ms query performance',
      'Crafts unit and integration test suites with 85%+ code coverage'
    ],
    githubWorkflowRole: 'Core Backend & Database PR Contributor',
    primaryTools: ['mypy --strict', 'pytest', 'Drizzle ORM', 'FastAPI'],
    qualityGateFocus: 'Backend & Database Engineering Gate (Steps 4, 6, 12, 13, 19)'
  },
  {
    name: 'Lovable / Base44 Frontend Specialist',
    alias: 'Lovable / Base44',
    specialization: 'React 18, Vite, Tailwind CSS, WCAG AAA Accessibility & Mobile UX',
    responsibilities: [
      'Builds modular, responsive React components using NEXORA Design System tokens',
      'Enforces strict WCAG AAA 7:1 color contrast and keyboard navigation',
      'Maintains mobile touch targets (>=44px) and responsive layout mechanics'
    ],
    githubWorkflowRole: 'UI/UX & Frontend Lead PR Contributor',
    primaryTools: ['React 18', 'Tailwind CSS', 'Lucide Icons', 'Axe-core Accessibility'],
    qualityGateFocus: 'Frontend & Accessibility Gate (Steps 7, 8)'
  },
  {
    name: 'OpenHands Automation & DevOps Specialist',
    alias: 'OpenHands',
    specialization: 'CI/CD Pipelines, GitHub Actions, Docker, Playwright E2E & Monitoring',
    responsibilities: [
      'Automates multi-stage Docker builds and GitHub Actions workflows',
      'Executes Playwright end-to-end browser automation suites',
      'Instruments OpenTelemetry collector metrics and Grafana alerting'
    ],
    githubWorkflowRole: 'DevOps & Repository Maintenance Bot',
    primaryTools: ['Docker', 'Terraform', 'Playwright', 'OpenTelemetry', 'Grafana'],
    qualityGateFocus: 'DevOps, CI/CD & Reliability Gate (Steps 11, 14, 16, 17, 18)'
  }
];

export const QUALITY_GATES_CATALOG: QualityGateRule[] = [
  {
    id: 'gate-01',
    category: 'Architecture',
    rule: 'Zero Circular Dependencies Across Bounded Contexts',
    threshold: '0 Circular Imports / 0 Cross-Context Entity Mutations',
    automatedCheckTool: 'Madge / Import Linter',
    blockingSeverity: 'CRITICAL'
  },
  {
    id: 'gate-02',
    category: 'Code',
    rule: 'Strict TypeScript & Python Static Typing',
    threshold: '100% Type Coverage (0 implicit any, mypy --strict pass)',
    automatedCheckTool: 'tsc --noEmit & mypy',
    blockingSeverity: 'CRITICAL'
  },
  {
    id: 'gate-03',
    category: 'Security',
    rule: 'Zero Known Vulnerabilities & Strict Authorization Checks',
    threshold: '0 Critical/High Vulnerabilities, 100% Endpoint Auth Guards',
    automatedCheckTool: 'Trivy & OPA Policy Scan',
    blockingSeverity: 'CRITICAL'
  },
  {
    id: 'gate-04',
    category: 'Performance',
    rule: 'p95 Latency SLA & Memory Leak Guard',
    threshold: 'p95 < 50ms (Read), p95 < 100ms (Write), 0 Memory Leak Growth',
    automatedCheckTool: 'k6 Load Tester',
    blockingSeverity: 'HIGH'
  },
  {
    id: 'gate-05',
    category: 'Testing',
    rule: 'Automated Test Code Coverage Target',
    threshold: 'Line Coverage >= 85%, Branch Coverage >= 80%',
    automatedCheckTool: 'pytest-cov & Vitest Coverage',
    blockingSeverity: 'HIGH'
  },
  {
    id: 'gate-06',
    category: 'Docs',
    rule: 'OpenAPI 3.1 & Architecture ADR Completeness',
    threshold: '100% Endpoints Documented, Spectral Validation Clean',
    automatedCheckTool: 'Spectral CLI',
    blockingSeverity: 'MEDIUM'
  },
  {
    id: 'gate-07',
    category: 'Accessibility',
    rule: 'WCAG AAA Color Contrast & Focus States',
    threshold: 'Contrast Ratio >= 7:1, 0 Missing Alt/Label Violations',
    automatedCheckTool: 'Axe-core Linter',
    blockingSeverity: 'HIGH'
  },
  {
    id: 'gate-08',
    category: 'Localization',
    rule: 'Multi-Language Translation Key Completeness',
    threshold: '100% Translation Key Coverage across en, fr, ar, es, pt, bm',
    automatedCheckTool: 'i18n-check-cli',
    blockingSeverity: 'HIGH'
  }
];

export const MODULE_TEMPLATE_HIERARCHY: ModuleTemplateNode[] = [
  {
    path: 'src/modules/<module_name>',
    type: 'folder',
    description: 'Root folder of the standard NEXORA business module.'
  },
  {
    path: 'src/modules/<module_name>/domain',
    type: 'folder',
    description: 'Domain layer containing aggregate roots, entities, and value objects.'
  },
  {
    path: 'src/modules/<module_name>/domain/<module_name>.entity.ts',
    type: 'file',
    description: 'Canonical Domain Entity with strict encapsulate methods.',
    sampleContent: `export class InventoryItemAggregate {
  constructor(
    public readonly id: string,
    private sku: string,
    private quantity: number,
    private updatedBy: string
  ) {}

  public adjustStock(delta: number, actorId: string): void {
    if (this.quantity + delta < 0) {
      throw new Error("InsufficientStockException: Cannot reduce below zero.");
    }
    this.quantity += delta;
    this.updatedBy = actorId;
  }
}`
  },
  {
    path: 'src/modules/<module_name>/api',
    type: 'folder',
    description: 'RESTful API route handlers, request validation schemas, and rate-limiting middleware.'
  },
  {
    path: 'src/modules/<module_name>/api/<module_name>.router.ts',
    type: 'file',
    description: 'FastAPI async route handlers with OpenAPI documentation attributes.',
    sampleContent: `from fastapi import APIRouter, Depends, HTTPException
from src.modules.inventory.dto import StockAdjustDTO
from src.modules.inventory.service import InventoryService

router = APIRouter(prefix="/api/v1/inventory", tags=["Inventory"])

@router.post("/{item_id}/adjust")
async def adjust_stock(
    item_id: str,
    payload: StockAdjustDTO,
    service: InventoryService = Depends()
):
    return await service.adjust_stock(item_id, payload.delta, payload.user_id)`
  },
  {
    path: 'src/modules/<module_name>/ui',
    type: 'folder',
    description: 'React UI view page, modular components, and custom state hooks.'
  },
  {
    path: 'src/modules/<module_name>/locales',
    type: 'folder',
    description: 'Internationalization dictionary JSON files for en, fr, ar, es, pt, bm.'
  },
  {
    path: 'src/modules/<module_name>/tests',
    type: 'folder',
    description: 'Isolated pytest unit tests and Vitest component rendering tests.'
  }
];
