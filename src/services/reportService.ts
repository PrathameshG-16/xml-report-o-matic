
import { TestReport } from '../types/reportTypes';
import { parseXmlReport } from '../utils/xmlParser';
import { parseHtmlReport } from '../utils/htmlParser';

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
      console.log('XML Report saved:', report);
      
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
      console.log('HTML Report saved:', report);
      
      return report;
    } catch (error) {
      console.error('Error saving HTML report:', error);
      throw new Error('Failed to save HTML report');
    }
  },
  
  /**
   * Detect file type and save accordingly
   * @param fileContent File content as string
   * @param fileName Original file name (used for detection)
   * @returns The parsed and saved TestReport
   */
  saveReport: (fileContent: string, fileName: string): TestReport => {
    console.log(`Saving report from file: ${fileName}`);
    // Check file extension to determine the type
    const fileExt = fileName.split('.').pop()?.toLowerCase();
    
    if (fileExt === 'xml') {
      console.log('Detected XML file');
      return reportService.saveXmlReport(fileContent);
    } else if (fileExt === 'html' || fileExt === 'htm') {
      console.log('Detected HTML file');
      return reportService.saveHtmlReport(fileContent);
    } else {
      // Try to detect content type
      if (fileContent.trim().startsWith('<!DOCTYPE html>') || fileContent.trim().startsWith('<html')) {
        console.log('Content detected as HTML');
        return reportService.saveHtmlReport(fileContent);
      } else if (fileContent.trim().startsWith('<?xml') || fileContent.trim().startsWith('<')) {
        console.log('Content detected as XML');
        return reportService.saveXmlReport(fileContent);
      }
      
      throw new Error('Unsupported file format');
    }
  },
  
  /**
   * Get all stored reports
   * @returns Array of TestReport objects
   */
  getAllReports: (): TestReport[] => {
    try {
      const reportsJson = localStorage.getItem(STORAGE_KEY);
      const reports = reportsJson ? JSON.parse(reportsJson) : [];
      console.log('Retrieved reports from localStorage:', reports);
      return reports;
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
    console.log('All reports cleared from localStorage');
  }
};
