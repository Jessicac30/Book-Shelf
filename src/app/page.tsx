import { Dashboard } from "@/components/dashboard/dashboard";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Page() {
  return (
    <div>
      {/* O botão para testar o tema */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* O conteúdo principal da sua página */}
      <Dashboard />
    </div>
  );
}
