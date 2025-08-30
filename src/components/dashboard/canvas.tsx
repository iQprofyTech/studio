
"use client";

import React, { useCallback, useState, useMemo, useEffect, useRef } from "react";
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
  useReactFlow,
  OnConnectEnd,
  OnConnectStart,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import { AddNodeToolbar } from "./add-node-toolbar";
import { Node as CustomNode } from "./node";
import { nodeInfo } from "./node-info";
import { ContextMenu } from "./context-menu";
import { useToast } from "@/hooks/use-toast";

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

const MAX_NODES = 144;
const MAX_INCOMING_CONNECTIONS = 12;

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
  const { project } = useReactFlow();
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [menu, setMenu] = useState<ContextMenuData | null>(null);
  const connectingNodeId = useRef<{nodeId: string | null, handleId: string | null}>({ nodeId: null, handleId: null });
  const { toast } = useToast();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  
  const onConnectStart: OnConnectStart = useCallback((_, { nodeId, handleId }) => {
    connectingNodeId.current = { nodeId, handleId };
  }, []);

 const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
        if (!connectingNodeId.current.nodeId || !reactFlowWrapper.current || !reactFlowInstance) {
            return;
        }

        const target = event.target as HTMLElement;
        const targetIsPane = target.classList.contains('react-flow__pane');

        if (targetIsPane && event instanceof MouseEvent) {
            const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
            
            setMenu({
                top: event.clientY - top,
                left: event.clientX - left,
                sourceNodeId: connectingNodeId.current.nodeId,
                sourceHandleId: connectingNodeId.current.handleId,
            });
        }
    },
    [reactFlowInstance]
);

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setMenu(null);
      
      const incomingEdges = edges.filter(e => e.target === connection.target);
      if (incomingEdges.length >= MAX_INCOMING_CONNECTIONS) {
        toast({
          variant: "destructive",
          title: "Connection Limit Exceeded",
          description: `A node can have a maximum of ${MAX_INCOMING_CONNECTIONS} incoming connections.`,
        });
        return;
      }
      
       setNodes(nds => {
         const sourceNode = nds.find(node => node.id === connection.source);
         if (!sourceNode) return nds;

         const newEdge: Edge = {
          ...connection,
          id: `${connection.source}-${connection.target}`,
          style: { stroke: nodeInfo[sourceNode.data.type].color, strokeWidth: 2.5 },
          type: 'default'
         };
         setEdges((eds) => addEdge(newEdge, eds));

         return nds;
       })
    },
    [edges, toast, setNodes, setEdges]
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
    (id: string, data: Partial<Omit<NodeData, 'id' | 'onDelete' | 'onUpdate' | 'nodes' | 'edges'>>) => {
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
      setNodes((nds) => {
         if (nds.length >= MAX_NODES) {
          toast({
            variant: "destructive",
            title: "Node Limit Reached",
            description: `You can only have a maximum of ${MAX_NODES} nodes on the canvas.`,
          });
          return nds;
        }

        let defaultModel = 'Default';
        if (type === 'Text') defaultModel = 'Gemini 1.5 Pro';
        if (type === 'Image') defaultModel = 'Google Imagen 4';
        if (type === 'Video') defaultModel = 'Google Veo 3';
        if (type === 'Audio') defaultModel = 'Gemini TTS';

        const newNodeId = `${type}-${Date.now()}`;
        const pos = position || (reactFlowInstance ? reactFlowInstance.project({
          x: (reactFlowWrapper.current?.clientWidth || window.innerWidth) / 2,
          y: (reactFlowWrapper.current?.clientHeight || window.innerHeight) / 3,
        }) : { x: 0, y: 0});
        
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

        if (sourceNodeId) {
            const sourceNode = nds.find(node => node.id === sourceNodeId);
            if (sourceNode) {
              const newEdge: Edge = {
                  id: `${sourceNodeId}-${newNodeId}`,
                  source: sourceNodeId,
                  target: newNodeId,
                  style: { stroke: nodeInfo[sourceNode.data.type].color, strokeWidth: 2.5 },
                  type: 'default',
              };
              setEdges(prevEdges => addEdge(newEdge, prevEdges));
            } else {
                console.error("Could not find source node for new connection");
            }
        }
        return [...nds, newNode as Node<NodeData>];
      });
    },
    [deleteNode, updateNodeData, deleteEdge, toast, setEdges, reactFlowInstance]
  );


  // Add a default node if canvas is empty
  useEffect(() => {
    if (nodes.length === 0 && reactFlowInstance) {
      addNode("Image");
    }
  }, [nodes.length, reactFlowInstance, addNode]);

  const nodesWithCallbacks = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          nodes: nodes,
          edges: edges,
        },
      })),
    [nodes, edges]
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
        onPaneClick={() => setMenu(null)}
        onInit={setReactFlowInstance}
        fitView
      >
        <Background gap={40} />
        <Controls className="!bottom-12 !left-auto !right-4 !top-auto !-translate-x-0 !-translate-y-0 !transform-none" />
        <MiniMap className="!bottom-20 !left-auto !right-4 !top-auto !h-24 !-translate-x-0 !-translate-y-0 !transform-none !bg-background" zoomable pannable />
      </ReactFlow>

      <AddNodeToolbar onAddNode={(type) => addNode(type)} />
      {menu && reactFlowInstance && (
        <ContextMenu
          onClick={(nodeType) => {
            const position = reactFlowInstance.project({ x: menu.left, y: menu.top });
            addNode(nodeType, position, menu.sourceNodeId);
            setMenu(null);
          }}
          top={menu.top}
          left={menu.left}
        />
      )}
    </div>
  );
}
