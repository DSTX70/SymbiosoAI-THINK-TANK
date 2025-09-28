import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2, Download } from "lucide-react";
import { getAllDrafts, deleteDraft } from "@/lib/idb";

interface Draft {
  id: string;
  data: any;
  timestamp: number;
}

export default function DraftsManager() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const allDrafts = await getAllDrafts();
      setDrafts(allDrafts);
    } catch (error) {
      console.error('Failed to load drafts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDraft = async (id: string) => {
    try {
      await deleteDraft(id);
      setDrafts(drafts.filter(draft => draft.id !== id));
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  if (isLoading) {
    return (
      <div data-testid="drafts-manager" className="p-4">
        <div className="text-center">Loading drafts...</div>
      </div>
    );
  }

  return (
    <div data-testid="drafts-manager" className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Drafts</h2>
        <Badge variant="secondary">{drafts.length} drafts</Badge>
      </div>

      {drafts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No drafts saved yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {drafts.map((draft) => (
            <Card key={draft.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Draft {draft.id}</CardTitle>
                    <CardDescription>
                      Saved {new Date(draft.timestamp).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid={`restore-draft-${draft.id}`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteDraft(draft.id)}
                      data-testid={`delete-draft-${draft.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}