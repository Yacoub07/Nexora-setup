import { SrfServiceSpec, SrfArchitectureLayer, SrfFeatureFlag, SrfAiPromptTemplate } from '../types/srf';

export const SRF_SERVICES_CATALOG: SrfServiceSpec[] = [
  {
    id: 'srf-config',
    code: 'SRF-CFG-01',
    name: 'Configuration Service',
    category: 'CORE_PLATFORM',
    tagline: 'Multi-source profile management with hot-reload, secret resolution & schema validation',
    responsibilities: [
      'Parse YAML, JSON, and Environment Variables into typed immutable configuration objects',
      'Resolve secrets dynamically from Vault, AWS Secrets Manager, or GCP Secret Manager',
      'Provide profile-based cascades (local -> dev -> staging -> prod -> tenant-override)',
      'Validate configuration at startup using strict Pydantic/Zod schemas',
      'Emit change events for hot-reloading dynamic feature parameters without service restarts'
    ],
    interfaces: [
      {
        name: 'ConfigLoader',
        signature: 'load_config<T>(schema: Schema<T>, profile?: string): Promise<ConfigResult<T>>',
        description: 'Loads and validates environment configuration into strongly typed interfaces',
        codeExample: `import { SrfConfig } from '@nexora/srf-config';

const config = await SrfConfig.load({
  profile: process.env.NEXORA_ENV || 'production',
  secretsProvider: 'vault',
  hotReload: true
});

console.log('Database URL:', config.get('database.url'));`
      },
      {
        name: 'SecretsResolver',
        signature: 'resolve_secret(secretUri: string): Promise<string>',
        description: 'Interpolates secrets URIs (e.g., vault://kv/db/password) into actual decrypted strings',
        codeExample: `const dbPass = await SrfConfig.secrets.resolve('vault://nexora-prod/database#password');`
      }
    ],
    dependencies: ['Security Runtime (Vault Integration)', 'Logging Service'],
    extensionPoints: [
      'Custom Secret Provider Driver Interface (e.g., KeyVaultDriver)',
      'Custom Config Parser Hook (e.g., TOML / AWS AppConfig driver)'
    ],
    configurationYaml: `srf:
  config:
    profile: "production"
    cache_ttl_seconds: 300
    hot_reload_enabled: true
    providers:
      - type: "env"
        prefix: "NEXORA_"
      - type: "yaml"
        path: "/etc/nexora/config.yaml"
      - type: "vault"
        address: "https://vault.nexora.internal:8200"
        mount_path: "secret"`,
    errorHandling: [
      'Throw ConfigValidationError if schema validation fails on startup and halt deployment',
      'Fallback to cached secret values if Secret Vault suffers a transient timeout (< 3s)',
      'Log CRITICAL diagnostic traces when required environment keys are unresolvable'
    ],
    testingStrategy: [
      'Mock Secret Vault provider with local memory map for fast unit testing',
      'Test environment variable override precedence over YAML defaults',
      'Verify hot-reload listener receives update callbacks when mock file changes'
    ],
    securityConsiderations: [
      'Never output resolved secret strings to console logs or stack traces',
      'Memory zeroization for sensitive credentials in RAM when config is destroyed',
      'Strict TLS 1.3 requirement for Vault / KMS remote connections'
    ],
    performanceConsiderations: [
      'Sub-millisecond configuration reads via in-memory immutability',
      'Asynchronous non-blocking background secret rotation refresh'
    ],
    consumers: [
      { productId: 'forge', productName: 'NEXORA Forge', usageDescription: 'Loads CLI workspace settings & command templates', status: 'CORE_DEPENDENCY' },
      { productId: 'sdk', productName: 'NEXORA SDK', usageDescription: 'Injects runtime environment variables into user client apps', status: 'ACTIVE' },
      { productId: 'studio', productName: 'NEXORA Studio', usageDescription: 'Hot-reloads app metadata & theme configurations', status: 'ACTIVE' },
      { productId: 'platform', productName: 'NEXORA Platform', usageDescription: 'Tenant-level configuration cascading and secrets resolution', status: 'CORE_DEPENDENCY' },
      { productId: 'core', productName: 'NEXORA CORE', usageDescription: 'System kernel parameters & DB connection string parsing', status: 'CORE_DEPENDENCY' },
      { productId: 'analytics', productName: 'Analytics Platform', usageDescription: 'Loads ingestion endpoint specs & rate limits', status: 'ACTIVE' },
      { productId: 'mining', productName: 'Mining Platform', usageDescription: 'Parses node cluster endpoints & worker pools', status: 'ACTIVE' }
    ]
  },
  {
    id: 'srf-logging',
    code: 'SRF-LOG-02',
    name: 'Logging Service',
    category: 'OBSERVABILITY_DIAGNOSTICS',
    tagline: 'Structured JSON logging, correlation tracing & automatic PII redacting',
    responsibilities: [
      'Provide zero-allocation structured JSON log formatting for stdout, stderr, and log sinks',
      'Automatically propagate trace_id, span_id, request_id, and tenant_id across thread contexts',
      'Redact sensitive PII fields (passwords, credit cards, SSNs, JWT tokens) before writing',
      'Support dynamic log level changes (DEBUG -> INFO -> WARN -> ERROR) per namespace at runtime',
      'Manage multi-destination streaming (Console, File with rotation, FluentBit, Datadog)'
    ],
    interfaces: [
      {
        name: 'StructuredLogger',
        signature: 'logger.info(message: string, context?: Record<string, any>): void',
        description: 'Writes structured JSON log entry containing mandatory correlation headers',
        codeExample: `import { logger } from '@nexora/srf-logging';

logger.info('User authentication succeeded', {
  tenantId: 'tenant-482',
  userId: 'usr-9921',
  durationMs: 14.2
});`
      },
      {
        name: 'CorrelationContext',
        signature: 'withContext<T>(context: TraceContext, fn: () => T): T',
        description: 'Binds request and trace IDs to the current asynchronous execution context',
        codeExample: `logger.withContext({ traceId: 'tr-99201', tenantId: 't-88' }, () => {
  // All nested logs automatically inherit traceId and tenantId
  processOrder();
});`
      }
    ],
    dependencies: ['Configuration Service'],
    extensionPoints: [
      'Custom Log Sink Driver (e.g., Elasticsearch, Loki, CloudWatch)',
      'Custom PII Masking Filter Regex Rules'
    ],
    configurationYaml: `srf:
  logging:
    level: "INFO"
    format: "json" # json | console
    pii_redaction:
      enabled: true
      keys: ["password", "token", "secret", "credit_card", "ssn"]
    outputs:
      - type: "console"
      - type: "file"
        path: "/var/log/nexora/runtime.log font-mono"
        max_size_mb: 50
        max_backups: 5`,
    errorHandling: [
      'Fallback to basic stderr output if file logging sink suffers IO block',
      'Buffer log records in memory up to 10MB during remote log collector disconnection'
    ],
    testingStrategy: [
      'Inspect JSON output string matching expected schema during unit tests',
      'Assert that sensitive fields like "password" are transformed to "***REDACTED***"'
    ],
    securityConsiderations: [
      'Sanitize all user-input strings in log messages to prevent Log Injection / ANSI escape attacks',
      'Strict disk permissions (0600) on local rotated log files'
    ],
    performanceConsiderations: [
      'Asynchronous non-blocking buffer flush prevents I/O stalling main execution loop',
      'Zero-allocation string interpolation using pre-allocated memory pools'
    ],
    consumers: [
      { productId: 'forge', productName: 'NEXORA Forge', usageDescription: 'Formatted CLI output & verbose diagnostic logs', status: 'ACTIVE' },
      { productId: 'sdk', productName: 'NEXORA SDK', usageDescription: 'Client SDK telemetry & HTTP request tracing', status: 'ACTIVE' },
      { productId: 'studio', productName: 'NEXORA Studio', usageDescription: 'Console log streaming for live app preview', status: 'ACTIVE' },
      { productId: 'platform', productName: 'NEXORA Platform', usageDescription: 'Enterprise audit logging & security compliance stream', status: 'CORE_DEPENDENCY' },
      { productId: 'core', productName: 'NEXORA CORE', usageDescription: 'Kernel event logging & container lifecycle traces', status: 'CORE_DEPENDENCY' },
      { productId: 'knowledge', productName: 'Knowledge Portal', usageDescription: 'Indexing pipeline activity logs', status: 'ACTIVE' }
    ]
  },
  {
    id: 'srf-eventbus',
    code: 'SRF-EVB-03',
    name: 'Event Bus',
    category: 'INTEGRATION_SCHEDULING',
    tagline: 'High-throughput async event publisher/subscriber with DLQ & event replay',
    responsibilities: [
      'Provide in-memory and distributed event publishing (Redis PubSub / RabbitMQ / Kafka / NATS)',
      'Guarantee idempotent event processing with correlation ID deduplication',
      'Manage Dead Letter Queues (DLQ) for failed event subscriber execution after max retries',
      'Support event replay for historical state reconstruction and auditing',
      'Enforce strongly typed Event Schemas with backward/forward compatibility rules'
    ],
    interfaces: [
      {
        name: 'EventPublisher',
        signature: 'publish<T>(topic: string, event: DomainEvent<T>): Promise<void>',
        description: 'Publishes a domain event to all registered local and remote subscribers',
        codeExample: `import { eventBus } from '@nexora/srf-eventbus';

await eventBus.publish('user.created', {
  eventId: 'evt-8812',
  tenantId: 'tenant-01',
  timestamp: new Date().toISOString(),
  payload: { userId: 'usr-102', email: 'dev@nexora.io' }
});`
      },
      {
        name: 'EventSubscriber',
        signature: 'subscribe<T>(topic: string, handler: EventHandler<T>): Subscription',
        description: 'Registers an asynchronous handler function for a specific event topic',
        codeExample: `eventBus.subscribe('user.created', async (event) => {
  await sendWelcomeEmail(event.payload.email);
});`
      }
    ],
    dependencies: ['Logging Service', 'Validation Framework'],
    extensionPoints: [
      'Message Transport Adapter (e.g., KafkaDriver, NatsDriver, RedisDriver)',
      'Custom DLQ Handling Middleware'
    ],
    configurationYaml: `srf:
  event_bus:
    driver: "redis" # memory | redis | kafka | nats
    redis:
      url: "redis://redis.nexora.internal:6379/0"
    dlq:
      enabled: true
      max_retries: 3
      backoff_ms: 1000
      dlq_topic: "nexora.system.dlq"`,
    errorHandling: [
      'Automatically divert failing events to DLQ after exponential backoff retries fail',
      'Emit system alerts when DLQ message count exceeds threshold (> 50 messages)'
    ],
    testingStrategy: [
      'Use memory event bus transport in unit test suites for deterministic execution',
      'Simulate subscriber throwing exceptions to verify DLQ retry escalation'
    ],
    securityConsiderations: [
      'Sign event payloads with HMAC SHA-256 to ensure event origin authenticity',
      'Topic level authorization checks preventing unauthorized tenants from subscribing to system topics'
    ],
    performanceConsiderations: [
      'Batch publishing support for high-volume telemetry events (> 50,000 evt/sec)',
      'Zero-copy payload serialization when running on in-process memory channel'
    ],
    consumers: [
      { productId: 'forge', productName: 'NEXORA Forge', usageDescription: 'Emits build lifecycle events (pre-build, post-build)', status: 'ACTIVE' },
      { productId: 'platform', productName: 'NEXORA Platform', usageDescription: 'Orchestrates cross-service domain events across tenants', status: 'CORE_DEPENDENCY' },
      { productId: 'analytics', productName: 'Analytics Platform', usageDescription: 'Consumes all system events for real-time aggregation', status: 'CORE_DEPENDENCY' },
      { productId: 'automation', productName: 'Automation Platform', usageDescription: 'Triggers workflow actions on incoming domain events', status: 'ACTIVE' },
      { productId: 'mining', productName: 'Mining Platform', usageDescription: 'Dispatches telemetry & compute job state changes', status: 'ACTIVE' }
    ]
  },
  {
    id: 'srf-plugin',
    code: 'SRF-PLG-04',
    name: 'Plugin Runtime',
    category: 'CORE_PLATFORM',
    tagline: 'Dynamic plugin discovery, sandboxed execution & dependency validation',
    responsibilities: [
      'Scan workspace and extension registries for compatible NEXORA plugin packages',
      'Validate plugin manifest version constraints against core runtime host version',
      'Isolate plugin execution contexts to prevent memory leaks or security breaches',
      'Manage complete plugin lifecycle (discover -> validate -> load -> enable -> disable -> unload)',
      'Expose extension points and hooks for plugins to augment UI, CLI, and API layers'
    ],
    interfaces: [
      {
        name: 'PluginRegistry',
        signature: 'registerPlugin(plugin: NexoraPlugin): Promise<PluginLoadResult>',
        description: 'Validates and mounts a plugin instance into the active host runtime',
        codeExample: `import { pluginRuntime } from '@nexora/srf-plugin';

const result = await pluginRuntime.loadFromDirectory('./plugins/custom-generator');
console.log('Plugin status:', result.status);`
      }
    ],
    dependencies: ['Configuration Service', 'Security Runtime', 'Logging Service'],
    extensionPoints: [
      'Plugin Hook System (e.g., registerCliCommand, registerApiRoute, registerUiTab)',
      'Custom Sandbox Isolator'
    ],
    configurationYaml: `srf:
  plugin_runtime:
    plugin_directories:
      - "/var/nexora/plugins"
      - "./node_modules/@nexora-plugins"
    auto_enable: true
    strict_version_check: true
    sandbox:
      timeout_ms: 10000
      max_memory_mb: 256`,
    errorHandling: [
      'Isolate crashing plugin without taking down the host process',
      'Auto-disable plugins that breach memory limits or throw uncaught exceptions'
    ],
    testingStrategy: [
      'Verify host runtime rejects plugins with mismatched API major version numbers',
      'Test plugin hook registration and event listener cleanup upon unloading'
    ],
    securityConsiderations: [
      'Digital signature verification on all loaded plugin binaries/packages',
      'Restricted permissions preventing plugins from accessing host filesystem outside designated workdirs'
    ],
    performanceConsiderations: [
      'Lazy dynamic importing on demand rather than eager loading all plugins at boot',
      'Shared memory buffers for inter-plugin data exchange'
    ],
    consumers: [
      { productId: 'forge', productName: 'NEXORA Forge', usageDescription: 'Loads third-party code generator plugins', status: 'CORE_DEPENDENCY' },
      { productId: 'studio', productName: 'NEXORA Studio', usageDescription: 'Renders custom widget & extensions tabs', status: 'ACTIVE' },
      { productId: 'marketplace', productName: 'Marketplace', usageDescription: 'Validates and executes community extension packages', status: 'CORE_DEPENDENCY' },
      { productId: 'sigs', productName: 'SIGS Platform', usageDescription: 'Loads domain-specific intelligence modules', status: 'ACTIVE' }
    ]
  },
  {
    id: 'srf-security',
    code: 'SRF-SEC-05',
    name: 'Security Runtime',
    category: 'SECURITY_GOVERNANCE',
    tagline: 'JWT authentication, API key validation, RBAC/ABAC authorization & cryptography',
    responsibilities: [
      'Validate JWT access tokens and OAuth2 Bearer headers asynchronously',
      'Enforce Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) policies',
      'Provide cryptographically secure password hashing (Argon2id / bcrypt) and key generation',
      'Manage API key verification with rate limiting and scope validation',
      'Encrypt sensitive data at rest using AES-256-GCM envelope encryption'
    ],
    interfaces: [
      {
        name: 'AuthValidator',
        signature: 'validateToken(token: string): Promise<UserClaims>',
        description: 'Verifies signature and expiration of incoming authentication token',
        codeExample: `import { security } from '@nexora/srf-security';

const claims = await security.auth.verifyToken(authHeader);
if (!security.rbac.hasPermission(claims, 'domain:write')) {
  throw new ForbiddenError('Insufficient permissions');
}`
      },
      {
        name: 'CryptoUtil',
        signature: 'encrypt(data: Buffer, key: Buffer): EncryptedPayload',
        description: 'Encrypts binary data using AES-256-GCM with authenticated tag',
        codeExample: `const encrypted = security.crypto.encrypt(sensitiveBuffer, masterKey);`
      }
    ],
    dependencies: ['Configuration Service', 'Logging Service'],
    extensionPoints: [
      'Custom Identity Provider Driver (e.g., Keycloak, Okta, Firebase Auth, Auth0)',
      'Custom ABAC Policy Evaluator Engine'
    ],
    configurationYaml: `srf:
  security:
    jwt:
      issuer: "https://auth.nexora.io"
      audience: "nexora-api"
      algorithms: ["RS256", "EdDSA"]
      jwks_uri: "https://auth.nexora.io/.well-known/jwks.json"
    encryption:
      algorithm: "AES-256-GCM"
      key_rotation_days: 90
    rate_limiting:
      api_keys_per_min: 1000`,
    errorHandling: [
      'Return HTTP 401 Unauthorized for expired or malformed JWT tokens with zero internal details exposed',
      'Return HTTP 403 Forbidden when RBAC evaluation fails'
    ],
    testingStrategy: [
      'Generate mock RSA keypair in tests to issue and verify valid test tokens',
      'Test tamper detection on ciphertext modified by 1 byte during AES-GCM decryption'
    ],
    securityConsiderations: [
      'Zeroize cryptographic keys in memory immediately after operation completes',
      'Constant-time comparison algorithms for token hashes to eliminate timing attacks'
    ],
    performanceConsiderations: [
      'In-memory public key caching for JWKS to avoid remote HTTP roundtrips',
      'Hardware-accelerated AES-NI CPU instructions for symmetric encryption'
    ],
    consumers: [
      { productId: 'forge', productName: 'NEXORA Forge', usageDescription: 'Authenticates CLI sessions & developer API tokens', status: 'ACTIVE' },
      { productId: 'sdk', productName: 'NEXORA SDK', usageDescription: 'Attaches authorization headers & manages local refresh tokens', status: 'ACTIVE' },
      { productId: 'platform', productName: 'NEXORA Platform', usageDescription: 'Central identity gateway & tenant isolation enforcement', status: 'CORE_DEPENDENCY' },
      { productId: 'core', productName: 'NEXORA CORE', usageDescription: 'Kernel security boundary & inter-service TLS verification', status: 'CORE_DEPENDENCY' },
      { productId: 'marketplace', productName: 'Marketplace', usageDescription: 'Verifies developer submission permissions & digital signatures', status: 'ACTIVE' }
    ]
  },
  {
    id: 'srf-cache',
    code: 'SRF-CSH-06',
    name: 'Cache Layer',
    category: 'DATA_STORAGE_CACHE',
    tagline: 'Multi-level memory & Redis caching with TTL, tags & pattern invalidation',
    responsibilities: [
      'Provide L1 (In-Memory LRU) and L2 (Distributed Redis) multi-tier caching abstractions',
      'Support cache tagging for bulk invalidation of related domain entities',
      'Prevent cache stampede / thundering herd problem using locking cache miss handlers',
      'Manage TTL policies, eviction strategies, and compression for large cached objects',
      'Offer transparent decorator/wrapper annotations for seamless method caching'
    ],
    interfaces: [
      {
        name: 'CacheManager',
        signature: 'getOrSet<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds: number): Promise<T>',
        description: 'Retrieves item from cache, or invokes fetch function on miss and stores result',
        codeExample: `import { cache } from '@nexora/srf-cache';

const userProfile = await cache.getOrSet('user:usr-102', async () => {
  return await db.users.find('usr-102');
}, 300); // 5 minutes TTL`
      }
    ],
    dependencies: ['Configuration Service', 'Logging Service'],
    extensionPoints: [
      'Cache Backend Adapter (e.g., RedisClusterDriver, MemcachedDriver, MemoryDriver)'
    ],
    configurationYaml: `srf:
  cache:
    default_ttl: 300
    l1_memory:
      max_items: 10000
    l2_redis:
      enabled: true
      cluster_nodes: ["redis-1.nexora:6379", "redis-2.nexora:6379"]
      key_prefix: "srf:"`,
    errorHandling: [
      'Gracefully degrade to DB query if Redis cache cluster experiences connection loss',
      'Log warning when cache hit ratio drops below 60%'
    ],
    testingStrategy: [
      'Test LRU eviction policy when capacity threshold is reached',
      'Verify cache invalidation by tag purges all tagged keys across L1 and L2'
    ],
    securityConsiderations: [
      'Encrypt sensitive values stored in Redis L2 cache',
      'Isolate tenant keys using prefix namespaces (e.g., `tenant:tenantId:key`)'
    ],
    performanceConsiderations: [
      'L1 memory cache lookup response time < 0.1ms',
      'Binary serialization (Protobuf / MessagePack) to minimize network payload'
    ],
    consumers: [
      { productId: 'platform', productName: 'NEXORA Platform', usageDescription: 'Caches tenant profiles & global metadata', status: 'CORE_DEPENDENCY' },
      { productId: 'core', productName: 'NEXORA CORE', usageDescription: 'Caches compiled domain schemas & route tables', status: 'CORE_DEPENDENCY' },
      { productId: 'knowledge', productName: 'Knowledge Portal', usageDescription: 'Caches rendered documentation articles & search results', status: 'ACTIVE' },
      { productId: 'analytics', productName: 'Analytics Platform', usageDescription: 'Caches frequent query aggregations', status: 'ACTIVE' }
    ]
  },
  {
    id: 'srf-validation',
    code: 'SRF-VAL-07',
    name: 'Validation Framework',
    category: 'CORE_PLATFORM',
    tagline: 'Schema validation, DTO constraints, and domain rule assertion engine',
    responsibilities: [
      'Provide declarative schema definition for HTTP body, query params, and DTO objects',
      'Execute business rule validation pipelines with detailed field-level error output',
      'Cross-field validation support (e.g., endDate must be after startDate)',
      'Sanitize string inputs to prevent XSS and SQL Injection vulnerabilities',
      'Support dynamic custom rule registration'
    ],
    interfaces: [
      {
        name: 'ValidatorEngine',
        signature: 'validate<T>(schema: Schema<T>, input: unknown): ValidationResult<T>',
        description: 'Validates unknown input against defined schema and returns sanitized typed object or error list',
        codeExample: `import { validator, s } from '@nexora/srf-validation';

const UserSchema = s.object({
  email: s.string().email(),
  age: s.number().min(18)
});

const result = validator.validate(UserSchema, req.body);
if (!result.success) {
  return res.status(400).json(result.errors);
}`
      }
    ],
    dependencies: ['Logging Service'],
    extensionPoints: [
      'Custom Validation Rule Function Generator'
    ],
    configurationYaml: `srf:
  validation:
    strict_unknown_keys: true
    auto_strip_nulls: false
    locale: "en"`,
    errorHandling: [
      'Return formatted JSON response detailing exact field paths and violation reasons'
    ],
    testingStrategy: [
      'Unit test boundary cases (min/max lengths, special characters, null values)'
    ],
    securityConsiderations: [
      'Strip unknown properties from request bodies to prevent mass assignment exploits',
      'Enforce maximum input string lengths to mitigate buffer overflow / ReDoS attacks'
    ],
    performanceConsiderations: [
      'Pre-compiled validation functions for maximum execution speed (> 500k val/sec)'
    ],
    consumers: [
      { productId: 'forge', productName: 'NEXORA Forge', usageDescription: 'Validates CLI argument flags & manifest files', status: 'CORE_DEPENDENCY' },
      { productId: 'sdk', productName: 'NEXORA SDK', usageDescription: 'Client-side payload validation before API request dispatch', status: 'ACTIVE' },
      { productId: 'platform', productName: 'NEXORA Platform', usageDescription: 'Validates all REST/gRPC API ingress payloads', status: 'CORE_DEPENDENCY' },
      { productId: 'studio', productName: 'NEXORA Studio', usageDescription: 'Validates form entries in visual editors', status: 'ACTIVE' }
    ]
  },
  {
    id: 'srf-observability',
    code: 'SRF-OBS-08',
    name: 'Observability & Diagnostics',
    category: 'OBSERVABILITY_DIAGNOSTICS',
    tagline: 'OpenTelemetry tracing, Prometheus metrics, health checks & runtime diagnostics',
    responsibilities: [
      'Collect system and application metrics (CPU, memory, HTTP latency, DB pool depth)',
      'Provide OpenTelemetry distributed tracing across HTTP and Event Bus microservice calls',
      'Expose standard health endpoints (/health/liveness, /health/readiness, /health/diagnostics)',
      'Generate automated crash dumps and memory diagnostic profiles',
      'Export metrics in Prometheus pull format and OpenTelemetry OTLP push format'
    ],
    interfaces: [
      {
        name: 'MetricsCollector',
        signature: 'counter.inc(name: string, value?: number, labels?: Record<string, string>): void',
        description: 'Increments a Prometheus metric counter with associated label metadata',
        codeExample: `import { metrics, tracer } from '@nexora/srf-observability';

metrics.counter('http_requests_total', 1, { method: 'POST', status: '200' });

await tracer.startSpan('database_query', async () => {
  return await db.query();
});`
      },
      {
        name: 'HealthCheckRegistry',
        signature: 'registerHealthCheck(name: string, checkFn: () => Promise<HealthCheckStatus>): void',
        description: 'Registers a subsystem health probe for readiness/liveness evaluation',
        codeExample: `health.registerReadiness('database', async () => {
  const isAlive = await db.ping();
  return isAlive ? HealthCheckStatus.HEALTHY : HealthCheckStatus.UNHEALTHY;
});`
      }
    ],
    dependencies: ['Configuration Service', 'Logging Service'],
    extensionPoints: [
      'Custom OTLP Exporter Target',
      'Custom Health Probe Driver'
    ],
    configurationYaml: `srf:
  observability:
    service_name: "nexora-core"
    prometheus:
      enabled: true
      port: 9090
      path: "/metrics"
    otlp:
      endpoint: "http://otlp-collector.nexora.internal:4317"
    tracing:
      sample_rate: 1.0`,
    errorHandling: [
      'Silently drop trace telemetry if remote collector fails to avoid blocking main thread'
    ],
    testingStrategy: [
      'Assert metrics registry contains expected counter and histogram samples during tests'
    ],
    securityConsiderations: [
      'Sanitize URLs in trace spans to avoid leaking secret tokens in query strings',
      'Restrict /metrics and /health endpoints via network policies or bearer tokens'
    ],
    performanceConsiderations: [
      'Asynchronous batching of OTLP spans to reduce network socket operations'
    ],
    consumers: [
      { productId: 'core', productName: 'NEXORA CORE', usageDescription: 'Monitors kernel health & thread pools', status: 'CORE_DEPENDENCY' },
      { productId: 'platform', productName: 'NEXORA Platform', usageDescription: 'Monitors HTTP route latencies & microservice health', status: 'CORE_DEPENDENCY' },
      { productId: 'mining', productName: 'Mining Platform', usageDescription: 'Tracks compute cluster utilization & worker node state', status: 'CORE_DEPENDENCY' },
      { productId: 'analytics', productName: 'Analytics Platform', usageDescription: 'Monitors pipeline throughput metrics', status: 'ACTIVE' }
    ]
  },
  {
    id: 'srf-featureflag',
    code: 'SRF-FLG-09',
    name: 'Feature Flag System',
    category: 'INTEGRATION_SCHEDULING',
    tagline: 'Global, tenant & percentage-based rollout system with scheduled activations',
    responsibilities: [
      'Evaluate feature flag state in real-time for specific user, tenant, or environment contexts',
      'Support percentage-based gradual rollouts using deterministic hash ring math',
      'Allow scheduled flag activation/deactivation without code redeployments',
      'Support tenant-level and user-segment overrides for beta tester groups',
      'Emit telemetry events when flags are evaluated for A/B testing analytics'
    ],
    interfaces: [
      {
        name: 'FeatureFlagClient',
        signature: 'isEnabled(flagKey: string, context?: EvaluationContext): Promise<boolean>',
        description: 'Determines if a feature flag is active for the given evaluation context',
        codeExample: `import { featureFlags } from '@nexora/srf-featureflag';

const isNewUiEnabled = await featureFlags.isEnabled('flag-new-editor-v2', {
  tenantId: 'tenant-102',
  userId: 'usr-881'
});

if (isNewUiEnabled) {
  renderV2Editor();
}`
      }
    ],
    dependencies: ['Configuration Service', 'Cache Layer', 'Logging Service'],
    extensionPoints: [
      'Feature Flag Backend Adapter (e.g., LaunchDarkly, Unleash, LocalConfigDriver)'
    ],
    configurationYaml: `srf:
  feature_flags:
    provider: "unleash" # local | unleash | launchdarkly
    poll_interval_seconds: 30
    local_defaults:
      flag-new-editor-v2: true
      flag-ai-copilot-beta: false`,
    errorHandling: [
      'Fallback to local safety default boolean if flag evaluation service times out'
    ],
    testingStrategy: [
      'Mock feature flag state map in test context to test both flag enabled and disabled code paths'
    ],
    securityConsiderations: [
      'Ensure context evaluated on client side does not leak sensitive internal flag keys'
    ],
    performanceConsiderations: [
      'Local in-memory evaluation (< 0.05ms) backed by background polling updates'
    ],
    consumers: [
      { productId: 'studio', productName: 'NEXORA Studio', usageDescription: 'Controls visual feature availability per subscription tier', status: 'ACTIVE' },
      { productId: 'platform', productName: 'NEXORA Platform', usageDescription: 'Manages tenant-level feature entitlements', status: 'CORE_DEPENDENCY' },
      { productId: 'ai', productName: 'AI Platform', usageDescription: 'Controls canary rollout of new AI model versions', status: 'ACTIVE' },
      { productId: 'forge', productName: 'NEXORA Forge', usageDescription: 'Enables experimental CLI command flags', status: 'ACTIVE' }
    ]
  },
  {
    id: 'srf-scheduler',
    code: 'SRF-SCH-10',
    name: 'Scheduler Service',
    category: 'INTEGRATION_SCHEDULING',
    tagline: 'Cron jobs, distributed background tasks, delayed queues & retry policies',
    responsibilities: [
      'Schedule periodic tasks using standard 5-part cron syntax',
      'Distribute task execution across cluster nodes with distributed locking to prevent duplicate execution',
      'Support delayed job queues (e.g., run task X in 2 hours)',
      'Configurable retry policies with exponential backoff and jitter',
      'Track execution status, history logs, and duration metrics for all scheduled jobs'
    ],
    interfaces: [
      {
        name: 'CronScheduler',
        signature: 'schedule(cronExpr: string, taskName: string, handler: TaskHandler): JobHandle',
        description: 'Registers a recurring cron job with distributed locking support',
        codeExample: `import { scheduler } from '@nexora/srf-scheduler';

scheduler.schedule('0 0 * * *', 'daily_data_cleanup', async () => {
  await db.logs.purgeOldRecords(30);
});`
      }
    ],
    dependencies: ['Cache Layer (Distributed Locking)', 'Logging Service'],
    extensionPoints: [
      'Task Store Driver (e.g., RedisBullDriver, PostgresQuartzDriver)'
    ],
    configurationYaml: `srf:
  scheduler:
    driver: "redis"
    concurrency: 10
    lock_ttl_ms: 60000`,
    errorHandling: [
      'Execute retry policy up to max attempts before marking job as FAILED and triggering alert'
    ],
    testingStrategy: [
      'Manual immediate trigger execution during test runs without waiting for real cron ticks'
    ],
    securityConsiderations: [
      'Authorize job trigger endpoints so only internal admin service can manually kick off tasks'
    ],
    performanceConsiderations: [
      'Non-blocking async worker pool execution with bounded memory queue limits'
    ],
    consumers: [
      { productId: 'core', productName: 'NEXORA CORE', usageDescription: 'Runs periodic garbage collection & state syncing', status: 'CORE_DEPENDENCY' },
      { productId: 'analytics', productName: 'Analytics Platform', usageDescription: 'Runs nightly aggregation & reporting tasks', status: 'ACTIVE' },
      { productId: 'automation', productName: 'Automation Platform', usageDescription: 'Executes timed workflow triggers', status: 'CORE_DEPENDENCY' }
    ]
  },
  {
    id: 'srf-storage',
    code: 'SRF-STO-11',
    name: 'File Storage Service',
    category: 'DATA_STORAGE_CACHE',
    tagline: 'Unified storage abstraction for Local Disk, S3, Azure Blob & Google Cloud Storage',
    responsibilities: [
      'Provide provider-agnostic file operations (upload, download, stream, delete, exists)',
      'Generate secure presigned upload/download URLs with expiring signatures',
      'Automatic mime-type detection and stream checksum verification (SHA-256)',
      'Support image/file metadata extraction and thumbnail generation hooks',
      'Manage multi-part chunked uploads for large binary files (> 100MB)'
    ],
    interfaces: [
      {
        name: 'StorageProvider',
        signature: 'upload(key: string, data: Buffer | Readable, options?: UploadOptions): Promise<StorageObject>',
        description: 'Uploads a file object to the configured storage backend',
        codeExample: `import { storage } from '@nexora/srf-storage';

const result = await storage.upload('artifacts/build-991.zip', zipBuffer, {
  contentType: 'application/zip',
  public: false
});

const downloadUrl = await storage.getPresignedUrl('artifacts/build-991.zip', 3600);`
      }
    ],
    dependencies: ['Configuration Service', 'Logging Service'],
    extensionPoints: [
      'Storage Driver Implementation (S3Driver, GcsDriver, AzureBlobDriver, LocalDiskDriver)'
    ],
    configurationYaml: `srf:
  storage:
    provider: "s3" # local | s3 | gcs | azure
    s3:
      bucket: "nexora-cloud-artifacts"
      region: "us-east-1"
      endpoint: "https://s3.amazonaws.com"`,
    errorHandling: [
      'Catch storage provider socket exceptions and retry upload chunks up to 3 times'
    ],
    testingStrategy: [
      'Use memory mock or local temporary directory driver in test suites'
    ],
    securityConsiderations: [
      'Enforce server-side encryption (SSE-S3 / SSE-KMS) for stored objects',
      'Prevent path traversal attacks by sanitizing object keys'
    ],
    performanceConsiderations: [
      'Stream large files directly from HTTP socket to cloud storage without buffering entirely in RAM'
    ],
    consumers: [
      { productId: 'forge', productName: 'NEXORA Forge', usageDescription: 'Stores compiled artifact bundles & binaries', status: 'CORE_DEPENDENCY' },
      { productId: 'studio', productName: 'NEXORA Studio', usageDescription: 'Stores app visual screenshots & media assets', status: 'ACTIVE' },
      { productId: 'knowledge', productName: 'Knowledge Portal', usageDescription: 'Stores attachment files & media graphics', status: 'ACTIVE' }
    ]
  },
  {
    id: 'srf-notification',
    code: 'SRF-NTF-12',
    name: 'Notification Runtime',
    category: 'INTEGRATION_SCHEDULING',
    tagline: 'Multi-channel dispatch: Email, SMS, WhatsApp, Push, In-App & Webhooks',
    responsibilities: [
      'Dispatch messages across multiple transport channels (Email, SMS, WhatsApp, Webhook, In-App)',
      'Manage HTML/Text template rendering using dynamic variable interpolation',
      'Handle webhook delivery retries with HMAC signature headers for payload verification',
      'Batch notifications and apply frequency cap rate limits per user',
      'Track delivery receipts and bounce/complaint status callbacks'
    ],
    interfaces: [
      {
        name: 'NotificationDispatcher',
        signature: 'send(notification: NotificationRequest): Promise<DeliveryReport>',
        description: 'Dispatches notification payload to target recipient over requested channels',
        codeExample: `import { notification } from '@nexora/srf-notification';

await notification.send({
  channels: ['email', 'in_app'],
  recipientId: 'usr-902',
  templateId: 'tpl_welcome_user',
  data: { name: 'Alex' }
});`
      }
    ],
    dependencies: ['Configuration Service', 'Event Bus', 'Logging Service'],
    extensionPoints: [
      'Channel Driver Adapter (SendGridDriver, TwilioDriver, FirebaseFcmDriver, WebhookDriver)'
    ],
    configurationYaml: `srf:
  notification:
    providers:
      email:
        driver: "sendgrid"
        from: "no-reply@nexora.io"
      sms:
        driver: "twilio"
    webhooks:
      timeout_ms: 5000
      max_retries: 5`,
    errorHandling: [
      'Route failed notification attempts to Event Bus DLQ for auditing and manual retry'
    ],
    testingStrategy: [
      'Use mock transport sink in tests to capture sent notifications without triggering real emails'
    ],
    securityConsiderations: [
      'Sign Webhook HTTP requests with SHA-256 HMAC headers so receivers can authenticate payloads'
    ],
    performanceConsiderations: [
      'Asynchronous background message queue processing to ensure zero latency impact on HTTP API'
    ],
    consumers: [
      { productId: 'platform', productName: 'NEXORA Platform', usageDescription: 'Sends account security alerts & password resets', status: 'CORE_DEPENDENCY' },
      { productId: 'automation', productName: 'Automation Platform', usageDescription: 'Triggers external webhook calls & Slack alerts', status: 'CORE_DEPENDENCY' },
      { productId: 'marketplace', productName: 'Marketplace', usageDescription: 'Sends plugin purchase & update receipts', status: 'ACTIVE' }
    ]
  },
  {
    id: 'srf-ai',
    code: 'SRF-AIR-13',
    name: 'AI Runtime & RAG Infrastructure',
    category: 'AI_RUNTIME_ENGINES',
    tagline: 'Prompt registry, Model abstraction, RAG pipeline, Vector store & Agent execution',
    responsibilities: [
      'Unified provider-agnostic abstraction layer across Gemini, OpenAI, Claude & Local LLMs',
      'Manage centralized Prompt Registry with template versioning, variables & temperature controls',
      'Maintain conversation context history with automated sliding-window token truncation',
      'Vector Store abstraction (pgvector, Pinecone, Qdrant) for fast semantic search',
      'RAG Runtime pipeline: Document Chunking -> Embedding -> Hybrid Retrieval -> Context Synthesis',
      'Agent Registry & Execution Engine supporting tool calling / function invocation loops'
    ],
    interfaces: [
      {
        name: 'AiClient',
        signature: 'generateText(promptId: string, variables: Record<string, any>): Promise<AiResponse>',
        description: 'Executes a managed prompt template against the configured default LLM provider',
        codeExample: `import { aiRuntime } from '@nexora/srf-ai';

const response = await aiRuntime.generateText('prompt_code_explanation', {
  codeSnippet: 'function hello() { return "world"; }',
  targetLanguage: 'Python'
});

console.log('AI Output:', response.text);`
      },
      {
        name: 'RagEngine',
        signature: 'queryRag(query: string, options?: RagOptions): Promise<RagResult>',
        description: 'Performs semantic vector search and synthesizes augmented answer with citations',
        codeExample: `const ragResult = await aiRuntime.rag.query('How do I configure Redis cache in NEXORA?', {
  collection: 'nexora_docs',
  topK: 3
});`
      }
    ],
    dependencies: ['Configuration Service', 'Security Runtime', 'Cache Layer', 'Logging Service'],
    extensionPoints: [
      'LLM Provider Adapter (GeminiAdapter, OpenAIAdapter, AnthropicAdapter, OllamaAdapter)',
      'Vector Store Driver (PgVectorDriver, PineconeDriver, QdrantDriver)',
      'Custom Agent Tool Provider'
    ],
    configurationYaml: `srf:
  ai_runtime:
    default_provider: "gemini"
    gemini:
      model: "gemini-2.5-flash"
      max_tokens: 2048
    vector_store:
      driver: "pgvector"
      embedding_model: "text-embedding-004"
      dimension: 768
    prompt_registry:
      sync_remote: true`,
    errorHandling: [
      'Fallback to secondary model provider (e.g., Gemini Flash -> Gemini Pro or Local LLM) if primary provider experiences rate limit (429) or outage (503)'
    ],
    testingStrategy: [
      'Mock LLM provider responses using mock vector embeddings for fast deterministic test suites'
    ],
    securityConsiderations: [
      'Sanitize prompt inputs to prevent Prompt Injection attacks',
      'Redact PII data before passing payload to external AI LLM API endpoints'
    ],
    performanceConsiderations: [
      'Semantic caching of vector embeddings to eliminate duplicate LLM embedding generation calls',
      'Streaming responses (Server-Sent Events / WebSockets) for real-time text output UI rendering'
    ],
    consumers: [
      { productId: 'ai', productName: 'AI Platform', usageDescription: 'Core engine powering all AI agent workflows & orchestration', status: 'CORE_DEPENDENCY' },
      { productId: 'forge', productName: 'NEXORA Forge', usageDescription: 'Powers AI CLI copilot & code generation commands', status: 'CORE_DEPENDENCY' },
      { productId: 'studio', productName: 'NEXORA Studio', usageDescription: 'Powers visual app scaffolding & component suggestions', status: 'ACTIVE' },
      { productId: 'knowledge', productName: 'Knowledge Portal', usageDescription: 'Powers semantic documentation search & AI Q&A', status: 'ACTIVE' },
      { productId: 'sigs', productName: 'SIGS Platform', usageDescription: 'Powers domain intelligence analysis & summary generation', status: 'ACTIVE' }
    ]
  }
];

