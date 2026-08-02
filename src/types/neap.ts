export interface CapabilityLevel3 {
  id: string;
  name: string;
  description: string;
  technicalComponents: string[];
  mappedApi: string;
  mappedEntity: string;
  mappedRole: string;
  mappedWorkflow: string;
  mappedAiAgent: string;
}

export interface CapabilityLevel2 {
  id: string;
  name: string;
  description: string;
  level3Functions: CapabilityLevel3[];
}

export interface CapabilityLevel1 {
  id: string;
  name: string;
  code: string;
  description: string;
  level2Capabilities: CapabilityLevel2[];
}

export interface ArchitectureLayer {
  id: string;
  name: string;
  purpose: string;
  responsibilities: string[];
  dependencies: string[];
  inputs: string[];
  outputs: string[];
  integrationPoints: string[];
  mermaidSpec: string;
}

export interface DevelopmentStandardCategory {
  title: string;
  description: string;
  standards: {
    rule: string;
    description: string;
    badExample?: string;
    goodExample?: string;
  }[];
}

export type SupportedLocale = 'en' | 'fr' | 'ar' | 'es' | 'pt' | 'bm';

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}
