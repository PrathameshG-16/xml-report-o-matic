
import { TestReport, FeatureResult, TestCase } from '../types/reportTypes';

/**
 * Parses a Cucumber XML report into the application's TestReport format
 * 
 * @param xmlString The XML report as a string
 * @returns A TestReport object formatted for the application
 */
export function parseXmlReport(xmlString: string): TestReport {
  // Create a DOM parser
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  
  // Extract basic report information
  const testsuites = xmlDoc.getElementsByTagName("testsuite");
  const timestamp = xmlDoc.documentElement.getAttribute("timestamp") || new Date().toISOString();
  const reportName = xmlDoc.documentElement.getAttribute("name") || "Cucumber Test Report";
  
  // Initialize counters for summary
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;
  let totalExecutionTime = 0;
  
  // Extract features and test cases
  const features: FeatureResult[] = [];
  
  // Process each testsuite (feature)
  for (let i = 0; i < testsuites.length; i++) {
    const testsuite = testsuites[i];
    
    const featureId = `feature-${i + 1}`;
    const featureName = testsuite.getAttribute("name") || `Feature ${i + 1}`;
    const featureTime = parseFloat(testsuite.getAttribute("time") || "0");
    
    // Extract testcases for this feature
    const testElements = testsuite.getElementsByTagName("testcase");
    const testCases: TestCase[] = [];
    
    let featurePassedTests = 0;
    let featureFailedTests = 0;
    let featureSkippedTests = 0;
    
    // Process each testcase
    for (let j = 0; j < testElements.length; j++) {
      const testElement = testElements[j];
      const testId = `tc-${i + 1}-${j + 1}`;
      const testName = testElement.getAttribute("name") || `Test Case ${j + 1}`;
      const testTime = parseFloat(testElement.getAttribute("time") || "0");
      
      // Check test status
      const failures = testElement.getElementsByTagName("failure");
      const skipped = testElement.getElementsByTagName("skipped");
      
      let status: 'passed' | 'failed' | 'skipped' = 'passed';
      let failureReason: string | undefined = undefined;
      
      if (failures.length > 0) {
        status = 'failed';
        failureReason = failures[0].getAttribute("message") || "Unknown error";
        featureFailedTests++;
        totalFailed++;
      } else if (skipped.length > 0) {
        status = 'skipped';
        featureSkippedTests++;
        totalSkipped++;
      } else {
        featurePassedTests++;
        totalPassed++;
      }
      
      // Create test case entry
      testCases.push({
        id: testId,
        name: testName,
        status,
        duration: testTime,
        failureReason
      });
    }
    
    // Update feature counts
    const featureTestCount = testCases.length;
    totalTests += featureTestCount;
    totalExecutionTime += featureTime;
    
    // Create feature entry
    features.push({
      id: featureId,
      name: featureName,
      totalTests: featureTestCount,
      passedTests: featurePassedTests,
      failedTests: featureFailedTests,
      skippedTests: featureSkippedTests,
      testCases
    });
  }
  
  // Calculate pass rate
  const passRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;
  
  // Create the final report
  const report: TestReport = {
    id: `report-${Date.now()}`,
    name: reportName,
    timestamp,
    summary: {
      totalFeatures: features.length,
      totalTests,
      totalPassed,
      totalFailed,
      totalSkipped,
      executionTime: totalExecutionTime,
      passRate
    },
    features
  };
  
  return report;
}
