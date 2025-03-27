
import React, { useState, useEffect } from 'react';
import TestSummary from './TestSummary';
import FileUpload from './FileUpload';
import { TestReport } from '../types/reportTypes';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { reportService } from '../services/reportService';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import PieChartDisplay from './PieChartDisplay';
import FeatureBreakdown from './FeatureBreakdown';
import FailureReasons from './FailureReasons';
import TestReportCard from './TestReportCard';

interface DashboardProps {
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  const [reports, setReports] = useState<TestReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Load reports from storage
    loadReports();
  }, []);
  
  useEffect(() => {
    // Select the first report by default when reports change
    if (reports.length > 0 && !selectedReportId) {
      setSelectedReportId(reports[0].id);
    }
  }, [reports, selectedReportId]);
  
  const loadReports = () => {
    setIsLoading(true);
    try {
      console.log('Loading reports...');
      const storageReports = reportService.getAllReports();
      console.log('Reports loaded:', storageReports);
      setReports(storageReports);
      
      // Reset selected report if it no longer exists
      if (storageReports.length > 0) {
        if (!storageReports.some(report => report.id === selectedReportId)) {
          setSelectedReportId(storageReports[0].id);
        }
      } else {
        setSelectedReportId('');
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReportAdded = () => {
    loadReports();
  };
  
  const clearAllReports = () => {
    if (confirm('Are you sure you want to delete all reports?')) {
      reportService.clearAllReports();
      setReports([]);
      setSelectedReportId('');
      toast.success('All reports cleared');
    }
  };
  
  const selectedReport = reports.find(report => report.id === selectedReportId);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!selectedReport && reports.length === 0) {
    return (
      <div className={cn("p-6", className)}>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-semibold">Test Report Visualizer</h1>
            <p className="text-muted-foreground">
              Upload your test reports to visualize results
            </p>
          </div>
          
          <FileUpload onReportAdded={handleReportAdded} />
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Upload your first XML or HTML report to get started</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Prepare chart data for the selected report
  const getChartData = () => {
    if (!selectedReport) return [];
    
    const { summary } = selectedReport;
    
    return [
      { name: 'Passed', value: summary.totalPassed, color: '#10b981' },
      { name: 'Failed', value: summary.totalFailed, color: '#ef4444' },
      { name: 'Skipped', value: summary.totalSkipped, color: '#f59e0b' },
    ];
  };
  
  return (
    <div className={cn("p-6", className)}>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar with upload */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Test Reports</h2>
              
              {reports.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearAllReports} 
                  title="Clear all reports"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
            
            <FileUpload onReportAdded={handleReportAdded} />
            
            <div className="space-y-3">
              {reports.map(report => (
                <TestReportCard
                  key={report.id}
                  report={report}
                  isActive={selectedReportId === report.id}
                  onClick={() => setSelectedReportId(report.id)}
                />
              ))}
            </div>
          </div>
          
          {/* Main content area */}
          {selectedReport && (
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-2xl font-semibold mb-1">{selectedReport.name}</h1>
                <p className="text-muted-foreground">
                  {new Date(selectedReport.timestamp).toLocaleString()}
                </p>
              </div>
              
              {/* Test Summary */}
              <TestSummary summary={selectedReport.summary} />
              
              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <PieChartDisplay 
                  data={getChartData()} 
                  title="Test Results" 
                />
                
                <FailureReasons 
                  features={selectedReport.features} 
                />
              </div>
              
              {/* Features */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Feature Details</h2>
                <FeatureBreakdown features={selectedReport.features} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
