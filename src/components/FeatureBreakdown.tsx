
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FeatureResult } from '@/types/reportTypes';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureBreakdownProps {
  features: FeatureResult[];
  className?: string;
}

const FeatureBreakdown: React.FC<FeatureBreakdownProps> = ({ features, className }) => {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const toggleFeature = (featureId: string) => {
    if (expandedFeature === featureId) {
      setExpandedFeature(null);
    } else {
      setExpandedFeature(featureId);
    }
  };

  return (
    <Card className={cn("glass-card border-0 animate-fade-in", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Feature Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div 
                key={feature.id}
                className="animate-slide-in [animation-delay:var(--delay)]"
                style={{ '--delay': `${index * 50}ms` } as React.CSSProperties}
              >
                <div 
                  className={cn(
                    "p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all-200 cursor-pointer",
                    { "rounded-b-none": expandedFeature === feature.id }
                  )}
                  onClick={() => toggleFeature(feature.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium">{feature.name}</span>
                      <div className="ml-3 flex items-center space-x-2">
                        <StatusBadge value={feature.passedTests} type="passed" />
                        {feature.failedTests > 0 && (
                          <StatusBadge value={feature.failedTests} type="failed" />
                        )}
                        {feature.skippedTests > 0 && (
                          <StatusBadge value={feature.skippedTests} type="skipped" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-3 text-sm text-muted-foreground">
                        {feature.totalTests} tests
                      </div>
                      {expandedFeature === feature.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedFeature === feature.id && (
                  <div className="p-4 rounded-b-lg border border-t-0 border-secondary bg-background/50 animate-fade-in">
                    <div className="space-y-2">
                      {feature.testCases.map((test) => (
                        <div 
                          key={test.id}
                          className={cn(
                            "p-3 text-sm rounded flex justify-between items-center",
                            test.status === "passed" ? "bg-success/5" : 
                            test.status === "failed" ? "bg-destructive/5" : "bg-warning/5"
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            <StatusDot status={test.status} />
                            <span>{test.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {test.duration.toFixed(1)}s
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface StatusBadgeProps {
  value: number;
  type: 'passed' | 'failed' | 'skipped';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ value, type }) => {
  if (value === 0) return null;
  
  const bgColor = 
    type === 'passed' ? 'bg-success/10 text-success' : 
    type === 'failed' ? 'bg-destructive/10 text-destructive' : 
    'bg-warning/10 text-warning';
  
  return (
    <div className={cn("text-xs px-2 py-0.5 rounded-full font-medium", bgColor)}>
      {value}
    </div>
  );
};

interface StatusDotProps {
  status: 'passed' | 'failed' | 'skipped';
}

const StatusDot: React.FC<StatusDotProps> = ({ status }) => {
  const bgColor = 
    status === 'passed' ? 'bg-success' : 
    status === 'failed' ? 'bg-destructive' : 
    'bg-warning';
  
  return (
    <div className={cn("h-2 w-2 rounded-full", bgColor)} />
  );
};

export default FeatureBreakdown;
