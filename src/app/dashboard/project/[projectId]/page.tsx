import { Canvas } from "@/components/dashboard/canvas";

export default function ProjectPage({ params }: { params: { projectId: string } }) {
  // You can use params.projectId to fetch specific project data
  return (
    <div className="flex-1 overflow-auto">
      <Canvas />
    </div>
  );
}
