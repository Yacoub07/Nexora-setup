import { DomainEntity, BoundedContext, RbacRolePermission, ModuleDependencyNode } from '../types/edm';

export const EDM_BOUNDED_CONTEXTS: BoundedContext[] = [
  {
    id: 'bc-org',
    name: 'Organization Management Context',
    type: 'Core',
    description: 'Models multi-tenant hierarchical structures including Organizations, Business Units, Divisions, Departments, Teams, and Workspaces.',
    aggregates: ['OrganizationAggregate', 'WorkspaceAggregate'],
    entities: ['Organization', 'BusinessUnit', 'Division', 'Department', 'Team', 'Workspace'],
    domainEvents: ['OrganizationCreated', 'WorkspaceProvisioned', 'TeamMemberAssigned', 'QuotaLimitExceeded']
  },
  {
    id: 'bc-iam',
    name: 'Identity & Access Control Context (IAM)',
    type: 'Core',
    description: 'Handles Identity authentication, RBAC/ABAC authorization policies, OAuth clients, API keys, sessions, and multi-tenant user profiles.',
    aggregates: ['UserAggregate', 'SecurityPolicyAggregate'],
    entities: ['User', 'Profile', 'Role', 'Permission', 'Group', 'Policy', 'Authentication', 'Session', 'ApiKey', 'OAuthClient'],
    domainEvents: ['UserAuthenticated', 'RoleAssigned', 'ApiKeyGenerated', 'SecurityPolicyViolated']
  },
  {
    id: 'bc-[#platform]',
    name: 'Platform Core & Extension Context',
    type: 'Core',
    description: 'Manages Application definitions, runtime Modules, Packages, Plugins, Extensions, Themes, Environments, and Global Configs.',
    aggregates: ['ApplicationAggregate', 'EnvironmentAggregate'],
    entities: ['Application', 'Module', 'Package', 'Plugin', 'Extension', 'Theme', 'Environment', 'Configuration'],
    domainEvents: ['ApplicationDeployed', 'PluginInstalled', 'ConfigUpdated', 'EnvironmentSwitched']
  },
  {
    id: 'bc-dev',
    name: 'Software Development & Lifecycle Context',
    type: 'Supporting',
    description: 'Manages software development repositories, branches, releases, sprints, milestones, builds, CI/CD pipelines, and releases.',
    aggregates: ['ProjectAggregate', 'PipelineAggregate'],
    entities: ['Project', 'Repository', 'Branch', 'Release', 'Sprint', 'Milestone', 'Version', 'Build', 'Deployment', 'Pipeline'],
    domainEvents: ['PipelineTriggered', 'BuildSucceeded', 'ReleasePublished', 'DeploymentCompleted']
  },
  {
    id: 'bc-knowledge',
    name: 'Knowledge & Semantic Search Context (NKP)',
    type: 'Supporting',
    description: 'Powers the NEXORA Knowledge Portal, handling articles, wiki pages, procedures, files, categories, tags, and documentation trees.',
    aggregates: ['KnowledgeBaseAggregate', 'DocumentAggregate'],
    entities: ['KnowledgeBase', 'Article', 'WikiPage', 'Documentation', 'Procedure', 'FAQ', 'File', 'Attachment', 'Tag', 'Category'],
    domainEvents: ['ArticlePublished', 'DocumentIndexed', 'WikiPageUpdated', 'AttachmentUploaded']
  },
  {
    id: 'bc-automation',
    name: 'Workflow & Orchestration Context',
    type: 'Supporting',
    description: 'Handles trigger-action workflow graphs, scheduled jobs, integration connectors, asynchronous task queues, and automated pipelines.',
    aggregates: ['WorkflowAggregate', 'QueueAggregate'],
    entities: ['Workflow', 'Trigger', 'Action', 'Schedule', 'Queue', 'Integration', 'Connector', 'Job'],
    domainEvents: ['WorkflowExecuted', 'JobFailed', 'TriggerFired', 'QueueBackpressureWarning']
  },
  {
    id: 'bc-ai',
    name: 'AI Agent & Intelligence Context',
    type: 'Core',
    description: 'Manages AI agents, prompt templates, LLM models, conversational memory, vector indexes, embeddings, tool definitions, and datasets.',
    aggregates: ['AIAgentAggregate', 'VectorIndexAggregate'],
    entities: ['AIAgent', 'Model', 'Prompt', 'Conversation', 'Dataset', 'Embedding', 'VectorIndex', 'KnowledgeSource', 'Tool', 'Memory'],
    domainEvents: ['AgentInvoked', 'EmbeddingGenerated', 'PromptExecuted', 'MemoryTruncated']
  },
  {
    id: 'bc-analytics',
    name: 'Analytics & Observability Context',
    type: 'Generic',
    description: 'Provides real-time dashboards, metrics calculation, KPI tracking, reporting, widgets, and heterogeneous data source connectors.',
    aggregates: ['DashboardAggregate', 'ReportAggregate'],
    entities: ['Dashboard', 'Widget', 'KPI', 'Report', 'Metric', 'Chart', 'DataSource'],
    domainEvents: ['KPIThresholdCrossed', 'DashboardRendered', 'ReportGenerated']
  },
  {
    id: 'bc-audit',
    name: 'Audit, Security & Governance Context',
    type: 'Generic',
    description: 'Tracks immutable audit logs, system security events, operational alerts, compliance policies, and incident management.',
    aggregates: ['AuditLogAggregate', 'IncidentAggregate'],
    entities: ['AuditLog', 'Event', 'Notification', 'Alert', 'Incident', 'SecurityPolicy', 'ComplianceRule'],
    domainEvents: ['SecurityIncidentRaised', 'ComplianceRuleFailed', 'AuditTrailLogged']
  }
];

