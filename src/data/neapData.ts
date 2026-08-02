import {
  CapabilityLevel1,
  ArchitectureLayer,
  DevelopmentStandardCategory,
  LocaleInfo,
  SupportedLocale
} from '../types/neap';

export const LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', flag: '🇧🇷' },
  { code: 'bm', name: 'Bambara', nativeName: 'Bamanankan', direction: 'ltr', flag: '🇲🇱' }
];

export const I18N_TRANSLATIONS: Record<SupportedLocale, Record<string, string>> = {
  en: {
    'neap.title': 'NEXORA Enterprise Architecture Program (NEAP)',
    'neap.subtitle': 'Master Architecture v3.0 – Enterprise Capability Model, Reference Architecture & Standards',
    'neap.capability_model': '01. Capability Model (ECM)',
    'neap.reference_arch': '02. Reference Architecture (ERA)',
    'neap.dev_standards': '03. Engineering Standards (EDS)',
    'neap.i18n_strategy': '04. Localization Strategy (i18n)',
    'neap.roadmap': '05. Architecture Roadmap',
    'app.launch_engine': 'LAUNCH PRODUCT ENGINE',
    'app.wcag_compliant': 'WCAG AAA 7:1 COMPLIANT',
    'app.system_status': 'SYSTEM ALL PIPELINES OPERATIONAL',
    'app.search_placeholder': 'Search capabilities, architecture layers, standards...'
  },
  fr: {
    'neap.title': 'Programme d Architecture d Entreprise NEXORA (NEAP)',
    'neap.subtitle': 'Architecture Maîtresse v3.0 – Modèle de Capacité, Architecture de Référence et Normes',
    'neap.capability_model': '01. Modèle de Capacités (ECM)',
    'neap.reference_arch': '02. Architecture de Référence (ERA)',
    'neap.dev_standards': '03. Normes d Ingénierie (EDS)',
    'neap.i18n_strategy': '04. Stratégie de Localisation (i18n)',
    'neap.roadmap': '05. Feuille de Route Architecturale',
    'app.launch_engine': 'LANCER LE MOTEUR PRODUIT',
    'app.wcag_compliant': 'CONFORME WCAG AAA 7:1',
    'app.system_status': 'SYSTÈME TOUS LES PIPELINES OPERATIONNELS',
    'app.search_placeholder': 'Rechercher des capacités, des couches d architecture, des normes...'
  },
  ar: {
    'neap.title': 'برنامج بنية المؤسسة نكسورا (NEAP)',
    'neap.subtitle': 'البنية الهندسية الشاملة الإصدار 3.0 – نموذج القدرات، البنية المرجعية والمعايير',
    'neap.capability_model': '01. نموذج قدرات المؤسسة (ECM)',
    'neap.reference_arch': '02. البنية المرجعية للمؤسسة (ERA)',
    'neap.dev_standards': '03. معايير التطوير الهندسي (EDS)',
    'neap.i18n_strategy': '04. استراتيجية التدويل والترجمة (i18n)',
    'neap.roadmap': '05. خارطة الطريق المعمارية',
    'app.launch_engine': 'تشغيل محرك المنتج',
    'app.wcag_compliant': 'متوافق مع معايير الوصول WCAG AAA 7:1',
    'app.system_status': 'جميع الأنابيب والخدمات تعمل بانتظام',
    'app.search_placeholder': 'البحث في القدرات، طبقات البنية المعمارية، والمعايير...'
  },
  es: {
    'neap.title': 'Programa de Arquitectura Empresarial NEXORA (NEAP)',
    'neap.subtitle': 'Arquitectura Maestra v3.0 – Modelo de Capacidades, Arquitectura de Referencia y Estándares',
    'neap.capability_model': '01. Modelo de Capacidades (ECM)',
    'neap.reference_arch': '02. Arquitectura de Referencia (ERA)',
    'neap.dev_standards': '03. Estándares de Ingeniería (EDS)',
    'neap.i18n_strategy': '04. Estrategia de Localización (i18n)',
    'neap.roadmap': '05. Hoja de Ruta de Arquitectura',
    'app.launch_engine': 'INICIAR MOTOR DE PRODUCTO',
    'app.wcag_compliant': 'CUMPLE WCAG AAA 7:1',
    'app.system_status': 'SISTEMA TODOS LOS PIPELINES OPERATIVOS',
    'app.search_placeholder': 'Buscar capacidades, capas de arquitectura, estándares...'
  },
  pt: {
    'neap.title': 'Programa de Arquitetura Empresarial NEXORA (NEAP)',
    'neap.subtitle': 'Arquitetura Mestra v3.0 – Modelo de Capacidades, Arquitetura de Referência e Padrões',
    'neap.capability_model': '01. Modelo de Capacidades (ECM)',
    'neap.reference_arch': '02. Arquitetura de Referência (ERA)',
    'neap.dev_standards': '03. Padrões de Engenharia (EDS)',
    'neap.i18n_strategy': '04. Estratégia de Localização (i18n)',
    'neap.roadmap': '05. Roteiro de Arquitetura',
    'app.launch_engine': 'INICIAR MOTOR DE PRODUTO',
    'app.wcag_compliant': 'CONFORME WCAG AAA 7:1',
    'app.system_status': 'SISTEMA TODOS OS PIPELINES OPERACIONAIS',
    'app.search_placeholder': 'Pesquisar capacidades, camadas de arquitetura, padrões...'
  },
  bm: {
    'neap.title': 'NEXORA Sogo Sogo Kɛcogo Baara (NEAP)',
    'neap.subtitle': 'Cokoya Baa v3.0 – Sebaaya Ladhɛ, Kɛcogo Sira & Sariyaw',
    'neap.capability_model': '01. Sebaaya Ladhɛ (ECM)',
    'neap.reference_arch': '02. Kɛcogo Sira Baa (ERA)',
    'neap.dev_standards': '03. Baara Kɛ Sariyaw (EDS)',
    'neap.i18n_strategy': '04. Kanw Bamanankan Sira (i18n)',
    'neap.roadmap': '05. Sira Taamana Cokoya',
    'app.launch_engine': 'BAARA MOTEUR DAMINE',
    'app.wcag_compliant': 'WCAG AAA 7:1 SARIYA BƐ KƐ',
    'app.system_status': 'SISTƐMI PIPELINE BƐƐ BƐ BAARA KƐ',
    'app.search_placeholder': 'Sebaayaw, cokoya, ni sariyaw ɲini...'
  }
};

