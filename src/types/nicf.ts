export type CommunicationModelType = 
  | 'REST_API'
  | 'GRPC'
  | 'EVENT_BUS'
  | 'WEBSOCKET_SSE'
  | 'WEBHOOKS'
  | 'GRAPHQL'
  | 'MESSAGE_QUEUE'
  | 'STREAMING_EVENTS';

export interface CommunicationModelSpec {
  id: string;
  name: string;
  type: CommunicationModelType;
  protocol: string;
  primaryUseCase: string;
  latencyExpectation: string;
  payloadFormat: string;
  governanceRules: string[];
  codeExample: string;
}

export interface ApiGovernancePolicy {
  topic: string;
  standard: string;
  rules: string[];
  exampleSnippet: string;
}

export interface NicfCatalogEvent {
  id: string;
  eventName: string;
  category: 'IDENTITY_TENANCY' | 'WORKSPACE_BUILD' | 'EXTENSIONS' | 'KNOWLEDGE_AI' | 'PLATFORM_OPS';
  topic: string;
  publisherService: string;
  subscriberServices: string[];
  ownerTeam: string;
  payloadSchemaJson: string;
  examplePayloadJson: string;
}

export interface NicfExternalConnector {
  id: string;
  name: string;
  category: 'WORKPLACE_SUITE' | 'DEVOPS_VCS' | 'ENTERPRISE_ERP' | 'IDENTITY_DIRECTORY' | 'CLOUD_PROVIDER' | 'COMMUNICATION';
  authMethod: 'OAUTH2' | 'API_KEY' | 'MTLS_CERT' | 'LDAP_BASIC' | 'IAM_ROLE';
  protocol: string;
  reusableCapabilities: string[];
  rateLimitSpecs: string;
  sampleConfigYaml: string;
}

export interface NicfContractStandard {
  standardName: string;
  version: string;
  targetMedium: string;
  linterRules: string[];
  sampleSpec: string;
}
