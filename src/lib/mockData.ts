
import { TestReport } from '../types/reportTypes';

export const mockTestReport: TestReport = {
  id: "report-001",
  name: "Sprint 27 Regression Tests",
  timestamp: "2023-11-15T14:30:00Z",
  summary: {
    totalFeatures: 5,
    totalTests: 87,
    totalPassed: 73,
    totalFailed: 9,
    totalSkipped: 5,
    executionTime: 1243.5, // seconds
    passRate: 84.9
  },
  features: [
    {
      id: "feature-001",
      name: "User Authentication",
      totalTests: 18,
      passedTests: 17,
      failedTests: 1,
      skippedTests: 0,
      testCases: [
        {
          id: "tc-001",
          name: "Valid login credentials should authenticate user",
          status: "passed",
          duration: 1.2
        },
        {
          id: "tc-002",
          name: "Invalid credentials should display appropriate error",
          status: "passed",
          duration: 0.8
        },
        {
          id: "tc-003",
          name: "Password reset flow should send email",
          status: "failed",
          duration: 2.5,
          failureReason: "Email service timeout after 2000ms"
        },
        // More test cases would be here in a real application
      ]
    },
    {
      id: "feature-002",
      name: "Product Catalog",
      totalTests: 22,
      passedTests: 19,
      failedTests: 2,
      skippedTests: 1,
      testCases: [
        {
          id: "tc-019",
          name: "Product listing should display all available products",
          status: "passed",
          duration: 1.5
        },
        {
          id: "tc-020",
          name: "Product filtering should work as expected",
          status: "passed",
          duration: 1.1
        },
        {
          id: "tc-021",
          name: "Product search should return relevant results",
          status: "failed",
          duration: 1.8,
          failureReason: "Search index not updated with latest products"
        },
        // More test cases would be here in a real application
      ]
    },
    {
      id: "feature-003",
      name: "Shopping Cart",
      totalTests: 15,
      passedTests: 12,
      failedTests: 3,
      skippedTests: 0,
      testCases: [
        {
          id: "tc-042",
          name: "Adding product to cart should update cart count",
          status: "passed",
          duration: 0.9
        },
        {
          id: "tc-043",
          name: "Removing product from cart should update cart total",
          status: "failed",
          duration: 1.3,
          failureReason: "Price calculation error when removing last item"
        },
        // More test cases would be here in a real application
      ]
    },
    {
      id: "feature-004",
      name: "Checkout Process",
      totalTests: 20,
      passedTests: 15,
      failedTests: 2,
      skippedTests: 3,
      testCases: [
        {
          id: "tc-057",
          name: "Customer should be able to complete purchase",
          status: "passed",
          duration: 3.2
        },
        {
          id: "tc-058",
          name: "Payment validation should handle invalid card details",
          status: "failed",
          duration: 2.1,
          failureReason: "Payment gateway connection error"
        },
        // More test cases would be here in a real application
      ]
    },
    {
      id: "feature-005",
      name: "User Profile",
      totalTests: 12,
      passedTests: 10,
      failedTests: 1,
      skippedTests: 1,
      testCases: [
        {
          id: "tc-077",
          name: "User should be able to update profile information",
          status: "passed",
          duration: 1.7
        },
        {
          id: "tc-078",
          name: "Profile picture upload should work as expected",
          status: "failed",
          duration: 2.4,
          failureReason: "Image processing service unavailable"
        },
        // More test cases would be here in a real application
      ]
    }
  ]
};

export const generateMockReports = (count: number = 1): TestReport[] => {
  const reports: TestReport[] = [];
  
  for (let i = 0; i < count; i++) {
    const newReport = JSON.parse(JSON.stringify(mockTestReport)) as TestReport;
    newReport.id = `report-${String(i + 1).padStart(3, '0')}`;
    
    // Add some variation to each report
    const variationFactor = 0.9 + Math.random() * 0.2; // Between 0.9 and 1.1
    newReport.summary.totalPassed = Math.floor(newReport.summary.totalPassed * variationFactor);
    newReport.summary.totalFailed = newReport.summary.totalTests - newReport.summary.totalPassed - newReport.summary.totalSkipped;
    newReport.summary.passRate = (newReport.summary.totalPassed / newReport.summary.totalTests) * 100;
    
    // Update timestamp to create a timeline
    const date = new Date();
    date.setDate(date.getDate() - i);
    newReport.timestamp = date.toISOString();
    
    reports.push(newReport);
  }
  
  return reports;
};

export const mockReports = generateMockReports(5);
