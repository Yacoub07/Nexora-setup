import {
  CommunicationModelSpec,
  ApiGovernancePolicy,
  NicfCatalogEvent,
  NicfExternalConnector,
  NicfContractStandard
} from '../types/nicf';

export const NICF_COMMUNICATION_MODELS: CommunicationModelSpec[] = [
  {
    id: 'comm-rest',
    name: 'REST APIs (HTTP/2 & HTTP/3)',
    type: 'REST_API',
    protocol: 'HTTPS / JSON (OpenAPI 3.1)',
    primaryUseCase: 'External web/mobile apps, third-party partner integrations, and public portal ingress APIs.',
    latencyExpectation: '< 150ms (p99)',
    payloadFormat: 'JSON with snake_case fields & ISO-8601 timestamps',
    governanceRules: [
      'Must adhere strictly to OpenAPI 3.1 specifications validated at build-time',
      'Must return standardized RFC 7807 Problem Details for all error status codes (4xx/5xx)',
      'Must support mandatory Idempotency-Key headers on all POST/PATCH mutating endpoints',
      'Must use token bucket rate limiting headers (X-RateLimit-Limit, X-RateLimit-Remaining)',
      'Must pass W3C Trace Context headers (traceparent, tracestate) across upstream proxies'
    ],
    codeExample: `// HTTP GET /v1/workspaces/ws-9021/projects?limit=20&cursor=eyJpZCI6MTAwfQ
// Response: 200 OK
{
  "object": "list",
  "data": [
    {
      "id": "proj-101",
      "name": "auth-service",
      "status": "ACTIVE",
      "created_at": "2026-08-01T10:00:00Z"
    }
  ],
  "has_more": false,
  "next_cursor": null
}`
  },
  {
    id: 'comm-grpc',
    name: 'gRPC (Internal Microservices)',
    type: 'GRPC',
    protocol: 'HTTP/2 / Protocol Buffers v3',
    primaryUseCase: 'High-performance synchronous service-to-service communication within the internal mesh.',
    latencyExpectation: '< 5ms (p99)',
    payloadFormat: 'Binary Protocol Buffers (proto3)',
    governanceRules: [
      'All internal RPCs MUST be defined in centralized proto repositories',
      'Backward compatibility MUST be preserved (never reuse tag numbers, no field deletion)',
      'mTLS SPIFFE identity certificates MUST be presented for every gRPC channel',
      'Deadlines and context timeouts MUST be propagated downstream on every RPC invocation',
      'Circuit breakers (Envoy/Istio) MUST open when error rate exceeds 5% over 10s'
    ],
    codeExample: `syntax = "proto3";
package nexora.core.v1;

service WorkspaceService {
  rpc GetWorkspace (GetWorkspaceRequest) returns (GetWorkspaceResponse);
  rpc ValidateWorkspace (ValidateWorkspaceRequest) returns (ValidateWorkspaceResponse);
}

message GetWorkspaceRequest {
  string workspace_id = 1;
  string tenant_id = 2;
}`
  },
  {
    id: 'comm-eventbus',
    name: 'Event Bus (Async Domain Events)',
    type: 'EVENT_BUS',
    protocol: 'NATS JetStream / Apache Kafka / Redis PubSub',
    primaryUseCase: 'Asynchronous event-driven state propagation, audit logging, and cross-service notifications.',
    latencyExpectation: '< 10ms publish, async subscriber consumption',
    payloadFormat: 'CloudEvents v1.0 JSON with Schema Registry validation',
    governanceRules: [
      'Events MUST follow CloudEvents v1.0 specification wrapper',
      'Publishers MUST publish to topic naming convention: nexora.<domain>.<entity>.<action>',
      'Subscribers MUST handle duplicate events idempotently using event_id deduplication keys',
      'Failed subscribers retry with exponential backoff before routing message to Dead Letter Queue (DLQ)',
      'Domain events represent immutable past facts (e.g., UserCreated, WorkspaceBuilt)'
    ],
    codeExample: `{
  "specversion": "1.0",
  "id": "evt-889102",
  "source": "nexora.forge.cli",
  "type": "nexora.workspace.project.created",
  "datacontenttype": "application/json",
  "time": "2026-08-01T12:00:00Z",
  "traceparent": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
  "data": {
    "workspace_id": "ws-9021",
    "project_name": "nexora-auth",
    "tenant_id": "tenant-482"
  }
}`
  },
  {
    id: 'comm-websocket',
    name: 'WebSockets & Server-Sent Events (SSE)',
    type: 'WEBSOCKET_SSE',
    protocol: 'WSS / HTTP/2 Server-Sent Events',
    primaryUseCase: 'Real-time collaborative canvas updates in NEXORA Studio, build log streaming, and live alerts.',
    latencyExpectation: '< 30ms full duplex',
    payloadFormat: 'JSON Frames / SSE Event Streams',
    governanceRules: [
      'WebSocket connections MUST authenticate via initial ticket exchange (avoid long-lived query tokens)',
      'Heartbeat ping/pong frames MUST occur every 30 seconds to clean up dead socket connections',
      'Server-Sent Events (SSE) should be preferred for unidirectional read-only server streams (e.g., build logs)'
    ],
    codeExample: `// SSE Endpoint: GET /v1/builds/bld-902/logs/stream
// Event Stream Header: Content-Type: text/event-stream
event: log_line
data: {"timestamp": "12:00:01", "level": "INFO", "message": "Compiling TypeScript AST..."}

event: build_status
data: {"status": "SUCCESS", "duration_ms": 1420}`
  },
  {
    id: 'comm-webhooks',
    name: 'Webhooks (Outbound Integrations)',
    type: 'WEBHOOKS',
    protocol: 'HTTPS POST / JSON',
    primaryUseCase: 'Notifying external third-party partner systems (GitHub, Slack, Zapier, Custom ERP) of platform events.',
    latencyExpectation: 'Asynchronous background queue execution',
    payloadFormat: 'JSON Payload signed with SHA-256 HMAC signature',
    governanceRules: [
      'Outbound webhook requests MUST include X-Nexora-Signature: t=169000,v1=sha256_hmac_hash header',
      'Receivers MUST be able to verify request signature using shared webhook secret',
      'Automatic exponential backoff retry for 24 hours (up to 12 retries) upon receiving non-2xx status codes'
    ],
    codeExample: `// Outbound POST https://client.example.com/nexora-webhook
// Header: X-Nexora-Signature: t=1785582000,v1=a38f9d21c0e89...
{
  "event": "deployment.completed",
  "deployment_id font-mono": "dep-882",
  "environment": "production",
  "status": "SUCCESS"
}`
  },
  {
    id: 'comm-graphql',
    name: 'GraphQL (Aggregation & BFF Layer)',
    type: 'GRAPHQL',
    protocol: 'HTTPS / GraphQL POST',
    primaryUseCase: 'Frontend Backend-For-Frontend (BFF) layers requiring flexible field selection & multi-resource stitching.',
    latencyExpectation: '< 200ms',
    payloadFormat: 'GraphQL AST Query / Mutation / Subscription',
    governanceRules: [
      'Strict query depth limiting (max depth = 5) and query complexity analysis to prevent DoS attacks',
      'No N+1 database queries; DataLoader batching pattern is mandatory on all field resolvers',
      'Schema stitching / GraphQL Federation managed by central Apollo Gateway router'
    ],
    codeExample: `query GetWorkspaceOverview($id: ID!) {
  workspace(id: $id) {
    name
    version
    projects {
      id
      name
      status
    }
  }
}`
  }
];