export const EDM_ENTITIES: DomainEntity[] = [
  // --- 1. ORGANIZATION ---
  {
    id: 'entity-org',
    name: 'Organization',
    category: 'Organization',
    boundedContext: 'Organization Management Context',
    aggregateRoot: 'OrganizationAggregate',
    description: 'The top-level multi-tenant enterprise boundary in NEXORA. All environments, subscriptions, and security scopes descend from an Organization.',
    postgresTable: 'organizations',
    restEndpoint: '/api/v1/organizations',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Primary key unique identifier' },
      { name: 'name', type: 'VARCHAR(255)', required: true, description: 'Legal or display organization name' },
      { name: 'code', type: 'VARCHAR(64)', required: true, constraints: 'UNIQUE', description: 'Normalized machine identifier (e.g., nexora-corp)' },
      { name: 'tier', type: 'VARCHAR(32)', required: true, description: 'Subscription tier (ENTERPRISE, PRO, STANDARD)' },
      { name: 'created_at', type: 'TIMESTAMPTZ', required: true, description: 'UTC timestamp of creation' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', required: true, description: 'UTC timestamp of last update' }
    ],
    relationships: [
      { targetEntity: 'BusinessUnit', type: 'One-to-Many', ownership: 'Composite', description: 'An Organization contains 1 or more Business Units' },
      { targetEntity: 'Workspace', type: 'One-to-Many', ownership: 'Composite', description: 'An Organization owns multiple active Workspaces' },
      { targetEntity: 'User', type: 'One-to-Many', ownership: 'Shared', description: 'Users belong to Organizations' }
    ]
  },
  {
    id: 'entity-bu',
    name: 'BusinessUnit',
    category: 'Organization',
    boundedContext: 'Organization Management Context',
    description: 'An operational strategic unit within an Organization (e.g., Enterprise Software Division, Cloud Operations).',
    postgresTable: 'business_units',
    restEndpoint: '/api/v1/business-units',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Primary key' },
      { name: 'organization_id', type: 'UUID', required: true, isFk: true, fkTarget: 'organizations.id', description: 'Parent Organization FK' },
      { name: 'name', type: 'VARCHAR(255)', required: true, description: 'Business unit name' },
      { name: 'cost_center', type: 'VARCHAR(64)', required: false, description: 'Accounting cost center tag' }
    ],
    relationships: [
      { targetEntity: 'Organization', type: 'Many-to-One', ownership: 'Composite', description: 'Belongs to a parent Organization' },
      { targetEntity: 'Division', type: 'One-to-Many', ownership: 'Composite', description: 'Contains multiple operational Divisions' }
    ]
  },
  {
    id: 'entity-dept',
    name: 'Department',
    category: 'Organization',
    boundedContext: 'Organization Management Context',
    description: 'A functional department (e.g., Engineering, Product Design, Security) grouping teams and users.',
    postgresTable: 'departments',
    restEndpoint: '/api/v1/departments',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Primary key' },
      { name: 'business_unit_id', type: 'UUID', required: true, isFk: true, fkTarget: 'business_units.id', description: 'Parent Business Unit FK' },
      { name: 'name', type: 'VARCHAR(255)', required: true, description: 'Department display name' },
      { name: 'head_user_id', type: 'UUID', required: false, isFk: true, fkTarget: 'users.id', description: 'Department Manager User FK' }
    ],
    relationships: [
      { targetEntity: 'Team', type: 'One-to-Many', ownership: 'Composite', description: 'Department contains multiple Teams' }
    ]
  },
  {
    id: 'entity-team',
    name: 'Team',
    category: 'Organization',
    boundedContext: 'Organization Management Context',
    description: 'A cross-functional execution group of individual Users assigned to projects and workspaces.',
    postgresTable: 'teams',
    restEndpoint: '/api/v1/teams',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Primary key' },
      { name: 'department_id', type: 'UUID', required: true, isFk: true, fkTarget: 'departments.id', description: 'Parent Department FK' },
      { name: 'name', type: 'VARCHAR(255)', required: true, description: 'Team name (e.g., Core Platform Team)' },
      { name: 'slug', type: 'VARCHAR(64)', required: true, description: 'Machine slug for routing' }
    ],
    relationships: [
      { targetEntity: 'User', type: 'Many-to-Many', ownership: 'Shared', description: 'Teams contain multiple Users via team_members' },
      { targetEntity: 'Workspace', type: 'One-to-Many', ownership: 'Shared', description: 'Teams have access to specific Workspaces' }
    ]
  },
  {
    id: 'entity-workspace',
    name: 'Workspace',
    category: 'Organization',
    boundedContext: 'Organization Management Context',
    aggregateRoot: 'WorkspaceAggregate',
    description: 'An isolated environment boundary holding Applications, Projects, Knowledge Repositories, and Pipelines.',
    postgresTable: 'workspaces',
    restEndpoint: '/api/v1/workspaces',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Primary key' },
      { name: 'organization_id', type: 'UUID', required: true, isFk: true, fkTarget: 'organizations.id', description: 'Parent Organization FK' },
      { name: 'name', type: 'VARCHAR(255)', required: true, description: 'Workspace name' },
      { name: 'region', type: 'VARCHAR(32)', required: true, description: 'Cloud deployment region (us-east1, europe-west2)' },
      { name: 'is_active', type: 'BOOLEAN', required: true, description: 'Active status flag' }
    ],
    relationships: [
      { targetEntity: 'Project', type: 'One-to-Many', ownership: 'Composite', description: 'Workspace contains Development Projects' },
      { targetEntity: 'KnowledgeBase', type: 'One-to-Many', ownership: 'Composite', description: 'Workspace contains Knowledge Bases' },
      { targetEntity: 'AIAgent', type: 'One-to-Many', ownership: 'Composite', description: 'Workspace contains AI Agents' }
    ]
  },

  // --- 2. IDENTITY & ACCESS ---
  {
    id: 'entity-user',
    name: 'User',
    category: 'Identity & Access',
    boundedContext: 'Identity & Access Control Context (IAM)',
    aggregateRoot: 'UserAggregate',
    description: 'A human or service actor registered in the NEXORA Identity Directory.',
    postgresTable: 'users',
    restEndpoint: '/api/v1/users',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'User unique ID' },
      { name: 'organization_id', type: 'UUID', required: true, isFk: true, fkTarget: 'organizations.id', description: 'Primary Organization' },
      { name: 'email', type: 'VARCHAR(255)', required: true, constraints: 'UNIQUE', description: 'User login email address' },
      { name: 'password_hash', type: 'VARCHAR(255)', required: true, description: 'Bcrypt/Argon2 encrypted password' },
      { name: 'status', type: 'VARCHAR(32)', required: true, description: 'Account state (ACTIVE, SUSPENDED, PENDING)' },
      { name: 'mfa_enabled', type: 'BOOLEAN', required: true, description: 'Multi-factor authentication flag' }
    ],
    relationships: [
      { targetEntity: 'Profile', type: 'One-to-One', ownership: 'Composite', description: 'User has 1 user profile' },
      { targetEntity: 'Role', type: 'Many-to-Many', ownership: 'Shared', description: 'Users hold assigned Roles' },
      { targetEntity: 'Session', type: 'One-to-Many', ownership: 'Composite', description: 'User has active auth Sessions' },
      { targetEntity: 'ApiKey', type: 'One-to-Many', ownership: 'Composite', description: 'User owns API keys' }
    ]
  },
  {
    id: 'entity-role',
    name: 'Role',
    category: 'Identity & Access',
    boundedContext: 'Identity & Access Control Context (IAM)',
    description: 'A named set of permission grants (e.g., OrgAdmin, Developer, AI Operator) assigned to users and API clients.',
    postgresTable: 'roles',
    restEndpoint: '/api/v1/roles',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Role ID' },
      { name: 'organization_id', type: 'UUID', required: false, isFk: true, fkTarget: 'organizations.id', description: 'Org ID (null for system roles)' },
      { name: 'name', type: 'VARCHAR(128)', required: true, description: 'Role name' },
      { name: 'is_system', type: 'BOOLEAN', required: true, description: 'Built-in unmodifiable role flag' }
    ],
    relationships: [
      { targetEntity: 'Permission', type: 'Many-to-Many', ownership: 'Shared', description: 'Role aggregates multiple Granular Permissions' }
    ]
  },
  {
    id: 'entity-apikey',
    name: 'ApiKey',
    category: 'Identity & Access',
    boundedContext: 'Identity & Access Control Context (IAM)',
    description: 'Cryptographic API credentials for machine-to-machine, SDK, and CLI programmatic access.',
    postgresTable: 'api_keys',
    restEndpoint: '/api/v1/api-keys',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Key identifier' },
      { name: 'user_id', type: 'UUID', required: true, isFk: true, fkTarget: 'users.id', description: 'Owner user ID' },
      { name: 'key_hash', type: 'VARCHAR(255)', required: true, description: 'SHA-256 hash of raw key' },
      { name: 'prefix', type: 'VARCHAR(16)', required: true, description: 'Key prefix for visual identification (nx_live_)' },
      { name: 'expires_at', type: 'TIMESTAMPTZ', required: false, description: 'Expiration date' }
    ],
    relationships: [
      { targetEntity: 'User', type: 'Many-to-One', ownership: 'Composite', description: 'Belongs to owner User' }
    ]
  },

  // --- 3. PLATFORM ---
  {
    id: 'entity-app',
    name: 'Application',
    category: 'Platform',
    boundedContext: 'Platform Core & Extension Context',
    aggregateRoot: 'ApplicationAggregate',
    description: 'A deployed or registered software suite inside NEXORA (e.g., NEXORA Studio, NEXORA Forge, Knowledge Portal).',
    postgresTable: 'applications',
    restEndpoint: '/api/v1/applications',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'App ID' },
      { name: 'workspace_id', type: 'UUID', required: true, isFk: true, fkTarget: 'workspaces.id', description: 'Workspace FK' },
      { name: 'name', type: 'VARCHAR(255)', required: true, description: 'Application name' },
      { name: 'type', type: 'VARCHAR(64)', required: true, description: 'Type (WEB, CLI, MICROSERVICE, AI_PIPELINE)' },
      { name: 'status', type: 'VARCHAR(32)', required: true, description: 'Runtime status (HEALTHY, DEGRADED, STOPPED)' }
    ],
    relationships: [
      { targetEntity: 'Module', type: 'One-to-Many', ownership: 'Composite', description: 'Contains executable Modules' },
      { targetEntity: 'Plugin', type: 'One-to-Many', ownership: 'Shared', description: 'Integrates active Plugins' }
    ]
  },
  {
    id: 'entity-plugin',
    name: 'Plugin',
    category: 'Platform',
    boundedContext: 'Platform Core & Extension Context',
    description: 'An extensible add-on package extending NEXORA Platform capabilities (e.g., GitHub Connector, Kubernetes Doctor).',
    postgresTable: 'plugins',
    restEndpoint: '/api/v1/plugins',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Plugin ID' },
      { name: 'name', type: 'VARCHAR(255)', required: true, description: 'Plugin name' },
      { name: 'version', type: 'VARCHAR(32)', required: true, description: 'SemVer string (1.4.2)' },
      { name: 'author', type: 'VARCHAR(128)', required: true, description: 'Publisher name' },
      { name: 'is_enabled', type: 'BOOLEAN', required: true, description: 'Toggle flag' }
    ],
    relationships: [
      { targetEntity: 'Application', type: 'Many-to-Many', ownership: 'Shared', description: 'Loaded into Applications' }
    ]
  },

  // --- 4. DEVELOPMENT ---
  {
    id: 'entity-project',
    name: 'Project',
    category: 'Development',
    boundedContext: 'Software Development & Lifecycle Context',
    aggregateRoot: 'ProjectAggregate',
    description: 'A software codebase project containing repositories, pipelines, sprints, and release artifacts.',
    postgresTable: 'projects',
    restEndpoint: '/api/v1/projects',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Project ID' },
      { name: 'workspace_id', type: 'UUID', required: true, isFk: true, fkTarget: 'workspaces.id', description: 'Parent Workspace FK' },
      { name: 'name', type: 'VARCHAR(255)', required: true, description: 'Project title' },
      { name: 'key', type: 'VARCHAR(16)', required: true, description: 'Short project prefix key (e.g., FORGE)' }
    ],
    relationships: [
      { targetEntity: 'Repository', type: 'One-to-Many', ownership: 'Composite', description: 'Owns Git Repositories' },
      { targetEntity: 'Pipeline', type: 'One-to-Many', ownership: 'Composite', description: 'Owns CI/CD Pipelines' },
      { targetEntity: 'Release', type: 'One-to-Many', ownership: 'Composite', description: 'Publishes Releases' }
    ]
  },
  {
    id: 'entity-pipeline',
    name: 'Pipeline',
    category: 'Development',
    boundedContext: 'Software Development & Lifecycle Context',
    aggregateRoot: 'PipelineAggregate',
    description: 'Automated CI/CD build, lint, test, and release pipeline runner specification.',
    postgresTable: 'pipelines',
    restEndpoint: '/api/v1/pipelines',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Pipeline ID' },
      { name: 'project_id', type: 'UUID', required: true, isFk: true, fkTarget: 'projects.id', description: 'Project FK' },
      { name: 'name', type: 'VARCHAR(255)', required: true, description: 'Pipeline name (e.g., Main Build & Deploy)' },
      { name: 'status', type: 'VARCHAR(32)', required: true, description: 'Status (PASSED, RUNNING, FAILED)' },
      { name: 'definition_yaml', type: 'TEXT', required: true, description: 'YAML pipeline spec' }
    ],
    relationships: [
      { targetEntity: 'Build', type: 'One-to-Many', ownership: 'Composite', description: 'Generates Build runs' }
    ]
  },

  // --- 5. KNOWLEDGE ---
  {
    id: 'entity-kb',
    name: 'KnowledgeBase',
    category: 'Knowledge',
    boundedContext: 'Knowledge & Semantic Search Context (NKP)',
    aggregateRoot: 'KnowledgeBaseAggregate',
    description: 'A semantic documentation collection holding articles, wiki pages, diagrams, and vector embeddings.',
    postgresTable: 'knowledge_bases',
    restEndpoint: '/api/v1/knowledge-bases',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'KB ID' },
      { name: 'workspace_id', type: 'UUID', required: true, isFk: true, fkTarget: 'workspaces.id', description: 'Workspace FK' },
      { name: 'title', type: 'VARCHAR(255)', required: true, description: 'Knowledge base title' },
      { name: 'visibility', type: 'VARCHAR(32)', required: true, description: 'PUBLIC, INTERNAL, RESTRICTED' }
    ],
    relationships: [
      { targetEntity: 'Article', type: 'One-to-Many', ownership: 'Composite', description: 'Contains Articles' },
      { targetEntity: 'WikiPage', type: 'One-to-Many', ownership: 'Composite', description: 'Contains Wiki Pages' }
    ]
  },
  {
    id: 'entity-article',
    name: 'Article',
    category: 'Knowledge',
    boundedContext: 'Knowledge & Semantic Search Context (NKP)',
    description: 'A structured documentation or procedure document indexed for vector similarity search.',
    postgresTable: 'articles',
    restEndpoint: '/api/v1/articles',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Article ID' },
      { name: 'knowledge_base_id', type: 'UUID', required: true, isFk: true, fkTarget: 'knowledge_bases.id', description: 'KB FK' },
      { name: 'title', type: 'VARCHAR(255)', required: true, description: 'Article title' },
      { name: 'content_markdown', type: 'TEXT', required: true, description: 'Markdown source text' },
      { name: 'author_id', type: 'UUID', required: true, isFk: true, fkTarget: 'users.id', description: 'Author User FK' }
    ],
    relationships: [
      { targetEntity: 'Attachment', type: 'One-to-Many', ownership: 'Composite', description: 'Has image/file attachments' },
      { targetEntity: 'KnowledgeBase', type: 'Many-to-One', ownership: 'Composite', description: 'Belongs to KnowledgeBase' }
    ]
  },

  // --- 6. AUTOMATION ---
  {
    id: 'entity-workflow',
    name: 'Workflow',
    category: 'Automation',
    boundedContext: 'Workflow & Orchestration Context',
    aggregateRoot: 'WorkflowAggregate',
    description: 'An event-driven execution DAG (Directed Acyclic Graph) chaining Triggers and Actions across services.',
    postgresTable: 'workflows',
    restEndpoint: '/api/v1/workflows',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Workflow ID' },
      { name: 'workspace_id', type: 'UUID', required: true, isFk: true, fkTarget: 'workspaces.id', description: 'Workspace FK' },
      { name: 'name', type: 'VARCHAR(255)', required: true, description: 'Workflow name' },
      { name: 'status', type: 'VARCHAR(32)', required: true, description: 'ACTIVE, PAUSED, DRAFT' },
      { name: 'dag_json', type: 'JSONB', required: true, description: 'Node-edge execution graph structure' }
    ],
    relationships: [
      { targetEntity: 'Trigger', type: 'One-to-Many', ownership: 'Composite', description: 'Starts on Triggers' },
      { targetEntity: 'Action', type: 'One-to-Many', ownership: 'Composite', description: 'Executes Actions' },
      { targetEntity: 'Job', type: 'One-to-Many', ownership: 'Composite', description: 'Generates Job execution records' }
    ]
  },

  // --- 7. AI ---
  {
    id: 'entity-agent',
    name: 'AIAgent',
    category: 'AI',
    boundedContext: 'AI Agent & Intelligence Context',
    aggregateRoot: 'AIAgentAggregate',
    description: 'An autonomous or human-in-the-loop AI agent powered by Gemini models, loaded with tools, prompts, and vector memories.',
    postgresTable: 'ai_agents',
    restEndpoint: '/api/v1/ai-agents',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Agent ID' },
      { name: 'workspace_id', type: 'UUID', required: true, isFk: true, fkTarget: 'workspaces.id', description: 'Workspace FK' },
      { name: 'name', type: 'VARCHAR(255)', required: true, description: 'Agent name (e.g. Doctor AI, CodeGen Agent)' },
      { name: 'model_alias', type: 'VARCHAR(64)', required: true, description: 'Gemini model alias (gemini-2.5-flash)' },
      { name: 'system_instruction', type: 'TEXT', required: true, description: 'Core agent system prompt' },
      { name: 'temperature', type: 'NUMERIC(3,2)', required: true, description: 'Sampling parameter (0.0 - 1.0)' }
    ],
    relationships: [
      { targetEntity: 'Prompt', type: 'One-to-Many', ownership: 'Composite', description: 'Uses Prompt templates' },
      { targetEntity: 'VectorIndex', type: 'Many-to-Many', ownership: 'Shared', description: 'Queries Vector Indexes for RAG' },
      { targetEntity: 'Conversation', type: 'One-to-Many', ownership: 'Composite', description: 'Maintains Conversations' }
    ]
  },
  {
    id: 'entity-vectorindex',
    name: 'VectorIndex',
    category: 'AI',
    boundedContext: 'AI Agent & Intelligence Context',
    aggregateRoot: 'VectorIndexAggregate',
    description: 'High-dimensional vector embedding database storing 768/1536d embeddings for RAG semantic retrieval.',
    postgresTable: 'vector_indexes',
    restEndpoint: '/api/v1/vector-indexes',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Index ID' },
      { name: 'workspace_id', type: 'UUID', required: true, isFk: true, fkTarget: 'workspaces.id', description: 'Workspace FK' },
      { name: 'name', type: 'VARCHAR(255)', required: true, description: 'Index label' },
      { name: 'dimension', type: 'INTEGER', required: true, description: 'Embedding vector dimensions (768, 1536)' },
      { name: 'distance_metric', type: 'VARCHAR(32)', required: true, description: 'COSINE, EUCLIDEAN, DOT_PRODUCT' }
    ],
    relationships: [
      { targetEntity: 'KnowledgeSource', type: 'One-to-Many', ownership: 'Composite', description: 'Ingests KnowledgeSources' }
    ]
  },

  // --- 8. ANALYTICS ---
  {
    id: 'entity-dashboard',
    name: 'Dashboard',
    category: 'Analytics',
    boundedContext: 'Analytics & Observability Context',
    aggregateRoot: 'DashboardAggregate',
    description: 'A customizable visual intelligence canvas aggregating widgets, KPI cards, charts, and metrics.',
    postgresTable: 'dashboards',
    restEndpoint: '/api/v1/dashboards',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Dashboard ID' },
      { name: 'workspace_id', type: 'UUID', required: true, isFk: true, fkTarget: 'workspaces.id', description: 'Workspace FK' },
      { name: 'title', type: 'VARCHAR(255)', required: true, description: 'Dashboard title' },
      { name: 'layout_grid_json', type: 'JSONB', required: true, description: 'Grid placement geometry' }
    ],
    relationships: [
      { targetEntity: 'Widget', type: 'One-to-Many', ownership: 'Composite', description: 'Contains visual Widgets' }
    ]
  },

  // --- 9. AUDIT & SECURITY ---
  {
    id: 'entity-auditlog',
    name: 'AuditLog',
    category: 'Audit & Security',
    boundedContext: 'Audit, Security & Governance Context',
    aggregateRoot: 'AuditLogAggregate',
    description: 'An immutable tamper-evident audit record capturing every sensitive user, API, and agent action.',
    postgresTable: 'audit_logs',
    restEndpoint: '/api/v1/audit-logs',
    fields: [
      { name: 'id', type: 'UUID', required: true, isPk: true, description: 'Log entry ID' },
      { name: 'organization_id', type: 'UUID', required: true, isFk: true, fkTarget: 'organizations.id', description: 'Org FK' },
      { name: 'actor_id', type: 'UUID', required: true, description: 'User or AI Agent ID that triggered event' },
      { name: 'action', type: 'VARCHAR(128)', required: true, description: 'Action code (e.g. USER.ROLE_UPDATE)' },
      { name: 'resource_type', type: 'VARCHAR(64)', required: true, description: 'Target entity (User, Role, Pipeline)' },
      { name: 'resource_id', type: 'UUID', required: true, description: 'Target entity ID' },
      { name: 'ip_address', type: 'VARCHAR(45)', required: true, description: 'IPv4 or IPv6 client origin' },
      { name: 'created_at', type: 'TIMESTAMPTZ', required: true, description: 'Timestamp' }
    ],
    relationships: []
  }
];

