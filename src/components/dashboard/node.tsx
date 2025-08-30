"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  Play,
  Ratio,
  Settings,
  Trash2,
  AudioWaveform,
  Image as ImageIcon,
  Text as TextIcon,
  Video as VideoIcon,
  LoaderCircle,
  Copy,
  Download,
  XCircle,
  Unplug,
} from "lucide-react";
import Image from "next/image";
import type { Node as ReactFlowNode } from 'reactflow';
import type { NodeData, NodeType } from "./canvas";
import { Handle, Position } from "reactflow";
import { cn } from "@/lib/utils";
import React, { useState, useCallback } from "react";
import { generateTextFromText } from "@/ai/flows/generate-text-from-text";
import { generateImageFromText } from "@/ai/flows/generate-image-from-text";
import { generateVideoFromText } from "@/ai/flows/generate-video-from-text";
import { generateAudioFromText } from "@/ai/flows/generate-audio-from-text";
import { generateVideoFromImage } from "@/ai/flows/generate-video-from-image";
import { generateTextFromImage } from "@/ai/flows/generate-text-from-image";
import { useToast } from "@/hooks/use-toast";
import { nodeInfo } from "./node-info";

interface NodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
}

const nodeToolbarConfig: Record<NodeType, ("delete" | "aspect" | "model" | "settings")[]> = {
    "Text": ["delete", "model", "settings"],
    "Image": ["delete", "aspect", "model", "settings"],
    "Video": ["delete", "aspect", "model", "settings"],
    "Audio": ["delete", "model", "settings"],
}

const aspectRatios: Record<string, string> = {
    "16:9": "aspect-[16/9]",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "3:4": "aspect-[3/4]",
    "9:16": "aspect-[9/16]",
};

const mimeTypes: Record<NodeType, string> = {
  Image: "image/png",
  Video: "video/mp4",
  Audio: "audio/wav",
  Text: "text/plain",
}