export const API_GOVERNANCE_POLICIES: ApiGovernancePolicy[] = [
  {
    topic: 'URI & Resource Naming Conventions',
    standard: 'RESTful Noun Hierarchy with Kebab-case',
    rules: [
      'Resource names MUST use plural nouns in lowercase kebab-case (e.g., /v1/workspace-templates)',
      'Sub-resources MUST express clear parent-child ownership (e.g., /v1/organizations/{org_id}/workspaces)',
      'Actions on resources MUST use HTTP verbs (GET for read, POST for create, PUT/PATCH for update, DELETE for remove)',
      'Custom non-CRUD operations use colon verbs at URI tail (e.g., POST /v1/deployments/{id}:rollback)'
    ],
    exampleSnippet: `GET  /v1/workspaces                          # List workspaces
POST /v1/workspaces                          # Create workspace
GET  /v1/workspaces/{workspace_id}           # Get workspace details
PUT  /v1/workspaces/{workspace_id}           # Replace workspace
PATCH /v1/workspaces/{workspace_id}          # Partial workspace update
POST /v1/workspaces/{workspace_id}:validate # Custom action verb`
  },
  {
    topic: 'Error Handling Model (RFC 7807)',
    standard: 'Standardized Problem Details for HTTP APIs',
    rules: [
      'ALL API errors MUST return content-type: application/problem+json',
      'Fields MUST include: type, title, status, detail, instance, trace_id, and invalid_params',
      'Never expose internal database stack traces or raw exception messages in public error payloads'
    ],
    exampleSnippet: `{
  "type": "https://errors.nexora.io/validation-failed",
  "title": "Unprocessable Request Payload",
  "status": 422,
  "detail": "Workspace manifest is missing required field 'version'",
  "instance": "/v1/workspaces/validate",
  "trace_id": "tr-8892019283",
  "invalid_params": [
    {
      "name": "version",
      "reason": "Field 'version' is mandatory when strict mode is active"
    }
  ]
}`
  },
  {
    topic: 'Pagination, Filtering & Sorting',
    standard: 'Cursor-Based Opaque Tokens',
    rules: [
      'List endpoints MUST support limit (default 20, max 100) and cursor params',
      'Filters MUST use query params formatted as field[operator]=value (e.g., status[eq]=ACTIVE)',
      'Sorting MUST use sort query param with comma-separated fields, prefix - for descending (e.g., sort=-created_at,name)'
    ],
    exampleSnippet: `GET /v1/projects?limit=10&cursor=eyJpZCI6MTAwLCJ0cyI6MTcwMH0&status[eq]=ACTIVE&sort=-updated_at`
  },
  {
    topic: 'Idempotency & Replay Protection',
    standard: 'Idempotency-Key Header Standard',
    rules: [
      'Mutating HTTP POST/PATCH calls MUST accept Idempotency-Key: <uuid-v4> header',
      'Server caches response payload for 24 hours keyed by (tenant_id, idempotency_key)',
      'Subsequent requests with identical key return cached status code and payload without re-executing business logic'
    ],
    exampleSnippet: `POST /v1/deployments HTTP/1.1
Host: api.nexora.io
Authorization: Bearer eyJhbGci...
Idempotency-Key: 7b8e92d1-4e12-4f3a-9921-2a104b281900
Content-Type: application/json

{ "target": "production", "artifact": "v1.2.0" }`
  }
];

