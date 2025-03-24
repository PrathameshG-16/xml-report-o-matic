
import { TestReport, FeatureResult, TestCase } from '@/types/reportTypes';

/**
 * Parses a Cucumber HTML report into the application's TestReport format
 * 
 * @param htmlString The HTML report as a string
 * @returns A TestReport object formatted for the application
 */
export function parseHtmlReport(htmlString: string): TestReport {
  // Create a DOM parser
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlString, "text/html");
  
  // Extract basic report information
  const reportName = htmlDoc.querySelector('title')?.textContent || "Cucumber Test Report";
  const timestamp = new Date().toISOString();
  
  // Look for report summary elements
  const summaryElements = htmlDoc.querySelectorAll('.summary');
  
  // Initialize counters for summary
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;
  let totalExecutionTime = 0;
  
  // Try to extract summary data if available in specific HTML format
  for (const summaryEl of summaryElements) {
    const statsEl = summaryEl.querySelector('.stats');
    if (statsEl) {
      // Extract counts if they exist
      totalTests = parseInt(statsEl.querySelector('.total')?.textContent || '0');
      totalPassed = parseInt(statsEl.querySelector('.passed')?.textContent || '0');
      totalFailed = parseInt(statsEl.querySelector('.failed')?.textContent || '0');
      totalSkipped = parseInt(statsEl.querySelector('.skipped')?.textContent || '0');
    }
    
    // Try to find execution time
    const timeEl = summaryEl.querySelector('.duration');
    if (timeEl) {
      // Parse time string (format might vary)
      const timeStr = timeEl.textContent || '0';
      // Convert time string to seconds (simple implementation, adjust based on format)
      totalExecutionTime = parseTimeToSeconds(timeStr);
    }
  }
  
  // Extract features
  const features: FeatureResult[] = [];
  
  // Look for feature elements
  const featureElements = htmlDoc.querySelectorAll('.feature');
  
  // Process each feature
  for (let i = 0; i < featureElements.length; i++) {
    const featureEl = featureElements[i];
    
    const featureId = `feature-${i + 1}`;
    const featureName = featureEl.querySelector('.name')?.textContent || `Feature ${i + 1}`;
    
    // Extract testcases for this feature
    const testElements = featureEl.querySelectorAll('.element');
    const testCases: TestCase[] = [];
    
    let featurePassedTests = 0;
    let featureFailedTests = 0;
    let featureSkippedTests = 0;
    
    // Process each testcase
    for (let j = 0; j < testElements.length; j++) {
      const testElement = testElements[j];
      const testId = `tc-${i + 1}-${j + 1}`;
      const testName = testElement.querySelector('.name')?.textContent || `Test Case ${j + 1}`;
      
      // Find duration if available
      let testTime = 0;
      const durationEl = testElement.querySelector('.duration');
      if (durationEl) {
        const timeStr = durationEl.textContent || '0';
        testTime = parseTimeToSeconds(timeStr);
      }
      
      // Check test status
      const failureEl = testElement.querySelector('.failed');
      const skippedEl = testElement.querySelector('.skipped');
      
      let status: 'passed' | 'failed' | 'skipped' = 'passed';
      let failureReason: string | undefined = undefined;
      
      if (failureEl) {
        status = 'failed';
        // Try to find error message
        failureReason = testElement.querySelector('.message')?.textContent || "Unknown error";
        featureFailedTests++;
      } else if (skippedEl) {
        status = 'skipped';
        featureSkippedTests++;
      } else {
        featurePassedTests++;
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
    totalTests = Math.max(totalTests, totalTests + featureTestCount - (featurePassedTests + featureFailedTests + featureSkippedTests));
    
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

/**
 * Helper function to parse time strings into seconds
 * Handles various formats like "10m 15s", "125ms", "2 minutes 5 seconds"
 */
function parseTimeToSeconds(timeStr: string): number {
  // Remove non-alphanumeric characters for consistent parsing
  const normalizedStr = timeStr.trim().toLowerCase();
  
  // Check for common patterns
  if (normalizedStr.includes('m') && normalizedStr.includes('s')) {
    // Format like "10m 15s"
    const minutesPart = normalizedStr.split('m')[0].trim();
    const secondsPart = normalizedStr.split('m')[1].split('s')[0].trim();
    
    return (parseInt(minutesPart) * 60) + parseInt(secondsPart);
  } else if (normalizedStr.includes('ms')) {
    // Format like "1500ms"
    const ms = parseInt(normalizedStr.replace('ms', '').trim());
    return ms / 1000;
  } else if (normalizedStr.includes('s')) {
    // Format like "45s"
    return parseInt(normalizedStr.replace('s', '').trim());
  } else if (normalizedStr.includes('minute')) {
    // Format like "2 minutes 5 seconds"
    const parts = normalizedStr.split(' ');
    let seconds = 0;
    
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === 'minute' || parts[i] === 'minutes') {
        seconds += parseInt(parts[i-1]) * 60;
      }
      if (parts[i] === 'second' || parts[i] === 'seconds') {
        seconds += parseInt(parts[i-1]);
      }
    }
    
    return seconds;
  }
  
  // Default: try to parse as direct seconds
  return parseFloat(normalizedStr) || 0;
}
