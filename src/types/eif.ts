export interface PipelineStep {
  stepNumber: number;
  id: string;
  name: string;
  category: 'Strategy & Domain' | 'Engineering & Code' | 'Validation & Testing' | 'Ops & Monitoring';
  description: string;
  deliverables: string[];
  qualityGates: string[];
  acceptanceCriteria: string[];
  forgeCommand?: string;
  aiAgentRole: string;
}

export interface ForgeCommandSpec {
  command: string;
  description: string;
  inputs: { flag: string; type: string; description: string; required: boolean }[];
  outputs: string[];
  generatedFiles: string[];
  validationRules: string[];
  dependencies: string[];
  rollbackStrategy: string;
}

export interface AiAgentSpec {
  name: string;
  alias: string;
  specialization: string;
  responsibilities: string[];
  githubWorkflowRole: string;
  primaryTools: string[];
  qualityGateFocus: string;
}

export interface QualityGateRule {
  id: string;
  category: 'Architecture' | 'Code' | 'Security' | 'Performance' | 'Testing' | 'Docs' | 'Accessibility' | 'Localization';
  rule: string;
  threshold: string;
  automatedCheckTool: string;
  blockingSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface ModuleTemplateNode {
  path: string;
  type: 'folder' | 'file';
  description: string;
  sampleContent?: string;
}
