import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

type WorkspaceSummary = {
  id: string;
  name: string;
  description?: string | null;
  ownerId?: string;
  isPrivate?: boolean | null;
};

type WorkspaceContextValue = {
  workspaces: WorkspaceSummary[];
  activeWorkspace: WorkspaceSummary | null;
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (workspaceId: string | null) => void;
  isLoading: boolean;
};

const ACTIVE_WORKSPACE_KEY = "active_workspace_id";

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function readStoredWorkspaceId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_WORKSPACE_KEY);
}

export function WorkspaceContextProvider({ children }: { children: ReactNode }) {
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string | null>(readStoredWorkspaceId);
  const { data, isLoading } = useQuery<WorkspaceSummary[] | null>({
    queryKey: ["/api/workspaces"],
    retry: false,
  });

  const workspaces = Array.isArray(data) ? data : [];

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (workspaces.length === 0) {
      setActiveWorkspaceIdState(null);
      localStorage.removeItem(ACTIVE_WORKSPACE_KEY);
      return;
    }

    const hasSelectedWorkspace = activeWorkspaceId && workspaces.some((workspace) => workspace.id === activeWorkspaceId);
    if (hasSelectedWorkspace) return;

    const nextWorkspaceId = workspaces[0].id;
    setActiveWorkspaceIdState(nextWorkspaceId);
    localStorage.setItem(ACTIVE_WORKSPACE_KEY, nextWorkspaceId);
  }, [workspaces, activeWorkspaceId]);

  const setActiveWorkspaceId = (workspaceId: string | null) => {
    setActiveWorkspaceIdState(workspaceId);
    if (typeof window === "undefined") return;

    if (workspaceId) {
      localStorage.setItem(ACTIVE_WORKSPACE_KEY, workspaceId);
    } else {
      localStorage.removeItem(ACTIVE_WORKSPACE_KEY);
    }
  };

  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId) || null;

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        activeWorkspaceId,
        setActiveWorkspaceId,
        isLoading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceContext must be used within WorkspaceContextProvider");
  }
  return context;
}
