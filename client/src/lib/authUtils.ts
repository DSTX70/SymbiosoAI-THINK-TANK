export interface ParsedApiError {
  status?: number;
  code?: string;
  message: string;
  type?: string;
}

export interface ActionableApiError {
  title: string;
  description: string;
  variant?: "default" | "warning" | "destructive";
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

interface ActionableApiErrorOptions {
  onLogin?: () => void;
  onOpenWorkspace?: () => void;
  onUpgrade?: () => void;
}

const AUTH_CODES = new Set([
  "AUTH_REQUIRED",
  "AUTHENTICATION_REQUIRED",
  "INVALID_CREDENTIALS",
  "UNAUTHORIZED",
  "UNAUTHENTICATED",
]);

function parseErrorPayload(payload: string): ParsedApiError {
  const trimmed = payload.trim();

  if (!trimmed) {
    return { message: "Request failed" };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const envelope = parsed?.error ?? parsed;
    return {
      code: envelope?.code,
      message: envelope?.message || trimmed,
      type: envelope?.type,
    };
  } catch {
    return { message: trimmed };
  }
}

export function parseApiError(error: unknown): ParsedApiError {
  if (error instanceof Error) {
    const match = error.message.match(/^(\d+):\s*([\s\S]*)$/);
    if (match) {
      const status = Number(match[1]);
      const parsed = parseErrorPayload(match[2] || "");
      return {
        status,
        code: parsed.code,
        message: parsed.message,
        type: parsed.type,
      };
    }

    return { message: error.message };
  }

  if (typeof error === "string") {
    return parseErrorPayload(error);
  }

  return { message: "Request failed" };
}

export function isUnauthorizedError(error: unknown): boolean {
  const parsed = parseApiError(error);
  return parsed.status === 401 || (!!parsed.code && AUTH_CODES.has(parsed.code));
}

export function getActionableApiError(
  error: unknown,
  options: ActionableApiErrorOptions = {},
): ActionableApiError | null {
  const parsed = parseApiError(error);
  const normalizedMessage = parsed.message.toLowerCase();
  const normalizedCode = parsed.code?.toLowerCase() || "";

  if (parsed.status === 401 || (parsed.code && AUTH_CODES.has(parsed.code))) {
    return {
      title: "Sign in required",
      description: parsed.message || "Please sign in to continue.",
      variant: "destructive",
      primaryAction: options.onLogin
        ? { label: "Sign in", onClick: options.onLogin }
        : undefined,
    };
  }

  const workspaceRequired =
    normalizedCode === "workspace_context_required" ||
    normalizedMessage.includes("workspace context required") ||
    normalizedMessage.includes("create or select workspace") ||
    normalizedMessage.includes("select workspace");

  if (workspaceRequired) {
    return {
      title: "Workspace required",
      description:
        parsed.message ||
        "Expert mode requires an active workspace before you can run analysis.",
      variant: "warning",
      primaryAction: options.onOpenWorkspace
        ? { label: "Open workspace", onClick: options.onOpenWorkspace }
        : undefined,
      secondaryAction: options.onUpgrade
        ? { label: "Upgrade plan", onClick: options.onUpgrade }
        : undefined,
    };
  }

  const planRequired =
    parsed.status === 403 ||
    normalizedCode.includes("entitlement") ||
    normalizedCode.includes("plan") ||
    normalizedCode.includes("billing") ||
    normalizedMessage.includes("upgrade") ||
    normalizedMessage.includes("plan required") ||
    normalizedMessage.includes("premium") ||
    normalizedMessage.includes("enterprise") ||
    normalizedMessage.includes("pro plan") ||
    normalizedMessage.includes("subscription");

  if (planRequired) {
    return {
      title: "Plan or permission required",
      description: parsed.message || "Your account does not currently have access to this feature.",
      variant: "warning",
      primaryAction: options.onUpgrade
        ? { label: "Open billing", onClick: options.onUpgrade }
        : undefined,
    };
  }

  return null;
}
