import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Рабочий стол</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Новый проект
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <Link href="/dashboard/project/1">
            <div className="aspect-video relative">
               <Image
                src="https://picsum.photos/300/168"
                alt="Project thumbnail"
                fill
                className="object-cover rounded-t-lg"
                data-ai-hint="abstract art"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Демо проект</CardTitle>
              <CardDescription className="text-xs">Изменено 2 часа назад</CardDescription>
            </CardHeader>
          </Link>
        </Card>
        
        {/* Placeholder for adding a new project */}
        <Card className="flex items-center justify-center border-dashed border-2 hover:border-primary hover:text-primary transition-colors cursor-pointer aspect-video">
          <div className="text-center p-4">
            <PlusCircle className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
            <p className="text-xs font-medium">Новый проект</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
