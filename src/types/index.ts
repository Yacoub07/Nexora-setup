export interface CliResult {
  command: string;
  exitCode: number;
  output: string;
  rawOutput: string;
  timestamp: string;
}

export interface DiagnosticCheck {
  category: string;
  name: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  message: string;
  recommendation: string | null;
}

export interface DoctorReport {
  overall_status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  target_path: string;
  checks: DiagnosticCheck[];
  summary: {
    total: number;
    pass: number;
    warn: number;
    fail: number;
  };
}

export interface WorkspaceValidationReport {
  valid: boolean;
  errors: string[];
  warnings: string[];
  checks_passed: string[];
  score: number;
  manifest_path?: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  extension?: string;
  size?: number;
  children?: FileNode[];
}

export interface TestSuiteResult {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  duration: number;
  coverage: number;
  suites: {
    file: string;
    tests: {
      name: string;
      status: 'PASSED' | 'FAILED' | 'SKIPPED';
      duration: string;
      error?: string;
    }[];
  }[];
  rawOutput: string;
}
