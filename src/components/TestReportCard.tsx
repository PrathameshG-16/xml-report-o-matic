
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestReport } from '@/types/reportTypes';
import { FileText, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestReportCardProps {
  report: TestReport;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const TestReportCard: React.FC<TestReportCardProps> = ({ report, isActive, onClick, className }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all-200 overflow-hidden border",
        isActive 
          ? "ring-2 ring-primary/30 border-primary/50 shadow-sm bg-primary/5" 
          : "hover:border-muted hover:bg-muted/10 glass-card",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center",
            isActive ? "bg-primary/10" : "bg-muted"
          )}>
            <FileText className={cn(
              "h-5 w-5",
              isActive ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <h3 className="font-medium text-sm truncate max-w-[160px]">{report.name}</h3>
            <p className="text-xs text-muted-foreground">{formatDate(report.timestamp)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-1 text-xs text-success">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>{report.summary.totalPassed}</span>
            </div>
            
            {report.summary.totalFailed > 0 && (
              <div className="flex items-center space-x-1 text-xs text-destructive">
                <XCircle className="h-3.5 w-3.5" />
                <span>{report.summary.totalFailed}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{Math.floor(report.summary.executionTime / 60)}m</span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "transition-all h-8 w-8",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestReportCard;