export const SRF_ARCHITECTURE_LAYERS: SrfArchitectureLayer[] = [
  {
    id: 'layer-products',
    title: 'LAYER 1: NEXORA PRODUCTS SUITE (12 Products)',
    subtitle: 'NEXORA Forge | SDK | Studio | Platform | CORE | Analytics | Automation | Mining | Marketplace | SIGS | Knowledge | AI Platform',
    color: '#38bdf8',
    services: ['Forge', 'SDK', 'Studio', 'Platform', 'CORE', 'Analytics', 'Automation', 'Mining', 'Marketplace', 'SIGS', 'Knowledge', 'AI Platform'],
    description: 'Product Engineering layer. Consumes Shared Runtime Foundation services via typed SDK drivers without duplicating infrastructure code.'
  },
  {
    id: 'layer-ai-integration',
    title: 'LAYER 2: AI & EXTENSION RUNTIME',
    subtitle: 'AI Runtime (Prompt/Model Registry, RAG, Agents) & Plugin Runtime',
    color: '#a855f7',
    services: ['AI Runtime & RAG Infrastructure', 'Plugin Runtime'],
    description: 'High-level runtime services providing AI capabilities, model registry, vector search, and dynamic plugin sandboxing.'
  },
  {
    id: 'layer-integrations',
    title: 'LAYER 3: INTEGRATION & SCHEDULING RUNTIME',
    subtitle: 'Event Bus, Feature Flag System, Scheduler, Notification Runtime',
    color: '#10b981',
    services: ['Event Bus', 'Feature Flag System', 'Scheduler Service', 'Notification Runtime'],
    description: 'Async messaging, feature gating, recurring cron task execution, and multi-channel notifications.'
  },
  {
    id: 'layer-security-obs',
    title: 'LAYER 4: SECURITY & OBSERVABILITY RUNTIME',
    subtitle: 'Security Runtime (JWT/RBAC/Crypto) & Observability & Diagnostics (OpenTelemetry/Metrics)',
    color: '#f59e0b',
    services: ['Security Runtime', 'Observability & Diagnostics'],
    description: 'Enterprise governance boundary. Ensures cryptographically enforced auth/RBAC and full OpenTelemetry visibility.'
  },
  {
    id: 'layer-core-data',
    title: 'LAYER 5: CORE & DATA STORAGE FOUNDATION',
    subtitle: 'Configuration Service, Logging Service, Cache Layer, Validation Framework, File Storage Service',
    color: '#06b6d4',
    services: ['Configuration Service', 'Logging Service', 'Cache Layer', 'Validation Framework', 'File Storage Service'],
    description: 'Base runtime kernel. Provides immutable config loading, structured JSON logging, multi-tier cache, DTO validation, and storage.'
  }
];

