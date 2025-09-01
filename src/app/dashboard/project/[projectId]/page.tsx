import { Canvas } from "@/components/dashboard/canvas";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  // You can use projectId to fetch specific project data
  return (
    <div className="flex-1 overflow-auto">
      <Canvas />
    </div>
  );
}
