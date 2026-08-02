export interface ProductDefinition {
  id: string;
  name: string;
  pillar: 'forge' | 'sdk' | 'studio' | 'platform';
  mission: string;
  scope: string[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  estimatedComplexity: 'HIGH' | 'VERY HIGH' | 'MEDIUM';
  businessValue: 'CRITICAL' | 'HIGH';
  technicalRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  dependencies: string[];
}

export interface Epic {
  id: string;
  productId: string;
  code: string;
  title: string;
  description: string;
  features: Feature[];
}

export interface Feature {
  id: string;
  epicId: string;
  code: string;
  title: string;
  businessValue: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  dependencies: string[];
  estimatedSprint: string;
  acceptanceCriteria: string[];
}

export interface UserStory {
  id: string;
  featureId: string;
  code: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  businessRules: string[];
  edgeCases: string[];
  nfr: {
    security: string;
    performance: string;
  };
  tasks: {
    category: 'Backend' | 'Frontend' | 'Database' | 'API' | 'Tests' | 'Localization' | 'AI' | 'DevOps' | 'Security';
    title: string;
    estimateHours: number;
    assignedAiAgent: string;
  }[];
}

export interface ReleaseMilestone {
  version: string;
  productName: string;
  targetQuarter: string;
  objectives: string[];
  keyFeatures: string[];
  risks: string[];
  dependencies: string[];
  exitCriteria: string[];
}

export interface DevelopmentOrderStep {
  stepNumber: number;
  productName: string;
  rationale: string;
  prerequisiteStepNumber: number | null;
  coreDeliverables: string[];
}

export interface SprintDefinition {
  sprintNumber: number;
  sprintGoal: string;
  targetProduct: string;
  featuresIncluded: string[];
  definitionOfDone: string[];
  risks: string[];
  requiredAiAgents: string[];
  githubMilestone: string;
}
