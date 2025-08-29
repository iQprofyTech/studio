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
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<NodeData>) => void;
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
      model: "DALL-E 3",
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

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, [setNodes, setEdges]);
  
  const updateNodeData = useCallback((id: string, data: Partial<NodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...data } } : node
        )
      );
  }, [setNodes]);

  const addNode = (type: NodeType) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type: "custom",
      position: {
        x: window.innerWidth / 2 - 190,
        y: window.innerHeight / 3 - 150,
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
  
  const nodesWithCallbacks = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onDelete: deleteNode,
      onUpdate: updateNodeData,
    },
  }));

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden">
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background gap={40} />
         <MiniMap className="!bg-background" zoomable pannable />
        <Controls className="[&_button]:!bg-background [&_button]:!border-border [&_button:hover]:!bg-muted" />
      </ReactFlow>
      
      <AddNodeToolbar onAddNode={addNode} />
    </div>
  );
}
