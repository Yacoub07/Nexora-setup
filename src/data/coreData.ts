import {
  CoreSprintSpec,
  CoreOrganizationUnit,
  CoreUserRecord,
  CoreAuditLog,
  CoreSystemMetric
} from '../types/core';

export const CORE_VERSION = '1.0.0';

export const CORE_SPRINT_ROADMAP: CoreSprintSpec[] = [
  {
    sprintNumber: 1,
    id: 'sprint-1-iam-core',
    name: 'Sprint 1: IAM Core, Multi-Tenant Auth & Token Infrastructure',
    goal: 'Establish central identity provider, multi-tenant JWT issuing, refresh tokens, MFA state machine, and API key management using nexora-security and nexora-config.',
    status: 'COMPLETED',
    durationWeeks: 2,
    userStories: [
      'As a user, I can authenticate using credentials/SSO to obtain tenant-scoped JWT access and refresh tokens.',
      'As a tenant admin, I can issue and revoke service API keys with fine-grained scope constraints.',
      'As a security auditor, I can enforce mandatory MFA challenge upon login for privileged roles.'
    ],
    technicalTasks: [
      'Implement OAuth2/OIDC provider endpoints (/oauth/v2/token, /oauth/v2/authorize, /.well-known/openid-configuration)',
      'Construct RS256/ES256 asymmetric token signing service using nexora-security JwtValidator',
      'Integrate Redis-backed sliding refresh token rotation and token blacklist store',
      'Build API Key hashing engine with SHA-256 and scope validation middleware'
    ],
    databaseChanges: [
      'CREATE TABLE core_tenants (id UUID PRIMARY KEY, slug VARCHAR(64) UNIQUE, name TEXT, tier VARCHAR(32), created_at TIMESTAMPTZ);',
      'CREATE TABLE core_users (id UUID PRIMARY KEY, tenant_id UUID REFERENCES core_tenants(id), email VARCHAR(255) UNIQUE, password_hash TEXT, mfa_secret TEXT, status VARCHAR(32));',
      'CREATE TABLE core_api_keys (id UUID PRIMARY KEY, tenant_id UUID, key_hash VARCHAR(64), name TEXT, scopes TEXT[], expires_at TIMESTAMPTZ);'
    ],
    apiEndpoints: [
      'POST /api/v1/auth/login',
      'POST /api/v1/auth/refresh',
      'POST /api/v1/auth/mfa/verify',
      'GET /api/v1/iam/api-keys',
      'POST /api/v1/iam/api-keys'
    ],
    uiComponents: [
      'CoreAuthLoginForm',
      'MfaChallengeModal',
      'ApiKeyManagementTable',
      'SessionTokenInspector'
    ],
    testRequirements: [
      '100% test coverage for JWT issuance and verification logic',
      'Integration test for API key scoping and immediate revocation',
      'Brute-force lockout and rate limiting unit tests'
    ],
    definitionOfDone: [
      'JWT tokens validated cleanly across all downstream SRF services',
      'API Key authentication latency < 2ms',
      'All security unit & integration tests passing'
    ]
  },
  {
    sprintNumber: 2,
    id: 'sprint-2-org-hierarchy',
    name: 'Sprint 2: Multi-Tenant Organization Structure & Hierarchies',
    goal: 'Implement hierarchical multi-tenant tree (Organizations -> Business Units -> Departments -> Teams -> Sites) with tenant context propagation.',
    status: 'COMPLETED',
    durationWeeks: 2,
    userStories: [
      'As an Enterprise Admin, I can model multi-level organization structures with parent-child relationships.',
      'As a Department Lead, I can assign users to teams and sites across global operational locations.',
      'As a Developer, I can inherit configuration and policies down the organization tree.'
    ],
    technicalTasks: [
      'Implement recursive closure table pattern for fast org tree queries (O(1) ancestor/descendant checks)',
      'Integrate nexora-database BaseRepository tenant isolation mixins',
      'Build Department & Team lifecycle CRUD API handlers with audit logging'
    ],
    databaseChanges: [
      'CREATE TABLE core_org_units (id UUID PRIMARY KEY, tenant_id UUID, parent_id UUID, unit_type VARCHAR(32), name TEXT, code VARCHAR(32));',
      'CREATE TABLE core_org_tree_closure (ancestor_id UUID, descendant_id UUID, depth INT, PRIMARY KEY(ancestor_id, descendant_id));'
    ],
    apiEndpoints: [
      'GET /api/v1/org/units/tree',
      'POST /api/v1/org/units',
      'PUT /api/v1/org/units/{id}',
      'DELETE /api/v1/org/units/{id}'
    ],
    uiComponents: [
      'OrganizationTreeView',
      'OrgUnitCreateModal',
      'TeamMemberTransferDrawer',
      'DepartmentLeaderboard'
    ],
    testRequirements: [
      'Recursive query performance test (< 5ms for 10,000 node tree)',
      'Tenant boundary violation guard unit tests',
      'Circular dependency prevention validation'
    ],
    definitionOfDone: [
      'Org tree renders dynamically in under 100ms',
      'Multi-tenant database isolation verified by automated integration test'
    ]
  },
  {
    sprintNumber: 3,
    id: 'sprint-3-rbac-policy',
    name: 'Sprint 3: Fine-Grained RBAC & Policy Engine Integration',
    goal: 'Build comprehensive role management, permission matrix, role templates, and integration with ABAC policy engine.',
    status: 'COMPLETED',
    durationWeeks: 2,
    userStories: [
      'As a Security Admin, I can define custom roles and attach granular permission policies.',
      'As a System Component, I can evaluate permissions in sub-millisecond time using nexora-security.',
      'As a Compliance Officer, I can export the active permission matrix for security audits.'
    ],
    technicalTasks: [
      'Construct RBAC permission matrix engine with wildcard permission matching (*, org:*, workspace:write)',
      'Build OPA / Wasm ABAC policy evaluator wrapper in nexora-security',
      'Implement pre-defined System Role Templates (Platform Admin, Org Admin, Auditor, Developer, Viewer)'
    ],
    databaseChanges: [
      'CREATE TABLE core_roles (id UUID PRIMARY KEY, tenant_id UUID, name TEXT, is_system BOOLEAN, permissions TEXT[]);',
      'CREATE TABLE core_user_roles (user_id UUID, role_id UUID, scope_unit_id UUID, PRIMARY KEY(user_id, role_id, scope_unit_id));'
    ],
    apiEndpoints: [
      'GET /api/v1/iam/roles',
      'POST /api/v1/iam/roles',
      'POST /api/v1/iam/roles/evaluate',
      'GET /api/v1/iam/permissions'
    ],
    uiComponents: [
      'RbacPermissionMatrixTable',
      'RoleEditorDrawer',
      'PolicyEvaluatorTester',
      'RoleTemplateSelector'
    ],
    testRequirements: [
      'Sub-millisecond RBAC evaluation benchmark tests',
      'Inherited scope permission tests (Unit -> Sub-unit)',
      'Policy cache invalidation verification'
    ],
    definitionOfDone: [
      'Permission evaluation latency < 0.2ms',
      '100% test coverage for role hierarchy evaluation'
    ]
  },
  {
    sprintNumber: 4,
    id: 'sprint-4-user-mgmt',
    name: 'Sprint 4: User Management, Invitations & Active Session Control',
    goal: 'Complete user profiles, invitation workflows, batch user import/export, and active session termination controls.',
    status: 'IN_PROGRESS',
    durationWeeks: 2,
    userStories: [
      'As an HR Lead, I can invite new employees via email link with automatic team provisioning.',
      'As a Security Officer, I can view active sessions and remotely terminate compromised user sessions.',
      'As an IT Admin, I can bulk import users via CSV with role mappings.'
    ],
    technicalTasks: [
      'Implement tokenized email invitation workflow with expiration and rate limiting',
      'Build Redis session registry for live active session tracking and instant kill-switch execution',
      'Develop CSV / JSON asynchronous user bulk importer with validation reporting'
    ],
    databaseChanges: [
      'CREATE TABLE core_invitations (id UUID PRIMARY KEY, tenant_id UUID, email TEXT, role_id UUID, token_hash TEXT, expires_at TIMESTAMPTZ);',
      'CREATE TABLE core_user_sessions (id UUID PRIMARY KEY, user_id UUID, ip_address VARCHAR(45), user_agent TEXT, created_at TIMESTAMPTZ, last_seen_at TIMESTAMPTZ);'
    ],
    apiEndpoints: [
      'GET /api/v1/users',
      'POST /api/v1/users/invite',
      'GET /api/v1/users/{id}/sessions',
      'DELETE /api/v1/users/{id}/sessions/{sessionId}',
      'POST /api/v1/users/bulk-import'
    ],
    uiComponents: [
      'UserManagementTable',
      'InviteUserModal',
      'ActiveSessionsDrawer',
      'BulkUserImportWizard'
    ],
    testRequirements: [
      'Invitation token security & expiration unit tests',
      'Session kill-switch propagation tests',
      'Bulk import error handling edge-case tests'
    ],
    definitionOfDone: [
      'User invitation link workflow functional end-to-end',
      'Session termination invalidates JWT refresh immediately'
    ]
  },
  {
    sprintNumber: 5,
    id: 'sprint-5-audit-compliance',
    name: 'Sprint 5: Audit Engine, Compliance Logs & CloudEvents Dispatcher',
    goal: 'Deliver immutable security audit logging, configuration tracking, RFC 7807 problem details trace log correlation, and CloudEvents dispatching via nexora-events.',
    status: 'PLANNED',
    durationWeeks: 2,
    userStories: [
      'As a Compliance Officer, I can search immutable audit logs filtered by actor, IP, action, and date.',
      'As a Security Analyst, I can correlate API failure responses with CloudEvent trace IDs.',
      'As a SIEM Integration Engineer, I can stream NEXORA audit events to Datadog/Splunk via webhooks.'
    ],
    technicalTasks: [
      'Implement append-only Audit Engine with cryptographic checksum verification',
      'Integrate nexora-events CloudEventBus publisher for all IAM and Org events',
      'Build log retention archival policy manager (90-day hot storage, S3/GCS cold export)'
    ],
    databaseChanges: [
      'CREATE TABLE core_audit_logs (id UUID PRIMARY KEY, tenant_id UUID, actor_id UUID, action TEXT, resource TEXT, ip_address VARCHAR(45), trace_id TEXT, status VARCHAR(32), payload JSONB, created_at TIMESTAMPTZ);',
      'CREATE INDEX idx_audit_search ON core_audit_logs(tenant_id, created_at DESC, action);'
    ],
    apiEndpoints: [
      'GET /api/v1/audit/logs',
      'GET /api/v1/audit/logs/{id}',
      'POST /api/v1/audit/export'
    ],
    uiComponents: [
      'AuditLogExplorerTable',
      'AuditLogDetailModal',
      'SiemExportConfigPanel'
    ],
    testRequirements: [
      'Audit log immutability & hash verification tests',
      'CloudEvents v1.0 schema compliance tests',
      'Log search performance test (< 10ms over 1,000,000 records)'
    ],
    definitionOfDone: [
      'Audit events published to CloudEventBus automatically',
      'Audit search filters yield sub-second responses'
    ]
  },
  {
    sprintNumber: 6,
    id: 'sprint-6-platform-ops',
    name: 'Sprint 6: Platform Settings, Localization, Notifications & Admin Ops',
    goal: 'Build global platform settings, localization engine (multilingual i18n), multi-channel notifications (In-app, Email, Webhooks), and runtime health dashboard.',
    status: 'PLANNED',
    durationWeeks: 2,
    userStories: [
      'As a Platform Operator, I can configure global branding, currency, default timezone, and feature flag overrides.',
      'As an Administrator, I can monitor NEXORA CORE runtime health, active licenses, and resource utilization in real time.',
      'As a End User, I can receive in-app and email notifications for account and security events.'
    ],
    technicalTasks: [
      'Build Platform Settings storage with tenant-level override fallback mechanism using nexora-config',
      'Construct Notification Dispatcher supporting template rendering and multi-channel routing',
      'Build SRF & NICF Runtime Health aggregation monitor (/healthz, /metrics, /license)'
    ],
    databaseChanges: [
      'CREATE TABLE core_platform_settings (tenant_id UUID PRIMARY KEY, branding JSONB, localization JSONB, features JSONB, updated_at TIMESTAMPTZ);',
      'CREATE TABLE core_notifications (id UUID PRIMARY KEY, user_id UUID, title TEXT, body TEXT, channel VARCHAR(32), read_at TIMESTAMPTZ, created_at TIMESTAMPTZ);'
    ],
    apiEndpoints: [
      'GET /api/v1/platform/settings',
      'PUT /api/v1/platform/settings',
      'GET /api/v1/platform/health',
      'GET /api/v1/notifications',
      'POST /api/v1/notifications/send'
    ],
    uiComponents: [
      'PlatformSettingsForm',
      'RuntimeHealthOpsDashboard',
      'NotificationCenterPopover',
      'LicenseUsageWidget'
    ],
    testRequirements: [
      'Notification dispatch fallback tests',
      'Health check endpoint response < 5ms test',
      'Settings inheritance unit tests'
    ],
    definitionOfDone: [
      'Full NEXORA CORE v1.0 platform operational and ready for production deployment',
      'All 6 Agile Sprints verified with 100% acceptance criteria met'
    ]
  }
];

