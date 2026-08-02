export type SrfCategory = 
  | 'CORE_PLATFORM'
  | 'SECURITY_GOVERNANCE'
  | 'OBSERVABILITY_DIAGNOSTICS'
  | 'DATA_STORAGE_CACHE'
  | 'AI_RUNTIME_ENGINES'
  | 'INTEGRATION_SCHEDULING';

export interface SrfInterfaceSpec {
  name: string;
  signature: string;
  description: string;
  codeExample: string;
}

export interface SrfProductConsumer {
  productId: string;
  productName: string;
  usageDescription: string;
  status: 'ACTIVE' | 'PLANNED' | 'CORE_DEPENDENCY';
}

export interface SrfServiceSpec {
  id: string;
  code: string;
  name: string;
  category: SrfCategory;
  tagline: string;
  responsibilities: string[];
  interfaces: SrfInterfaceSpec[];
  dependencies: string[];
  extensionPoints: string[];
  configurationYaml: string;
  errorHandling: string[];
  testingStrategy: string[];
  securityConsiderations: string[];
  performanceConsiderations: string[];
  consumers: SrfProductConsumer[];
}

export interface SrfArchitectureLayer {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  services: string[];
  description: string;
}

export interface SrfDomainEvent {
  id: string;
  eventName: string;
  topic: string;
  publisher: string;
  payloadJson: string;
  correlationId: string;
  timestamp: string;
  status: 'DISPATCHED' | 'ACKNOWLEDGED' | 'REPLAYED' | 'DLQ';
}

export interface SrfFeatureFlag {
  key: string;
  name: string;
  description: string;
  type: 'BOOLEAN' | 'PERCENTAGE' | 'TENANT' | 'USER_SEGMENT';
  defaultValue: boolean | number | string;
  rolloutPercentage: number;
  environmentRule: string;
  enabled: boolean;
}

export interface SrfAiPromptTemplate {
  id: string;
  name: string;
  version: string;
  provider: 'GEMINI_FLASH' | 'GEMINI_PRO' | 'CUSTOM_EMBEDDING';
  templateText: string;
  variables: string[];
  temperature: number;
  maxTokens: number;
}
