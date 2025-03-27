
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TestSummary as TestSummaryType } from '../types/reportTypes';
import { cn } from '../lib/utils';

interface TestSummaryProps {
  summary: TestSummaryType;
  className?: string;
}

const TestSummary: React.FC<TestSummaryProps> = ({ summary, className }) => {
  // Format execution time to be more readable
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds.toFixed(2)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle>Test Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
            <p className="text-2xl font-bold">{summary.totalTests}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
            <p className="text-2xl font-bold text-green-500">
              {summary.passRate.toFixed(1)}%
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Execution Time</p>
            <p className="text-2xl font-bold">{formatTime(summary.executionTime)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Features</p>
            <p className="text-2xl font-bold">{summary.totalFeatures}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Passed</p>
            <p className="text-2xl font-bold text-green-500">{summary.totalPassed}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Failed</p>
            <p className="text-2xl font-bold text-red-500">{summary.totalFailed}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Skipped</p>
            <p className="text-2xl font-bold text-yellow-500">{summary.totalSkipped}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestSummary;
