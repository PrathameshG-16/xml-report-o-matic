
import { TestReport } from '@/types/reportTypes';
import { parseXmlReport } from '@/utils/xmlParser';
import { parseHtmlReport } from '@/utils/htmlParser';

const STORAGE_KEY = 'test_reports';

/**
 * Service for managing test reports
 */
export const reportService = {
  /**
   * Save a new report from XML
   * @param xmlString XML report string
   * @returns The parsed and saved TestReport
   */
  saveXmlReport: (xmlString: string): TestReport => {
    try {
      // Parse the XML report
      const report = parseXmlReport(xmlString);
      
      // Get existing reports
      const existingReports = reportService.getAllReports();
      
      // Add the new report
      const updatedReports = [report, ...existingReports];
      
      // Save to storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
      
      return report;
    } catch (error) {
      console.error('Error saving XML report:', error);
      throw new Error('Failed to save XML report');
    }
  },
  
  /**
   * Save a new report from HTML
   * @param htmlString HTML report string
   * @returns The parsed and saved TestReport
   */
  saveHtmlReport: (htmlString: string): TestReport => {
    try {
      // Parse the HTML report
      const report = parseHtmlReport(htmlString);
      
      // Get existing reports
      const existingReports = reportService.getAllReports();
      
      // Add the new report
      const updatedReports = [report, ...existingReports];
      
      // Save to storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
      
      return report;
    } catch (error) {
      console.error('Error saving HTML report:', error);
      throw new Error('Failed to save HTML report');
    }
  },
  
  /**
   * Get all stored reports
   * @returns Array of TestReport objects
   */
  getAllReports: (): TestReport[] => {
    try {
      const reportsJson = localStorage.getItem(STORAGE_KEY);
      return reportsJson ? JSON.parse(reportsJson) : [];
    } catch (error) {
      console.error('Error getting reports:', error);
      return [];
    }
  },
  
  /**
   * Clear all reports from storage
   */
  clearAllReports: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
