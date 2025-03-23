
import React, { useState } from 'react';
import TestSummary from './TestSummary';
import FeatureBreakdown from './FeatureBreakdown';
import FailureReasons from './FailureReasons';
import PieChartDisplay from './PieChartDisplay';
import TestReportCard from './TestReportCard';
import { TestReport } from '@/types/reportTypes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface DashboardProps {
  reports: TestReport[];
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, className }) => {
  const [selectedReportId, setSelectedReportId] = useState(reports[0]?.id || '');
  
  const selectedReport = reports.find(report => report.id === selectedReportId) || reports[0];
  
  // Data for the pie charts
  const statusData = [
    { name: 'Passed', value: selectedReport.summary.totalPassed, color: 'hsl(var(--success))' },
    { name: 'Failed', value: selectedReport.summary.totalFailed, color: 'hsl(var(--destructive))' },
    { name: 'Skipped', value: selectedReport.summary.totalSkipped, color: 'hsl(var(--warning))' }
  ];
  
  // Prepare data for features pie chart
  const featureData = selectedReport.features.map((feature, index) => {
    // Create a palette of colors from blue to purple
    const hue = 210 + (index * 20) % 60;
    const color = `hsl(${hue}, 70%, 60%)`;
    
    return {
      name: feature.name,
      value: feature.totalTests,
      color
    };
  });

  return (
    <div className={cn("p-6", className)}>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar with test reports */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <h2 className="text-xl font-semibold mb-4">Test Reports</h2>
            <ScrollArea className="h-[calc(100vh-12rem)]">
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
