import { DashboardSidebar, DashboardHeader } from "@/components/dashboard/sidebar"
import { AIChatbot } from "@/components/dashboard/ai-chatbot"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="pl-[260px] transition-all duration-300">
        <DashboardHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
      <AIChatbot />
    </div>
  )
}
