import { SdkPackageSpec, SdkBenchmarkMetric, SdkFeatureFlag } from '../types/sdk';

export const NEXORA_SDK_VERSION = '0.1.0';

export const SDK_PACKAGES: SdkPackageSpec[] = [
  {
    id: 'sdk-config',
    name: 'nexora-config',
    version: NEXORA_SDK_VERSION,
    category: 'CORE_CONFIG',
    description: 'Unified hierarchical configuration loader supporting environment variables, YAML profiles, Vault secrets, and runtime feature flags.',
    pythonModulePath: 'nexora.config',
    tsModulePath: '@nexora/config',
    keyClassesAndFunctions: ['ConfigManager', 'load_profile()', 'get_secret()', 'FeatureFlagEvaluator'],
    dependencies: ['pydantic-settings', 'pyyaml', 'hvac'],
    testCoveragePercent: 100,
    pythonImplementation: `from pydantic import BaseModel, Field
from typing import Optional
import os, yaml

class NexoraConfig(BaseModel):
    environment: str = Field(default="production")
    app_name: str = Field(default="nexora-service")
    tenant_id: Optional[str] = None
    database_url: str = Field(default_factory=lambda: os.getenv("DATABASE_URL", "postgresql://localhost:5432/nexora"))

    @classmethod
    def load_from_env(cls) -> "NexoraConfig":
        return cls()`,
    tsImplementation: `import { z } from 'zod';

export const NexoraConfigSchema = z.object({
  environment: z.enum(['development', 'staging', 'production']).default('production'),
  appName: z.string().default('nexora-service'),
  tenantId: z.string().optional(),
  databaseUrl: z.string().default('postgresql://localhost:5432/nexora')
});

export type NexoraConfig = z.infer<typeof NexoraConfigSchema>;

export class ConfigManager {
  public static load(): NexoraConfig {
    return NexoraConfigSchema.parse({
      environment: process.env.NODE_ENV || 'production',
      appName: process.env.APP_NAME || 'nexora-service',
      tenantId: process.env.TENANT_ID,
      databaseUrl: process.env.DATABASE_URL
    });
  }
}`,
    unitTestExample: `def test_config_loader():
    config = NexoraConfig.load_from_env()
    assert config.environment in ["development", "staging", "production"]
    assert config.database_url is not None`
  },
  {
    id: 'sdk-logging',
    name: 'nexora-logging',
    version: NEXORA_SDK_VERSION,
    category: 'OBSERVABILITY',
    description: 'Structured JSON logger with automatic W3C tracecontext propagation, correlation IDs, and log sampling.',
    pythonModulePath: 'nexora.logging',
    tsModulePath: '@nexora/logging',
    keyClassesAndFunctions: ['NexoraLogger', 'get_logger()', 'LogContext', 'audit_event()'],
    dependencies: ['structlog', 'opentelemetry-api'],
    testCoveragePercent: 100,
    pythonImplementation: `import structlog, logging

def setup_logger(service_name: str):
    structlog.configure(
        processors=[
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.add_log_level,
            structlog.processors.JSONRenderer()
        ],
        logger_factory=structlog.PrintLoggerFactory()
    )
    return structlog.get_logger(service=service_name)`,
    tsImplementation: `export class NexoraLogger {
  constructor(private serviceName: string) {}

  public info(message: string, meta: Record<string, unknown> = {}) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: this.serviceName,
      message,
      ...meta
    }));
  }
}`,
    unitTestExample: `def test_json_logging(capsys):
    logger = setup_logger("test-service")
    logger.info("system_boot", version="0.1.0")
    captured = capsys.readouterr()
    assert "system_boot" in captured.out
    assert "test-service" in captured.out`
  },
  {
    id: 'sdk-exceptions',
    name: 'nexora-exceptions',
    version: NEXORA_SDK_VERSION,
    category: 'CORE_CONFIG',
    description: 'Enterprise exception hierarchy mapping cleanly to RFC 7807 Problem Details for all HTTP & gRPC errors.',
    pythonModulePath: 'nexora.exceptions',
    tsModulePath: '@nexora/exceptions',
    keyClassesAndFunctions: ['NexoraBaseException', 'ValidationError', 'NotFoundException', 'UnauthorizedError', 'to_rfc7807()'],
    dependencies: [],
    testCoveragePercent: 100,
    pythonImplementation: `class NexoraBaseException(Exception):
    def __init__(self, message: str, status_code: int = 500, error_code: str = "INTERNAL_ERROR"):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code

    def to_problem_details(self, instance: str = "") -> dict:
        return {
            "type": f"https://errors.nexora.io/{self.error_code.lower()}",
            "title": self.error_code,
            "status": self.status_code,
            "detail": self.message,
            "instance": instance
        }`,
    tsImplementation: `export class NexoraBaseException extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public errorCode: string = 'INTERNAL_ERROR'
  ) {
    super(message);
  }

  public toProblemDetails(instance: string = ''): Record<string, unknown> {
    return {
      type: \`https://errors.nexora.io/\${this.errorCode.toLowerCase()}\`,
      title: this.errorCode,
      status: this.statusCode,
      detail: this.message,
      instance
    };
  }
}`,
    unitTestExample: `def test_exception_rfc7807_mapping():
    err = NexoraBaseException("Workspace missing", status_code=404, error_code="WORKSPACE_NOT_FOUND")
    problem = err.to_problem_details("/v1/workspaces/ws-99")
    assert problem["status"] == 404
    assert problem["title"] == "WORKSPACE_NOT_FOUND"`
  },
  {
    id: 'sdk-events',
    name: 'nexora-events',
    version: NEXORA_SDK_VERSION,
    category: 'OBSERVABILITY',
    description: 'CloudEvents v1.0 publisher & consumer event bus abstraction for NATS JetStream, Kafka, and Redis.',
    pythonModulePath: 'nexora.events',
    tsModulePath: '@nexora/events',
    keyClassesAndFunctions: ['CloudEventBus', 'publish_event()', 'subscribe()', 'CloudEventSpec'],
    dependencies: ['cloudevents', 'nats-py'],
    testCoveragePercent: 100,
    pythonImplementation: `from cloudevents.http import CloudEvent
from typing import Callable, Dict

class EventBus:
    def __init__(self, service_name: str):
        self.service_name = service_name
        self.handlers: Dict[str, Callable] = {}

    def publish(self, topic: str, data: dict):
        attributes = {
            "type": topic,
            "source": f"nexora.{self.service_name}",
        }
        event = CloudEvent(attributes, data)
        return event`,
    tsImplementation: `export interface CloudEventWrapper<T> {
  specversion: '1.0';
  id: string;
  source: string;
  type: string;
  time: string;
  data: T;
}

export class EventBus {
  constructor(private serviceName: string) {}

  public createCloudEvent<T>(topic: string, payload: T): CloudEventWrapper<T> {
    return {
      specversion: '1.0',
      id: \`evt-\${Math.random().toString(36).substring(2, 9)}\`,
      source: \`nexora.\${this.serviceName}\`,
      type: topic,
      time: new Date().toISOString(),
      data: payload
    };
  }
}`,
    unitTestExample: `def test_cloud_event_creation():
    bus = EventBus("forge")
    evt = bus.publish("nexora.workspace.created", {"workspace_id": "ws-100"})
    assert evt["type"] == "nexora.workspace.created"
    assert "ws-100" in str(evt.data)`
  },
  {
    id: 'sdk-security',
    name: 'nexora-security',
    version: NEXORA_SDK_VERSION,
    category: 'SECURITY_AUTH',
    description: 'JWT validation, mTLS SPIFFE context parsing, RBAC permission matrix, and ABAC policy engine.',
    pythonModulePath: 'nexora.security',
    tsModulePath: '@nexora/security',
    keyClassesAndFunctions: ['JwtValidator', 'RbacEvaluator', 'SpiffeIdentity', 'has_permission()'],
    dependencies: ['pyjwt', 'cryptography'],
    testCoveragePercent: 100,
    pythonImplementation: `class RbacEvaluator:
    ROLE_PERMISSIONS = {
        "PLATFORM_ADMIN": ["*"],
        "WORKSPACE_ADMIN": ["workspace:read", "workspace:write", "workspace:delete"],
        "MEMBER": ["workspace:read", "workspace:write"],
        "VIEWER": ["workspace:read"]
    }

    @classmethod
    def has_permission(cls, user_role: str, required_permission: str) -> bool:
        perms = cls.ROLE_PERMISSIONS.get(user_role, [])
        return "*" in perms or required_permission in perms`,
    tsImplementation: `export class RbacEvaluator {
  private static ROLE_PERMISSIONS: Record<string, string[]> = {
    PLATFORM_ADMIN: ['*'],
    WORKSPACE_ADMIN: ['workspace:read', 'workspace:write', 'workspace:delete'],
    MEMBER: ['workspace:read', 'workspace:write'],
    VIEWER: ['workspace:read']
  };

  public static hasPermission(role: string, requiredPermission: string): boolean {
    const perms = this.ROLE_PERMISSIONS[role] || [];
    return perms.includes('*') || perms.includes(requiredPermission);
  }
}`,
    unitTestExample: `def test_rbac_permission_checks():
    assert RbacEvaluator.has_permission("PLATFORM_ADMIN", "workspace:delete") is True
    assert RbacEvaluator.has_permission("VIEWER", "workspace:write") is False`
  },
  {
    id: 'sdk-database',
    name: 'nexora-database',
    version: NEXORA_SDK_VERSION,
    category: 'DATA_PERSISTENCE',
    description: 'ORM abstraction & BaseRepository with built-in multi-tenant isolation, soft deletes, and transaction unit of work.',
    pythonModulePath: 'nexora.database',
    tsModulePath: '@nexora/database',
    keyClassesAndFunctions: ['BaseRepository', 'TenantScopedSession', 'UnitOfWork', 'SoftDeleteMixin'],
    dependencies: ['sqlalchemy', 'asyncpg'],
    testCoveragePercent: 100,
    pythonImplementation: `from typing import TypeVar, Generic, List, Optional

T = TypeVar("T")

class BaseRepository(Generic[T]):
    def __init__(self, tenant_id: str):
        self.tenant_id = tenant_id
        self._store: List[dict] = []

    def save(self, entity: dict) -> dict:
        entity["tenant_id"] = self.tenant_id
        self._store.append(entity)
        return entity

    def find_all(self) -> List[dict]:
        return [item for item in self._store if item.get("tenant_id") == self.tenant_id]`,
    tsImplementation: `export class BaseRepository<T extends { id: string; tenantId: string }> {
  private store: Map<string, T> = new Map();

  constructor(private tenantId: string) {}

  public save(entity: T): T {
    const item = { ...entity, tenantId: this.tenantId };
    this.store.set(entity.id, item);
    return item;
  }

  public findAll(): T[] {
    return Array.from(this.store.values()).filter(i => i.tenantId === this.tenantId);
  }
}`,
    unitTestExample: `def test_tenant_isolated_repository():
    repo_a = BaseRepository("tenant-a")
    repo_b = BaseRepository("tenant-b")
    repo_a.save({"id": "1", "name": "Project Alpha"})
    assert len(repo_a.find_all()) == 1
    assert len(repo_b.find_all()) == 0`
  },
  {
    id: 'sdk-ai',
    name: 'nexora-ai',
    version: NEXORA_SDK_VERSION,
    category: 'AI_RAG',
    description: 'Unified Gemini AI client, Prompt Registry hydrator, and Vector Store RAG search abstractions.',
    pythonModulePath: 'nexora.ai',
    tsModulePath: '@nexora/ai',
    keyClassesAndFunctions: ['NexoraAiClient', 'PromptRegistry', 'VectorStoreClient', 'generate_text()'],
    dependencies: ['google-genai', 'qdrant-client'],
    testCoveragePercent: 100,
    pythonImplementation: `class PromptRegistry:
    PROMPTS = {
        "SUMMARIZE_CODE": "Summarize the following architecture code for tenant {tenant_id}:\\n{code}",
        "GENERATE_API_SPEC": "Generate an OpenAPI 3.1 specification for module {module_name}."
    }

    @classmethod
    def hydrate(cls, prompt_key: str, **kwargs) -> str:
        template = cls.PROMPTS.get(prompt_key, "")
        return template.format(**kwargs)`,
    tsImplementation: `export class PromptRegistry {
  private static PROMPTS: Record<string, string> = {
    SUMMARIZE_CODE: 'Summarize the following architecture code for tenant {tenant_id}:\n{code}',
    GENERATE_API_SPEC: 'Generate an OpenAPI 3.1 specification for module {module_name}.'
  };

  public static hydrate(key: string, params: Record<string, string>): string {
    let template = this.PROMPTS[key] || '';
    Object.entries(params).forEach(([k, v]) => {
      template = template.replace(new RegExp(\`{\${k}}\`, 'g'), v);
    });
    return template;
  }
}`,
    unitTestExample: `def test_prompt_hydration():
    prompt = PromptRegistry.hydrate("SUMMARIZE_CODE", tenant_id="tenant-100", code="class CoreService: pass")
    assert "tenant-100" in prompt
    assert "class CoreService" in prompt`
  },
  {
    id: 'sdk-plugins',
    name: 'nexora-plugins',
    version: NEXORA_SDK_VERSION,
    category: 'EXTENSIONS_PLUGINS',
    description: 'Standard plugin interface, module lifecycle hooks (init, start, stop), and marketplace extension contracts.',
    pythonModulePath: 'nexora.plugins',
    tsModulePath: '@nexora/plugins',
    keyClassesAndFunctions: ['NexoraPluginInterface', 'PluginManager', 'on_enable()', 'on_disable()'],
    dependencies: [],
    testCoveragePercent: 100,
    pythonImplementation: `class NexoraPluginInterface:
    def __init__(self, plugin_id: str, version: str):
        self.plugin_id = plugin_id
        self.version = version
        self.active = False

    def on_enable(self):
        self.active = True

    def on_disable(self):
        self.active = False`,
    tsImplementation: `export abstract class NexoraPlugin {
  public active: boolean = false;
  constructor(public pluginId: string, public version: string) {}

  public abstract onEnable(): Promise<void> | void;
  public abstract onDisable(): Promise<void> | void;
}`,
    unitTestExample: `def test_plugin_lifecycle():
    plugin = NexoraPluginInterface("docker-deployer", "1.0.0")
    assert plugin.active is False
    plugin.on_enable()
    assert plugin.active is True`
  }
];

