import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Settings, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [customColor, setCustomColor] = useState("#000000");
  const [openDialogs, setOpenDialogs] = useState<Record<number, boolean>>({});
  const [hasQuickAccess, setHasQuickAccess] = useState(false);
  
  // Estado local para dados
  const [siteTitle, setSiteTitle] = useState("Painel Premium");
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [buttons, setButtons] = useState([
    { id: 1, buttonLabel: "Transferência" },
    { id: 2, buttonLabel: "Depósito" },
    { id: 3, buttonLabel: "Saque" },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("quickAccessToken");
    if (!token) {
      setLocation("/");
    } else {
      setHasQuickAccess(true);
      
      // Carregar configurações do localStorage
      const savedSettings = localStorage.getItem("adminSettings");
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          setSiteTitle(settings.siteTitle || "Painel Premium");
          setCustomColor(settings.primaryColor || "#000000");
          setButtons(settings.buttons || buttons);
        } catch (e) {
          console.error("Erro ao carregar configurações:", e);
        }
      }
      
      // Carregar histórico de transações do localStorage
      const savedHistory = localStorage.getItem("transactionHistory");
      if (savedHistory) {
        try {
          const historyData = JSON.parse(savedHistory);
          setHistory(historyData);
          
          // Calcular saldo
          let totalBalance = 0;
          historyData.forEach((transaction: any) => {
            if (transaction.type === "entrada") {
              totalBalance += transaction.amount;
            } else {
              totalBalance -= transaction.amount;
            }
          });
          setBalance(totalBalance);
        } catch (e) {
          console.error("Erro ao carregar histórico:", e);
        }
      }
    }
  }, [setLocation]);

  const handleAddTransaction = (buttonId: number, type: "entrada" | "saida") => {
    const amountInput = document.querySelector("input[type='number']") as HTMLInputElement;
    const pixKeyInput = document.querySelector("input[type='text']") as HTMLInputElement;

    if (!amountInput?.value || !pixKeyInput?.value) {
      toast.error("Preencha todos os campos");
      return;
    }

    const amount = parseFloat(amountInput.value);
    const pixKey = pixKeyInput.value;

    // Criar transação
    const newTransaction = {
      id: Date.now(),
      amount,
      pixKey,
      type,
      createdAt: new Date().toISOString(),
      buttonId,
    };

    // Atualizar histórico
    const updatedHistory = [newTransaction, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("transactionHistory", JSON.stringify(updatedHistory));

    // Atualizar saldo
    let newBalance = balance;
    if (type === "entrada") {
      newBalance += amount;
    } else {
      newBalance -= amount;
    }
    setBalance(newBalance);

    // Limpar inputs
    amountInput.value = "";
    pixKeyInput.value = "";
    setOpenDialogs({});

    toast.success("Transação adicionada com sucesso!");
  };

  const handleLogout = () => {
    localStorage.removeItem("quickAccessToken");
    setLocation("/");
  };

  const handleAccessAdmin = () => {
    setLocation("/admin");
  };

  if (!hasQuickAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">{siteTitle}</h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleAccessAdmin}
              variant="outline"
              size="sm"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <Settings size={18} className="mr-2" />
              Admin
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
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
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Balance Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <h2 className="text-gray-400 text-sm mb-2">Saldo Disponível</h2>
            <h1 className="text-4xl font-bold" style={{ color: customColor }}>
              R$ {balance.toFixed(2)}
            </h1>
            <p className="text-gray-500 text-sm mt-4">
              Saldo disponível para transações
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {buttons.map((btn) => (
              <Dialog key={btn.id} open={openDialogs[btn.id]} onOpenChange={(open) => setOpenDialogs({ ...openDialogs, [btn.id]: open })}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full text-white font-semibold py-6"
                    style={{ backgroundColor: customColor }}
                  >
                    {btn.buttonLabel}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800 text-white">
                  <DialogHeader>
                    <DialogTitle>{btn.buttonLabel}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`amount-${btn.id}`}>Valor</Label>
                      <Input
                        id={`amount-${btn.id}`}
                        type="number"
                        placeholder="0.00"
                        className="bg-gray-800 border-gray-700 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`pixKey-${btn.id}`}>Chave PIX</Label>
                      <Input
                        id={`pixKey-${btn.id}`}
                        type="text"
                        placeholder="Digite a chave PIX"
                        className="bg-gray-800 border-gray-700 text-white mt-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddTransaction(btn.id, "entrada")}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <ArrowDownLeft size={18} className="mr-2" />
                        Entrada
                      </Button>
                      <Button
                        onClick={() => handleAddTransaction(btn.id, "saida")}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <ArrowUpRight size={18} className="mr-2" />
                        Saída
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {/* Transaction History */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Histórico de Transações</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history && history.length > 0 ? (
                history.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {transaction.type === "entrada" ? (
                        <ArrowDownLeft size={20} className="text-green-500" />
                      ) : (
                        <ArrowUpRight size={20} className="text-red-500" />
                      )}
                      <div>
                        <p className="font-semibold">{transaction.pixKey}</p>
                        <p className="text-sm text-gray-400">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${transaction.type === "entrada" ? "text-green-500" : "text-red-500"}`}>
                      {transaction.type === "entrada" ? "+" : "-"} R$ {transaction.amount.toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhuma transação registrada</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
