export type BoundedContextType = 
  | 'Core'
  | 'Supporting'
  | 'Generic';

export interface DomainEntityField {
  name: string;
  type: string;
  required: boolean;
  isPk?: boolean;
  isFk?: boolean;
  fkTarget?: string;
  description: string;
  constraints?: string;
}

export interface DomainEntity {
  id: string;
  name: string;
  category: 
    | 'Organization'
    | 'Identity & Access'
    | 'Platform'
    | 'Development'
    | 'Knowledge'
    | 'Automation'
    | 'AI'
    | 'Analytics'
    | 'Audit & Security';
  boundedContext: string;
  aggregateRoot?: string;
  description: string;
  fields: DomainEntityField[];
  relationships: {
    targetEntity: string;
    type: 'One-to-One' | 'One-to-Many' | 'Many-to-One' | 'Many-to-Many';
    ownership: 'Composite' | 'Shared' | 'Reference';
    description: string;
  }[];
  restEndpoint: string;
  postgresTable: string;
}

export interface BoundedContext {
  id: string;
  name: string;
  type: BoundedContextType;
  description: string;
  aggregates: string[];
  entities: string[];
  domainEvents: string[];
}

export interface RbacRolePermission {
  role: string;
  description: string;
  permissions: Record<string, ('C' | 'R' | 'U' | 'D' | 'A')[]>; // Entity -> CRUD permissions
}

export interface ModuleDependencyNode {
  id: string;
  name: string;
  layer: 'L1 - CLI & Tools' | 'L2 - SDK & Shared' | 'L3 - Visual & Admin' | 'L4 - Core Engine & Services';
  dependsOn: string[];
  description: string;
}
