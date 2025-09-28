import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, AlertCircle, CheckCircle, XCircle, FileText, 
  User, Calendar, MessageSquare, ThumbsUp, ThumbsDown 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewDetailProps {
  reviewId: string;
  onClose?: () => void;
}

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
  completedAt?: string;
  completedBy?: string;
  metadata?: any;
}

interface ReviewStep {
  id: string;
  stepNumber: number;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "skipped";
  isRequired: boolean;
  canSkip: boolean;
  completedAt?: string;
  completedBy?: string;
}

interface ReviewComment {
  id: string;
  authorId: string;
  content: string;
  commentType: "comment" | "question" | "suggestion" | "objection" | "approval_note";
  isInternal: boolean;
  createdAt: string;
}

export default function ReviewDetail({ reviewId, onClose }: ReviewDetailProps) {
  const [comment, setComment] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const { toast } = useToast();

  const { data: review, isLoading } = useQuery<Review>({
    queryKey: ['/api/reviews', reviewId],
    enabled: !!reviewId,
  });

  const { data: steps = [] } = useQuery<ReviewStep[]>({
    queryKey: ['/api/reviews', reviewId, 'steps'],
    enabled: !!reviewId,
  });

  const { data: comments = [] } = useQuery<ReviewComment[]>({
    queryKey: ['/api/reviews', reviewId, 'comments'],
    enabled: !!reviewId,
  });

  const approveMutation = useMutation({
    mutationFn: (data: { comment?: string }) =>
      apiRequest(`/api/reviews/${reviewId}/approve`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Review approved successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      onClose?.();
    },
    onError: () => {
      toast({ title: "Failed to approve review", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (data: { comment: string; reason?: string }) =>
      apiRequest(`/api/reviews/${reviewId}/reject`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Review rejected" });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      onClose?.();
    },
    onError: () => {
      toast({ title: "Failed to reject review", variant: "destructive" });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (data: { content: string; commentType?: string }) =>
      apiRequest(`/api/reviews/${reviewId}/comments`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "Comment added successfully" });
      setComment("");
      setShowCommentForm(false);
      queryClient.invalidateQueries({ queryKey: ['/api/reviews', reviewId, 'comments'] });
    },
    onError: () => {
      toast({ title: "Failed to add comment", variant: "destructive" });
    },
  });

  const handleApprove = () => {
    approveMutation.mutate({ comment: comment || undefined });
  };

  const handleReject = () => {
    if (!comment.trim()) {
      toast({ title: "Rejection reason is required", variant: "destructive" });
      return;
    }
    rejectMutation.mutate({ comment: comment, reason: "User rejected" });
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    commentMutation.mutate({ content: comment, commentType: "comment" });
  };

  const getStatusIcon = (status: Review['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'in_progress': return <AlertCircle className="h-5 w-5" />;
      case 'approved': return <CheckCircle className="h-5 w-5" />;
      case 'rejected': return <XCircle className="h-5 w-5" />;
      case 'cancelled': return <XCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
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

  const getPriorityColor = (priority: Review['priority']) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4" data-testid={`review-detail-${reviewId}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-8" data-testid={`review-detail-${reviewId}`}>
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Review not found</h3>
        <p className="text-muted-foreground">The requested review could not be loaded.</p>
      </div>
    );
  }

  const canApprove = review.status === 'pending' || review.status === 'in_progress';

  return (
    <div className="space-y-6" data-testid={`review-detail-${reviewId}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={cn("p-3 rounded-lg", getStatusColor(review.status))}>
                {getStatusIcon(review.status)}
              </div>
              <div>
                <CardTitle className="text-xl">{review.title}</CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={getPriorityColor(review.priority)}>
                    {review.priority}
                  </Badge>
                  <Badge variant="outline">
                    {review.reviewType}
                  </Badge>
                  <Badge variant="secondary">
                    {review.resourceType}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={cn("text-lg font-semibold", getStatusColor(review.status))}>
                {review.status.replace('_', ' ')}
              </div>
              {review.dueDate && (
                <div className="text-sm text-muted-foreground mt-1">
                  Due {new Date(review.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {review.description && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{review.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Initiated by {review.initiatorId}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Created {new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            {review.completedAt && (
              <>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Completed {new Date(review.completedAt).toLocaleDateString()}</span>
                </div>
                {review.completedBy && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Completed by {review.completedBy}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Steps */}
      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Review Steps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium bg-muted rounded-full w-6 h-6 flex items-center justify-center">
                      {step.stepNumber}
                    </div>
                    <div>
                      <h5 className="font-medium">{step.title}</h5>
                      {step.description && (
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={step.status === 'completed' ? 'default' : 'outline'}>
                    {step.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Comments ({comments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-muted pl-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{comment.authorId}</span>
                    <Badge variant="outline" className="text-xs">
                      {comment.commentType}
                    </Badge>
                    {comment.isInternal && (
                      <Badge variant="secondary" className="text-xs">Internal</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No comments yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {canApprove && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Add Comment (Optional)</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your review comments here..."
                  className="mt-1"
                  data-testid={`review-comment-${reviewId}`}
                />
              </div>
              
              <Separator />
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleApprove}
                  disabled={approveMutation.isPending}
                  className="flex-1"
                  data-testid={`review-approve-${reviewId}`}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {approveMutation.isPending ? 'Approving...' : 'Approve'}
                </Button>
                
                <Button
                  onClick={handleReject}
                  disabled={rejectMutation.isPending}
                  variant="destructive"
                  className="flex-1"
                  data-testid={`review-reject-${reviewId}`}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                </Button>
              </div>
              
              {!canApprove && (
                <Button
                  onClick={handleAddComment}
                  disabled={commentMutation.isPending || !comment.trim()}
                  variant="outline"
                  className="w-full"
                  data-testid={`review-add-comment-${reviewId}`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {commentMutation.isPending ? 'Adding...' : 'Add Comment'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}