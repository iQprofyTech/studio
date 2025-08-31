
"use client";

import React, { useCallback, useState, useMemo, useRef } from "react";
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
  type OnConnectEnd,
  type OnConnectStart,
  type ReactFlowInstance,
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
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [menu, setMenu] = useState<ContextMenuData | null>(null);
  const connectingNodeId = useRef<{nodeId: string | null, handleId: string | null}>({ nodeId: null, handleId: null });
  const { toast } = useToast();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
        setMenu(null);
        setNodes((nds) => applyNodeChanges(changes, nds))
    },
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
      const sourceNodeId = connectingNodeId.current.nodeId;
      const targetIsPane = (event.target as HTMLElement)?.classList.contains('react-flow__pane');

      if (targetIsPane && sourceNodeId && reactFlowWrapper.current && reactFlowInstance && event instanceof MouseEvent) {
          const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
          const position = reactFlowInstance.screenToFlowPosition({
              x: event.clientX - left,
              y: event.clientY - top,
          });

          // Adding a short delay to prevent the pane click from closing the menu immediately
          setTimeout(() => {
            setMenu({
                top: event.clientY - top,
                left: event.clientX - left,
                sourceNodeId: sourceNodeId,
                sourceHandleId: connectingNodeId.current.handleId,
            });
          }, 10);
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
    [edges, toast, setEdges, setNodes]
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
        setNodes(nds =>
            nds.map(node =>
                node.id === id ? { ...node, data: { ...node.data, ...data } } : node
            )
        );
    },
    [setNodes]
  );
  
  const addNode = useCallback(
    (type: NodeType, position?: { x: number; y: number }, sourceNodeId?: string, sourceHandleId?: string | null) => {
        setMenu(null);
        if (nodes.length >= MAX_NODES) {
            toast({
                variant: "destructive",
                title: "Node Limit Reached",
                description: `You can only have a maximum of ${MAX_NODES} nodes on the canvas.`,
            });
            return;
        }

        let defaultModel = 'Default';
        if (type === 'Text') defaultModel = 'Gemini 1.5 Pro';
        if (type === 'Image') defaultModel = 'Google Imagen 4';
        if (type === 'Video') defaultModel = 'Google Veo 3';
        if (type === 'Audio') defaultModel = 'Gemini TTS';

        const newNodeId = `${type}-${Date.now()}`;
        
        const pos = position || reactFlowInstance?.screenToFlowPosition({
            x: (reactFlowWrapper.current?.clientWidth || window.innerWidth) / 2,
            y: (reactFlowWrapper.current?.clientHeight || window.innerHeight) / 3,
        }) || { x: 0, y: 0 };
        
        const newNode: Node<Omit<NodeData, 'nodes' | 'edges'>> = {
            id: newNodeId,
            type: 'custom',
            position: pos,
            data: {
                id: newNodeId,
                type,
                prompt: '',
                aspectRatio: '16:9',
                model: defaultModel,
                output: null,
                isGenerating: false,
                onDelete: deleteNode,
                onUpdate: updateNodeData,
                onDeleteEdge: deleteEdge,
            },
        };
        
        setNodes(nds => [...nds, newNode as Node<NodeData>]);

        if (sourceNodeId && reactFlowInstance) {
             const sourceNode = nodes.find(node => node.id === sourceNodeId);
             if (sourceNode) {
                const newEdge = {
                    id: `${sourceNodeId}-${newNodeId}`,
                    source: sourceNodeId,
                    sourceHandle: sourceHandleId,
                    target: newNodeId,
                    style: { stroke: nodeInfo[sourceNode.data.type].color, strokeWidth: 2.5 },
                    type: 'default',
                };
                setEdges(eds => addEdge(newEdge, eds));
             }
        }
    },
    [reactFlowInstance, nodes, toast, deleteNode, updateNodeData, deleteEdge, setNodes, setEdges]
  );

  const nodesWithSharedData = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        nodes: nodes,
        edges: edges,
        onUpdate: updateNodeData,
        onDelete: deleteNode,
        onDeleteEdge: deleteEdge
      },
    }));
  }, [nodes, edges, updateNodeData, deleteNode, deleteEdge]);

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
        nodes={nodesWithSharedData}
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
      {menu && reactFlowInstance &&(
        <ContextMenu
          onClick={(nodeType) => {
            const position = reactFlowInstance.screenToFlowPosition({
                x: menu.left,
                y: menu.top,
            });
            addNode(nodeType, position, menu.sourceNodeId, menu.sourceHandleId);
            setMenu(null);
          }}
          top={menu.top}
          left={menu.left}
        />
      )}
    </div>
  );
}
