
import React, { useState, useEffect } from 'react';
import TestSummary from './TestSummary';
import FileUpload from './FileUpload';
import { TestReport } from '../types/reportTypes';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { reportService } from '../services/reportService';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface DashboardProps {
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  const [reports, setReports] = useState<TestReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState('');
  
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
    const storageReports = reportService.getAllReports();
    setReports(storageReports);
    
    // Reset selected report if it no longer exists
    if (storageReports.length > 0) {
      if (!storageReports.some(report => report.id === selectedReportId)) {
        setSelectedReportId(storageReports[0].id);
      }
    } else {
      setSelectedReportId('');
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
            <p>Upload your first XML report to get started</p>
          </div>
        </div>
      </div>
    );
  }
  
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
                <div 
                  key={report.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedReportId === report.id 
                      ? "bg-primary/10 border-primary" 
                      : "hover:bg-muted border-transparent"
                  )}
                  onClick={() => setSelectedReportId(report.id)}
                >
                  <h3 className="font-medium truncate">{report.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(report.timestamp).toLocaleString()}
                  </p>
                </div>
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
              
              {/* Features */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Features</h2>
                
                {selectedReport.features.map(feature => (
                  <div key={feature.id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg">{feature.name}</h3>
                    <div className="flex gap-4 mt-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Tests: </span>
                        <span className="font-medium">{feature.totalTests}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Passed: </span>
                        <span className="font-medium text-green-500">{feature.passedTests}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Failed: </span>
                        <span className="font-medium text-red-500">{feature.failedTests}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Skipped: </span>
                        <span className="font-medium text-yellow-500">{feature.skippedTests}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
