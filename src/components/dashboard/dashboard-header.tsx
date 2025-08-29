
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import Logo from "@/components/icons/logo";
import { HelpCircle, LayoutGrid, LogOut, Settings, User as UserIcon } from "lucide-react";
import { JobsPanel } from "./jobs-panel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

const helpText = {
  title: "Как пользоваться приложением",
  desc1: "Добро пожаловать в FlowForge AI! Вот краткое руководство:",
  step1: "1. Добавьте ноды: Используйте панель инструментов вверху, чтобы добавить ноды для генерации текста, изображений, видео или аудио на холст.",
  step2: "2. Настройте ноды: Кликните на ноду, чтобы выделить ее. В появившихся полях введите промпт и выберите настройки (модель, соотношение сторон).",
  step3: "3. Соединяйте ноды: Перетащите линию от правой точки одной ноды к левой точке другой, чтобы создать каскад. Результат первой ноды будет использован как входные данные для второй.",
  step4: "4. Генерируйте: Нажмите кнопку 'Generate' на ноде, чтобы запустить процесс. Дождитесь результата в окне предпросмотра.",
  step5: "5. Управляйте результатом: Вы можете скопировать текст или скачать медиафайлы, а также очистить вывод для повторной генерации."
}


export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-6 w-6" />
          <span className="font-bold hidden sm:inline-block">FlowForge AI</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {/* Add nav items here if needed */}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <JobsPanel />
          <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">Help</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{helpText.title}</DialogTitle>
                    <DialogDescription>{helpText.desc1}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 text-sm text-muted-foreground">
                    <p>{helpText.step1}</p>
                    <p>{helpText.step2}</p>
                    <p>{helpText.step3}</p>
                    <p>{helpText.step4}</p>
                    <p>{helpText.step5}</p>
                </div>
            </DialogContent>
        </Dialog>
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://picsum.photos/100" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  <span>Workspaces</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

