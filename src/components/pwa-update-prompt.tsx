import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";

interface PWAUpdatePromptProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

export function PWAUpdatePrompt({ onUpdate, onDismiss }: PWAUpdatePromptProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleUpdate = () => {
    onUpdate();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    onDismiss();
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Update Available
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            A new version of the app is available with improvements and bug
            fixes.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              onClick={handleUpdate}
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Now
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing PWA updates
export function usePWAUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateSW, setUpdateSW] = useState<
    ((reloadPage?: boolean) => Promise<void>) | null
  >(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      import("virtual:pwa-register")
        .then(({ registerSW }) => {
          const updateFunction = registerSW({
            onNeedRefresh() {
              setNeedRefresh(true);
            },
            onOfflineReady() {
              console.log("App ready to work offline");
            },
            onRegistered(registration) {
              console.log("SW Registered: ", registration);

              // Check for updates every 30 seconds
              if (registration) {
                setInterval(() => {
                  registration.update();
                }, 30000);
              }
            },
            onRegisterError(error) {
              console.log("SW registration error", error);
            },
          });
          setUpdateSW(() => updateFunction);
        })
        .catch(error => {
          console.log("PWA registration failed:", error);
        });
    }
  }, []);

  const handleUpdate = () => {
    if (updateSW) {
      updateSW(true);
    }
  };

  const handleDismiss = () => {
    setNeedRefresh(false);
  };

  return {
    needRefresh,
    handleUpdate,
    handleDismiss,
  };
}
