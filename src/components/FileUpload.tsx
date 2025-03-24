
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, Check } from 'lucide-react';
import { reportService } from '@/services/reportService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onReportAdded: () => void;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onReportAdded, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const processFile = async (file: File) => {
    // Check file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExt || !(fileExt === 'xml' || fileExt === 'html' || fileExt === 'htm')) {
      toast.error('Please upload an XML or HTML file');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fileContent = await file.text();
      
      // Process according to file type
      if (fileExt === 'xml') {
        reportService.saveXmlReport(fileContent);
      } else {
        reportService.saveHtmlReport(fileContent);
      }
      
      toast.success('Report uploaded successfully');
      onReportAdded();
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process report file');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };
  
  return (
    <Card className={cn("border-dashed animate-fade-in", isDragging ? "border-primary" : "border-muted-foreground/20", className)}>
      <CardContent>
        <div
          className={cn(
            "flex flex-col items-center justify-center p-6 text-center cursor-pointer",
            isDragging ? "bg-primary/5" : "bg-background",
            "transition-all duration-200 rounded-lg h-40"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            type="file"
            accept=".xml,.html,.htm"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          
          {isLoading ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin">
                <Upload size={24} className="text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Processing report...</p>
            </div>
          ) : (
            <label htmlFor="file-upload" className="flex flex-col items-center space-y-3 cursor-pointer w-full h-full">
              <div className="bg-primary/10 p-3 rounded-full">
                <Upload size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">Upload Test Report</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports XML and HTML formats
                </p>
              </div>
            </label>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
