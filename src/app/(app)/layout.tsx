import { Navigation } from "@/components/navigation";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { MemoryPalaceProvider } from "@/context/memory-palace-context";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MemoryPalaceProvider>
      <div className="min-h-screen w-full">
        <SidebarProvider>
          <Sidebar>
            <Navigation />
          </Sidebar>
          <SidebarInset>
            <main className="p-4 sm:p-6 lg:p-8">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </MemoryPalaceProvider>
  );
}