export const SAMPLE_SRF_EVENTS = [
  {
    id: 'evt-1001',
    eventName: 'workspace.build.started',
    topic: 'nexora.forge.build',
    publisher: 'NEXORA Forge CLI',
    payloadJson: JSON.stringify({ buildId: 'bld-9821', target: 'production', module: 'auth-service' }, null, 2),
    correlationId: 'tr-8891-01',
    timestamp: '2026-08-01T12:00:01.120Z',
    status: 'DISPATCHED' as const
  },
  {
    id: 'evt-1002',
    eventName: 'tenant.provisioned',
    topic: 'nexora.platform.tenants',
    publisher: 'NEXORA Platform',
    payloadJson: JSON.stringify({ tenantId: 'tenant-482', plan: 'enterprise', region: 'eu-west-1' }, null, 2),
    correlationId: 'tr-8891-02',
    timestamp: '2026-08-01T12:01:15.400Z',
    status: 'ACKNOWLEDGED' as const
  },
  {
    id: 'evt-1003',
    eventName: 'ai.prompt.executed',
    topic: 'nexora.ai.execution',
    publisher: 'AI Platform',
    payloadJson: JSON.stringify({ promptId: 'prompt_code_gen', model: 'gemini-2.5-flash', tokens: 412 }, null, 2),
    correlationId: 'tr-8891-03',
    timestamp: '2026-08-01T12:02:30.850Z',
    status: 'ACKNOWLEDGED' as const
  },
  {
    id: 'evt-1004',
    eventName: 'plugin.installed',
    topic: 'nexora.marketplace.plugins',
    publisher: 'Marketplace',
    payloadJson: JSON.stringify({ pluginId: 'pkg-docker-deployer', version: '2.1.0', checksum: 'sha256-a89...' }, null, 2),
    correlationId: 'tr-8891-04',
    timestamp: '2026-08-01T12:03:10.010Z',
    status: 'ACKNOWLEDGED' as const
  }
];

