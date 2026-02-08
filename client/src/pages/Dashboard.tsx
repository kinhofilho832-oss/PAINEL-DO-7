import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Settings, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [customColor, setCustomColor] = useState("#000000");
  const [openDialogs, setOpenDialogs] = useState<Record<number, boolean>>({});

  // Fetch data from server
  const { data: balance } = trpc.balance.getBalance.useQuery();
  const { data: history } = trpc.balance.getHistory.useQuery();
  const { data: buttons } = trpc.buttons.list.useQuery();
  const { data: adminSettings } = trpc.admin.getSettings.useQuery();

  // Mutations
  const addTransactionMutation = trpc.balance.addTransaction.useMutation({
    onSuccess: () => {
      toast.success("Transação adicionada com sucesso!");
      setOpenDialogs({});
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    if (adminSettings?.primaryColor) {
      setCustomColor(adminSettings.primaryColor);
    }
  }, [adminSettings]);

  const handleAddTransaction = (buttonId: number, type: "entrada" | "saida") => {
    const amountInput = document.getElementById(`amount-${buttonId}`) as HTMLInputElement;
    const pixKeyInput = document.getElementById(`pixKey-${buttonId}`) as HTMLInputElement;
    
    if (!amountInput?.value) {
      toast.error("Digite um valor");
      return;
    }

    const description = type === "entrada" ? "Depósito" : "Saque";

    addTransactionMutation.mutate({
      amount: parseInt(amountInput.value),
      type,
      description,
      pixKey: pixKeyInput?.value || undefined,
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  const balanceValue = balance || 0;
  const formattedBalance = (balanceValue / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/admin")}
              className="text-gray-400 hover:text-white"
            >
              <Settings size={18} className="mr-2" />
              Admin
            </Button>
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
          {/* Balance Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
            <p className="text-gray-400 mb-2">Saldo Disponível</p>
            <h2 className="text-5xl font-bold mb-6">R$ {formattedBalance}</h2>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {buttons?.map((btn) => (
                <Dialog key={btn.id} open={openDialogs[btn.id]} onOpenChange={(open) => setOpenDialogs({ ...openDialogs, [btn.id]: open })}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full font-semibold py-6 text-white"
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
                        <Label htmlFor={`amount-${btn.id}`}>Valor (em centavos)</Label>
                        <Input
                          id={`amount-${btn.id}`}
                          type="number"
                          placeholder="1000"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`pixKey-${btn.id}`}>Chave PIX (opcional)</Label>
                        <Input
                          id={`pixKey-${btn.id}`}
                          type="text"
                          placeholder="seu@email.com"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <Button
                        onClick={() => handleAddTransaction(btn.id, btn.buttonName === "deposito" ? "entrada" : "saida")}
                        className="w-full font-semibold text-white"
                        style={{ backgroundColor: customColor }}
                      >
                        Confirmar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-6">Histórico de Movimentações</h3>
            <div className="space-y-4">
              {history && history.length > 0 ? (
                history.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {transaction.type === "entrada" ? (
                        <ArrowDownLeft size={24} className="text-green-500" />
                      ) : (
                        <ArrowUpRight size={24} className="text-red-500" />
                      )}
                      <div>
                        <p className="font-semibold">{transaction.description}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(transaction.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold ${
                        transaction.type === "entrada" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {transaction.type === "entrada" ? "+" : "-"}R${" "}
                      {(transaction.amount / 100).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">Nenhuma transação registrada</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
