
import React, { useState, useEffect } from 'react';
import TestSummary from './TestSummary';
import FeatureBreakdown from './FeatureBreakdown';
import FailureReasons from './FailureReasons';
import PieChartDisplay from './PieChartDisplay';
import TestReportCard from './TestReportCard';
import FileUpload from './FileUpload';
import { TestReport } from '@/types/reportTypes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { reportService } from '@/services/reportService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DashboardProps {
  reports?: TestReport[];
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ reports: initialReports, className }) => {
  const [reports, setReports] = useState<TestReport[]>(initialReports || []);
  const [selectedReportId, setSelectedReportId] = useState('');
  
  useEffect(() => {
    // Load reports from storage if no initial reports provided
    if (!initialReports || initialReports.length === 0) {
      loadReports();
    }
  }, [initialReports]);
  
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
            <h1 className="text-2xl font-semibold">XML Report Visualizer</h1>
            <p className="text-muted-foreground">
              Upload your Cucumber XML reports to visualize test results
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
  
  // Prepare data for charts if there's a selected report
  let statusData: { name: string; value: number; color: string }[] = [];
  let featureData: { name: string; value: number; color: string }[] = [];
  
  if (selectedReport) {
    // Data for the status pie chart
    statusData = [
      { name: 'Passed', value: selectedReport.summary.totalPassed, color: 'hsl(var(--success))' },
      { name: 'Failed', value: selectedReport.summary.totalFailed, color: 'hsl(var(--destructive))' },
      { name: 'Skipped', value: selectedReport.summary.totalSkipped, color: 'hsl(var(--warning))' }
    ];
    
    // Prepare data for features pie chart
    featureData = selectedReport.features.map((feature, index) => {
      // Create a palette of colors from blue to purple
      const hue = 210 + (index * 20) % 60;
      const color = `hsl(${hue}, 70%, 60%)`;
      
      return {
        name: feature.name,
        value: feature.totalTests,
        color
      };
    });
  }

  return (
    <div className={cn("p-6", className)}>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar with test reports and upload */}
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
            
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-3 pr-4">
                {reports.map(report => (
                  <TestReportCard
                    key={report.id}
                    report={report}
                    isActive={selectedReportId === report.id}
                    onClick={() => setSelectedReportId(report.id)}
                  />
                ))}
              </div>
            </ScrollArea>
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
              
              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PieChartDisplay 
                  data={statusData} 
                  title="Test Status Distribution" 
                />
                <PieChartDisplay 
                  data={featureData} 
                  title="Tests by Feature" 
                />
              </div>
              
              {/* Feature breakdown and failure reasons */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FeatureBreakdown features={selectedReport.features} />
                <FailureReasons features={selectedReport.features} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
