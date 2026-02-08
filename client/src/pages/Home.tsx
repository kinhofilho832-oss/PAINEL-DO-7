import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { LogOut, LayoutDashboard, Settings, Zap } from "lucide-react";

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold">Painel Premium</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Bem-vindo, {user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-gray-400 hover:text-white"
              >
                <LogOut size={18} className="mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dashboard Card */}
              <div
                onClick={() => setLocation("/dashboard")}
                className="bg-gray-900 border border-gray-800 rounded-lg p-8 cursor-pointer hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <LayoutDashboard size={32} className="text-white" />
                  <h2 className="text-xl font-semibold">Dashboard</h2>
                </div>
                <p className="text-gray-400 mb-6">
                  Acesse seu painel principal com visualização de saldo, histórico de transações e ações rápidas.
                </p>
                <Button className="w-full bg-white text-black hover:bg-gray-200">
                  Acessar Dashboard
                </Button>
              </div>

              {/* Admin Panel Card */}
              <div
                onClick={() => setLocation("/admin")}
                className="bg-gray-900 border border-gray-800 rounded-lg p-8 cursor-pointer hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Settings size={32} className="text-white" />
                  <h2 className="text-xl font-semibold">Painel Admin</h2>
                </div>
                <p className="text-gray-400 mb-6">
                  Personalize seu painel: altere cores, nomes de botões e configure suas preferências.
                </p>
                <Button className="w-full bg-white text-black hover:bg-gray-200">
                  Acessar Admin
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Painel Administrativo Premium</h1>
        <p className="text-gray-400 mb-8">
          Plataforma completa de gestão com autenticação segura, personalização visual e controle total.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => setLocation("/acesso")}
            className="w-full bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
          >
            <Zap size={20} className="mr-2" />
            Acesso Rápido
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-500">ou</span>
            </div>
          </div>
          
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            variant="outline"
            className="w-full border-gray-700 text-white hover:bg-gray-900 px-8 py-3 text-lg"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    </div>
  );
}
