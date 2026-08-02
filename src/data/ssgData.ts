import { SprintPackageSpec, SsgAtomicTask } from '../types/ssg';

export const SPRINT_1_ATOMIC_TASKS: SsgAtomicTask[] = [
  {
    id: 'TSK-IAM-001',
    title: 'PostgreSQL Multi-Tenant Schema & DDL Migration Script',
    priority: 'P0',
    owner: 'DBA / Data Architect',
    estimatedHours: 8,
    dependencies: [],
    deliverables: ['0001_iam_core_schema.sql', 'migration_rollback.sql'],
    status: 'READY'
  },
  {
    id: 'TSK-IAM-002',
    title: 'Argon2id Password Hashing Engine & Salt Vault Service',
    priority: 'P0',
    owner: 'Security Engineer',
    estimatedHours: 6,
    dependencies: ['TSK-IAM-001'],
    deliverables: ['/src/security/argon2Service.ts', 'argon2.spec.ts'],
    status: 'READY'
  },
  {
    id: 'TSK-IAM-003',
    title: 'Ed25519 JWT Key Pair Manager & Token Signer',
    priority: 'P0',
    owner: 'Security Engineer',
    estimatedHours: 8,
    dependencies: [],
    deliverables: ['/src/security/tokenSigner.ts', 'ed25519Keys.ts'],
    status: 'READY'
  },
  {
    id: 'TSK-IAM-004',
    title: 'Multi-Tenant Auth API Handler (Signup, Login, Refresh, Logout)',
    priority: 'P0',
    owner: 'Backend Engineer',
    estimatedHours: 12,
    dependencies: ['TSK-IAM-001', 'TSK-IAM-002', 'TSK-IAM-003'],
    deliverables: ['/src/routes/authRoutes.ts', 'authController.ts'],
    status: 'READY'
  },
  {
    id: 'TSK-IAM-005',
    title: 'High-Performance Redis Token Blacklist & Session Store',
    priority: 'P0',
    owner: 'Backend Engineer',
    estimatedHours: 6,
    dependencies: ['TSK-IAM-003'],
    deliverables: ['/src/services/redisSessionService.ts'],
    status: 'READY'
  },
  {
    id: 'TSK-IAM-006',
    title: 'Hierarchical RBAC Permission Evaluator Middleware',
    priority: 'P1',
    owner: 'Backend Engineer',
    estimatedHours: 10,
    dependencies: ['TSK-IAM-004'],
    deliverables: ['/src/middleware/rbacGuard.ts', 'rbac.spec.ts'],
    status: 'READY'
  },
  {
    id: 'TSK-IAM-007',
    title: 'WebAuthn / TOTP MFA Second-Factor Authentication Service',
    priority: 'P1',
    owner: 'Security / Fullstack Engineer',
    estimatedHours: 12,
    dependencies: ['TSK-IAM-004'],
    deliverables: ['/src/services/mfaService.ts', 'mfaRoutes.ts'],
    status: 'READY'
  },
  {
    id: 'TSK-IAM-008',
    title: 'Immutable Audit Log Producer & Hash-Chain Verification',
    priority: 'P1',
    owner: 'Backend / Security Engineer',
    estimatedHours: 8,
    dependencies: ['TSK-IAM-001'],
    deliverables: ['/src/services/auditLogger.ts'],
    status: 'READY'
  },
  {
    id: 'TSK-IAM-009',
    title: 'Rate Limiting & DDoS Prevention Middleware (Leaky Bucket)',
    priority: 'P1',
    owner: 'DevOps / Backend Engineer',
    estimatedHours: 6,
    dependencies: ['TSK-IAM-005'],
    deliverables: ['/src/middleware/rateLimiter.ts'],
    status: 'READY'
  },
  {
    id: 'TSK-IAM-010',
    title: 'E2E Integration & Stress Testing Suite (10,000 req/sec)',
    priority: 'P0',
    owner: 'QA Lead / SDET',
    estimatedHours: 12,
    dependencies: ['TSK-IAM-004', 'TSK-IAM-006', 'TSK-IAM-008'],
    deliverables: ['/tests/integration/auth.e2e.ts', 'k6-load-test.js'],
    status: 'READY'
  }
];

