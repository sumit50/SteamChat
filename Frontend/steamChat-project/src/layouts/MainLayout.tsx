import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/chat/Sidebar";
import { ThemeProvider } from "@/components/ui/darkMode";
import { ModeToggle } from "@/components/ui/modeToggle";
// import { GlobalSupportChat } from "@/components/chat/GlobalSupportChat";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <Sidebar />
        <main className="flex-1 flex flex-col w-full bg-background text-foreground min-h-screen relative">
          <div className="p-2 border-b flex justify-between items-center">
            <SidebarTrigger />
            <ModeToggle />
          </div>
          {children}
          {/* <GlobalSupportChat /> */}
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};

