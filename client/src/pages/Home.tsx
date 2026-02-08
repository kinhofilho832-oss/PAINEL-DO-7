import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { LogOut, LayoutDashboard, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const QUICK_ACCESS_CODE = "acesso123";

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [accessCode, setAccessCode] = useState("");

  const handleQuickAccess = () => {
    if (!accessCode) {
      toast.error("Digite o código de acesso");
      return;
    }

    if (accessCode === QUICK_ACCESS_CODE) {
      localStorage.setItem("quickAccessToken", accessCode);
      localStorage.setItem("quickAccessTime", new Date().getTime().toString());
      toast.success("Acesso concedido!");
      setLocation("/dashboard");
    } else {
      toast.error("Código de acesso inválido");
      setAccessCode("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleQuickAccess();
    }
  };

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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">Painel Premium</h1>
          <p className="text-gray-400 mb-8 text-center">
            Acesse seu painel de administração
          </p>

          {/* Quick Access Code Section */}
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="accessCode" className="text-white">Código de Acesso</Label>
              <Input
                id="accessCode"
                type="password"
                placeholder="Digite seu código"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-gray-800 border-gray-700 text-white mt-2"
                autoFocus
              />
            </div>
            <Button
              onClick={handleQuickAccess}
              className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-3"
            >
              Acessar
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-500">ou</span>
            </div>
          </div>

          {/* OAuth Login */}
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            variant="outline"
            className="w-full border-gray-700 text-white hover:bg-gray-800 font-semibold py-3"
          >
            Fazer Login com Manus
          </Button>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              Plataforma de gestão segura e profissional
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