export const SPRINT_1_PACKAGE: SprintPackageSpec = {
  sprintId: 'SPRINT-2026-01',
  sprintName: 'Sprint 1: IAM Core, Multi-Tenant Auth & Token Infrastructure',
  version: '1.0.0',
  targetProduct: 'NEXORA CORE Platform',
  generatedAt: '2026-08-01T12:00:00Z',
  atomicTasks: SPRINT_1_ATOMIC_TASKS,
  documents: [
    {
      id: 'doc-readme',
      filename: 'README.md',
      title: 'Sprint 1 Engineering Package README',
      category: 'BUSINESS',
      format: 'markdown',
      content: `# NEXORA CORE - Sprint 1 Engineering Package
## IAM Core, Multi-Tenant Authentication & Token Infrastructure (v1.0.0)

### Overview
This package defines the exact implementation specification for **NEXORA CORE Sprint 1**. It covers zero-trust multi-tenant isolation, Ed25519 token signing, Argon2id password hashing, Redis session management, and fine-grained RBAC matrix guards.

### Package Artifacts Included
1. **README.md** - Executive Summary & Package Blueprint
2. **BusinessContext.md** - Domain Context, Objectives & Success Metrics
3. **UserStories.md** - Product Backlog Stories (US-01 through US-08)
4. **AcceptanceCriteria.md** - Given-When-Then Specification Matrix
5. **FunctionalRequirements.md** - Hard functional requirements & boundary logic
6. **NonFunctionalRequirements.md** - SLA, SLO, Latency, Throughput & Compliance
7. **DatabaseSchema.md** - PostgreSQL DDL, Indexes, Foreign Keys & Migration
8. **OpenAPI.yaml** - OpenAPI 3.1 REST API Specification
9. **SequenceDiagram.md** - Auth Flow & Token Renewal Sequence Diagrams
10. **ClassDiagram.md** - Domain Domain Model & Service Layer Architecture
11. **StateMachine.md** - User Account Lifecycle & Session State Machines
12. **Mermaid.md** - All System Visualizations in Native Mermaid Syntax
13. **PlantUML.md** - Production Architectural Diagrams in PlantUML Syntax
14. **PermissionsMatrix.md** - RBAC Role-Permission Mapping Matrix
15. **LocalizationKeys.md** - i18n Translation Schema (EN, AR, DE, ES, FR, JA)
16. **ValidationRules.md** - Input Payload Sanitization & Boundary Rules
17. **TestCases.md** - Unit & Functional Test Suite Specifications
18. **IntegrationTests.md** - E2E API Scenario Specifications
19. **SecurityChecklist.md** - OWASP Top 10 & Zero-Trust Hardening Guide
20. **PerformanceTargets.md** - Load Testing Baselines & P99 SLA Limits
21. **DefinitionOfDone.md** - Quality Gate Requirements for Production Release
22. **RiskAssessment.md** - Risk Matrix & Mitigation Contingency
23. **ImplementationTasks.md** - Atomic Work Breakdown Structure (WBS)
24. **ReleaseChecklist.md** - Staging to Production Deployment Sequence
`
    },
    {
      id: 'doc-business-context',
      filename: 'BusinessContext.md',
      title: 'Business Context & Problem Statement',
      category: 'BUSINESS',
      format: 'markdown',
      content: `# Business Context - Sprint 1: IAM Core & Multi-Tenant Platform

## Executive Summary
NEXORA requires a enterprise-grade Identity & Access Management (IAM) framework to support multi-tenant isolation across all 7 downstream products (Forge, Shield, Apex, Flow, Pulse, Nexus, Grid).

## Problem Statement
Legacy authentication mechanisms lack deterministic multi-tenant tenant isolation, resulting in cross-tenant data leak risks, inefficient JWT validation overhead, and uncoordinated audit logging across microservices.

## Strategic Objectives
1. **Zero-Trust Multi-Tenancy**: Every request carries cryptographically signed tenant context (\`tenant_id\`) with row-level security (RLS) enforcement.
2. **Sub-5ms Auth Latency**: Asymmetric Ed25519 token validation with local public key caching to eliminate database bottlenecks during high-concurrency requests.
3. **Strict Regulatory Compliance**: Native SOC2 Type II, ISO 27001, HIPAA, and GDPR audit logging with immutable hash chaining.

## Key Performance Indicators (KPIs)
- **Token Issue Latency**: < 15ms (P99)
- **Token Verification Overhead**: < 1.5ms (P99)
- **Tenant Isolation Breach Tolerance**: Exactly 0.
`
    },
    {
      id: 'doc-user-stories',
      filename: 'UserStories.md',
      title: 'Agile User Stories (US-01 to US-08)',
      category: 'BUSINESS',
      format: 'markdown',
      content: `# User Stories - Sprint 1

### US-01: Multi-Tenant Tenant Provisioning
**As a** System Administrator  
**I want to** provision a new isolated Tenant Organization  
**So that** business data, users, and resources remain strictly compartmentalized.

---

### US-02: Cryptographic User Authentication
**As an** Organization User  
**I want to** log in with email/password and multi-factor authentication (MFA)  
**So that** my account remains protected against credential stuffing and brute-force attacks.

---

### US-03: Asymmetric Ed25519 Access Token Issuance
**As a** Microservice Developer  
**I want to** validate user JWTs locally using Ed25519 public keys  
**So that** services can authenticate requests without round-tripping to the central IAM service.

---

### US-04: Instant Token Revocation via Redis Blacklist
**As a** Security Manager  
**I want to** immediately invalidate compromised tokens or user sessions  
**So that** revoked credentials cannot access downstream APIs.

---

### US-05: Hierarchical Role-Based Access Control (RBAC)
**As a** Tenant Admin  
**I want to** assign granular roles (Owner, Admin, Member, Auditor) to team members  
**So that** employees only access features explicit to their business role.

---

### US-06: WebAuthn / FIDO2 Passkey Support
**As an** Enterprise Security Executive  
**I want to** enforce hardware key authentication (YubiKey/TouchID) for privileged users  
**So that** phishing attempts are mitigated.

---

### US-07: Cryptographic Hash-Chained Audit Trail
**As a** Compliance Auditor  
**I want to** verify tamper-proof audit logs for all security events  
**So that** log tampering can be detected immediately.

---

### US-08: Adaptive Rate Limiting & Brute Force Guard
**As a** System Reliability Engineer  
**I want to** throttle abusive authentication attempts per IP and Tenant  
**So that** platform availability is protected against DDoS attacks.
`
    },
    {
      id: 'doc-acceptance-criteria',
      filename: 'AcceptanceCriteria.md',
      title: 'Acceptance Criteria (Given-When-Then)',
      category: 'BUSINESS',
      format: 'markdown',
      content: `# Acceptance Criteria Specification Matrix

## AC-01: User Login & Token Generation
\`\`\`gherkin
Scenario: Successful Tenant Authentication
  Given a registered user "alice@enterprise.com" belonging to Tenant "tenant-881"
  And the account status is "ACTIVE"
  When Alice sends POST /api/v1/auth/login with valid password and TOTP code "582910"
  Then the response status should be 200 OK
  And the body must contain a "token_bundle" with "access_token" and "refresh_token"
  And the decoded access_token header must specify "alg": "EdDSA"
  And the token payload must contain "sub", "tenant_id", "roles", and "exp" (15 minute lifetime)
  And a "SECURE_AUTH_LOGIN_SUCCESS" event must be written to the Audit Log.
\`\`\`

## AC-02: Cross-Tenant Data Isolation Guard
\`\`\`gherkin
Scenario: Cross-Tenant Resource Access Blocked
  Given an authenticated user belonging to Tenant "tenant-100"
  When the user attempts to GET /api/v1/organizations/tenant-200/users
  Then the system must return 403 Forbidden
  And the error code must be "ERR_TENANT_ACCESS_DENIED"
  And a security anomaly alert "SEC_CROSS_TENANT_VIOLATION" must be dispatched to Security Ops.
\`\`\`

## AC-03: Immediate Revocation Verification
\`\`\`gherkin
Scenario: Revoked Access Token Rejected
  Given a valid access token "eyJhbGci..."
  When the user invokes POST /api/v1/auth/logout
  Then the token ID (jti) is added to the Redis revocation bloom filter with TTL = remaining exp
  And subsequent API calls with "eyJhbGci..." must be rejected immediately with 401 Unauthorized.
\`\`\`
`
    },
    {
      id: 'doc-functional-requirements',
      filename: 'FunctionalRequirements.md',
      title: 'Functional Requirements',
      category: 'ARCHITECTURE',
      format: 'markdown',
      content: `# Functional Requirements Specification

| Requirement ID | Description | Severity | Target Module |
|---|---|---|---|
| **FR-IAM-01** | System MUST hash passwords using Argon2id with parameters: memory=64MB, iterations=3, parallelism=4, salt=16B. | P0 | Password Engine |
| **FR-IAM-02** | System MUST sign JWTs using Ed25519 (EdDSA) private keys rotated every 30 days. | P0 | Token Signer |
| **FR-IAM-03** | Refresh tokens MUST be single-use and bound to a high-entropy client fingerprint. | P0 | Session Store |
| **FR-IAM-04** | All database queries MUST enforce PostgreSQL Row Level Security (RLS) bound to \`current_setting('app.current_tenant_id')\`. | P0 | Database Layer |
| **FR-IAM-05** | MFA enforcement MUST support both TOTP (RFC 6238) and WebAuthn (FIDO2 Level 2). | P1 | Security Service |
| **FR-IAM-06** | System MUST log every auth attempt (success/failure) into an immutable hash-chained audit log table. | P1 | Audit Service |
| **FR-IAM-07** | Rate limiting MUST enforce max 5 login attempts per IP per 60s window before triggering IP jail. | P1 | Edge Gateway |
| **FR-IAM-08** | RBAC permission engine MUST evaluate permission paths in < 1ms using memory-cached role graphs. | P1 | RBAC Evaluator |
`
    },
    {
      id: 'doc-non-functional-requirements',
      filename: 'NonFunctionalRequirements.md',
      title: 'Non-Functional Requirements & SLAs',
      category: 'ARCHITECTURE',
      format: 'markdown',
      content: `# Non-Functional Requirements (NFRs)

## 1. Latency & Performance SLA
- **Authentication Handshake**: P95 < 25ms, P99 < 50ms
- **Stateless Token Verification**: P99 < 1.0ms
- **Token Revocation Lookup (Redis)**: P99 < 2.0ms

## 2. Throughput & Scalability
- **Peak Login Throughput**: 5,000 requests / second
- **Token Validation Capacity**: 100,000 requests / second across service mesh

## 3. Availability & Fault Tolerance
- **IAM Core Uptime**: 99.99% multi-region availability (max 52.6 min downtime/year)
- **Failover Recovery**: Automated Redis cluster failover in < 3 seconds

## 4. Security & Compliance Requirements
- **Encryption in Transit**: TLS 1.3 mandated on all external & internal gRPC/HTTP endpoints
- **Encryption at Rest**: AES-256-GCM hardware key encryption for secrets
- **Compliance Certification**: SOC 2 Type II, ISO 27001, HIPAA compliant controls
`
    },
    {
      id: 'doc-database-schema',
      filename: 'DatabaseSchema.md',
      title: 'Database Schema & DDL Migration',
      category: 'DATABASE',
      format: 'markdown',
      content: `# Database Schema Specification (PostgreSQL 16)

\`\`\`sql
-- Enable cryptographic extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tenants Table
CREATE TABLE core_tenants (
    tenant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(63) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    plan_tier VARCHAR(32) NOT NULL DEFAULT 'ENTERPRISE',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE core_users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES core_tenants(tenant_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_tenant_user_email UNIQUE (tenant_id, email)
);

-- 3. Roles Table
CREATE TABLE core_roles (
    role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES core_tenants(tenant_id) ON DELETE CASCADE,
    role_name VARCHAR(64) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_tenant_role_name UNIQUE (tenant_id, role_name)
);

-- 4. User Role Mapping
CREATE TABLE core_user_roles (
    user_id UUID NOT NULL REFERENCES core_users(user_id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES core_roles(role_id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- Indexes for Ultra-High Performance
CREATE INDEX idx_users_tenant_email ON core_users(tenant_id, email);
CREATE INDEX idx_user_roles_user ON core_user_roles(user_id);
\`\`\`
`
    },
    {
      id: 'doc-openapi',
      filename: 'OpenAPI.yaml',
      title: 'OpenAPI 3.1 REST API Specification',
      category: 'API',
      format: 'yaml',
      content: `openapi: 3.1.0
info:
  title: NEXORA CORE IAM API
  version: 1.0.0
  description: Enterprise Multi-Tenant Identity and Token Infrastructure API.
paths:
  /api/v1/auth/login:
    post:
      summary: User Authentication & Token Generation
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [tenant_slug, email, password]
              properties:
                tenant_slug:
                  type: string
                  example: "acme-corp"
                email:
                  type: string
                  format: email
                  example: "admin@acme.com"
                password:
                  type: string
                  format: password
                  example: "P@ssw0rd2026!"
                totp_code:
                  type: string
                  example: "582910"
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                  refresh_token:
                    type: string
                  expires_in:
                    type: integer
                    example: 900
                  token_type:
                    type: string
                    example: "Bearer"
        '401':
          description: Invalid credentials or MFA challenge required
`
    },
    {
      id: 'doc-sequence-diagram',
      filename: 'SequenceDiagram.md',
      title: 'Authentication Sequence Diagram',
      category: 'ARCHITECTURE',
      format: 'markdown',
      content: `# Authentication Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User as Client App / SPA
    participant GW as API Gateway (Kong/Nginx)
    participant IAM as IAM Auth Service
    participant DB as PostgreSQL (RLS)
    participant Redis as Redis Cache

    User->>GW: POST /api/v1/auth/login
    GW->>IAM: Forward Request Payload
    IAM->>DB: Query User by Email & Tenant Slug
    DB-->>IAM: Return User Record & Argon2id Hash
    IAM->>IAM: Verify Argon2id Password Hash
    alt Password Invalid
        IAM-->>GW: 401 Unauthorized (Invalid Credentials)
        GW-->>User: 401 Response
    else Password Valid & MFA Required
        IAM-->>GW: 202 MFA Required Challenge Token
        GW-->>User: Prompt TOTP / WebAuthn
    else Auth Success
        IAM->>IAM: Generate Ed25519 JWT (Access Token)
        IAM->>Redis: Store Refresh Token & Session Context
        IAM-->>GW: 200 OK + Token Bundle
        GW-->>User: Access Token + Refresh Cookie
    end
\`\`\`
`
    },
    {
      id: 'doc-class-diagram',
      filename: 'ClassDiagram.md',
      title: 'Domain Class Diagram',
      category: 'ARCHITECTURE',
      format: 'markdown',
      content: `# IAM Core Domain Model & Service Class Architecture

\`\`\`mermaid
classDiagram
    class Tenant {
        +UUID tenantId
        +String slug
        +String name
        +TenantStatus status
        +activate()
        +suspend()
    }

    class User {
        +UUID userId
        +UUID tenantId
        +String email
        +String passwordHash
        +Boolean mfaEnabled
        +verifyPassword(plain)
        +assignRole(Role)
    }

    class Role {
        +UUID roleId
        +UUID tenantId
        +String name
        +List~Permission~ permissions
    }

    class Permission {
        +String permissionId
        +String resource
        +String action
    }

    class AuthService {
        +login(credentials) TokenBundle
        +refreshToken(refreshToken) TokenBundle
        +logout(accessToken) Void
    }

    class TokenSigner {
        +signToken(User) String
        +verifyToken(String) JwtPayload
    }

    Tenant "1" -- "*" User : owns
    Tenant "1" -- "*" Role : defines
    User "*" -- "*" Role : possesses
    Role "*" -- "*" Permission : includes
    AuthService --> TokenSigner : uses
\`\`\`
`
    },
    {
      id: 'doc-state-machine',
      filename: 'StateMachine.md',
      title: 'Account Lifecycle State Machine',
      category: 'ARCHITECTURE',
      format: 'markdown',
      content: `# User Account Lifecycle State Machine

\`\`\`mermaid
stateDiagram-v2
    [*] --> PROVISIONED: Admin Provisions User
    PROVISIONED --> PENDING_MFA: Email Verified
    PENDING_MFA --> ACTIVE: MFA Setup Completed
    ACTIVE --> LOCKED: 5 Consecutive Failed Logins
    LOCKED --> ACTIVE: Admin Unlock / Reset
    ACTIVE --> SUSPENDED: Violation Detected
    SUSPENDED --> ACTIVE: Admin Reinstatement
    ACTIVE --> DELETED: User Soft Delete
    DELETED --> [*]
\`\`\`
`
    },
    {
      id: 'doc-mermaid',
      filename: 'Mermaid.md',
      title: 'Complete Mermaid Visualizations Suite',
      category: 'ARCHITECTURE',
      format: 'mermaid',
      content: `gantt
    title NEXORA CORE Sprint 1 Implementation Roadmap
    dateFormat  YYYY-MM-DD
    section Database & Security
    PostgreSQL DDL & RLS       :active, db1, 2026-08-01, 3d
    Argon2id & Key Signing     :sec1, after db1, 2d
    section API & Auth Logic
    Auth Handler Endpoints     :api1, after sec1, 4d
    Redis Token Revocation     :redis1, after api1, 2d
    section Access Control & QA
    Hierarchical RBAC Engine   :rbac1, after redis1, 3d
    E2E Stress & Penetration   :qa1, after rbac1, 3d
`
    },
    {
      id: 'doc-plantuml',
      filename: 'PlantUML.md',
      title: 'PlantUML Architecture Diagram',
      category: 'ARCHITECTURE',
      format: 'plantuml',
      content: `@startuml
package "NEXORA CORE IAM Layer" {
  [API Gateway] --> [Auth Controller]
  [Auth Controller] --> [Argon2id Service]
  [Auth Controller] --> [Ed25519 Signer]
  [Auth Controller] --> [PostgreSQL DB]
  [Auth Controller] --> [Redis Cluster]
}
database "PostgreSQL 16" {
  [core_tenants]
  [core_users]
  [core_roles]
}
node "Redis 7.2" {
  [Blacklist Store]
  [Session Tokens]
}
@enduml
`
    },
    {
      id: 'doc-permissions-matrix',
      filename: 'PermissionsMatrix.md',
      title: 'RBAC Role-Permission Matrix',
      category: 'SECURITY',
      format: 'markdown',
      content: `# RBAC Role-Permissions Matrix

| Resource & Action | System SuperAdmin | Tenant Owner | Tenant Admin | Developer | Auditor |
|---|:---:|:---:|:---:|:---:|:---:|
| \`tenant:create\` | ✅ | ❌ | ❌ | ❌ | ❌ |
| \`tenant:delete\` | ✅ | ❌ | ❌ | ❌ | ❌ |
| \`user:read\` | ✅ | ✅ | ✅ | ✅ | ✅ |
| \`user:create\` | ✅ | ✅ | ✅ | ❌ | ❌ |
| \`user:delete\` | ✅ | ✅ | ✅ | ❌ | ❌ |
| \`role:assign\` | ✅ | ✅ | ✅ | ❌ | ❌ |
| \`audit:read\` | ✅ | ✅ | ✅ | ❌ | ✅ |
| \`system:keys_rotate\`| ✅ | ❌ | ❌ | ❌ | ❌ |
`
    },
    {
      id: 'doc-localization-keys',
      filename: 'LocalizationKeys.md',
      title: 'Localization Keys (i18n)',
      category: 'BUSINESS',
      format: 'markdown',
      content: `# Internationalization (i18n) Keys Schema

\`\`\`json
{
  "auth": {
    "login_title": "Sign in to NEXORA CORE",
    "invalid_credentials": "The email or password entered is incorrect.",
    "mfa_required": "Multi-factor verification required.",
    "session_expired": "Your session has expired. Please sign in again.",
    "tenant_not_found": "Tenant organization could not be resolved."
  },
  "errors": {
    "ERR_UNAUTHORIZED": "Authentication token missing or invalid.",
    "ERR_FORBIDDEN": "Insufficient privileges to perform this action.",
    "ERR_RATE_LIMIT": "Too many failed attempts. Please try again in 15 minutes."
  }
}
\`\`\`
`
    },
    {
      id: 'doc-validation-rules',
      filename: 'ValidationRules.md',
      title: 'Payload Validation Rules',
      category: 'API',
      format: 'markdown',
      content: `# Input Payload Validation & Sanitization Schema

### Email Address
- Pattern: \`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\`
- Max Length: 255 characters
- Lowercased and whitespace stripped prior to hashing.

### Password Complexity
- Min Length: 12 characters
- Must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character (\`!@#$%^&*\`).
- Checked against HaveIBeenPwned breach database.

### Tenant Slug
- Pattern: \`^[a-z0-9-]+$\`
- Min Length: 3, Max Length: 63
`
    },
    {
      id: 'doc-test-cases',
      filename: 'TestCases.md',
      title: 'Unit & Functional Test Cases',
      category: 'TESTING',
      format: 'markdown',
      content: `# Unit Test Suite Specifications

| Test ID | Function Under Test | Input Condition | Expected Outcome |
|---|---|---|---|
| **TC-SEC-01** | \`argon2idHash()\` | Password string | Returns valid Argon2id hash string |
| **TC-SEC-02** | \`signJwt()\` | Valid user payload | Returns 3-segment Ed25519 signed JWT |
| **TC-SEC-03** | \`verifyJwt()\` | Tampered JWT signature | Throws \`JsonWebTokenError\` |
| **TC-SEC-04** | \`verifyJwt()\` | Expired JWT timestamp | Throws \`TokenExpiredError\` |
| **TC-SEC-05** | \`rbacCheck()\` | User role = MEMBER requesting \`user:delete\` | Returns \`false\` |
`
    },
    {
      id: 'doc-integration-tests',
      filename: 'IntegrationTests.md',
      title: 'E2E Integration Test Suite',
      category: 'TESTING',
      format: 'markdown',
      content: `# E2E Integration Scenarios

1. **Full Authentication Lifecycle**:
   - Register tenant -> Provision user -> Login with Argon2id -> Receive JWT -> Execute authenticated query -> Logout (Blacklist token).
2. **MFA Challenge Lifecycle**:
   - Trigger login -> Receive 202 MFA required -> Validate TOTP code -> Issue full token.
3. **Cross-Tenant Security Breach Simulation**:
   - Authenticate as Tenant A -> Attempt API call targeting Tenant B resources -> Verify 403 Forbidden and audit log emission.
`
    },
    {
      id: 'doc-security-checklist',
      filename: 'SecurityChecklist.md',
      title: 'Security & Zero-Trust Checklist',
      category: 'SECURITY',
      format: 'markdown',
      content: `# OWASP & Zero-Trust Security Checklist

- [x] Argon2id password hashing enforced.
- [x] Ed25519 asymmetric key signing for JWTs.
- [x] TLS 1.3 enforced on all REST & gRPC endpoints.
- [x] PostgreSQL RLS enforced per tenant ID.
- [x] Redis revocation blacklist for instantaneous logout.
- [x] Anti-brute force rate limiting per IP and email.
- [x] OWASP CORS headers configured (\`Access-Control-Allow-Origin\` restricted).
- [x] Cryptographic hash-chain integrity verification on audit log table.
`
    },
    {
      id: 'doc-performance-targets',
      filename: 'PerformanceTargets.md',
      title: 'Performance Baselines & Targets',
      category: 'OPS',
      format: 'markdown',
      content: `# Performance Benchmarks & Targets

| Metric | Baseline Target | Stress Target |
|---|---|---|
| **Authentication Request Latency** | P95 < 20ms | P99 < 45ms |
| **JWT Verification Time** | P99 < 0.8ms | P99 < 1.2ms |
| **Max Concurrent Logins** | 2,500 / sec | 10,000 / sec |
| **Database Pool Utilization** | < 40% under normal load | < 75% peak |
| **Redis Cache Hit Ratio** | > 99.5% | > 98.0% |
`
    },
    {
      id: 'doc-definition-of-done',
      filename: 'DefinitionOfDone.md',
      title: 'Definition of Done (DoD)',
      category: 'OPS',
      format: 'markdown',
      content: `# Definition of Done (DoD) Quality Gate

Every task in Sprint 1 must meet the following criteria before merge:

1. **Code Quality**: 100% TypeScript strict mode passing with zero linter errors.
2. **Test Coverage**: Minimum 95% unit test coverage and 100% critical path E2E coverage.
3. **Security Audit**: Zero High or Critical security vulnerability flags from SonarQube / Snyk.
4. **Documentation**: OpenAPI 3.1 schema updated and matching live handlers.
5. **Peer Review**: Approved by at least 2 Principal Architects (including Security Lead).
`
    },
    {
      id: 'doc-risk-assessment',
      filename: 'RiskAssessment.md',
      title: 'Risk Assessment & Mitigation',
      category: 'OPS',
      format: 'markdown',
      content: `# Risk Matrix & Contingency Planning

| Risk Description | Severity | Probability | Mitigation Strategy |
|---|:---:|:---:|---|
| Ed25519 Key Pair Compromise | High | Low | Automated 30-day key rotation with dual-key validation during grace window. |
| Redis Cluster Outage | High | Low | Fallback to PostgreSQL indexed session table with 150ms circuit breaker. |
| Argon2id CPU Exhaustion under DDoS | Medium | Medium | Edge Gateway Cloudflare rate-limiting before reaching worker threads. |
`
    },
    {
      id: 'doc-implementation-tasks',
      filename: 'ImplementationTasks.md',
      title: 'Atomic Implementation Task Breakdown',
      category: 'OPS',
      format: 'markdown',
      content: `# Atomic Implementation Tasks (WBS)

See the **Implementation Tasks Tab** in the UI viewer or the task array below for the complete 10-task atomic breakdown with hours, owners, and deliverables.
`
    },
    {
      id: 'doc-release-checklist',
      filename: 'ReleaseChecklist.md',
      title: 'Production Release Checklist',
      category: 'OPS',
      format: 'markdown',
      content: `# Staging to Production Release Sequence

- [ ] Execute PostgreSQL migration script \`0001_iam_core_schema.sql\`.
- [ ] Provision Ed25519 secrets in HashiCorp Vault / Secret Manager.
- [ ] Deploy IAM Service containers to Kubernetes cluster.
- [ ] Verify Redis cluster health and connectivity.
- [ ] Run automated E2E smoke tests on Staging environment.
- [ ] Cut over DNS traffic to production IAM API gateway.
- [ ] Confirm zero cross-tenant query leaks in audit logs.
`
    }
  ]
};
