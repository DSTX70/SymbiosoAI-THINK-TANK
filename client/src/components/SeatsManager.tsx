import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Minus, Save, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SeatsData {
  orgId: string;
  seats: number;
  updatedAt: string;
}

export default function SeatsManager() {
  const [currentSeats, setCurrentSeats] = useState<number>(5);
  const [newSeats, setNewSeats] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // In a real implementation, this would fetch current seats from API
    const fetchSeats = async () => {
      try {
        // Mock API call - in production this would be GET /billing/seats
        const mockSeats = 5;
        setCurrentSeats(mockSeats);
        setNewSeats(mockSeats);
      } catch (error) {
        console.error('Failed to fetch seats:', error);
        toast({
          title: "Error",
          description: "Failed to load current seat count",
          variant: "destructive"
        });
      }
    };

    fetchSeats();
  }, [toast]);

  useEffect(() => {
    setHasChanges(newSeats !== currentSeats);
  }, [newSeats, currentSeats]);

  const handleSeatsChange = (value: number) => {
    const clampedValue = Math.max(1, Math.min(1000, value));
    setNewSeats(clampedValue);
  };

  const incrementSeats = () => {
    handleSeatsChange(newSeats + 1);
  };

  const decrementSeats = () => {
    handleSeatsChange(newSeats - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    handleSeatsChange(value);
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setLoading(true);
    try {
      // In production, this would be PUT /billing/seats
      // const response = await fetch('/billing/seats', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ seats: newSeats })
      // });

      // Mock successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentSeats(newSeats);
      toast({
        title: "Seats Updated",
        description: `Organization seats updated to ${newSeats}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to update seats:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update seat count. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCostDelta = () => {
    const seatPrice = 29; // $29 per seat per month (mock pricing)
    const delta = (newSeats - currentSeats) * seatPrice;
    return { delta, seatPrice };
  };

  const { delta, seatPrice } = calculateCostDelta();

  return (
    <Card data-testid="seats-manager" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Seat Management
        </CardTitle>
        <CardDescription>
          Manage your organization's user seat allocation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Seats Display */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm font-medium">Current Seats</p>
            <p className="text-2xl font-bold">{currentSeats}</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            ${seatPrice}/month each
          </Badge>
        </div>

        {/* Seat Adjuster */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Adjust Seats</label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementSeats}
              disabled={newSeats <= 1 || loading}
              data-testid="button-decrease"
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 max-w-24">
              <Input
                type="number"
                value={newSeats}
                onChange={handleInputChange}
                min={1}
                max={1000}
                disabled={loading}
                data-testid="input-seats"
                className="text-center"
              />
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={incrementSeats}
              disabled={newSeats >= 1000 || loading}
              data-testid="button-increase"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Cost Impact */}
        {hasChanges && (
          <div className={`p-3 rounded-lg border ${delta >= 0 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className={`w-4 h-4 mt-0.5 ${delta >= 0 ? 'text-orange-600' : 'text-green-600'}`} />
              <div className="text-sm">
                <p className="font-medium">
                  {delta >= 0 ? 'Billing Increase' : 'Billing Decrease'}
                </p>
                <p className={delta >= 0 ? 'text-orange-700' : 'text-green-700'}>
                  {delta >= 0 ? '+' : ''}${Math.abs(delta)}/month
                  {delta >= 0 ? ' will be prorated on your next invoice' : ' credit will be applied'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!hasChanges || loading}
          className="w-full"
          data-testid="button-save"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Updating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>

        {/* Usage Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Seat changes take effect immediately</p>
          <p>• Billing adjustments are prorated</p>
          <p>• Minimum 1 seat, maximum 1000 seats</p>
        </div>
      </CardContent>
    </Card>
  );
}