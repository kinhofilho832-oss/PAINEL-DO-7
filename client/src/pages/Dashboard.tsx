import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Settings, Plus, CreditCard, BarChart3, Eye, EyeOff, Send, Wallet, TrendingUp } from "lucide-react";
import { toast } from "sonner";

// Componente separado para cada botão customizável
function CustomButtonDialog({ btn, onWithdraw }: any) {
  const [pixKey, setPixKey] = useState("");
  const [pixValue, setPixValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (id: number) => {
    switch(id) {
      case 1: return Send;
      case 2: return Wallet;
      case 3: return TrendingUp;
      case 4: return CreditCard;
      case 5: return BarChart3;
      default: return Plus;
    }
  };

  const IconComponent = getIcon(btn.id);

  const handleConfirm = () => {
    if (!pixKey.trim() || !pixValue.trim()) {
      toast.error("Preencha a chave PIX e o valor!");
      return;
    }
    
    const withdrawValue = parseFloat(pixValue);
    if (isNaN(withdrawValue) || withdrawValue <= 0) {
      toast.error("Valor inválido!");
      return;
    }
    
    // Chamar o callback para atualizar saldo e saídas
    onWithdraw(withdrawValue);
    
    toast.success("O SEU SAQUE FOI CONCLUÍDO COM SUCESSO AGORA ESPERAR EM ATÉ 1HORA ÚTEIS O DINHEIRO CAÍRA");
    setPixKey("");
    setPixValue("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={`w-full ${btn.color} hover:opacity-80 h-20 flex flex-col items-center justify-center rounded-2xl`}>
          <IconComponent size={24} className="mb-2" />
          <span className="text-sm">{btn.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>{btn.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Chave PIX</Label>
            <Input 
              placeholder="Ex: seu@email.com" 
              className="bg-gray-800 border-gray-700 text-white mt-2"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
            />
          </div>
          <div>
            <Label>Valor</Label>
            <Input 
              type="number" 
              placeholder="0.00" 
              className="bg-gray-800 border-gray-700 text-white mt-2"
              value={pixValue}
              onChange={(e) => setPixValue(e.target.value)}
            />
          </div>
          <Button onClick={handleConfirm} className="w-full bg-purple-600 hover:bg-purple-700">Confirmar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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

  // Botões customizáveis
  const [customButtons, setCustomButtons] = useState([
    { id: 1, name: "Transferência", color: "bg-blue-600" },
    { id: 2, name: "Depósito", color: "bg-green-600" },
    { id: 3, name: "Investimento", color: "bg-purple-600" },
    { id: 4, name: "Cartões", color: "bg-blue-600" },
    { id: 5, name: "Relatório", color: "bg-red-600" },
  ]);

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
        if (settings.buttons) {
          setCustomButtons(settings.buttons);
        }
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

  const handleWithdraw = (withdrawValue: number) => {
    // Atualizar saldo (diminuir)
    const newBalance = balance - withdrawValue;
    setBalance(newBalance);
    
    // Atualizar saídas (aumentar)
    const newExits = exits + withdrawValue;
    setExits(newExits);
    
    // Salvar no localStorage
    const currentSettings = localStorage.getItem("dashboardSettings");
    const settings = currentSettings ? JSON.parse(currentSettings) : {};
    settings.balance = newBalance;
    settings.exits = newExits;
    localStorage.setItem("dashboardSettings", JSON.stringify(settings));
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
          <div className="grid grid-cols-2 gap-4">
            {/* Botões Customizáveis */}
            {customButtons.map((btn: any) => (
              <CustomButtonDialog key={btn.id} btn={btn} onWithdraw={handleWithdraw} />
            ))}
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