export const EDM_RBAC_MATRIX: RbacRolePermission[] = [
  {
    role: 'Super Administrator',
    description: 'Full global system superuser with unrestricted platform authority across all tenants.',
    permissions: {
      Organization: ['C', 'R', 'U', 'D', 'A'],
      User: ['C', 'R', 'U', 'D', 'A'],
      Application: ['C', 'R', 'U', 'D', 'A'],
      Project: ['C', 'R', 'U', 'D', 'A'],
      AIAgent: ['C', 'R', 'U', 'D', 'A'],
      Workflow: ['C', 'R', 'U', 'D', 'A'],
      AuditLog: ['R', 'A']
    }
  },
  {
    role: 'Organization Administrator',
    description: 'Tenant administrator managing users, roles, workspaces, and security policies inside their Org.',
    permissions: {
      Organization: ['R', 'U'],
      User: ['C', 'R', 'U', 'D', 'A'],
      Application: ['C', 'R', 'U', 'D'],
      Project: ['C', 'R', 'U', 'D'],
      AIAgent: ['C', 'R', 'U', 'D'],
      Workflow: ['C', 'R', 'U', 'D'],
      AuditLog: ['R']
    }
  },
  {
    role: 'Manager / Product Lead',
    description: 'Division and project lead creating projects, workflows, dashboards, and managing team workspace assets.',
    permissions: {
      Organization: ['R'],
      User: ['R'],
      Application: ['R', 'U'],
      Project: ['C', 'R', 'U', 'D'],
      AIAgent: ['C', 'R', 'U'],
      Workflow: ['C', 'R', 'U', 'D'],
      AuditLog: ['R']
    }
  },
  {
    role: 'Engineer / Developer',
    description: 'Active builder executing CLI tools, authoring code repositories, running pipelines, and interacting with AI Agents.',
    permissions: {
      Organization: ['R'],
      User: ['R'],
      Application: ['R'],
      Project: ['R', 'U'],
      AIAgent: ['R', 'U'],
      Workflow: ['R', 'U'],
      KnowledgeBase: ['C', 'R', 'U']
    }
  },
  {
    role: 'AI Agent (Service Principal)',
    description: 'Autonomous AI service principal bound to API key scopes for code gen, vector search, and automated tasks.',
    permissions: {
      KnowledgeBase: ['R'],
      AIAgent: ['R'],
      Workflow: ['R', 'U'],
      VectorIndex: ['C', 'R', 'U']
    }
  }
];

