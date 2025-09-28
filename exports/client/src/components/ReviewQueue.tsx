import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, CheckCircle, XCircle, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "approved" | "rejected" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  reviewType: string;
  resourceType: string;
  resourceId: string;
  initiatorId: string;
  dueDate?: string;
  createdAt: string;
  metadata?: any;
}

export default function ReviewQueue() {
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews'],
    enabled: true,
  });

  const getPriorityColor = (priority: Review['priority']) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: Review['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Review['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      case 'in_progress': return 'text-blue-600 dark:text-blue-400';
      case 'approved': return 'text-green-600 dark:text-green-400';
      case 'rejected': return 'text-red-600 dark:text-red-400';
      case 'cancelled': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4" data-testid="review-queue">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="review-queue">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Review Queue</h2>
          <p className="text-muted-foreground">
            Manage approval workflows and content reviews
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {reviews.length} pending reviews
        </Badge>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews pending</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              All caught up! New reviews will appear here when they need your attention.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card 
              key={review.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              data-testid={`review-item-${review.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn("p-2 rounded-lg", getStatusColor(review.status))}>
                      {getStatusIcon(review.status)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{review.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getPriorityColor(review.priority)}>
                          {review.priority}
                        </Badge>
                        <Badge variant="outline">
                          {review.reviewType}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {review.resourceType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-sm font-medium", getStatusColor(review.status))}>
                      {review.status.replace('_', ' ')}
                    </div>
                    {review.dueDate && (
                      <div className="text-sm text-muted-foreground">
                        Due {new Date(review.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {review.description && (
                  <p className="text-muted-foreground mb-4">
                    {review.description.length > 150 
                      ? `${review.description.substring(0, 150)}...`
                      : review.description
                    }
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Created {new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      data-testid={`review-view-${review.id}`}
                    >
                      View Details
                    </Button>
                    {review.status === 'pending' && (
                      <Button 
                        size="sm"
                        data-testid={`review-approve-${review.id}`}
                      >
                        Start Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}