export const MOCK_CORE_ORG_UNITS: CoreOrganizationUnit[] = [
  {
    id: 'org-global',
    name: 'NEXORA Global Enterprise',
    code: 'NX-GLOBAL',
    type: 'ORGANIZATION',
    leaderName: 'Dr. Elena Vance (CEO)',
    memberCount: 1420,
    location: 'Zurich, Switzerland (HQ)'
  },
  {
    id: 'bu-north-america',
    name: 'North America Business Unit',
    code: 'BU-NA',
    type: 'BUSINESS_UNIT',
    parentId: 'org-global',
    leaderName: 'Marcus Vance (SVP)',
    memberCount: 650,
    location: 'San Francisco, CA'
  },
  {
    id: 'bu-emea',
    name: 'EMEA Business Unit',
    code: 'BU-EMEA',
    type: 'BUSINESS_UNIT',
    parentId: 'org-global',
    leaderName: 'Astrid Lindholm (SVP)',
    memberCount: 520,
    location: 'London, UK'
  },
  {
    id: 'dept-core-eng',
    name: 'Platform Engineering & Core R&D',
    code: 'DEPT-ENG',
    type: 'DEPARTMENT',
    parentId: 'bu-north-america',
    leaderName: 'Dr. Aris Thorne (VP Eng)',
    memberCount: 180,
    location: 'San Francisco R&D Lab'
  },
  {
    id: 'team-iam-sec',
    name: 'Identity & Access Security Team',
    code: 'TEAM-IAM',
    type: 'TEAM',
    parentId: 'dept-core-eng',
    leaderName: 'Sarah Jenkins (Lead IAM)',
    memberCount: 14,
    location: 'San Francisco R&D Lab'
  },
  {
    id: 'site-sf-hq',
    name: 'San Francisco Primary Data Center & HQ',
    code: 'SITE-SF1',
    type: 'SITE',
    parentId: 'bu-north-america',
    leaderName: 'David Zhang (Ops Director)',
    memberCount: 350,
    location: '100 Mission St, San Francisco'
  }
];

