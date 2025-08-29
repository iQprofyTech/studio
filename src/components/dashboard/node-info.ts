import {
  AudioWaveform,
  Image as ImageIcon,
  Text as TextIcon,
  Upload,
  Video as VideoIcon,
} from "lucide-react";
import type { NodeType } from "./canvas";

export const nodeInfo: Record<
  NodeType,
  { icon: React.ElementType; color: string }
> = {
  Text: { icon: TextIcon, color: "#60a5fa" }, // text-blue-400
  Image: { icon: ImageIcon, color: "#4ade80" }, // text-green-400
  Video: { icon: VideoIcon, color: "#f87171" }, // text-red-400
  Audio: { icon: AudioWaveform, color: "#facc15" }, // text-yellow-400
  Upload: { icon: Upload, color: "#a78bfa" }, // text-purple-400
};
