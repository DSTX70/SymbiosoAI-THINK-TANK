import type { ActionableApiError } from "@/lib/authUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface InlineActionErrorProps {
  error: ActionableApiError;
  onDismiss?: () => void;
  className?: string;
}

export function InlineActionError({
  error,
  onDismiss,
  className,
}: InlineActionErrorProps) {
  return (
    <Alert variant={error.variant || "warning"} className={className}>
      <AlertTriangle className="h-4 w-4" />
      <div className="space-y-3">
        <div className="pr-8">
          <AlertTitle>{error.title}</AlertTitle>
          <AlertDescription>{error.description}</AlertDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {error.primaryAction && (
            <Button size="sm" variant="default" onClick={error.primaryAction.onClick}>
              {error.primaryAction.label}
            </Button>
          )}
          {error.secondaryAction && (
            <Button size="sm" variant="outline" onClick={error.secondaryAction.onClick}>
              {error.secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
      {onDismiss && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  );
}
