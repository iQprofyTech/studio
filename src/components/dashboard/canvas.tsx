
"use client";

import React, { useCallback, useState, useMemo, useEffect, useRef, MouseEvent } from "react";
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
  ReactFlowInstance,
  useReactFlow,
  OnConnectEnd,
} from "reactflow";
import "reactflow/dist/style.css";

import { AddNodeToolbar } from "./add-node-toolbar";
import { Node as CustomNode } from "./node";
import { nodeInfo } from "./node-info";
import { ContextMenu } from "./context-menu";

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
  onDeleteEdge: (edgeId: string) => void;
  // Passing these down to each node for connection logic
  nodes: Node<NodeData>[];
  edges: Edge[];
}

const initialNodes: Node<NodeData>[] = [];

const initialEdges: Edge[] = [];

const nodeTypes = {
  custom: CustomNode,
};

interface ContextMenuData {
  top: number;
  left: number;
  sourceNodeId: string;
  sourceHandleId: string | null;
}

export function Canvas() {
  const [nodes, setNodes] = useState<Node<NodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [menu, setMenu] = useState<ContextMenuData | null>(null);
  const connectingNodeId = useRef<string | null>(null);


  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  
  const onConnectStart = useCallback((_: any, { nodeId }: { nodeId: string | null }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const targetIsPane = (event.target as HTMLElement).classList.contains(
        'react-flow__pane'
      );

      if (targetIsPane && connectingNodeId.current) {
        const { top, left } = (reactFlowWrapper.current as HTMLDivElement).getBoundingClientRect();
        const mouseEvent = event as unknown as MouseEvent;
        
        setMenu({
          top: mouseEvent.clientY - top,
          left: mouseEvent.clientX - left,
          sourceNodeId: connectingNodeId.current,
          sourceHandleId: null, // We assume one source handle per node for now
        });
      }
    },
    []
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
    [setNodes, setEdges] 
  );

  const deleteEdge = useCallback((id: string) => {
    setEdges(eds => eds.filter(edge => edge.id !== id));
  }, [setEdges]);


  const updateNodeData = useCallback(
    (id: string, data: Partial<Omit<NodeData, 'id' | 'onDelete' | 'onUpdate'>>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...data } } : node
        )
      );
    },
    [setNodes]
  );

  const addNode = useCallback(
    (type: NodeType, position?: { x: number; y: number }, sourceNodeId?: string) => {
      let defaultModel = 'Default';
      if (type === 'Text') defaultModel = 'Gemini 1.5 Pro';
      if (type === 'Image') defaultModel = 'Google Imagen 4';
      if (type === 'Video') defaultModel = 'Google Veo 3';
      if (type === 'Audio') defaultModel = 'Gemini TTS';

      const newNodeId = `${Date.now()}`;
      const pos = position || {
        x: Math.random() * (window.innerWidth / 2),
        y: Math.random() * (window.innerHeight / 2),
      };

      const newNode: Node<Omit<NodeData, 'nodes' | 'edges'>> = {
        id: newNodeId,
        type: 'custom',
        position: pos,
        data: {
          id: newNodeId,
          type,
          prompt: '',
          aspectRatio: '1:1',
          model: defaultModel,
          output: null,
          isGenerating: false,
          onDelete: deleteNode,
          onUpdate: updateNodeData,
          onDeleteEdge: deleteEdge,
        },
      };
      setNodes((prevNodes) => [...prevNodes, newNode as Node<NodeData>]);

      if (sourceNodeId) {
        const sourceNode = nodes.find(node => node.id === sourceNodeId);
        if (!sourceNode) return;
        const newEdge: Edge = {
          id: `${sourceNodeId}-${newNodeId}`,
          source: sourceNodeId,
          target: newNodeId,
          style: { stroke: nodeInfo[sourceNode.data.type].color, strokeWidth: 2.5 },
        };
        setEdges(eds => addEdge(newEdge, eds));
      }
    },
    [deleteNode, updateNodeData, setNodes, deleteEdge, nodes]
);


  // Add a default node if canvas is empty
  useEffect(() => {
    if (nodes.length === 0) {
      addNode("Image");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nodesWithCallbacks = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          id: node.id,
          onDelete: deleteNode,
          onUpdate: updateNodeData,
          onDeleteEdge: deleteEdge,
          nodes, // Pass all nodes
          edges, // Pass all edges
        },
      })),
    [nodes, edges, deleteNode, updateNodeData, deleteEdge]
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
    <div className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={animatedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background gap={40} />
        <Controls className="!bottom-12 !left-auto !right-4 !top-auto !-translate-x-0 !-translate-y-0 !transform-none" />
        <MiniMap className="!bottom-20 !left-auto !right-4 !top-auto !h-24 !-translate-x-0 !-translate-y-0 !transform-none !bg-background" zoomable pannable />
      </ReactFlow>

      <AddNodeToolbar onAddNode={(type) => addNode(type)} />
      {menu && (
        <ContextMenu
          onClick={() => setMenu(null)}
          {...menu}
          onNodeSelect={(nodeType) => {
            const position = screenToFlowPosition({ x: menu.left, y: menu.top });
            addNode(nodeType, position, menu.sourceNodeId);
          }}
        />
      )}
    </div>
  );
}
