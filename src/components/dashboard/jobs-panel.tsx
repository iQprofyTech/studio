import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export function JobsPanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bot className="h-5 w-5" />
          <span className="sr-only">Jobs</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Jobs Queue</SheetTitle>
          <SheetDescription>
            Here is the status of your recent content generations.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="text-center text-muted-foreground">
            No active jobs.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
