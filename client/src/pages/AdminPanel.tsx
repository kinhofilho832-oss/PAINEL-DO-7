import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: number;
  name: string;
  description: string;
  amount: number;
  type: "entry" | "exit";
  icon: string;
  color: string;
}

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [adminCode, setAdminCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(true);

  // Configurações do dashboard
  const [siteTitle, setSiteTitle] = useState("Trampo do 7");
  const [balance, setBalance] = useState(12450.80);
  const [entries, setEntries] = useState(5200.00);
  const [exits, setExits] = useState(3180.50);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, name: "Salário", description: "Trabalho • Hoje", amount: 5200.00, type: "entry", icon: "💰", color: "bg-green-600" },
    { id: 2, name: "Aluguel", description: "Moradia • Ontem", amount: -1500.00, type: "exit", icon: "🏠", color: "bg-red-600" },
  ]);

  // Cores
  const [gradientStart, setGradientStart] = useState("#1e40af");
  const [gradientMiddle, setGradientMiddle] = useState("#7c3aed");
  const [gradientEnd, setGradientEnd] = useState("#000000");

  useEffect(() => {
    const token = localStorage.getItem("quickAccessToken");
    if (!token) {
      setLocation("/");
    }

    // Carregar configurações salvas
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

  const handleVerifyCode = () => {
    if (adminCode === "123") {
      setIsAuthenticated(true);
      setShowCodeInput(false);
      toast.success("Acesso concedido!");
    } else {
      toast.error("Código inválido!");
      setAdminCode("");
    }
  };

  const handleSaveSettings = () => {
    const settings = {
      siteTitle,
      balance,
      entries,
      exits,
      transactions,
      gradientStart,
      gradientMiddle,
      gradientEnd,
    };
    localStorage.setItem("dashboardSettings", JSON.stringify(settings));
    toast.success("Configurações salvas com sucesso!");
  };

  const handleAddTransaction = () => {
    const newTransaction: Transaction = {
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
      name: "Nova Transação",
      description: "Descrição",
      amount: 0,
      type: "entry",
      icon: "💳",
      color: "bg-blue-600",
    };
    setTransactions([...transactions, newTransaction]);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleUpdateTransaction = (id: number, field: string, value: any) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  if (!isAuthenticated && showCodeInput) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6">Painel de Administração</h1>
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminCode" className="text-gray-300">Código de Administrador</Label>
              <Input
                id="adminCode"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleVerifyCode()}
                className="bg-gray-800 border-gray-700 text-white mt-2"
                placeholder="Digite o código"
              />
            </div>
            <Button
              onClick={handleVerifyCode}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Entrar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Painel de Administração</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft size={18} className="mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Configurações Gerais */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Configurações Gerais</h2>
            
            <div>
              <Label htmlFor="siteTitle" className="text-gray-300">Título do Site</Label>
              <Input
                id="siteTitle"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-2"
              />
            </div>
          </div>

          {/* Saldo e Valores */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Saldo e Valores</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="balance" className="text-gray-300">Saldo Total</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={balance}
                  onChange={(e) => setBalance(parseFloat(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>
              <div>
                <Label htmlFor="entries" className="text-gray-300">Entradas</Label>
                <Input
                  id="entries"
                  type="number"
                  step="0.01"
                  value={entries}
                  onChange={(e) => setEntries(parseFloat(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>
              <div>
                <Label htmlFor="exits" className="text-gray-300">Saídas</Label>
                <Input
                  id="exits"
                  type="number"
                  step="0.01"
                  value={exits}
                  onChange={(e) => setExits(parseFloat(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>
            </div>
          </div>

          {/* Cores do Gradiente */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Cores do Gradiente</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="gradientStart" className="text-gray-300">Cor Inicial</Label>
                <div className="flex gap-2 mt-2">
                  <input
                    id="gradientStart"
                    type="color"
                    value={gradientStart}
                    onChange={(e) => setGradientStart(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={gradientStart}
                    onChange={(e) => setGradientStart(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="gradientMiddle" className="text-gray-300">Cor do Meio</Label>
                <div className="flex gap-2 mt-2">
                  <input
                    id="gradientMiddle"
                    type="color"
                    value={gradientMiddle}
                    onChange={(e) => setGradientMiddle(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={gradientMiddle}
                    onChange={(e) => setGradientMiddle(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="gradientEnd" className="text-gray-300">Cor Final</Label>
                <div className="flex gap-2 mt-2">
                  <input
                    id="gradientEnd"
                    type="color"
                    value={gradientEnd}
                    onChange={(e) => setGradientEnd(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={gradientEnd}
                    onChange={(e) => setGradientEnd(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Preview do Gradiente */}
            <div
              className="h-24 rounded-lg border border-gray-700"
              style={{
                background: `linear-gradient(to bottom, ${gradientStart}, ${gradientMiddle}, ${gradientEnd})`,
              }}
            />
          </div>

          {/* Transações */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Transações</h2>
              <Button
                onClick={handleAddTransaction}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus size={18} className="mr-2" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Nome</Label>
                      <Input
                        value={tx.name}
                        onChange={(e) => handleUpdateTransaction(tx.id, "name", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Descrição</Label>
                      <Input
                        value={tx.description}
                        onChange={(e) => handleUpdateTransaction(tx.id, "description", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-300">Valor</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={tx.amount}
                        onChange={(e) => handleUpdateTransaction(tx.id, "amount", parseFloat(e.target.value))}
                        className="bg-gray-700 border-gray-600 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Tipo</Label>
                      <select
                        value={tx.type}
                        onChange={(e) => handleUpdateTransaction(tx.id, "type", e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md mt-2 px-3 py-2"
                      >
                        <option value="entry">Entrada</option>
                        <option value="exit">Saída</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Ícone</Label>
                      <Input
                        value={tx.icon}
                        onChange={(e) => handleUpdateTransaction(tx.id, "icon", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white mt-2"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => handleDeleteTransaction(tx.id)}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Deletar
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveSettings}
            className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg font-semibold"
          >
            <Save size={20} className="mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </main>
    </div>
  );
}
