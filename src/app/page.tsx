
"use client";

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
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const translations = {
  ru: {
    launchApp: "Launch App",
    headline: "Каскадная генерация контента с помощью AI",
    subheadline: "Создавайте уникальные изображения, видео, текст и аудио с помощью нашего интуитивного нодового редактора.",
    startCreating: "Начать творить",
    learnMore: "Узнать больше",
    allTools: "Все инструменты в одном месте",
    allToolsSub: "Объединяйте различные AI-модели в единый рабочий процесс для достижения невероятных результатов.",
    imgGen: "Генерация изображений",
    imgGenDesc: "Создавайте фотореалистичные изображения и арты из текстовых описаний с помощью передовых моделей.",
    videoGen: "Генерация видео",
    videoGenDesc: "Превращайте текст или изображения в короткие видеоролики, задавая стиль и динамику.",
    textGen: "Генерация текстов",
    textGenDesc: "Пишите статьи, посты, сценарии и многое другое, используя мощные языковые модели.",
    audioGen: "Генерация аудио",
    audioGenDesc: "Синтезируйте речь, создавайте музыку и звуковые эффекты для ваших проектов.",
    cascade: "Каскадные цепочки",
    cascadeDesc: "Соединяйте ноды, чтобы результат одной генерации стал основой для следующей.",
    visualEditor: "Визуальный редактор",
    visualEditorDesc: "Управляйте всем процессом генерации в удобном drag-and-drop редакторе.",
    pricing: "Простые и понятные тарифы",
    pricingSub: "Выберите план, который подходит именно вам. Начните бесплатно.",
    free: "Free",
    freePrice: "$0",
    freePeriod: "/ month",
    freeFeatures: ["100 генераций", "Базовые модели", "Поддержка по email"],
    freeButton: "Начать бесплатно",
    creator: "Creator",
    creatorPrice: "$15",
    creatorPeriod: "/ month",
    creatorFeatures: ["1000 генераций", "Продвинутые модели", "Приоритетная поддержка", "Доступ к новым функциям"],
    creatorButton: "Выбрать Creator",
    pro: "Pro Creator",
    proPrice: "$40",
    proPeriod: "/ month",
    proFeatures: ["Безлимитные генерации", "Все модели, включая премиум", "Персональный менеджер", "API доступ"],
    proButton: "Выбрать Pro",
    contact: "Связаться",
    privacy: "Политика конфиденциальности",
    whitepapers: "Белые листы",
    copyright: `© ${new Date().getFullYear()} FlowForge AI. All rights reserved.`,
    helpTitle: "Как пользоваться приложением",
    helpDesc1: "Добро пожаловать в FlowForge AI! Вот краткое руководство:",
    helpStep1: "1. Добавьте ноды: Используйте панель инструментов вверху, чтобы добавить ноды для генерации текста, изображений, видео или аудио на холст.",
    helpStep2: "2. Настройте ноды: Кликните на ноду, чтобы выделить ее. В появившихся полях введите промпт и выберите настройки (модель, соотношение сторон).",
    helpStep3: "3. Соединяйте ноды: Перетащите линию от правой точки одной ноды к левой точке другой, чтобы создать каскад. Результат первой ноды будет использован как входные данные для второй.",
    helpStep4: "4. Генерируйте: Нажмите кнопку 'Generate' на ноде, чтобы запустить процесс. Дождитесь результата в окне предпросмотра.",
    helpStep5: "5. Управляйте результатом: Вы можете скопировать текст или скачать медиафайлы, а также очистить вывод для повторной генерации.",
  },
  en: {
    launchApp: "Launch App",
    headline: "Cascading Content Generation with AI",
    subheadline: "Create unique images, videos, text, and audio with our intuitive node-based editor.",
    startCreating: "Start Creating",
    learnMore: "Learn More",
    allTools: "All Tools in One Place",
    allToolsSub: "Combine various AI models into a single workflow to achieve incredible results.",
    imgGen: "Image Generation",
    imgGenDesc: "Create photorealistic images and art from text descriptions using advanced models.",
    videoGen: "Video Generation",
    videoGenDesc: "Turn text or images into short video clips, defining the style and dynamics.",
    textGen: "Text Generation",
    textGenDesc: "Write articles, posts, scripts, and more using powerful language models.",
    audioGen: "Audio Generation",
    audioGenDesc: "Synthesize speech, create music, and sound effects for your projects.",
    cascade: "Cascading Chains",
    cascadeDesc: "Connect nodes so that the result of one generation becomes the input for the next.",
    visualEditor: "Visual Editor",
    visualEditorDesc: "Manage the entire generation process in a convenient drag-and-drop editor.",
    pricing: "Simple and Clear Pricing",
    pricingSub: "Choose the plan that's right for you. Start for free.",
    free: "Free",
    freePrice: "$0",
    freePeriod: "/ month",
    freeFeatures: ["100 generations", "Basic models", "Email support"],
    freeButton: "Start for free",
    creator: "Creator",
    creatorPrice: "$15",
    creatorPeriod: "/ month",
    creatorFeatures: ["1000 generations", "Advanced models", "Priority support", "Access to new features"],
    creatorButton: "Choose Creator",
    pro: "Pro Creator",
    proPrice: "$40",
    proPeriod: "/ month",
    proFeatures: ["Unlimited generations", "All models, including premium", "Personal manager", "API access"],
    proButton: "Choose Pro",
    contact: "Contact",
    privacy: "Privacy Policy",
    whitepapers: "Whitepapers",
    copyright: `© ${new Date().getFullYear()} FlowForge AI. All rights reserved.`,
    helpTitle: "How to Use the App",
    helpDesc1: "Welcome to FlowForge AI! Here's a quick guide:",
    helpStep1: "1. Add Nodes: Use the top toolbar to add nodes for generating text, images, video, or audio to the canvas.",
    helpStep2: "2. Configure Nodes: Click on a node to select it. In the fields that appear, enter your prompt and choose settings (model, aspect ratio).",
    helpStep3: "3. Connect Nodes: Drag a line from the right handle of one node to the left handle of another to create a cascade. The result of the first node will be used as input for the second.",
    helpStep4: "4. Generate: Press the 'Generate' button on a node to start the process. Wait for the result in the preview window.",
    helpStep5: "5. Manage Output: You can copy text or download media files, and clear the output to generate again.",
  }
};


