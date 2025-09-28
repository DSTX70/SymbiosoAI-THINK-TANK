import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploaderProps {
  onFileUpload?: (fileInfo: { fileName: string; fileUrl: string; fileSize: number }) => void;
  onFileRemove?: () => void;
  maxFileSize?: number;
  acceptedTypes?: string[];
  className?: string;
  disabled?: boolean;
}

interface UploadedFile {
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

export function DocumentUploader({
  onFileUpload,
  onFileRemove,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = [".pdf", ".docx", ".doc", ".txt", ".md"],
  className = "",
  disabled = false,
}: DocumentUploaderProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)} limit`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.some(type => type.toLowerCase() === fileExtension)) {
      return `File type not supported. Allowed types: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Upload Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Get upload URL from backend
      const uploadResponse = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadURL, documentId } = await uploadResponse.json();

      // Upload file directly to storage
      const uploadFileResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadFileResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Finalize the upload with metadata
      const finalizeResponse = await fetch('/api/documents/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          uploadURL,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }),
      });

      if (!finalizeResponse.ok) {
        throw new Error('Failed to finalize upload');
      }

      const { documentUrl } = await finalizeResponse.json();

      const fileInfo = {
        fileName: file.name,
        fileUrl: documentUrl,
        fileSize: file.size,
      };

      setUploadedFile(fileInfo);
      onFileUpload?.(fileInfo);

      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    onFileRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Label htmlFor="document-upload" className="text-sm font-medium">
          Upload Document
        </Label>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <AlertCircle className="w-3 h-3" />
          <span>Max {formatFileSize(maxFileSize)}, {acceptedTypes.join(', ')}</span>
        </div>
      </div>

      {!uploadedFile ? (
        <div>
          <Input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
            data-testid="document-file-input"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            disabled={disabled || isUploading}
            className="w-full"
            data-testid="button-upload-document"
          >
            {isUploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Choose Document
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium" data-testid="text-uploaded-filename">
                {uploadedFile.fileName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(uploadedFile.fileSize)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            disabled={disabled}
            data-testid="button-remove-document"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}