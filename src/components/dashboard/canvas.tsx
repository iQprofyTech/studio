
"use client";

import React, { useCallback, useState, useMemo } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";

import { AddNodeToolbar } from "./add-node-toolbar";
import { Node as CustomNode } from "./node";
import { nodeInfo } from "./node-info";

export type NodeType = "Text" | "Image" | "Video" | "Audio";

export interface NodeData {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  prompt: string;
  aspectRatio: string;
  model: string;
  output?: string | null; // Can be text, or data URI for image/video/audio
  isGenerating: boolean;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    data: Partial<Omit<NodeData, "id" | "onDelete" | "onUpdate">>
  ) => void;
  // Passing these down to each node for connection logic
  nodes: Node<NodeData>[];
  edges: Edge[];
}

const initialNodes: Node<NodeData>[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 100, y: 150 },
    data: {
      id: "1",
      type: "Image",
      prompt: "A beautiful landscape painting, digital art, high resolution",
      aspectRatio: "1:1",
      model: "Imagen 4",
      output: null,
      isGenerating: false,
      // @ts-ignore
      onDelete: () => {},
      // @ts-ignore
      onUpdate: () => {},
      nodes: [],
      edges: [],
    },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 600, y: 250 },
    data: {
      id: "2",
      type: "Text",
      prompt: "Write a short poem about this landscape.",
      aspectRatio: "1:1",
      model: "Gemini 1.5 Pro",
      output: null,
      isGenerating: false,
      // @ts-ignore
      onDelete: () => {},
      // @ts-ignore
      onUpdate: () => {},
      nodes: [],
      edges: [],
    },
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  custom: CustomNode,
};

export function Canvas() {
  const [nodes, setNodes] = useState<Node<NodeData>[]>(initialNodes);
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
    (connection: Connection) => {
      const sourceNode = nodes.find(node => node.id === connection.source);
      if (!sourceNode) return;

      const newEdge: Edge = {
        ...connection,
        id: `${connection.source}-${connection.target}`,
        style: { stroke: nodeInfo[sourceNode.data.type].color, strokeWidth: 2.5 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [nodes, setEdges]
  );

  const deleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id)
      );
    },
    [] // No dependencies, this function is stable
  );

  const updateNodeData = useCallback(
    (id: string, data: Partial<Omit<NodeData, 'id' | 'onDelete' | 'onUpdate'>>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...data } } : node
        )
      );
    },
    [] // No dependencies, this function is stable
  );

  const addNode = (type: NodeType) => {
    let defaultModel = "Default";
    if (type === "Text") defaultModel = "Gemini 1.5 Pro";
    if (type === "Image") defaultModel = "Imagen 4";
    if (type === "Video") defaultModel = "Veo 3";
    if (type === "Audio") defaultModel = "TTS-1";

    const newNodeId = `${Date.now()}`;
    const newNode: Node<NodeData> = {
      id: newNodeId,
      type: "custom",
      position: {
        x: window.innerWidth / 2 - 190,
        y: window.innerHeight / 3 - 150,
      },
      data: {
        id: newNodeId,
        type,
        prompt: "",
        aspectRatio: "1:1",
        model: defaultModel,
        output: null,
        isGenerating: false,
        onDelete: deleteNode,
        onUpdate: updateNodeData,
        nodes: nodes,
        edges: edges,
      },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const nodesWithCallbacks = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          id: node.id,
          onDelete: deleteNode,
          onUpdate: updateNodeData,
          nodes, // Pass all nodes
          edges, // Pass all edges
        },
      })),
    [nodes, edges, deleteNode, updateNodeData]
  );

 const animatedEdges = useMemo(() => {
    return edges.map(edge => {
      const targetNode = nodes.find(node => node.id === edge.target);
      if (targetNode?.data.isGenerating) {
        return { ...edge, animated: true };
      }
      return edge;
    });
  }, [edges, nodes]);


  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden">
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={animatedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background gap={40} />
        <Controls className="!bottom-12 !left-auto !right-4 !top-auto !-translate-x-0 !-translate-y-0 !transform-none" />
        <MiniMap className="!bottom-20 !left-auto !right-4 !top-auto !h-24 !-translate-x-0 !-translate-y-0 !transform-none !bg-background" zoomable pannable />
      </ReactFlow>

      <AddNodeToolbar onAddNode={addNode} />
    </div>
  );
}