export const ECM_CAPABILITIES: CapabilityLevel1[] = [
  {
    id: 'cap-identity',
    code: 'CAP-01',
    name: 'Identity & Access Control',
    description: 'Centralized multi-tenant identity verification, role/policy enforcement, credentials, and SSO session management.',
    level2Capabilities: [
      {
        id: 'cap-01-01',
        name: 'Authentication & Session Engine',
        description: 'Handles credentials, MFA, OAuth2/OIDC code flows, JWT issuance, and active session invalidation.',
        level3Functions: [
          {
            id: 'func-01-01-01',
            name: 'Multi-Factor Authentication (MFA)',
            description: 'Time-based OTP (TOTP) and webauthn security key verification.',
            technicalComponents: ['SDK IAM MFA Provider', 'FastAPI Auth Middleware', 'Redis Session Store'],
            mappedApi: 'POST /api/v1/auth/mfa/verify',
            mappedEntity: 'User',
            mappedRole: 'Guest / User',
            mappedWorkflow: 'WF-IAM-001 (Login Step 2)',
            mappedAiAgent: 'IAM Guardian Agent'
          },
          {
            id: 'func-01-01-02',
            name: 'OAuth2 & JWT Token Issuance',
            description: 'Issuance of short-lived RS256 JWT access tokens and persistent refresh tokens.',
            technicalComponents: ['SDK Auth Token Service', 'Vault Key Management'],
            mappedApi: 'POST /api/v1/auth/oauth/token',
            mappedEntity: 'OAuthClient',
            mappedRole: 'API Client',
            mappedWorkflow: 'WF-IAM-002 (Token Exchange)',
            mappedAiAgent: 'IAM Guardian Agent'
          }
        ]
      },
      {
        id: 'cap-01-02',
        name: 'Authorization & ABAC/RBAC Engine',
        description: 'Hierarchical role assignments and Attribute-Based Access Control (ABAC) evaluation matrix.',
        level3Functions: [
          {
            id: 'func-01-02-01',
            name: 'Policy Evaluation Engine',
            description: 'Evaluates zero-trust security policies against resource context in under 1.5ms.',
            technicalComponents: ['Open Policy Agent (OPA) sidecar', 'NEXORA Policy Engine'],
            mappedApi: 'POST /api/v1/iam/policies/evaluate',
            mappedEntity: 'Role / Permission',
            mappedRole: 'Org Admin',
            mappedWorkflow: 'WF-IAM-003 (Access Check)',
            mappedAiAgent: 'IAM Guardian Agent'
          }
        ]
      }
    ]
  },
  {
    id: 'cap-platform',
    code: 'CAP-02',
    name: 'Platform Infrastructure & Extensions',
    description: 'Runtime environment provisioning, plugin lifecycle execution, theme distribution, and global configuration.',
    level2Capabilities: [
      {
        id: 'cap-02-01',
        name: 'Plugin & Extension Marketplace',
        description: 'Dynamic sandbox loading of third-party plugins, hooks, and extensions.',
        level3Functions: [
          {
            id: 'func-02-01-01',
            name: 'WASM & Microservice Plugin Loader',
            description: 'Isolates plugin execution inside WebAssembly sandboxes with restricted syscalls.',
            technicalComponents: ['NEXORA Plugin Host', 'Wasmtime Engine', 'Forge Plugin CLI'],
            mappedApi: 'POST /api/v1/plugins/install',
            mappedEntity: 'Plugin',
            mappedRole: 'Super Admin',
            mappedWorkflow: 'WF-PLT-001 (Plugin Deploy)',
            mappedAiAgent: 'Studio Architect Agent'
          }
        ]
      }
    ]
  },
  {
    id: 'cap-development',
    code: 'CAP-03',
    name: 'Software Development Lifecycle (SDLC)',
    description: 'Code repository hosting, automated CI/CD pipeline runs, static analysis, sprint planning, and release generation.',
    level2Capabilities: [
      {
        id: 'cap-03-01',
        name: 'Automated CI/CD Build Engine',
        description: 'Distributed pipeline execution engine for builds, tests, security scans, and container pushes.',
        level3Functions: [
          {
            id: 'func-03-01-01',
            name: 'Pipeline Execution Engine',
            description: 'Parses YAML pipeline specifications and orchestrates parallel docker-in-docker workers.',
            technicalComponents: ['NEXORA Pipeline Daemon', 'Forge Test Runner', 'Argo CD Sync'],
            mappedApi: 'POST /api/v1/pipelines/{id}/trigger',
            mappedEntity: 'Pipeline',
            mappedRole: 'Engineer',
            mappedWorkflow: 'WF-DEV-001 (Build & Test)',
            mappedAiAgent: 'Doctor Diagnostic Agent'
          }
        ]
      }
    ]
  },
  {
    id: 'cap-ai',
    code: 'CAP-04',
    name: 'AI Intelligence & Agent Orchestration',
    description: 'Gemini LLM model proxying, high-dimensional vector embeddings, RAG knowledge retrieval, and autonomous agents.',
    level2Capabilities: [
      {
        id: 'cap-04-01',
        name: 'Vector Search & RAG Memory Engine',
        description: 'High-throughput 768d/1536d cosine vector indexing and semantic retrieval for grounding prompts.',
        level3Functions: [
          {
            id: 'func-04-01-01',
            name: 'Semantic Vector Retrieval',
            description: 'Performs pgvector HNSW similarity queries across indexed documentation and codebase snippets.',
            technicalComponents: ['SDK Gemini Embedding Proxy', 'PostgreSQL pgvector Engine'],
            mappedApi: 'POST /api/v1/vector-indexes/{id}/query',
            mappedEntity: 'VectorIndex',
            mappedRole: 'AI Agent / User',
            mappedWorkflow: 'WF-AI-001 (RAG Retrieval)',
            mappedAiAgent: 'Knowledge AI Copilot'
          }
        ]
      }
    ]
  }
];

