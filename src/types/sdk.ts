export type SdkModuleCategory = 
  | 'CORE_CONFIG'
  | 'OBSERVABILITY'
  | 'SECURITY_AUTH'
  | 'DATA_PERSISTENCE'
  | 'AI_RAG'
  | 'EXTENSIONS_PLUGINS'
  | 'UTILITIES';

export interface SdkPackageSpec {
  id: string;
  name: string;
  version: string;
  category: SdkModuleCategory;
  description: string;
  pythonModulePath: string;
  tsModulePath: string;
  keyClassesAndFunctions: string[];
  dependencies: string[];
  testCoveragePercent: number;
  pythonImplementation: string;
  tsImplementation: string;
  unitTestExample: string;
}

export interface SdkBenchmarkMetric {
  packageName: string;
  operation: string;
  latencyMs: number;
  throughputOpsSec: number;
  memoryUsageMb: number;
  status: 'OPTIMAL' | 'PASS' | 'WARNING';
}

export interface SdkFeatureFlag {
  key: string;
  description: string;
  enabled: boolean;
  rules: {
    tenantTier?: string[];
    userRoles?: string[];
    rolloutPercentage?: number;
  };
}
