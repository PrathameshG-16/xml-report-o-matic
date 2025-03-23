
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FeatureResult } from '@/types/reportTypes';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FailureReasonsProps {
  features: FeatureResult[];
  className?: string;
}

const FailureReasons: React.FC<FailureReasonsProps> = ({ features, className }) => {
  // Extract all failed test cases with their feature name
  const failedTests = features.flatMap(feature => 
    feature.testCases
      .filter(test => test.status === 'failed')
      .map(test => ({
        featureName: feature.name,
        featureId: feature.id,
        ...test
      }))
  );

  if (failedTests.length === 0) {
    return (
      <Card className={cn("glass-card border-0 animate-fade-in", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-success" />
            Failure Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No test failures found. All tests passed successfully!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("glass-card border-0 animate-fade-in", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
          Failure Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {failedTests.map((test, index) => (
              <div 
                key={test.id}
                className="p-4 rounded-lg bg-destructive/5 border border-destructive/10 animate-slide-in [animation-delay:var(--delay)]"
                style={{ '--delay': `${index * 50}ms` } as React.CSSProperties}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-6 w-6 flex items-center justify-center bg-destructive/10 rounded-full">
                      <XIcon className="h-3.5 w-3.5 text-destructive" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {test.featureName}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{test.name}</p>
                    {test.failureReason && (
                      <div className="text-sm text-muted-foreground mt-1 flex items-start">
                        <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0 text-destructive/60" />
                        <span className="text-xs">{test.failureReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Custom X icon for better consistency with design
const XIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

export default FailureReasons;
