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
  MoreVertical,
} from "lucide-react";
import Image from "next/image";
import type { NodeData, NodeType } from "./canvas";
import { Handle, Position } from "reactflow";

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

export function Node({ id, data, selected }: NodeProps) {
  const { type, prompt, aspectRatio, model, onDelete, onUpdate } = data;
  const Icon = nodeInfo[type].icon;
  const color = nodeInfo[type].color;
  const toolbarItems = nodeToolbarConfig[type];

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
          <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden">
              {type === "Image" ? (
              <Image
                  src={`https://picsum.photos/380/214?${id}`} // Add id to vary image
                  width={380}
                  height={214}
                  alt="Generated image"
                  className="w-full h-full object-cover"
                  data-ai-hint="abstract art"
              />
              ) : (
              <div className="text-muted-foreground/50 text-sm">Preview</div>
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
              <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Generate
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
    Image: ["Stable Diffusion 3", "DALL-E 3", "Imagen 3"],
    Video: ["Sora", "Veo", "Kling"],
    Audio: ["MusicGen", "TTS-1", "ElevenLabs"],
    Upload: [],
}

const aspectRatios = ["16:9", "1:1", "4:3", "9:16"];


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
                    {aspectRatios.map(ratio => (
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
