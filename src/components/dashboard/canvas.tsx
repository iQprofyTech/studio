"use client";

import React, { useState } from "react";
import { Node } from "./node";
import { AddNodeToolbar } from "./add-node-toolbar";

export type NodeType = "Text" | "Image" | "Video" | "Audio" | "Upload";

export interface NodeData {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  prompt: string;
  aspectRatio: string;
  model: string;
}

const initialNodes: NodeData[] = [
  {
    id: "1",
    type: "Image",
    position: { x: 100, y: 150 },
    prompt: "A beautiful landscape painting, digital art, high resolution",
    aspectRatio: "16:9",
    model: "Stable Diffusion",
  },
  {
    id: "2",
    type: "Text",
    position: { x: 600, y: 250 },
    prompt: "Write a short poem about this landscape.",
    aspectRatio: "1:1",
    model: "Gemini Pro",
  },
];

export function Canvas() {
  const [nodes, setNodes] = useState<NodeData[]>(initialNodes);

  const addNode = (type: NodeType) => {
    const newNode: NodeData = {
      id: `${Date.now()}`,
      type,
      // Position new nodes in the center of the viewport
      position: { x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 200 },
      prompt: "",
      aspectRatio: "1:1",
      model: "Default",
    };
    setNodes((prev) => [...prev, newNode]);
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-grid">
      <style jsx>{`
        .bg-grid {
          background-image:
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
      
      <AddNodeToolbar onAddNode={addNode} />

      {nodes.map((node) => (
        <Node key={node.id} data={node} />
      ))}
       <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/50 p-2 rounded-md backdrop-blur-sm">
        Note: Node dragging and connections require a library like React Flow. This is a visual representation.
      </div>
    </div>
  );
}
