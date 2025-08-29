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
  Upload,
  Video as VideoIcon,
  LoaderCircle,
} from "lucide-react";
import Image from "next/image";
import type { NodeData, NodeType } from "./canvas";
import { Handle, Position } from "reactflow";
import { cn } from "@/lib/utils";
import React, { useState, useCallback } from "react";
import { generateTextFromText } from "@/ai/flows/generate-text-from-text";
import { generateImageFromText } from "@/ai/flows/generate-image-from-text";
import { generateVideoFromText } from "@/ai/flows/generate-video-from-text";
import { generateAudioFromText } from "@/ai/flows/generate-audio-from-text";
import { useToast } from "@/hooks/use-toast";

interface NodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
}

const nodeInfo: Record<
  NodeType,
  { icon: React.ElementType; color: string }
> = {
  Text: { icon: TextIcon, color: "text-blue-400" },
  Image: { icon: ImageIcon, color: "text-green-400" },
  Video: { icon: VideoIcon, color: "text-red-400" },
  Audio: { icon: AudioWaveform, color: "text-yellow-400" },
  Upload: { icon: Upload, color: "text-purple-400" },
};

const nodeToolbarConfig: Record<NodeType, ("delete" | "aspect" | "model" | "settings")[]> = {
    "Text": ["delete", "model", "settings"],
    "Image": ["delete", "aspect", "model", "settings"],
    "Video": ["delete", "aspect", "model", "settings"],
    "Audio": ["delete", "model", "settings"],
    "Upload": ["delete", "settings"],
}

const aspectRatios: Record<string, string> = {
    "16:9": "aspect-[16/9]",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "3:4": "aspect-[3/4]",
    "9:16": "aspect-[9/16]",
};

export function Node({ id, data, selected }: NodeProps) {
  const { type, prompt, aspectRatio, model, onDelete, onUpdate, output } = data;
  const Icon = nodeInfo[type].icon;
  const color = nodeInfo[type].color;
  const toolbarItems = nodeToolbarConfig[type];

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    onUpdate(id, { output: null }); // Clear previous output
    try {
      let result;
      if (type === 'Text') {
        const response = await generateTextFromText({ prompt });
        result = response.generatedText;
      } else if (type === 'Image') {
        const response = await generateImageFromText({ prompt });
        result = response.imageDataUri;
      } else if (type === 'Video') {
         toast({ title: "🎬 Video generation started...", description: "This may take a minute or two. Please be patient." });
        const response = await generateVideoFromText({ prompt });
        result = response.videoDataUri;
        toast({ title: "✅ Video generation complete!", description: "The preview will be updated shortly." });
      } else if (type === 'Audio') {
        const response = await generateAudioFromText({ prompt });
        result = response.audioDataUri;
      }
      if (result) {
        onUpdate(id, { output: result });
      }
    } catch (error) {
      console.error("Generation failed:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [type, prompt, id, onUpdate, toast]);


  return (
    <div className="group">
       <Handle type="target" position={Position.Left} className="!bg-primary" />
      <Card className={`w-[380px] rounded-2xl shadow-2xl bg-background/50 backdrop-blur-xl border-2 transition-all duration-300 ${selected ? "border-primary/50 shadow-primary/20" : "border-white/10 dark:border-white/5"}`}>
        <div className={`handle p-3 flex items-center justify-between cursor-grab border-b border-white/10`}>
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${color}`} />
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
          <div className={cn("bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden relative", aspectRatios[aspectRatio] || "aspect-square")}>
             {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                    <LoaderCircle className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-primary-foreground mt-2">Generating...</p>
                </div>
              )}
              {output ? (
                <>
                  {type === "Image" && <Image src={output} alt="Generated image" layout="fill" objectFit="cover" />}
                  {type === "Video" && <video src={output} controls className="w-full h-full object-cover" />}
                  {type === "Audio" && <div className="p-4 w-full"><audio src={output} controls className="w-full" /></div>}
                  {type === 'Text' && <div className="p-4 text-sm overflow-y-auto max-h-60 w-full text-left"><p>{output}</p></div>}
                </>
              ) : type === 'Image' ? (
                <Image
                  src={`https://picsum.photos/380/214?${id}`} // Add id to vary image
                  width={380}
                  height={214}
                  alt="Placeholder image"
                  className="w-full h-full object-cover opacity-20"
                  data-ai-hint="abstract art"
                />
              ) : (
                <div className="text-muted-foreground/50 text-sm p-4 text-center">
                  {type === "Upload" ? "Upload a file" : "Preview will appear here"}
                </div>
              )}
          </div>
          {selected && type !== "Upload" && (
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
      <Handle type="source" position={Position.Right} className="!bg-primary" />
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

const modelOptions: Record<NodeType, string[]> = {
    Text: ["Gemini 1.5 Pro", "GPT-4o", "Llama 3"],
    Image: ["Imagen 3", "Stable Diffusion 3", "DALL-E 3"],
    Video: ["Veo", "Sora", "Kling"],
    Audio: ["TTS-1", "MusicGen", "ElevenLabs"],
    Upload: [],
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
  onUpdate: (id: string, data: Partial<NodeData>) => void;
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
                     <Button variant="ghost" className="h-7 px-2 text-xs">
                        <Icon className="w-3 h-3 mr-1" />
                        {model}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Select Model</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {modelOptions[type].map(modelOption => (
                        <DropdownMenuItem key={modelOption} onSelect={() => onUpdate(nodeId, { model: modelOption })}>
                            {modelOption}
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