export const EDM_MODULE_NODES: ModuleDependencyNode[] = [
  {
    id: 'm-forge',
    name: 'NEXORA Forge',
    layer: 'L1 - CLI & Tools',
    dependsOn: ['m-sdk'],
    description: 'CLI toolsuite, doctor diagnostics, terminal runners, and local developer workspace engine.'
  },
  {
    id: 'm-sdk',
    name: 'NEXORA SDK',
    layer: 'L2 - SDK & Shared',
    dependsOn: [],
    description: 'Core shared library: identity, logging, crypto, HTTP client, configuration, and Gemini AI bindings.'
  },
  {
    id: 'm-studio',
    name: 'NEXORA Studio',
    layer: 'L3 - Visual & Admin',
    dependsOn: ['m-sdk'],
    description: 'Visual low-code environment, visual workflow designer, design system inspector, and admin console.'
  },
  {
    id: 'm-core',
    name: 'NEXORA CORE Engine',
    layer: 'L4 - Core Engine & Services',
    dependsOn: ['m-sdk'],
    description: 'Distributed microservices mesh, event bus, database persistence, and orchestration kernel.'
  },
  {
    id: 'm-nkp',
    name: 'Knowledge Portal (NKP)',
    layer: 'L4 - Core Engine & Services',
    dependsOn: ['m-sdk', 'm-core'],
    description: 'Semantic vector knowledge indexing, document store, and documentation wiki platform.'
  },
  {
    id: 'm-ai',
    name: 'AI Platform',
    layer: 'L4 - Core Engine & Services',
    dependsOn: ['m-sdk', 'm-core'],
    description: 'Gemini LLM model proxy, prompt memory, vector retrieval, and agent orchestration engine.'
  }
];

