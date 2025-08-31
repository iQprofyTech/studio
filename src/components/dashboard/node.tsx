
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
  LoaderCircle,
  Copy,
  Download,
  XCircle,
  Unplug,
  Upload,
  Mic,
} from "lucide-react";
import Image from "next/image";
import type { Node as ReactFlowNode } from 'reactflow';
import type { NodeData, NodeType } from "./canvas";
import { Handle, Position } from "reactflow";
import { cn } from "@/lib/utils";
import React, { useState, useCallback, useRef } from "react";
import { generateTextFromText } from "@/ai/flows/generate-text-from-text";
import { generateImageFromText } from "@/ai/flows/generate-image-from-text";
import { generateVideoFromText } from "@/ai/flows/generate-video-from-text";
import { generateAudioFromText } from "@/ai/flows/generate-audio-from-text";
import { generateVideoFromImage } from "@/ai/flows/generate-video-from-image";
import { generateTextFromImage } from "@/ai/flows/generate-text-from-image";
import { stitchVideos } from "@/ai/flows/stitch-videos";
import { transcribeAudio } from "@/ai/flows/transcribe-audio";
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
  const sourceNode = data.nodes.find(n => n.id === edge?.source);
  const sourceColor = sourceNode ? nodeInfo[sourceNode.data.type].color : 'hsl(var(--muted-foreground))';

  return (
    <div className="group/handle absolute -left-4 top-1/2 -translate-y-1/2 h-full w-4 flex items-center justify-center">
      <Handle
        type="target"
        position={Position.Left}
        className={cn(
          "!w-4 !h-4 !border-slate-400 !border-[2.5px] shadow-md transition-colors",
          isConnected 
            ? `!bg-[${sourceColor}]` 
            : "!bg-muted-foreground/60"
        )}
        style={isConnected ? { background: sourceColor } : {}}
      />
      {isConnected && edge && (
        <button
          onClick={() => onDeleteEdge(edge.id)}
          className="absolute left-0 p-1 rounded-full bg-destructive/20 text-destructive opacity-0 group-hover/handle:opacity-100 hover:!opacity-100 transition-opacity z-10 -translate-x-full"
          aria-label="Delete connection"
        >
          <Unplug className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

function OutputHandle({ color, isConnected }: { color: string; isConnected: boolean }) {
  return (
    <div className="group/handle absolute -right-4 top-1/2 -translate-y-1/2 h-full w-4 flex items-center justify-center">
        <Handle
            type="source"
            position={Position.Right}
            className={cn(
                "!w-4 !h-4 !border-slate-400 !border-[2.5px] shadow-md transition-colors",
                isConnected
                    ? `!bg-[${color}]`
                    : "!bg-muted-foreground/60"
            )}
            style={isConnected ? { background: color } : {}}
        />
    </div>
  );
}


export function Node({ id, data, selected }: NodeProps) {
  const { type, prompt, aspectRatio, model, onDelete, onUpdate, output, nodes, edges, onDeleteEdge } = data;
  const Icon = nodeInfo[type].icon;
  const color = nodeInfo[type].color;
  const toolbarItems = nodeToolbarConfig[type];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isTarget = edges.some(edge => edge.target === id);
  const isSource = edges.some(edge => edge.source === id);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'Video' && file.size > 8 * 1024 * 1024) { // 8MB limit for video
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Video files should not exceed 8MB (around 5-8 seconds).'
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        onUpdate(id, { output: dataUri, prompt: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    onUpdate(id, { output: null, isGenerating: true });
    try {
      let result;
      const inputEdges = edges.filter(edge => edge.target === id);
      const inputNodes = inputEdges.map(edge => nodes.find(node => node.id === edge.source)).filter(Boolean) as ReactFlowNode<NodeData>[];

      // Video stitching logic
      if (type === 'Video' && model === 'Video Stitcher') {
          if (prompt.trim()) {
              throw new Error("The prompt for the target video node must be empty to stitch videos.");
          }
          const videoInputs = inputNodes.filter(n => n.data.type === 'Video' && n.data.output).map(n => n.data.output as string);
          if (videoInputs.length < 2 || videoInputs.length > 12) {
              throw new Error("Video Stitcher requires between 2 and 12 connected video inputs.");
          }
          toast({ title: "🎬 Video stitching started...", description: `Stitching ${videoInputs.length} videos. This may take a moment.` });
          const response = await stitchVideos({ videoDataUris: videoInputs });
          result = response.videoDataUri;
          toast({ title: "✅ Video stitching complete!" });
      } else {
        // Standard generation logic
        const primaryInputNode = inputNodes[0]?.data;
        const textInput = (primaryInputNode?.type === 'Text' && primaryInputNode.output) ? primaryInputNode.output : null;
        const imageInput = (primaryInputNode?.type === 'Image' && primaryInputNode.output) ? primaryInputNode.output : (type === 'Image' && output) ? output : null;
        const audioInput = (primaryInputNode?.type === 'Audio' && primaryInputNode.output) ? primaryInputNode.output : null;
        
        const generationPrompt = textInput || prompt;

        if (type === 'Text') {
          if (imageInput) {
              const response = await generateTextFromImage({ photoDataUri: imageInput });
              result = response.description;
          } else if (audioInput) {
              toast({ title: "🎤 Transcribing audio...", description: "This may take a moment." });
              const response = await transcribeAudio({ audioDataUri: audioInput });
              result = response.transcript;
              toast({ title: "✅ Transcription complete!" });
          } else {
              if (!generationPrompt) {
                 throw new Error("Prompt cannot be empty for Text generation.");
              }
              const response = await generateTextFromText({ prompt: generationPrompt });
              result = response.generatedText;
          }
        } else if (type === 'Image') {
            if (!generationPrompt) {
              throw new Error("Prompt is required for image generation.");
            }
            const response = await generateImageFromText({ prompt: generationPrompt });
            result = response.imageDataUri;
        } else if (type === 'Video') {
             if (!generationPrompt && !imageInput) {
                throw new Error("Prompt or image input is required for video generation.");
            }
            toast({ title: "🎬 Video generation started...", description: "This may take a minute or two. Please be patient." });
            let response;
            if (imageInput) {
                const videoAspectRatio = primaryInputNode?.aspectRatio || aspectRatio;
                response = await generateVideoFromImage({ 
                    prompt: prompt || "Animate this image", 
                    photoDataUri: imageInput,
                    aspectRatio: videoAspectRatio
                });
            } else {
                response = await generateVideoFromText({ prompt: generationPrompt! });
            }
            result = response.videoDataUri;
            toast({ title: "✅ Video generation complete!", description: "The preview will be updated shortly." });
        } else if (type === 'Audio') {
            if (!generationPrompt) {
               throw new Error("Prompt is required for audio generation.");
            }
            const response = await generateAudioFromText({ prompt: generationPrompt });
            result = response.audioDataUri;
        }
      }
      
      if (result) {
        onUpdate(id, { output: result });
      }
    } catch (error) {
      console.error("Generation failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      
      let toastTitle = "Uh oh! Something went wrong.";
      let toastDescription = errorMessage;

      if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("resource_exhausted") || errorMessage.toLowerCase().includes("quota")) {
          toastTitle = "API Quota Exceeded";
          toastDescription = "You have exceeded your request limit for the AI model. Please check your plan or try again later.";
      } else if (errorMessage.includes("content filters")) {
          toastTitle = "Content Generation Blocked";
          toastDescription = "The generation was blocked by content safety filters. Please modify your prompt and try again.";
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
  }, [type, prompt, output, aspectRatio, model, id, onUpdate, toast, nodes, edges]);
  
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
    if (typeof output === 'string') {
        navigator.clipboard.writeText(output).then(() => {
            toast({ title: "Copied to clipboard!" });
        });
    }
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
            backgroundImage: 'linear-gradient(hsl(var(--background)), hsl(var(--background))), linear-gradient(to right, #4BC178, #B555C2)',
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept={type === 'Image' ? 'image/*' : type === 'Video' ? 'video/mp4,video/quicktime' : 'audio/*'}
          />
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
                <div className="text-muted-foreground/50 text-sm p-4 text-center flex flex-col items-center justify-center gap-2">
                    <p>
                        {(type === "Image" || type === "Video") 
                            ? `Preview (${aspectRatio}) will appear here`
                            : "Preview will appear here"
                        }
                    </p>
                    {selected && (type === "Image" || type === "Video" || type === "Audio") && (
                        <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="w-3 h-3 mr-1.5" />
                            Upload
                        </Button>
                        {type === 'Audio' && 
                            <Button variant="outline" size="sm">
                            <Mic className="w-3 h-3 mr-1.5" />
                            Record
                            </Button>
                        }
                        </div>
                    )}
                </div>
              )}
          </div>
          {selected && (
            <>
              <Textarea
                  placeholder={`Enter your ${type.toLowerCase()} prompt here...`}
                  value={prompt}
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
      <OutputHandle color={color} isConnected={isSource} />
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
        { name: "Audio Transcription", enabled: true },
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
        { name: "Video Stitcher", enabled: true },
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

    