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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <Link href="/dashboard/project/1">
            <div className="aspect-video relative">
               <Image
                src="https://picsum.photos/400/225"
                alt="Project thumbnail"
                fill
                className="object-cover rounded-t-lg"
                data-ai-hint="abstract art"
              />
            </div>
            <CardHeader>
              <CardTitle>Демо проект</CardTitle>
              <CardDescription>Изменено 2 часа назад</CardDescription>
            </CardHeader>
          </Link>
        </Card>
        
        {/* Placeholder for adding a new project */}
        <Card className="flex items-center justify-center border-dashed border-2 hover:border-primary hover:text-primary transition-colors cursor-pointer">
          <div className="text-center p-6">
            <PlusCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Новый проект</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