function InputHandle({ nodeId, data, isConnected, onDeleteEdge }: { nodeId: string; data: NodeData; isConnected: boolean; onDeleteEdge: (edgeId: string) => void }) {
  const edge = data.edges.find(e => e.target === nodeId);

  if (!isConnected) {
    return <Handle type="target" position={Position.Left} className="!bg-primary !-left-4 !w-3 !h-3" />;
  }

  return (
    <div className="relative group/handle">
      <Handle type="target" position={Position.Left} className="!bg-primary !-left-4 !w-3 !h-3" />
      <button
        onClick={() => edge && onDeleteEdge(edge.id)}
        className="absolute -left-10 top-1/2 -translate-y-1/2 p-1 rounded-full bg-destructive/20 text-destructive opacity-0 group-hover/handle:opacity-100 transition-opacity z-10"
        aria-label="Delete connection"
      >
        <Unplug className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}


export function Node({ id, data, selected }: NodeProps) {
  const { type, prompt, aspectRatio, model, onDelete, onUpdate, output, nodes, edges, onDeleteEdge } = data;
  const Icon = nodeInfo[type].icon;
  const color = nodeInfo[type].color;
  const toolbarItems = nodeToolbarConfig[type];

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const isTarget = edges.some(edge => edge.target === id);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    onUpdate(id, { output: null, isGenerating: true }); // Clear previous output and set generating state
    try {
      let result;

      // Find the input node if any
      const inputEdge = edges.find(edge => edge.target === id);
      const inputNode = inputEdge ? nodes.find(node => node.id === inputEdge.source) : null;
      const inputNodeData = inputNode?.data as NodeData | undefined;
      
      const generationPrompt = inputNodeData?.type === 'Text' && inputNodeData.output ? inputNodeData.output : prompt;
      const imageInput = inputNodeData?.type === 'Image' && inputNodeData.output ? inputNodeData.output : null;


      if (type === 'Text') {
        if (imageInput) {
            const response = await generateTextFromImage({ photoDataUri: imageInput });
            result = response.description;
        } else {
            if (!generationPrompt) {
              throw new Error("Prompt cannot be empty for Text generation.");
            }
            const response = await generateTextFromText({ prompt: generationPrompt });
            result = response.generatedText;
        }
      } else if (type === 'Image') {
          if (!generationPrompt) throw new Error("Prompt is required for image generation.");
          const response = await generateImageFromText({ prompt: generationPrompt });
          result = response.imageDataUri;
      } else if (type === 'Video') {
          if (!generationPrompt && !imageInput) {
              throw new Error("Prompt or image input is required for video generation.");
          }
          toast({ title: "🎬 Video generation started...", description: "This may take a minute or two. Please be patient." });
          let response;
          if (imageInput) {
              response = await generateVideoFromImage({ prompt: prompt || "Animate this image", photoDataUri: imageInput });
          } else {
              // This case is validated by the check above, so generationPrompt is guaranteed to exist.
              response = await generateVideoFromText({ prompt: generationPrompt! });
          }
          result = response.videoDataUri;
          toast({ title: "✅ Video generation complete!", description: "The preview will be updated shortly." });
      } else if (type === 'Audio') {
          if (!generationPrompt) throw new Error("Prompt is required for audio generation.");
          const response = await generateAudioFromText({ prompt: generationPrompt });
          result = response.audioDataUri;
      }
      
      if (result) {
        onUpdate(id, { output: result });
      }
    } catch (error) {
      console.error("Generation failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      
      let toastTitle = "Uh oh! Something went wrong.";
      let toastDescription = errorMessage;

      if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
          toastTitle = "API Quota Exceeded";
          toastDescription = "You have exceeded your request limit for the AI model. Please check your plan or try again later.";
      }

      toast({
        variant: "destructive",
        title: toastTitle,
        description: toastDescription,
      });
    } finally {
      setIsLoading(false);
      onUpdate(id, { isGenerating: false });
    }
  }, [type, prompt, id, onUpdate, toast, nodes, edges]);
  
  const handleClearOutput = useCallback(() => {
    onUpdate(id, { output: null });
  }, [id, onUpdate]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const link = document.createElement("a");
    link.href = output;
    const extension = mimeTypes[type].split("/")[1];
    link.download = `${type.toLowerCase()}_${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [output, type]);
  
  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      toast({ title: "Copied to clipboard!" });
    });
  }, [output, toast]);


  return (
    <div className="group relative">
       <InputHandle nodeId={id} data={data} isConnected={isTarget} onDeleteEdge={onDeleteEdge} />
       <Card 
        className={cn(
          "w-[380px] rounded-2xl shadow-2xl bg-background/50 backdrop-blur-xl border-2 transition-all duration-300",
          selected 
            ? "border-transparent bg-clip-padding" 
            : "border-white/10 dark:border-white/5"
        )}
        style={selected ? { 
            backgroundImage: 'linear-gradient(theme(colors.background), theme(colors.background)), linear-gradient(to right, #4BC178, #B555C2)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
        } : {}}
       >
        <div className={`handle p-3 flex items-center justify-between cursor-grab border-b border-white/10`}>
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5`} style={{ color }}/>
            <h3 className="font-semibold">{type}</h3>
          </div>
          <div className="flex items-center gap-1 opacity-100">
            <NodeToolbar 
              nodeId={id} 
              items={toolbarItems} 
              onDelete={onDelete} 
              onUpdate={onUpdate}
              type={type}
              model={model}
              aspectRatio={aspectRatio}
            />
          </div>
        </div>
        
        <CardContent className="p-3 space-y-3">
          <div className={cn("bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden relative group/preview", aspectRatios[aspectRatio] || "aspect-square")}>
             {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                    <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-primary-foreground mt-2">Generating...</p>
                </div>
              )}
              {output ? (
                <>
                  {type === "Image" && <Image src={output} alt="Generated image" fill objectFit="cover" />}
                  {type === "Video" && <video src={output} controls className="w-full h-full object-cover" />}
                  {type === "Audio" && <div className="p-4 w-full"><audio src={output} controls className="w-full" /></div>}
                  {type === 'Text' && <div className="p-4 text-sm overflow-y-auto max-h-60 w-full text-left"><p>{output}</p></div>}
                  
                   <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                    {type === "Text" && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 bg-black/50 hover:bg-black/70 text-white" onClick={handleCopy}><Copy className="w-4 h-4" /></Button>
                    )}
                    {(type === "Image" || type === "Video" || type === "Audio") && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 bg-black/50 hover:bg-black/70 text-white" onClick={handleDownload}><Download className="w-4 h-4" /></Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 bg-black/50 hover:bg-black/70 text-white" onClick={handleClearOutput}><XCircle className="w-4 h-4" /></Button>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground/50 text-sm p-4 text-center">
                   {(type === "Image" || type === "Video") 
                      ? `Preview (${aspectRatio}) will appear here`
                      : "Preview will appear here"
                  }
                </div>
              )}
          </div>
          {selected && (
            <>
              <Textarea
                  placeholder={`Enter your ${type.toLowerCase()} prompt here...`}
                  defaultValue={prompt}
                  onChange={(e) => onUpdate(id, { prompt: e.target.value })}
                  className="bg-background/70 text-sm min-h-[80px]"
              />
              <Button className="w-full" onClick={handleGenerate} disabled={isLoading}>
                  {isLoading ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                  {isLoading ? "Generating..." : "Generate"}
              </Button>
            </>
          )}
        </CardContent>

      </Card>
      <Handle type="source" position={Position.Right} className="!bg-primary !-right-4 !w-3 !h-3" />
    </div>
  );
}

