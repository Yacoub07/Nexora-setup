export type CoreSprintStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';

export interface CoreSprintSpec {
  sprintNumber: number;
  id: string;
  name: string;
  goal: string;
  status: CoreSprintStatus;
  durationWeeks: number;
  userStories: string[];
  technicalTasks: string[];
  databaseChanges: string[];
  apiEndpoints: string[];
  uiComponents: string[];
  testRequirements: string[];
  definitionOfDone: string[];
}

export interface CoreOrganizationUnit {
  id: string;
  name: string;
  code: string;
  type: 'ORGANIZATION' | 'BUSINESS_UNIT' | 'DEPARTMENT' | 'TEAM' | 'SITE';
  parentId?: string;
  leaderName: string;
  memberCount: number;
  location: string;
}

export interface CoreUserRecord {
  id: string;
  email: string;
  fullName: string;
  role: string;
  orgId: string;
  deptName: string;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  mfaEnabled: boolean;
  lastLoginAt: string;
  avatarUrl?: string;
}

export interface CoreAuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'SUCCESS' | 'DENIED' | 'FAILED';
  traceId: string;
}

export interface CoreSystemMetric {
  metricName: string;
  currentValue: string;
  unit: string;
  targetThreshold: string;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}
