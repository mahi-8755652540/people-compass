import { useEffect } from "react";
import { useAttendanceCapture } from "@/hooks/useAttendanceCapture";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Camera, MapPin, Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AttendanceCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (photoUrl: string, latitude: number, longitude: number, address?: string) => void;
  userId: string;
  type: "check-in" | "check-out";
}

export const AttendanceCaptureDialog = ({
  open,
  onOpenChange,
  onCapture,
  userId,
  type,
}: AttendanceCaptureDialogProps) => {
  const {
    videoRef,
    isCapturing,
    capturedImage,
    location,
    cameraError,
    locationError,
    startCamera,
    stopCamera,
    capturePhoto,
    getLocation,
    uploadPhoto,
    reset,
  } = useAttendanceCapture();

  useEffect(() => {
    if (open) {
      startCamera();
      getLocation();
    } else {
      reset();
    }
  }, [open, startCamera, getLocation, reset]);

  const handleCapture = async () => {
    console.log("handleCapture called, capturedImage:", !!capturedImage);
    
    // Use already captured image
    const photoToUpload = capturedImage;
    if (!photoToUpload) {
      console.log("No photo captured yet");
      toast.error("Please capture a photo first");
      return;
    }

    // Wait for location if not yet available
    let loc = location;
    if (!loc) {
      console.log("Getting location...");
      loc = await getLocation();
    }

    // Allow proceeding without location in preview mode
    const isPreview = window.location.hostname.includes("lovableproject.com");
    if (!loc && !isPreview) {
      console.log("Location not available");
      toast.error("Please enable location access");
      return;
    }

    console.log("Uploading photo for user:", userId);
    const photoUrl = await uploadPhoto(photoToUpload, userId);
    console.log("Photo upload result:", photoUrl);
    
    if (!photoUrl) {
      console.log("Photo upload failed");
      return;
    }

    // Use default coordinates if location unavailable in preview
    const latitude = loc?.latitude ?? 0;
    const longitude = loc?.longitude ?? 0;
    const address = loc?.address ?? (isPreview ? "Preview Mode - Location unavailable" : undefined);

    console.log("Calling onCapture with:", { photoUrl, latitude, longitude, address });
    onCapture(photoUrl, latitude, longitude, address);
    onOpenChange(false);
  };

  const handleRetake = () => {
    reset();
    startCamera();
    getLocation();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            {type === "check-in" ? "Check-In" : "Check-Out"} Verification
          </DialogTitle>
          <DialogDescription>
            Please capture your photo and allow location access to proceed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Camera Section */}
          <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-destructive p-4 text-center">
                <AlertCircle className="w-12 h-12 mb-2" />
                <p className="text-sm">{cameraError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={startCamera}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
                style={{ transform: "scaleX(-1)" }}
              />
            )}

            {isCapturing && !cameraError && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <div className="px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full text-xs font-medium">
                  Camera ready
                </div>
              </div>
            )}
          </div>

          {/* Location Status */}
          <div
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl",
              location
                ? "bg-success/10 text-success"
                : locationError
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground"
            )}
          >
            {location ? (
              <>
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">Location captured</p>
                  <p className="text-xs truncate opacity-80">
                    {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                  </p>
                </div>
              </>
            ) : locationError ? (
              <>
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Location unavailable</p>
                  <p className="text-xs opacity-80">{locationError}</p>
                </div>
                <Button variant="outline" size="sm" onClick={getLocation}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                <div>
                  <p className="text-sm font-medium">Getting location...</p>
                  <p className="text-xs opacity-80">Please wait</p>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {capturedImage ? (
              <>
                <Button variant="outline" onClick={handleRetake} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={handleCapture}
                  className={cn(
                    "flex-1",
                    type === "check-in"
                      ? "bg-success hover:bg-success/90"
                      : "bg-destructive hover:bg-destructive/90"
                  )}
                  disabled={!location && !window.location.hostname.includes("lovableproject.com")}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm {type === "check-in" ? "Check-In" : "Check-Out"}
                </Button>
              </>
            ) : (
              <Button
                onClick={capturePhoto}
                disabled={!isCapturing || !!cameraError}
                className="flex-1"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture Photo
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
