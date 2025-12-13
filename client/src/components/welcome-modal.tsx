import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  LayoutDashboard,
  Search,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Shield,
} from "lucide-react";

const STORAGE_KEY = "moderator-hub-welcome-seen";

const steps = [
  {
    icon: Shield,
    title: "Welcome to ModeratorHub",
    description:
      "Your powerful admin dashboard for managing users and content. Let's take a quick tour of what you can do here.",
    badge: "Getting Started",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard Overview",
    description:
      "Get a bird's-eye view of your platform with real-time statistics on users, posts, and engagement metrics all in one place.",
    badge: "Dashboard",
  },
  {
    icon: Users,
    title: "User Management",
    description:
      "Browse, search, and view detailed profiles of all users. See their contact information, company details, and recent activity.",
    badge: "Users",
  },
  {
    icon: FileText,
    title: "Post Moderation",
    description:
      "Review and manage all user-generated content. Filter posts by author, view comments, and keep your community safe.",
    badge: "Posts",
  },
  {
    icon: Search,
    title: "Powerful Search",
    description:
      "Find anything instantly with our smart search. Filter users by name or email, and posts by title or content.",
    badge: "Search",
  },
];

function getStorageValue(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStorageValue(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage not available
  }
}

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenWelcome = getStorageValue(STORAGE_KEY);
    if (!hasSeenWelcome) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setStorageValue(STORAGE_KEY, "true");
    setOpen(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-welcome">
        <DialogHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              {currentStep === 0 && (
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="mx-auto mb-2 w-fit">
            {step.badge}
          </Badge>
          <DialogTitle className="text-xl" data-testid="text-welcome-title">
            {step.title}
          </DialogTitle>
          <DialogDescription className="text-center pt-2" data-testid="text-welcome-description">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-1.5 py-4" data-testid="container-step-indicators">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30"
              }`}
              onClick={() => setCurrentStep(index)}
              data-testid={`button-welcome-step-${index}`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <DialogFooter className="flex flex-row gap-2 sm:justify-between">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 0}
            data-testid="button-welcome-prev"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex gap-2">
            {!isLastStep && (
              <Button variant="ghost" onClick={handleClose} data-testid="button-welcome-skip">
                Skip
              </Button>
            )}
            <Button onClick={handleNext} data-testid="button-welcome-next">
              {isLastStep ? (
                "Get Started"
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