export const ERA_ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'layer-01',
    name: '01. Business Architecture Layer',
    purpose: 'Defines business goals, strategic pillars, capabilities, organization structures, and value streams.',
    responsibilities: [
      'Align technology development with business objectives',
      'Maintain the 10 core business product definitions',
      'Govern multi-tenant SLA parameters and business units'
    ],
    dependencies: ['None (Top Strategic Anchor)'],
    inputs: ['Enterprise Strategy', 'Customer Requirements', 'Regulatory Mandates'],
    outputs: ['Capability Maps', 'Business Models', 'Service Level Agreements'],
    integrationPoints: ['Capability Architecture', 'Domain Architecture'],
    mermaidSpec: `graph TD
    BA[Business Architecture] --> ForgePillar[Pillar I: Forge CLI]
    BA --> SDKPillar[Pillar II: SDK Libraries]
    BA --> StudioPillar[Pillar III: Studio Low-Code]
    BA --> PlatformPillar[Pillar IV: Platform CORE]`
  },
  {
    id: 'layer-02',
    name: '02. Capability Architecture Layer',
    purpose: 'Maps strategic business functions into Level 1-4 capabilities, business processes, and feature sets.',
    responsibilities: [
      'Formalize Level 1-4 capability hierarchies',
      'Ensure zero capability overlap between products',
      'Provide capability metrics for platform monitoring'
    ],
    dependencies: ['01. Business Architecture Layer'],
    inputs: ['Business Strategy', 'Product Definitions'],
    outputs: ['Capability Matrix', 'Level 1-4 Mappings'],
    integrationPoints: ['Domain Architecture', 'Application Architecture'],
    mermaidSpec: `graph LR
    CAP[Capability Layer] --> L1[L1: Identity]
    CAP --> L2[L1: Platform]
    CAP --> L3[L1: SDLC]
    CAP --> L4[L1: AI Platform]`
  },
  {
    id: 'layer-03',
    name: '03. Domain Architecture Layer (DDD)',
    purpose: 'Defines bounded contexts, aggregate roots, domain entities, value objects, domain events, and anti-corruption layers.',
    responsibilities: [
      'Maintain strict Bounded Context isolation',
      'Prevent domain model pollution across boundaries',
      'Define canonical Domain Events (e.g. OrganizationCreated, PipelineTriggered)'
    ],
    dependencies: ['02. Capability Architecture Layer'],
    inputs: ['Capability Maps', 'Domain Expert Rules'],
    outputs: ['Domain Entities', 'Aggregate Definitions', 'Domain Events'],
    integrationPoints: ['Application Architecture', 'Data Architecture'],
    mermaidSpec: `graph TD
    subgraph OrgContext [Organization Context]
      OrgAggregate[Organization Aggregate Root]
      BU[Business Unit Entity]
      Dept[Department Entity]
    end
    subgraph IAMContext [Identity & Access Context]
      UserAggregate[User Aggregate Root]
      Role[Role Entity]
    end
    OrgAggregate -->|Publishes Event| OrgCreatedEvt[OrganizationCreated]
    OrgCreatedEvt -->|Subscribed By| IAMContext`
  },
  {
    id: 'layer-04',
    name: '04. Application Architecture Layer',
    purpose: 'Orchestrates user interfaces, CLI binaries, web applications, low-code canvas engines, and microservice handlers.',
    responsibilities: [
      'Serve responsive frontend SPA (React, Tailwind, Lucide)',
      'Execute Python-based NEXORA Forge CLI tools',
      'Manage NEXORA Studio visual workspace builder'
    ],
    dependencies: ['03. Domain Architecture Layer'],
    inputs: ['User UI Events', 'CLI Commands', 'REST Responses'],
    outputs: ['Rendered UI Canvas', 'CLI Output Streams'],
    integrationPoints: ['Integration Architecture', 'API Architecture'],
    mermaidSpec: `graph TD
    CLI[NEXORA Forge CLI] -->|API Calls| SDK[NEXORA SDK]
    Studio[NEXORA Studio Web] -->|API Calls| Gateway[API Gateway]
    Platform[NEXORA Platform] -->|gRPC/REST| Core[NEXORA CORE Mesh]`
  },
  {
    id: 'layer-05',
    name: '05. Data Architecture Layer',
    purpose: 'Governs physical relational schemas, vector databases, Redis caches, object storage, and data encryption.',
    responsibilities: [
      'PostgreSQL schema execution and migration (DDL)',
      'High-dimensional pgvector index maintenance (HNSW 768d)',
      'Zero-trust data encryption at rest (AES-256)'
    ],
    dependencies: ['03. Domain Architecture Layer'],
    inputs: ['Domain Commands', 'Persistence Requests'],
    outputs: ['Persisted Records', 'Vector Similarity Results'],
    integrationPoints: ['Database Infrastructure', 'AI Architecture'],
    mermaidSpec: `graph TD
    App[Application Layer] -->|SQL DML| Postgres[(PostgreSQL 15)]
    App -->|Vector Search| PgVector[(pgvector Extension)]
    App -->|Session Cache| Redis[(Redis 7 Cache)]`
  },
  {
    id: 'layer-06',
    name: '06. Integration Architecture Layer',
    purpose: 'Manages event-driven message buses, asynchronous queues, WebSockets, and third-party connector adapters.',
    responsibilities: [
      'Asynchronous domain event streaming via NATS / RabbitMQ',
      'Real-time bi-directional WebSocket streaming',
      'Third-party connector isolation (GitHub, Jira, AWS)'
    ],
    dependencies: ['04. Application Architecture Layer'],
    inputs: ['Domain Events', 'Webhooks'],
    outputs: ['Dispatched Messages', 'Socket Events'],
    integrationPoints: ['API Architecture', 'Observability Architecture'],
    mermaidSpec: `graph LR
    Publisher[Domain Event Publisher] -->|NATS JetStream| Bus[Event Bus]
    Bus --> Subscriber1[Audit Logger]
    Bus --> Subscriber2[AI Vector Indexer]
    Bus --> Subscriber3[Notification Worker]`
  },
  {
    id: 'layer-07',
    name: '07. API Architecture Layer',
    purpose: 'Standardizes RESTful HTTP, gRPC microservices, GraphQL, OpenAPI 3.1 specifications, and API gateway routing.',
    responsibilities: [
      'Enforce /api/v1/ JSON resource conventions',
      'Rate limiting, request validation, and CORS headers',
      'Microservice RPC routing and service discovery'
    ],
    dependencies: ['04. Application Architecture Layer'],
    inputs: ['HTTP/gRPC Inbound Requests'],
    outputs: ['Structured JSON/Protobuf Responses'],
    integrationPoints: ['Security Architecture', 'Application Layer'],
    mermaidSpec: `graph TD
    Client[Client Requests] -->|HTTPS Port 3000| Gateway[NEXORA API Gateway]
    Gateway -->|JWT Check| Auth[IAM Auth Middleware]
    Auth -->|Route| Service1[Org Service]
    Auth -->|Route| Service2[AI Agent Service]`
  },
  {
    id: 'layer-08',
    name: '08. Security Architecture Layer',
    purpose: 'Zero-trust network architecture, mutual TLS (mTLS), key management, audit logging, and vulnerability scanning.',
    responsibilities: [
      'Enforce mTLS for inter-service communication',
      'Maintain immutable audit logs for compliance',
      'Manage API keys and secrets via HashiCorp Vault'
    ],
    dependencies: ['07. API Architecture Layer'],
    inputs: ['Request Context', 'Security Telemetry'],
    outputs: ['Auth Decision (Allow/Deny)', 'Audit Trail'],
    integrationPoints: ['All Layers (Cross-Cutting Concern)'],
    mermaidSpec: `graph TD
    Req[Incoming Request] --> TLS[mTLS Termination]
    TLS --> WAF[Web Application Firewall]
    WAF --> RBAC[RBAC/ABAC Evaluator]
    RBAC -->|Logged| Audit[(Immutable Audit Log)]`
  },
  {
    id: 'layer-09',
    name: '09. AI Systems Architecture Layer',
    purpose: 'Orchestrates Gemini model adapters, system prompts, conversational memory, vector search, and tool execution.',
    responsibilities: [
      'Server-side proxying of Gemini API keys',
      'RAG prompt context enrichment',
      'Agent function calling and tool sandbox execution'
    ],
    dependencies: ['05. Data Architecture Layer', '07. API Architecture Layer'],
    inputs: ['User Prompts', 'Context Vectors'],
    outputs: ['LLM Generation Streams', 'Tool Execution Logs'],
    integrationPoints: ['Application Layer', 'Data Layer'],
    mermaidSpec: `graph TD
    Prompt[User Prompt] --> RAG[RAG Context Resolver]
    RAG --> VectorDb[(pgvector Store)]
    VectorDb --> Context[Relevant Snippets]
    Context --> Gemini[Gemini 2.5 Flash API]
    Gemini --> Tool[Tool Execution Engine]`
  },
  {
    id: 'layer-[#infrastructure]',
    name: '10. Infrastructure Architecture Layer',
    purpose: 'Cloud-native runtime environments, Cloud Run containers, Kubernetes clusters, networks, and storage buckets.',
    responsibilities: [
      'Port 3000 ingress binding via Nginx reverse proxy',
      'Container orchestration and scale-to-zero support',
      'Multi-region high availability setup'
    ],
    dependencies: ['None (Physical/Cloud Layer)'],
    inputs: ['Deployment Manifests'],
    outputs: ['Running Container Pods'],
    integrationPoints: ['Deployment Architecture'],
    mermaidSpec: `graph TD
    Proxy[Nginx Proxy Port 3000] --> AppContainer[Cloud Run Container Node]
    AppContainer --> DB[(Managed Cloud SQL PostgreSQL)]`
  },
  {
    id: 'layer-11',
    name: '11. Deployment Architecture Layer',
    purpose: 'Infrastructure as Code (Terraform), Helm charts, blue-green deployments, and rollback automation.',
    responsibilities: [
      'Terraform provisioning of GCP resources',
      'Automated canary and blue-green deployments',
      'Zero-downtime database schema migrations'
    ],
    dependencies: ['10. Infrastructure Architecture Layer'],
    inputs: ['Terraform Specs', 'Docker Images'],
    outputs: ['Provisioned Cloud Resources'],
    integrationPoints: ['DevOps Architecture'],
    mermaidSpec: `graph LR
    TF[Terraform Plan] --> Provision[Provision Infrastructure]
    Provision --> Deploy[Deploy Container Images]
    Deploy --> Health[Run Health Check]`
  },
  {
    id: 'layer-12',
    name: '12. DevOps Architecture Layer',
    purpose: 'CI/CD pipeline automation, automated testing quality gates, artifact registries, and release tagging.',
    responsibilities: [
      'GitHub Actions workflow automation',
      'Enforce linting, static analysis, and code coverage (>85%)',
      'Automated container publishing to GitHub Container Registry'
    ],
    dependencies: ['11. Deployment Architecture Layer'],
    inputs: ['Git Push Events', 'Pull Requests'],
    outputs: ['Tested Artifacts', 'Deployment Triggers'],
    integrationPoints: ['Observability Architecture'],
    mermaidSpec: `graph TD
    Commit[Git Commit] --> Build[Docker Build & Lint]
    Build --> Test[Execute Unit & Integration Tests]
    Test --> Gate{Quality Gate Passed?}
    Gate -->|Yes| Push[Push Container Artifact]
    Gate -->|No| Notify[Alert Developer]`
  },
  {
    id: 'layer-13',
    name: '13. Observability Architecture Layer',
    purpose: 'Centralized OpenTelemetry logging, Prometheus metrics, Jaeger distributed tracing, and automated alerts.',
    responsibilities: [
      'Collect structured JSON logs from all services',
      'Monitor CPU, memory, latency, and error rate metrics',
      'Trigger PagerDuty / Slack alerts on anomaly detection'
    ],
    dependencies: ['All Architecture Layers'],
    inputs: ['Log Streams', 'Metric Gauges', 'Traces'],
    outputs: ['Grafana Dashboards', 'Alert Incident Triggers'],
    integrationPoints: ['Security Architecture', 'DevOps Architecture'],
    mermaidSpec: `graph TD
    Service[All Microservices] -->|OpenTelemetry| Collector[OTel Collector]
    Collector --> Prometheus[(Prometheus Metrics)]
    Collector --> Loki[(Loki Log Store)]
    Prometheus --> Grafana[Grafana Observability Canvas]`
  }
];

