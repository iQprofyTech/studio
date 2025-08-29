import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/icons/logo";
import {
  Bot,
  Clapperboard,
  ImageIcon,
  Mic,
  Link as LinkIcon,
  Check,
  Github,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Send,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";

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

        <section id="image-slider" className="container py-12">
            <div className="max-w-4xl mx-auto">
                 <Carousel opts={{ loop: true }}>
                    <CarouselContent>
                        <CarouselItem>
                            <Image src="https://picsum.photos/1200/600" data-ai-hint="futuristic city" alt="Generated Image 1" width={1200} height={600} className="rounded-2xl" />
                        </CarouselItem>
                        <CarouselItem>
                            <Image src="https://picsum.photos/1200/600" data-ai-hint="fantasy landscape" alt="Generated Image 2" width={1200} height={600} className="rounded-2xl" />
                        </CarouselItem>
                        <CarouselItem>
                            <Image src="https://picsum.photos/1200/600" data-ai-hint="abstract art" alt="Generated Image 3" width={1200} height={600} className="rounded-2xl" />
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
        
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

        <section id="pricing" className="container py-24 sm:py-32">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Простые и понятные тарифы</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Выберите план, который подходит именно вам. Начните бесплатно.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
                title="Free"
                price="$0"
                period="/ month"
                features={["100 генераций", "Базовые модели", "Поддержка по email"]}
                buttonText="Начать бесплатно"
                variant="default"
            />
            <PricingCard
                title="Creator"
                price="$15"
                period="/ month"
                features={["1000 генераций", "Продвинутые модели", "Приоритетная поддержка", "Доступ к новым функциям"]}
                buttonText="Выбрать Creator"
                variant="default"
                isFeatured
            />
            <PricingCard
                title="Pro Creator"
                price="$40"
                period="/ month"
                features={["Безлимитные генерации", "Все модели, включая премиум", "Персональный менеджер", "API доступ"]}
                buttonText="Выбрать Pro"
                variant="default"
            />
          </div>
        </section>
      </main>

      <footer className="border-t bg-background/50">
        <div className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-muted-foreground">
            <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
                <Link href="/" className="flex items-center space-x-2">
                    <Logo className="h-8 w-8" />
                    <span className="font-bold text-lg text-foreground">FlowForge AI</span>
                </Link>
                <p>123 AI Street, Generative City, 40404</p>
            </div>
            <div className="flex flex-col gap-4 items-center">
                 <div className="flex flex-col items-center gap-2">
                    <Link href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Белые листы</Link>
                </div>
                <div className="flex gap-4">
                    <Link href="#" className="text-muted-foreground hover:text-primary"><Github className="w-5 h-5" /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="w-5 h-5" /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="w-5 h-5" /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="w-5 h-5" /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="w-5 h-5" /></Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-primary">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-4 items-center md:items-end text-center md:text-right">
                <h4 className="font-semibold text-foreground">Связаться</h4>
                 <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors"><MessageCircle className="w-4 h-4"/>Whatsapp</Link>
                 <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors"><Send className="w-4 h-4" />Telegram</Link>
            </div>
        </div>
        <div className="container py-4 text-center text-xs text-muted-foreground/80 border-t">
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

function PricingCard({ title, price, period, features, buttonText, variant, isFeatured }: { title: string, price: string, period: string, features: string[], buttonText: string, variant: "default" | "outline", isFeatured?: boolean }) {
    return (
        <Card className={isFeatured ? "border-primary shadow-primary/20 shadow-lg" : ""}>
            <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                <div className="flex items-baseline gap-2">
                   <span className="text-4xl font-extrabold">{price}</span>
                   <span className="text-muted-foreground">{period}</span>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <ul className="space-y-3 mb-6">
                    {features.map(feature => (
                        <li key={feature} className="flex items-center gap-2">
                           <Check className="w-5 h-5 text-green-500" />
                           <span>{feature}</span>
                        </li>
                    ))}
                </ul>
                <Button className="w-full" variant={isFeatured ? "default" : "outline"}>{buttonText}</Button>
            </CardContent>
        </Card>
    )
}