
export interface TestCase {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  failureReason?: string;
}

export interface FeatureResult {
  id: string;
  name: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  testCases: TestCase[];
}

export interface TestSummary {
  totalFeatures: number;
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  executionTime: number;
  passRate: number;
}

export interface TestReport {
  id: string;
  name: string;
  timestamp: string;
  summary: TestSummary;
  features: FeatureResult[];
}