export const EDS_STANDARDS_CATALOG: DevelopmentStandardCategory[] = [
  {
    title: 'Python Engineering Standards (NEXORA Forge & Microservices)',
    description: 'Mandatory guidelines for Python 3.11+, FastAPI, Pydantic v2, and CLI tools in NEXORA Forge.',
    standards: [
      {
        rule: 'Explicit Type Hints & Strict Pydantic Models',
        description: 'All functions, methods, and API schemas MUST declare type hints. Any API payload must use Pydantic v2 BaseModels with strict validation.',
        badExample: `def process_user(data):\n    return data["name"].upper()`,
        goodExample: `def process_user(user: UserDTO) -> str:\n    return user.name.upper()`
      },
      {
        rule: 'Async/Await for I/O Bound Microservices',
        description: 'Use FastAPI async def route handlers for database queries, external HTTP calls, and AI stream proxying to avoid blocking worker threads.',
        badExample: `def get_user_data(user_id: str):\n    res = requests.get(f"http://api/users/{user_id}")\n    return res.json()`,
        goodExample: `async def get_user_data(user_id: str) -> UserResponse:\n    async with httpx.AsyncClient() as client:\n        res = await client.get(f"http://api/users/{user_id}")\n        return UserResponse.model_validate(res.json())`
      }
    ]
  },
  {
    title: 'TypeScript & Frontend Standards (React, Vite, Tailwind)',
    description: 'Strict typing, modular components, Tailwind utility styling, and zero unhandled promises.',
    standards: [
      {
        rule: 'Top-Level Named Type Imports & Named Exports',
        description: 'Imports must be at the top level. Use explicitly named exports instead of default exports for utility libraries and components.',
        badExample: `import type { User } from './types';\nexport default function UserCard() { ... }`,
        goodExample: `import { User } from './types';\nexport const UserCard: React.FC<{ user: User }> = ({ user }) => { ... };`
      },
      {
        rule: 'WCAG AAA Color Contrast & Accessible Elements',
        description: 'Ensure text contrast ratio >= 7:1 against background colors. Interactive controls must have unique IDs and keyboard focus states.',
        badExample: `<button onClick={click} className="text-gray-400 bg-gray-500 font-sans">Click</button>`,
        goodExample: `<button id="btn-submit-form" onClick={click} className="text-white bg-sky-600 hover:bg-sky-500 font-mono focus:ring-2 focus:ring-sky-400">Execute</button>`
      }
    ]
  },
  {
    title: 'Database & SQL Standards (PostgreSQL 15+)',
    description: 'Naming conventions, primary keys, migration scripts, and indexing rules.',
    standards: [
      {
        rule: 'Snake_Case Plural Table Names & UUID Primary Keys',
        description: 'All table names MUST be plural snake_case. Primary keys MUST be UUID version 4 generated server-side.',
        badExample: `CREATE TABLE UserProfile ( UserID INT PRIMARY KEY, FullName VARCHAR(100) );`,
        goodExample: `CREATE TABLE user_profiles (\n    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    full_name VARCHAR(255) NOT NULL,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);`
      }
    ]
  },
  {
    title: 'Git & Branching Standards (Git Flow & Semantic Commit)',
    description: 'Commit message structures, branch prefixes, and pull request gates.',
    standards: [
      {
        rule: 'Conventional Commit Format',
        description: 'Commits MUST follow Conventional Commits format: feat(scope): message, fix(scope): message, docs(scope): message.',
        badExample: `git commit -m "fixed stuff in sidebar"`,
        goodExample: `git commit -m "fix(ui): resolve active state highlight on global sidebar tabs"`
      }
    ]
  }
];
