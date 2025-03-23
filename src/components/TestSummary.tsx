
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TestSummary as TestSummaryType } from '@/types/reportTypes';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestSummaryProps {
  summary: TestSummaryType;
  className?: string;
}

const TestSummary: React.FC<TestSummaryProps> = ({ summary, className }) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes < 1) {
      return `${remainingSeconds}s`;
    }
    
    return `${minutes}m ${remainingSeconds}s`;
  };

  const summaryItems = [
    {
      title: "Passed",
      value: summary.totalPassed,
      icon: <CheckCircle className="h-5 w-5 text-success" />,
      bgClass: "bg-success/10"
    },
    {
      title: "Failed",
      value: summary.totalFailed,
      icon: <XCircle className="h-5 w-5 text-destructive" />,
      bgClass: "bg-destructive/10"
    },
    {
      title: "Skipped",
      value: summary.totalSkipped,
      icon: <AlertCircle className="h-5 w-5 text-warning" />,
      bgClass: "bg-warning/10"
    },
    {
      title: "Duration",
      value: formatTime(summary.executionTime),
      icon: <Clock className="h-5 w-5 text-info" />,
      bgClass: "bg-info/10"
    }
  ];

  return (
    <Card className={cn("glass-card border-0 animate-fade-in", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Test Execution Summary</h3>
            <div className="text-sm text-muted-foreground">
              {summary.totalTests} total tests across {summary.totalFeatures} features
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryItems.map((item, index) => (
              <div 
                key={item.title}
                className={cn(
                  "rounded-lg p-4 transition-all-200 hover:shadow-md flex flex-col space-y-2",
                  item.bgClass,
                  "animate-fade-in [animation-delay:var(--delay)]"
                )}
                style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{item.title}</span>
                  {item.icon}
                </div>
                <div className="text-2xl font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pass Rate</span>
              <span className="text-sm font-medium">{summary.passRate.toFixed(1)}%</span>
            </div>
            <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-success rounded-full transition-all-500"
                style={{ width: `${summary.passRate}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestSummary;
