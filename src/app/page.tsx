import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/icons/logo";
import {
  Bot,
  Clapperboard,
  ImageIcon,
  Mic,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold inline-block">FlowForge AI</span>
          </Link>
          <div className="flex flex-1 items-center justify-end">
            <Button asChild>
              <Link href="/dashboard">Launch App</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="relative isolate overflow-hidden">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/50 to-accent/50 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="container py-24 sm:py-32 lg:py-40">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-headline">
                Каскадная генерация контента с помощью AI
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Создавайте уникальные изображения, видео, текст и аудио с помощью нашего интуитивного нодового редактора.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" asChild>
                  <Link href="/dashboard">Начать творить</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Узнать больше</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary/40 to-accent/40 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </div>
        
        <section id="features" className="container py-24 sm:py-32">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Все инструменты в одном месте</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Объединяйте различные AI-модели в единый рабочий процесс для достижения невероятных результатов.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<ImageIcon className="w-8 h-8 text-primary" />}
              title="Генерация изображений"
              description="Создавайте фотореалистичные изображения и арты из текстовых описаний с помощью передовых моделей."
            />
            <FeatureCard
              icon={<Clapperboard className="w-8 h-8 text-primary" />}
              title="Генерация видео"
              description="Превращайте текст или изображения в короткие видеоролики, задавая стиль и динамику."
            />
            <FeatureCard
              icon={<Bot className="w-8 h-8 text-primary" />}
              title="Генерация текстов"
              description="Пишите статьи, посты, сценарии и многое другое, используя мощные языковые модели."
            />
            <FeatureCard
              icon={<Mic className="w-8 h-8 text-primary" />}
              title="Генерация аудио"
              description="Синтезируйте речь, создавайте музыку и звуковые эффекты для ваших проектов."
            />
            <FeatureCard
              icon={<LinkIcon className="w-8 h-8 text-primary" />}
              title="Каскадные цепочки"
              description="Соединяйте ноды, чтобы результат одной генерации стал основой для следующей."
            />
             <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  className="w-8 h-8 text-primary"
                  fill="currentColor"
                >
                  <path d="M168,152a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,152Zm-8-40H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm48-48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,208,64Zm-16,0H48V208H208Z" />
                </svg>
              }
              title="Визуальный редактор"
              description="Управляйте всем процессом генерации в удобном drag-and-drop редакторе."
            />
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FlowForge AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-4">
          {icon}
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
