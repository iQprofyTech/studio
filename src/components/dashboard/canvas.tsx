"use client";

import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  MiniMap,
  Controls,
  Background,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "reactflow";
import "reactflow/dist/style.css";

import { Node as CustomNode } from "./node";
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

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 100, y: 150 },
    data: {
      type: "Image",
      prompt: "A beautiful landscape painting, digital art, high resolution",
      aspectRatio: "16:9",
      model: "Stable Diffusion",
    },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 600, y: 250 },
    data: {
      type: "Text",
      prompt: "Write a short poem about this landscape.",
      aspectRatio: "1:1",
      model: "Gemini Pro",
    },
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  custom: CustomNode,
};

export function Canvas() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const addNode = (type: NodeType) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type: "custom",
      position: {
        x: window.innerWidth / 2 - 190,
        y: window.innerHeight / 3,
      },
      data: {
        type,
        prompt: "",
        aspectRatio: "1:1",
        model: "Default",
      },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={40} />
      </ReactFlow>
      
      <AddNodeToolbar onAddNode={addNode} />
    </div>
  );
}
