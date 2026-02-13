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

  useEffect(() => {
    const token = localStorage.getItem("quickAccessToken");
    if (!token) {
      setLocation("/");
    } else {
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
        } catch (e) {
          console.error("Erro ao carregar configurações:", e);
        }
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

  // Carregar cores do localStorage
  const [gradientStart, setGradientStart] = useState("#1e40af");
  const [gradientMiddle, setGradientMiddle] = useState("#7c3aed");
  const [gradientEnd, setGradientEnd] = useState("#000000");

  useEffect(() => {
    const savedSettings = localStorage.getItem("dashboardSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setGradientStart(settings.gradientStart || "#1e40af");
        setGradientMiddle(settings.gradientMiddle || "#7c3aed");
        setGradientEnd(settings.gradientEnd || "#000000");
      } catch (e) {
        console.error("Erro ao carregar cores:", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen text-white" style={{
      background: `linear-gradient(to bottom, ${gradientStart}, ${gradientMiddle}, ${gradientEnd})`
    }}>
      {/* Header */}
      <header className="border-b border-purple-500/20 px-6 py-4 bg-black/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">{siteTitle}</h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/notifications")}
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-white"
            >
              📱 Notificações
            </Button>
            <Button
              onClick={handleAccessAdmin}
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-white"
            >
              <Settings size={18} className="mr-2" />
              Admin
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-purple-200 hover:text-white"
            >
              <LogOut size={18} className="mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Greeting and Balance Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">Olá! 👋</h2>
              <p className="text-purple-200">Bem-vindo ao seu painel</p>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-md rounded-2xl p-6 border border-purple-400/20">
              <div className="flex items-center justify-between mb-4">
                <p className="text-purple-200">Saldo total</p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 hover:bg-purple-500/20 rounded-full transition"
                >
                  {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              <h3 className="text-5xl font-bold mb-6">
                {showBalance ? `R$ ${balance.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "R$ ••••"}
              </h3>

              {/* Entries and Exits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400">↗</span>
                    <p className="text-green-200">Entradas</p>
                  </div>
                  <p className="text-2xl font-bold text-green-400">
                    R$ {entries.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-400">↘</span>
                    <p className="text-red-200">Saídas</p>
                  </div>
                  <p className="text-2xl font-bold text-red-400">
                    R$ {exits.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <div className="grid grid-cols-3 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/30 rounded-2xl p-6 transition flex flex-col items-center gap-3 text-center">
                  <Plus size={32} className="text-purple-400" />
                  <span className="text-sm font-medium">Adicionar</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-purple-500/30">
                <DialogHeader>
                  <DialogTitle className="text-white">Adicionar Transação</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Descrição</Label>
                    <Input className="bg-gray-800 border-gray-700 text-white mt-2" placeholder="Ex: Salário" />
                  </div>
                  <div>
                    <Label className="text-gray-300">Valor</Label>
                    <Input className="bg-gray-800 border-gray-700 text-white mt-2" placeholder="0.00" type="number" />
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-blue-500/20 border border-blue-400/30 hover:bg-blue-500/30 rounded-2xl p-6 transition flex flex-col items-center gap-3 text-center">
                  <CreditCard size={32} className="text-blue-400" />
                  <span className="text-sm font-medium">Cartões</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-purple-500/30">
                <DialogHeader>
                  <DialogTitle className="text-white">Meus Cartões</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <p className="text-gray-400">Nenhum cartão adicionado</p>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-orange-500/20 border border-orange-400/30 hover:bg-orange-500/30 rounded-2xl p-6 transition flex flex-col items-center gap-3 text-center">
                  <BarChart3 size={32} className="text-orange-400" />
                  <span className="text-sm font-medium">Relatório</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-purple-500/30">
                <DialogHeader>
                  <DialogTitle className="text-white">Relatório</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <p className="text-gray-400">Relatório de transações</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Transactions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Transações</h3>
              <a href="#" className="text-purple-400 hover:text-purple-300 text-sm">Ver todas</a>
            </div>
            
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-gray-900/50 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between hover:bg-gray-900/80 transition">
                  <div className="flex items-center gap-4">
                    <div className={`${tx.color} rounded-lg p-3 w-12 h-12 flex items-center justify-center`}>
                      {tx.icon}
                    </div>
                    <div>
                      <p className="font-semibold">{tx.name}</p>
                      <p className="text-sm text-gray-400">{tx.description}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${tx.type === "entry" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "entry" ? "+" : ""} R$ {Math.abs(tx.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
