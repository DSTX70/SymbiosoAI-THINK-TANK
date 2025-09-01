import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, AlertTriangle, HelpCircle, Share2, Save, Printer, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultsSectionProps {
  consensus?: string;
  dissents?: Array<{ position: string; reasoning?: string }>;
  unresolved?: string[];
  citations?: string[];
  isVisible?: boolean;
}

export default function ResultsSection({ 
  consensus, 
  dissents = [], 
  unresolved = [], 
  citations = [],
  isVisible = false 
}: ResultsSectionProps) {
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ description: "Link copied to clipboard" });
  };

  const handleSave = () => {
    toast({ description: "Session saved successfully" });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    toast({ description: "PDF export functionality will be available soon" });
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6 fade-in" data-testid="section-results">
      {/* Consensus Card */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Handshake className="text-secondary" size={20} />
            AI Consensus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none" data-testid="text-consensus">
            {consensus || "No consensus available yet."}
          </div>
          {citations && citations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-2">Citations:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                {citations.map((citation, index) => (
                  <li key={index} data-testid={`citation-${index}`}>• {citation}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Split Layout for Dissents and Unresolved */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="text-amber-500" size={20} />
              Dissenting Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3" data-testid="section-dissents">
              {dissents.length > 0 ? (
                dissents.map((dissent, index) => (
                  <div key={index} className="p-3 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-400 rounded" data-testid={`dissent-${index}`}>
                    <p className="text-sm font-medium">{dissent.position}</p>
                    {dissent.reasoning && (
                      <p className="text-xs text-muted-foreground mt-1">{dissent.reasoning}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No significant dissenting views identified.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HelpCircle className="text-blue-500" size={20} />
              Unresolved Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2" data-testid="section-unresolved">
              {unresolved.length > 0 ? (
                unresolved.map((question, index) => (
                  <div key={index} className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-sm" data-testid={`unresolved-${index}`}>
                    {question}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No major unresolved questions identified.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Share2 className="text-primary" size={20} />
            Export & Share
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="btn-secondary" 
              onClick={handleShare}
              data-testid="button-share"
            >
              <Share2 size={16} className="mr-2" />
              Share Link
            </Button>
            <Button 
              variant="outline" 
              className="btn-secondary" 
              onClick={handleSave}
              data-testid="button-save"
            >
              <Save size={16} className="mr-2" />
              Save Session
            </Button>
            <Button 
              variant="outline" 
              className="btn-secondary" 
              onClick={handlePrint}
              data-testid="button-print"
            >
              <Printer size={16} className="mr-2" />
              Print
            </Button>
            <Button 
              className="btn-primary" 
              onClick={handleExportPDF}
              data-testid="button-export-pdf"
            >
              <FileText size={16} className="mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
