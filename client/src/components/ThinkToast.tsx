import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Brain } from "lucide-react";

interface ThinkToastProps {
  isProcessing: boolean;
  processingProgress: number;
  onCancel: () => void;
}

export default function ThinkToast({ isProcessing, processingProgress, onCancel }: ThinkToastProps) {
  if (!isProcessing) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-80 pointer-events-auto">
      <Card className="border-primary bg-card shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium">Expert Analysis</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onCancel}
              data-testid="button-cancel-processing"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Processing...</span>
              <span>{Math.round(processingProgress)}%</span>
            </div>
            <Progress value={processingProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}