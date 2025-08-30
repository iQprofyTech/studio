
"use client";

import { AudioWaveform, Image, Text, Video } from "lucide-react";
import type { NodeType } from "./canvas";
import { nodeInfo } from "./node-info";

interface ContextMenuProps {
  top: number;
  left: number;
  onClick: (type: NodeType) => void;
}

const nodeTypes = [
  { type: "Text", icon: Text, label: "Text" },
  { type: "Image", icon: Image, label: "Image" },
  { type: "Video", icon: Video, label: "Video" },
  { type: "Audio", icon: AudioWaveform, label: "Audio" },
] as const;

export function ContextMenu({ top, left, onClick }: ContextMenuProps) {
  return (
    <div
      style={{ top, left }}
      className="absolute z-50"
    >
      <div className="flex flex-col gap-2 p-2 rounded-2xl bg-background/80 backdrop-blur-md border shadow-lg">
        {nodeTypes.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onClick(type)}
            className="flex items-center gap-2 w-full text-left p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Icon className="h-5 w-5" style={{ color: nodeInfo[type].color }}/>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
