"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AudioWaveform, Image, Text, Video } from "lucide-react";
import type { NodeType } from "./canvas";

interface AddNodeToolbarProps {
  onAddNode: (type: NodeType) => void;
}

const nodeTypes = [
  { type: "Text", icon: Text, label: "Add Text Node" },
  { type: "Image", icon: Image, label: "Add Image Node" },
  { type: "Video", icon: Video, label: "Add Video Node" },
  { type: "Audio", icon: AudioWaveform, label: "Add Audio Node" },
] as const;

export function AddNodeToolbar({ onAddNode }: AddNodeToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-background/70 backdrop-blur-md border shadow-lg">
        <TooltipProvider>
          {nodeTypes.map(({ type, icon: Icon, label }) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAddNode(type as NodeType)}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