export const MOCK_CORE_USERS: CoreUserRecord[] = [
  {
    id: 'usr-101',
    email: 'admin.platform@nexora.io',
    fullName: 'Dr. Elena Vance',
    role: 'PLATFORM_ADMIN',
    orgId: 'org-global',
    deptName: 'Executive Office',
    status: 'ACTIVE',
    mfaEnabled: true,
    lastLoginAt: '2026-08-01T12:40:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-102',
    email: 'aris.thorne@nexora.io',
    fullName: 'Dr. Aris Thorne',
    role: 'WORKSPACE_ADMIN',
    orgId: 'bu-north-america',
    deptName: 'Platform Engineering & Core R&D',
    status: 'ACTIVE',
    mfaEnabled: true,
    lastLoginAt: '2026-08-01T12:45:12Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-103',
    email: 'sarah.jenkins@nexora.io',
    fullName: 'Sarah Jenkins',
    role: 'SECURITY_OFFICER',
    orgId: 'bu-north-america',
    deptName: 'Identity & Access Security Team',
    status: 'ACTIVE',
    mfaEnabled: true,
    lastLoginAt: '2026-08-01T12:50:30Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-104',
    email: 'dev.marcus@nexora.io',
    fullName: 'Marcus Vance',
    role: 'MEMBER',
    orgId: 'bu-north-america',
    deptName: 'North America Business Unit',
    status: 'ACTIVE',
    mfaEnabled: false,
    lastLoginAt: '2026-08-01T11:20:00Z'
  },
  {
    id: 'usr-105',
    email: 'auditor.compliance@nexora.io',
    fullName: 'Astrid Lindholm',
    role: 'AUDITOR',
    orgId: 'bu-emea',
    deptName: 'EMEA Business Unit',
    status: 'INVITED',
    mfaEnabled: true,
    lastLoginAt: 'Never'
  }
];