export const NICF_EVENT_CATALOG: NicfCatalogEvent[] = [
  {
    id: 'evt-user-created',
    eventName: 'UserCreated',
    category: 'IDENTITY_TENANCY',
    topic: 'nexora.identity.user.created',
    publisherService: 'NEXORA Platform (Identity Gateway)',
    subscriberServices: ['Notification Runtime', 'Analytics Platform', 'Audit Service'],
    ownerTeam: 'Platform Security & IAM Team',
    payloadSchemaJson: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "UserCreated",
  "type": "object",
  "properties": {
    "user_id": { "type": "string" },
    "tenant_id": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "role": { "type": "string" },
    "created_at": { "type": "string", "format": "date-time" }
  },
  "required": ["user_id", "tenant_id", "email", "role", "created_at"]
}`,
    examplePayloadJson: `{
  "user_id": "usr-9021",
  "tenant_id": "tenant-482",
  "email": "lead.dev@nexora.io",
  "role": "PLATFORM_ADMIN",
  "created_at": "2026-08-01T12:00:00Z"
}`
  },
  {
    id: 'evt-org-created',
    eventName: 'OrganizationCreated',
    category: 'IDENTITY_TENANCY',
    topic: 'nexora.identity.organization.created',
    publisherService: 'NEXORA Platform',
    subscriberServices: ['Billing Service', 'Tenant Provisioner', 'Analytics Platform'],
    ownerTeam: 'Core Architecture Team',
    payloadSchemaJson: `{
  "type": "object",
  "properties": {
    "organization_id": { "type": "string" },
    "name": { "type": "string" },
    "plan_tier": { "type": "string" }
  }
}`,
    examplePayloadJson: `{
  "organization_id": "org-9901",
  "name": "Global Tech Corp",
  "plan_tier": "ENTERPRISE"
}`
  },
  {
    id: 'evt-workspace-created',
    eventName: 'WorkspaceCreated',
    category: 'WORKSPACE_BUILD',
    topic: 'nexora.forge.workspace.created',
    publisherService: 'NEXORA Forge',
    subscriberServices: ['Studio Sync', 'Analytics', 'Knowledge Portal'],
    ownerTeam: 'Developer Experience Team',
    payloadSchemaJson: `{
  "type": "object",
  "properties": {
    "workspace_id": { "type": "string" },
    "name": { "type": "string" },
    "manifest_path": { "type": "string" }
  }
}`,
    examplePayloadJson: `{
  "workspace_id": "ws-9021",
  "name": "nexora-forge-core",
  "manifest_path": "/workspace/nexora-forge/nexora.yaml"
}`
  },
  {
    id: 'evt-plugin-enabled',
    eventName: 'PluginEnabled',
    category: 'EXTENSIONS',
    topic: 'nexora.marketplace.plugin.enabled',
    publisherService: 'Plugin Runtime',
    subscriberServices: ['Security Audit', 'UI Gateway', 'Studio Editor'],
    ownerTeam: 'Ecosystem & Extensions Team',
    payloadSchemaJson: `{
  "type": "object",
  "properties": {
    "plugin_id": { "type": "string" },
    "version": { "type": "string" },
    "tenant_id": { "type": "string" }
  }
}`,
    examplePayloadJson: `{
  "plugin_id": "pkg-docker-deployer",
  "version": "2.1.0",
  "tenant_id": "tenant-482"
}`
  },
  {
    id: 'evt-knowledge-published',
    eventName: 'KnowledgePublished',
    category: 'KNOWLEDGE_AI',
    topic: 'nexora.knowledge.article.published',
    publisherService: 'Knowledge Portal',
    subscriberServices: ['RAG Vector Indexer', 'Search Gateway', 'Notification Runtime'],
    ownerTeam: 'AI Platform Team',
    payloadSchemaJson: `{
  "type": "object",
  "properties": {
    "article_id": { "type": "string" },
    "title": { "type": "string" },
    "content_checksum": { "type": "string" }
  }
}`,
    examplePayloadJson: `{
  "article_id": "doc-8812",
  "title": "SRF Phase 5 Architecture Guide",
  "content_checksum": "sha256-a99f1..."
}`
  },
  {
    id: 'evt-deployment-completed',
    eventName: 'DeploymentCompleted',
    category: 'PLATFORM_OPS',
    topic: 'nexora.core.deployment.completed',
    publisherService: 'NEXORA CORE Orchestrator',
    subscriberServices: ['Automation Platform', 'Slack Notifier', 'Observability Dashboard'],
    ownerTeam: 'Cloud & Infrastructure Team',
    payloadSchemaJson: `{
  "type": "object",
  "properties": {
    "deployment_id": { "type": "string" },
    "status": { "type": "string" },
    "duration_ms": { "type": "number" }
  }
}`,
    examplePayloadJson: `{
  "deployment_id": "dep-77201",
  "status": "SUCCESS",
  "duration_ms": 1420
}`
  }
];

export const NICF_EXTERNAL_CONNECTORS: NicfExternalConnector[] = [
  {
    id: 'conn-m365',
    name: 'Microsoft 365 Connector',
    category: 'WORKPLACE_SUITE',
    authMethod: 'OAUTH2',
    protocol: 'Microsoft Graph REST API (HTTPS)',
    reusableCapabilities: [
      'Read/Write Outlook Emails & Calendar Events',
      'Sync OneDrive / SharePoint Documents into Knowledge RAG Index',
      'Send Teams Channel Chat Notifications & Webhooks',
      'User Profile & Azure AD Group Membership Resolution'
    ],
    rateLimitSpecs: '10,000 requests / 10 min per tenant bucket',
    sampleConfigYaml: `connector:
  type: "microsoft_365"
  client_id: "vault://nexora-prod/m365#client_id"
  tenant_id: "common"
  scopes:
    - "https://graph.microsoft.com/Calendars.ReadWrite"
    - "https://graph.microsoft.com/Files.Read.All"
  webhook_notification_url: "https://api.nexora.io/v1/connectors/m365/webhook"`
  },
  {
    id: 'conn-google-workspace',
    name: 'Google Workspace Connector',
    category: 'WORKPLACE_SUITE',
    authMethod: 'OAUTH2',
    protocol: 'Google Workspace APIs (Gmail, Sheets, Drive, Calendar)',
    reusableCapabilities: [
      'Query Gmail Threads & Draft Responses',
      'Sync Google Drive files to AI RAG Vector Store',
      'Read/Write Google Sheets tabular data for Analytics Ingestion',
      'Manage Google Calendar schedules for Automation Workflows'
    ],
    rateLimitSpecs: '2,000 queries / 100 seconds per user',
    sampleConfigYaml: `connector:
  type: "google_workspace"
  client_id: "vault://nexora-prod/google#client_id"
  scopes:
    - "https://www.googleapis.com/auth/drive.readonly"
    - "https://www.googleapis.com/auth/gmail.send"`
  },
  {
    id: 'conn-github-gitlab',
    name: 'GitHub & GitLab VCS Connector',
    category: 'DEVOPS_VCS',
    authMethod: 'OAUTH2',
    protocol: 'REST / GraphQL / Webhook',
    reusableCapabilities: [
      'Parse Repository Code trees for NEXORA Forge build automation',
      'Create Pull Requests / Merge Requests on auto-generated patches',
      'Stream CI/CD Pipeline logs & status checks into NEXORA Studio',
      'Listen to Push & Release Webhook events'
    ],
    rateLimitSpecs: '5,000 requests / hour (OAuth App)',
    sampleConfigYaml: `connector:
  type: "github_app"
  app_id: 88219
  private_key: "vault://nexora-prod/github#pem"
  webhook_secret: "vault://nexora-prod/github#webhook_secret"`
  },
  {
    id: 'conn-sap-oracle',
    name: 'SAP & Oracle ERP Connector',
    category: 'ENTERPRISE_ERP',
    authMethod: 'MTLS_CERT',
    protocol: 'OData REST / SOAP / RFC (Remote Function Call)',
    reusableCapabilities: [
      'Sync Enterprise Financial Ledgers & Invoices with NEXORA Platform',
      'Bi-directional Inventory & Purchase Order Sync',
      'Employee Master Data Sync for HR/Payroll modules'
    ],
    rateLimitSpecs: 'Throttled by internal SAP Gateway queue depth',
    sampleConfigYaml: `connector:
  type: "sap_s4hana"
  odata_url: "https://sap.internal.corp/sap/opu/odata/sap/API_BUSINESS_PARTNER"
  mtls_cert: "vault://nexora-prod/sap#client_cert"`
  },
  {
    id: 'conn-ldap-ad',
    name: 'LDAP & Active Directory Connector',
    category: 'IDENTITY_DIRECTORY',
    authMethod: 'LDAP_BASIC',
    protocol: 'LDAPS (Port 636) / Kerberos',
    reusableCapabilities: [
      'Synchronize Enterprise Directory Users & Security Groups',
      'Authenticate legacy corporate credentials via LDAP Bind',
      'Resolve organization hierarchy trees'
    ],
    rateLimitSpecs: 'Unlimited internal network throughput',
    sampleConfigYaml: `connector:
  type: "active_directory"
  host: "ldaps://ad.corp.internal:636"
  bind_dn: "cn=nexora-svc,ou=services,dc=corp,dc=internal"
  user_search_base: "ou=users,dc=corp,dc=internal"`
  },
  {
    id: 'conn-twilio-whatsapp',
    name: 'Twilio & WhatsApp Business Connector',
    category: 'COMMUNICATION',
    authMethod: 'API_KEY',
    protocol: 'HTTPS REST API',
    reusableCapabilities: [
      'Send SMS Multi-Factor Authentication (MFA) passcode alerts',
      'Dispatch WhatsApp transactional templates & interactive buttons',
      'Inbound SMS message callback webhook handler'
    ],
    rateLimitSpecs: '100 msg / sec burst cap',
    sampleConfigYaml: `connector:
  type: "twilio_whatsapp"
  account_sid: "vault://nexora-prod/twilio#sid"
  auth_token: "vault://nexora-prod/twilio#token"
  whatsapp_number: "whatsapp:+14155238886"`
  }
];

export const NICF_CONTRACT_STANDARDS: NicfContractStandard[] = [
  {
    standardName: 'OpenAPI Specification (OAS)',
    version: '3.1.0',
    targetMedium: 'RESTful HTTP APIs',
    linterRules: [
      'All endpoints must have an operationId and tags',
      'All parameters and properties must define explicit types and descriptions',
      'All response schemas must define 2xx success and standard RFC 7807 error models',
      'No inline anonymous schema objects; use $ref components'
    ],
    sampleSpec: `openapi: 3.1.0
info:
  title: NEXORA Workspace API
  version: 1.0.0
paths:
  /v1/workspaces:
    get:
      summary: List workspaces
      operationId: listWorkspaces
      responses:
        '200':
          description: List of workspaces`
  },
  {
    standardName: 'AsyncAPI Specification',
    version: '3.0.0',
    targetMedium: 'Event Bus & Asynchronous Messaging',
    linterRules: [
      'Every channel must link to defined message payloads',
      'Message headers must require CloudEvents v1.0 standard keys',
      'Topic naming must follow nexora.<domain>.<entity>.<action>'
    ],
    sampleSpec: `asyncapi: 3.0.0
info:
  title: NEXORA Domain Event Bus
  version: 1.0.0
channels:
  userCreatedChannel:
    address: nexora.identity.user.created
    messages:
      UserCreatedMessage:
        payload:
          type: object`
  },
  {
    standardName: 'Protocol Buffers (Proto3)',
    version: '3.25.0',
    targetMedium: 'gRPC Microservices Mesh',
    linterRules: [
      'Proto files must declare syntax = "proto3"',
      'Field tags must be sequentially numbered starting at 1',
      'Package namespace must match nexora.<subsystem>.v<version>'
    ],
    sampleSpec: `syntax = "proto3";
package nexora.core.v1;

message ProjectSpec {
  string project_id = 1;
  string name = 2;
}`
  }
];