export const SAMPLE_SRF_FLAGS: SrfFeatureFlag[] = [
  {
    key: 'flag-v2-editor',
    name: 'Next-Gen Visual App Editor',
    description: 'Enables real-time collaborative canvas in NEXORA Studio',
    type: 'PERCENTAGE',
    defaultValue: false,
    rolloutPercentage: 50,
    environmentRule: 'production',
    enabled: true
  },
  {
    key: 'flag-ai-rag-v2',
    name: 'RAG Hybrid Search Engine',
    description: 'Combines BM25 keyword matching with pgvector semantic embeddings',
    type: 'BOOLEAN',
    defaultValue: true,
    rolloutPercentage: 100,
    environmentRule: 'all',
    enabled: true
  },
  {
    key: 'flag-enterprise-sso',
    name: 'SAML 2.0 / OIDC Enterprise SSO',
    description: 'Restricted feature flag for Enterprise plan tenants',
    type: 'TENANT',
    defaultValue: false,
    rolloutPercentage: 0,
    environmentRule: 'tier == "enterprise"',
    enabled: true
  },
  {
    key: 'flag-mining-autoscale',
    name: 'Mining Compute Autoscaling',
    description: 'Dynamically spins up additional GPU compute pods based on queue depth',
    type: 'USER_SEGMENT',
    defaultValue: false,
    rolloutPercentage: 25,
    environmentRule: 'staging,production',
    enabled: false
  }
];

export const SAMPLE_SRF_PROMPTS: SrfAiPromptTemplate[] = [
  {
    id: 'prompt_code_explanation',
    name: 'Clean Code Explainer',
    version: '1.2.0',
    provider: 'GEMINI_FLASH',
    templateText: `You are an expert Chief Architect. Analyze the following {targetLanguage} code snippet and explain its architecture and memory usage in concise bullet points:

{codeSnippet}`,
    variables: ['targetLanguage', 'codeSnippet'],
    temperature: 0.2,
    maxTokens: 1024
  },
  {
    id: 'prompt_domain_scaffolder',
    name: 'DDD Entity & DTO Scaffolder',
    version: '2.0.0',
    provider: 'GEMINI_PRO',
    templateText: `Generate a clean Domain Driven Design entity and Pydantic DTO interface for the aggregate root "{entityName}" with properties: {fields}. Ensure strict field validation.`,
    variables: ['entityName', 'fields'],
    temperature: 0.1,
    maxTokens: 2048
  }
];