export const DDL_POSTGRES_SCHEMA = `-- =============================================================================
-- NEXORA ENTERPRISE DOMAIN MODEL (EDM) v1.0
-- DATABASE ENGINE: PostgreSQL 15+ (with pgvector extension)
-- AUTHOR: Chief Enterprise Architect, NEXORA Architecture Board
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- -----------------------------------------------------------------------------
-- 1. ORGANIZATION BOUNDED CONTEXT
-- -----------------------------------------------------------------------------
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64) UNIQUE NOT NULL,
    tier VARCHAR(32) NOT NULL DEFAULT 'ENTERPRISE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE business_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    cost_center VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_unit_id UUID NOT NULL REFERENCES business_units(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(32) NOT NULL DEFAULT 'us-east1',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. IDENTITY & ACCESS (IAM) BOUNDED CONTEXT
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) NOT NULL,
    prefix VARCHAR(16) NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. AI AGENTS & VECTOR INDEX BOUNDED CONTEXT
-- -----------------------------------------------------------------------------
CREATE TABLE ai_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    model_alias VARCHAR(64) NOT NULL DEFAULT 'gemini-2.5-flash',
    system_instruction TEXT NOT NULL,
    temperature NUMERIC(3,2) NOT NULL DEFAULT 0.20,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vector_indexes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    dimension INT NOT NULL DEFAULT 768,
    distance_metric VARCHAR(32) NOT NULL DEFAULT 'COSINE'
);

CREATE TABLE vector_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    index_id UUID NOT NULL REFERENCES vector_indexes(id) ON DELETE CASCADE,
    document_id UUID NOT NULL,
    embedding vector(768),
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- INDEXES & PERFORMANCE OPTIMIZATION
-- -----------------------------------------------------------------------------
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_workspaces_org ON workspaces(organization_id);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_vector_embeddings_hnsw ON vector_embeddings USING hnsw (embedding vector_cosine_ops);
`;
