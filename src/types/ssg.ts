export interface SsgDocument {
  id: string;
  filename: string;
  title: string;
  category: 'BUSINESS' | 'ARCHITECTURE' | 'DATABASE' | 'API' | 'SECURITY' | 'TESTING' | 'OPS';
  content: string;
  format: 'markdown' | 'yaml' | 'mermaid' | 'plantuml' | 'json';
}

export interface SsgAtomicTask {
  id: string;
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  owner: string;
  estimatedHours: number;
  dependencies: string[];
  deliverables: string[];
  status: 'READY' | 'IN_PROGRESS' | 'DONE';
}

export interface SprintPackageSpec {
  sprintId: string;
  sprintName: string;
  version: string;
  targetProduct: string;
  generatedAt: string;
  documents: SsgDocument[];
  atomicTasks: SsgAtomicTask[];
}