export const SDK_BENCHMARKS: SdkBenchmarkMetric[] = [
  {
    packageName: 'nexora-config',
    operation: 'Config load + Vault secret resolution',
    latencyMs: 1.2,
    throughputOpsSec: 850000,
    memoryUsageMb: 8.4,
    status: 'OPTIMAL'
  },
  {
    packageName: 'nexora-logging',
    operation: 'Structured JSON log emission with trace context',
    latencyMs: 0.08,
    throughputOpsSec: 12500000,
    memoryUsageMb: 4.1,
    status: 'OPTIMAL'
  },
  {
    packageName: 'nexora-security',
    operation: 'RBAC permission evaluation + JWT signature check',
    latencyMs: 0.15,
    throughputOpsSec: 6600000,
    memoryUsageMb: 6.2,
    status: 'OPTIMAL'
  },
  {
    packageName: 'nexora-events',
    operation: 'CloudEvents v1.0 serialization + publish',
    latencyMs: 0.42,
    throughputOpsSec: 2300000,
    memoryUsageMb: 9.8,
    status: 'OPTIMAL'
  },
  {
    packageName: 'nexora-database',
    operation: 'Tenant isolated repository save + filter',
    latencyMs: 0.85,
    throughputOpsSec: 1100000,
    memoryUsageMb: 12.5,
    status: 'OPTIMAL'
  },
  {
    packageName: 'nexora-ai',
    operation: 'Prompt registry template hydration',
    latencyMs: 0.02,
    throughputOpsSec: 50000000,
    memoryUsageMb: 3.2,
    status: 'OPTIMAL'
  }
];

export const SDK_FEATURE_FLAGS: SdkFeatureFlag[] = [
  {
    key: 'ENABLE_GRPC_ZERO_COPY',
    description: 'Enables high-throughput binary zero-copy protobuf serialization across internal services.',
    enabled: true,
    rules: { tenantTier: ['ENTERPRISE'], rolloutPercentage: 100 }
  },
  {
    key: 'AI_RAG_HYBRID_SEARCH',
    description: 'Enables dense vector embeddings + sparse BM25 hybrid search in VectorStoreClient.',
    enabled: true,
    rules: { tenantTier: ['ENTERPRISE', 'PRO'], rolloutPercentage: 50 }
  },
  {
    key: 'STRICT_ABAC_EVALUATION',
    description: 'Enforces fine-grained Attribute-Based Access Control in addition to standard RBAC.',
    enabled: false,
    rules: { userRoles: ['PLATFORM_ADMIN'], rolloutPercentage: 10 }
  }
];