const iconMap = {
    delete: Trash2,
    aspect: Ratio,
    model: Bot,
    settings: Settings
};

const tooltipMap = {
    delete: "Delete Node",
    aspect: "Aspect Ratio",
    model: "Change Model",
    settings: "Settings"
};

const modelOptions: Record<NodeType, { name: string; enabled: boolean }[]> = {
    Text: [
        { name: "Gemini 1.5 Pro", enabled: true },
        { name: "Gemini 1.5 Flash", enabled: true },
        { name: "Google AI редактор (Gemini Flash 2.0)", enabled: false },
        { name: "ChatGPT 4.5", enabled: false },
        { name: "ChatGPT 4-o (omni)", enabled: false },
        { name: "Grok 3", enabled: false },
        { name: "DeepSeek R1", enabled: false },
        { name: "Claude 3.7", enabled: false },
        { name: "Llama 3.1 405b", enabled: false },
    ],
    Image: [
        { name: "Google Imagen 4", enabled: true },
        { name: "Sora Images", enabled: false },
        { name: "Stable Diffusion", enabled: false },
        { name: "Flux.1", enabled: false },
        { name: "Flux.1 Редактор", enabled: false },
        { name: "Flux.1 PRO", enabled: false },
        { name: "Flux.1.1 PRO", enabled: false },
        { name: "Flux.1.1 PRO ULTRA", enabled: false },
        { name: "GPT-4o Images Generation", enabled: false },
        { name: "Ideogram", enabled: false },
    ],
    Video: [
        { name: "Google Veo 3", enabled: true },
        { name: "Google Veo 2", enabled: true },
        { name: "SORA", enabled: false },
        { name: "RunWay: Gen-3", enabled: false },
        { name: "RunWay Gen-4", enabled: false },
        { name: "Higgsfield", enabled: false },
        { name: "Luma: Dream Machine", enabled: false },
        { name: "Kling 1.6", enabled: false },
        { name: "Kling 2.0", enabled: false },
        { name: "Hailuo MiniMax 01", enabled: false },
        { name: "Hailuo MiniMax 02", enabled: false },
        { name: "MidJourney Video", enabled: false },
        { name: "Seedance", enabled: false },
        { name: "Синхронизатор губ (Lipsync RunWay)", enabled: false },
        { name: "Синхронизатор губ (Lipsync Kling)", enabled: false },
    ],
    Audio: [
        { name: "Gemini TTS", enabled: true },
        { name: "SUNO v3.5 (создание музыки)", enabled: false },
        { name: "SUNO v4.0", enabled: false },
    ],
}

const aspectRatioOptions = ["16:9", "4:3", "1:1", "3:4", "9:16"];


function NodeToolbar({
  nodeId,
  items,
  onDelete,
  onUpdate,
  type,
  model,
  aspectRatio
}: {
  nodeId: string;
  items: ("delete" | "aspect" | "model" | "settings")[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Omit<NodeData, 'id' | 'onDelete' | 'onUpdate' | 'nodes' | 'edges' | 'isGenerating' | 'onDeleteEdge'>>) => void;
  type: NodeType;
  model: string;
  aspectRatio: string;
}) {
  const renderToolbarItem = (item: typeof items[number]) => {
    const Icon = iconMap[item];
    const tooltip = tooltipMap[item];

    if (item === "delete") {
      return (
        <Button
          key={item}
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(nodeId)}
        >
          <Icon className="w-4 h-4" />
          <span className="sr-only">{tooltip}</span>
        </Button>
      );
    }
    
    if (item === 'model') {
        return (
            <DropdownMenu key={item}>
                <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="h-7 px-2 text-xs max-w-[120px] truncate">
                        <Icon className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{model}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Select Model</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {modelOptions[type].map(modelOption => (
                        <DropdownMenuItem 
                            key={modelOption.name} 
                            onSelect={() => onUpdate(nodeId, { model: modelOption.name })}
                            disabled={!modelOption.enabled}
                        >
                            {modelOption.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    if (item === 'aspect') {
        return (
            <DropdownMenu key={item}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-7 px-2 text-xs">
                        <Icon className="w-3 h-3 mr-1" />
                        {aspectRatio}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                     <DropdownMenuLabel>Aspect Ratio</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {aspectRatioOptions.map(ratio => (
                        <DropdownMenuItem key={ratio} onSelect={() => onUpdate(nodeId, { aspectRatio: ratio })}>
                           {ratio}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
      <Button key={item} variant="ghost" size="icon" className="h-7 w-7">
        <Icon className="w-4 h-4" />
        <span className="sr-only">{tooltip}</span>
      </Button>
    );
  };
  
  return (
    <div className="flex items-center gap-1">
      {items.map(renderToolbarItem)}
    </div>
  );
}