export const MOCK_CORE_AUDIT_LOGS: CoreAuditLog[] = [
  {
    id: 'aud-9901',
    timestamp: '2026-08-01T12:54:10Z',
    actorEmail: 'admin.platform@nexora.io',
    action: 'IAM_ROLE_PERMISSION_UPDATED',
    resource: 'core:role:WORKSPACE_ADMIN',
    ipAddress: '192.168.1.104',
    status: 'SUCCESS',
    traceId: 'tr-core-88192a'
  },
  {
    id: 'aud-9902',
    timestamp: '2026-08-01T12:52:35Z',
    actorEmail: 'sarah.jenkins@nexora.io',
    action: 'API_KEY_REVOKED',
    resource: 'core:key:ak_live_77192x',
    ipAddress: '10.0.4.12',
    status: 'SUCCESS',
    traceId: 'tr-core-77281b'
  },
  {
    id: 'aud-9903',
    timestamp: '2026-08-01T12:48:02Z',
    actorEmail: 'unknown.attacker@external.net',
    action: 'MFA_CHALLENGE_FAILED',
    resource: 'core:user:usr-102',
    ipAddress: '185.220.101.5',
    status: 'DENIED',
    traceId: 'tr-core-66129c'
  },
  {
    id: 'aud-9904',
    timestamp: '2026-08-01T12:45:00Z',
    actorEmail: 'aris.thorne@nexora.io',
    action: 'ORG_UNIT_CREATED',
    resource: 'core:org:TEAM-IAM',
    ipAddress: '10.0.4.55',
    status: 'SUCCESS',
    traceId: 'tr-core-55102d'
  }
];

export const MOCK_CORE_SYSTEM_METRICS: CoreSystemMetric[] = [
  {
    metricName: 'IAM Authentication Latency',
    currentValue: '1.45',
    unit: 'ms',
    targetThreshold: '< 5.0ms',
    status: 'HEALTHY'
  },
  {
    metricName: 'Active Concurrent JWT Sessions',
    currentValue: '14,820',
    unit: 'sessions',
    targetThreshold: '< 100,000',
    status: 'HEALTHY'
  },
  {
    metricName: 'RBAC Permission Evaluation Rate',
    currentValue: '1.2M',
    unit: 'eval/sec',
    targetThreshold: '> 500k/sec',
    status: 'HEALTHY'
  },
  {
    metricName: 'Multi-Tenant DB Query Latency',
    currentValue: '2.10',
    unit: 'ms',
    targetThreshold: '< 10.0ms',
    status: 'HEALTHY'
  },
  {
    metricName: 'Audit Log Ingestion Pipeline',
    currentValue: '100%',
    unit: 'guaranteed delivery',
    targetThreshold: '100%',
    status: 'HEALTHY'
  }
];