export default function Home() {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const t = translations[lang];

  const toggleLang = () => {
    setLang(prevLang => prevLang === 'ru' ? 'en' : 'ru');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold inline-block">FlowForge AI</span>
          </Link>
          <div className="flex flex-1 items-center justify-end gap-2">
            <HelpModal t={t} />
            <ThemeToggle />
            <Button asChild>
              <Link href="/dashboard">{t.launchApp}</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={toggleLang} className="w-20">
              {lang === 'ru' ? 'EN' : 'RU'}
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
                {t.headline}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {t.subheadline}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" asChild>
                  <Link href="/dashboard">{t.startCreating}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">{t.learnMore}</Link>
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">{t.allTools}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.allToolsSub}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<ImageIcon className="w-8 h-8 text-primary" />}
              title={t.imgGen}
              description={t.imgGenDesc}
            />
            <FeatureCard
              icon={<Clapperboard className="w-8 h-8 text-primary" />}
              title={t.videoGen}
              description={t.videoGenDesc}
            />
            <FeatureCard
              icon={<Bot className="w-8 h-8 text-primary" />}
              title={t.textGen}
              description={t.textGenDesc}
            />
            <FeatureCard
              icon={<Mic className="w-8 h-8 text-primary" />}
              title={t.audioGen}
              description={t.audioGenDesc}
            />
            <FeatureCard
              icon={<LinkIcon className="w-8 h-8 text-primary" />}
              title={t.cascade}
              description={t.cascadeDesc}
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
              title={t.visualEditor}
              description={t.visualEditorDesc}
            />
          </div>
        </section>

        <section id="pricing" className="container py-24 sm:py-32">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">{t.pricing}</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t.pricingSub}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
                title={t.free}
                price={t.freePrice}
                period={t.freePeriod}
                features={t.freeFeatures}
                buttonText={t.freeButton}
                variant="default"
            />
            <PricingCard
                title={t.creator}
                price={t.creatorPrice}
                period={t.creatorPeriod}
                features={t.creatorFeatures}
                buttonText={t.creatorButton}
                variant="default"
                isFeatured
            />
            <PricingCard
                title={t.pro}
                price={t.proPrice}
                period={t.proPeriod}
                features={t.proFeatures}
                buttonText={t.proButton}
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
                    <Link href="#" className="hover:text-primary transition-colors">{t.privacy}</Link>
                    <Link href="#" className="hover:text-primary transition-colors">{t.whitepapers}</Link>
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
                <h4 className="font-semibold text-foreground">{t.contact}</h4>
                 <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors"><MessageCircle className="w-4 h-4"/>Whatsapp</Link>
                 <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors"><Send className="w-4 h-4" />Telegram</Link>
            </div>
        </div>
        <div className="container py-4 text-center text-xs text-muted-foreground/80 border-t">
          {t.copyright}
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

function HelpModal({ t }: { t: any }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">Help</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t.helpTitle}</DialogTitle>
                    <DialogDescription>{t.helpDesc1}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 text-sm text-muted-foreground">
                    <p>{t.helpStep1}</p>
                    <p>{t.helpStep2}</p>
                    <p>{t.helpStep3}</p>
                    <p>{t.helpStep4}</p>
                    <p>{t.helpStep5}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}

