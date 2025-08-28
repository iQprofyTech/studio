"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

interface NodeProps {
  data: NodeData;
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

export function Node({ data }: NodeProps) {
  const { type, position, prompt } = data;
  const Icon = nodeInfo[type].icon;
  const color = nodeInfo[type].color;

  return (
    <div
      className="absolute group"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <Card className="w-[380px] rounded-2xl shadow-2xl bg-background/50 backdrop-blur-xl border-2 border-white/10 dark:border-white/5 transition-all duration-300 hover:shadow-primary/20 hover:border-primary/20">
        <div className="handle p-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <h3 className="font-semibold">{type} Node</h3>
          </div>
          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <NodeToolbar />
          </div>
        </div>
        <CardContent className="p-3 space-y-3">
          <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden">
            {type === "Image" ? (
              <Image
                src="https://picsum.photos/380/214"
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
          <Textarea
            placeholder={`Enter your ${type.toLowerCase()} prompt here...`}
            defaultValue={prompt}
            className="bg-background/70 text-sm min-h-[80px]"
          />
           <Button className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function NodeToolbar() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreVertical className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    <Ratio className="mr-2 h-4 w-4" />
                    <span>Aspect Ratio</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Bot className="mr-2 h-4 w-4" />
                    <span>Change Model</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Node</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
