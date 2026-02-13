import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Settings, Plus, CreditCard, BarChart3, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [hasQuickAccess, setHasQuickAccess] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  
  // Estado local para dados
  const [siteTitle, setSiteTitle] = useState("Trampo do 7");
  const [balance, setBalance] = useState(12450.80);
  const [entries, setEntries] = useState(5200.00);
  const [exits, setExits] = useState(3180.50);
  const [transactions, setTransactions] = useState([
    { id: 1, name: "Salário", description: "Trabalho • Hoje", amount: 5200.00, type: "entry", icon: "💰", color: "bg-green-600" },
    { id: 2, name: "Aluguel", description: "Moradia • Ontem", amount: -1500.00, type: "exit", icon: "🏠", color: "bg-red-600" },
  ]);

  // Cores do gradiente
  const [gradientStart, setGradientStart] = useState("#1e40af");
  const [gradientMiddle, setGradientMiddle] = useState("#7c3aed");
  const [gradientEnd, setGradientEnd] = useState("#000000");

  useEffect(() => {
    const token = localStorage.getItem("quickAccessToken");
    if (!token) {
      setLocation("/");
      return;
    }
    
    setHasQuickAccess(true);
    
    // Carregar configurações do localStorage
    const savedSettings = localStorage.getItem("dashboardSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setSiteTitle(settings.siteTitle || "Trampo do 7");
        setBalance(settings.balance || 12450.80);
        setEntries(settings.entries || 5200.00);
        setExits(settings.exits || 3180.50);
        setTransactions(settings.transactions || transactions);
        setGradientStart(settings.gradientStart || "#1e40af");
        setGradientMiddle(settings.gradientMiddle || "#7c3aed");
        setGradientEnd(settings.gradientEnd || "#000000");
      } catch (e) {
        console.error("Erro ao carregar configurações:", e);
      }
    }
  }, [setLocation]);

  const handleAccessAdmin = () => {
    const adminCode = prompt("Digite o código de administrador:");
    if (adminCode === "123") {
      setLocation("/admin");
    } else if (adminCode !== null) {
      toast.error("Código inválido!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("quickAccessToken");
    setLocation("/");
  };

  if (!hasQuickAccess) {
    return null;
  }

  return (
    <div className="min-h-screen text-white" style={{
      background: `linear-gradient(to bottom, ${gradientStart}, ${gradientMiddle}, ${gradientEnd})`
    }}>
      {/* Header */}
      <header className="border-b border-purple-500/20 px-6 py-4 bg-black/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Olá! 👋</h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAccessAdmin}
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-white"
            >
              <Settings size={20} />
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-white"
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Saldo Total */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-200">{siteTitle}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="text-purple-200 hover:text-white"
              >
                {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
              </Button>
            </div>
            <div className="text-5xl font-bold">
              {showBalance ? `R$ ${balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "••••••"}
            </div>
          </div>

          {/* Entradas e Saídas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-600/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/30">
              <div className="text-green-300 text-sm font-semibold mb-2">📈 Entradas</div>
              <div className="text-3xl font-bold text-green-400">
                R$ {entries.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-red-600/20 backdrop-blur-md rounded-2xl p-6 border border-red-500/30">
              <div className="text-red-300 text-sm font-semibold mb-2">📉 Saídas</div>
              <div className="text-3xl font-bold text-red-400">
                R$ {exits.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Menu de Ações */}
          <div className="grid grid-cols-3 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 h-20 flex flex-col items-center justify-center rounded-2xl">
                  <Plus size={24} className="mb-2" />
                  <span className="text-sm">Adicionar</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800">
                <DialogHeader>
                  <DialogTitle>Adicionar Transação</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Descrição</Label>
                    <Input placeholder="Ex: Salário" className="bg-gray-800 border-gray-700 text-white mt-2" />
                  </div>
                  <div>
                    <Label>Valor</Label>
                    <Input type="number" placeholder="0.00" className="bg-gray-800 border-gray-700 text-white mt-2" />
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-20 flex flex-col items-center justify-center rounded-2xl">
                  <CreditCard size={24} className="mb-2" />
                  <span className="text-sm">Cartões</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800">
                <DialogHeader>
                  <DialogTitle>Meus Cartões</DialogTitle>
                </DialogHeader>
                <div className="text-gray-400">Nenhum cartão cadastrado</div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 h-20 flex flex-col items-center justify-center rounded-2xl">
                  <BarChart3 size={24} className="mb-2" />
                  <span className="text-sm">Relatório</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800">
                <DialogHeader>
                  <DialogTitle>Relatório</DialogTitle>
                </DialogHeader>
                <div className="text-gray-400">Relatório em desenvolvimento</div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Transações */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-6">Transações</h3>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{tx.icon}</div>
                    <div>
                      <div className="font-semibold">{tx.name}</div>
                      <div className="text-sm text-gray-400">{tx.description}</div>
                    </div>
                  </div>
                  <div className={`font-bold ${tx.type === "entry" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "entry" ? "+" : ""} R$ {Math.abs(tx.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
