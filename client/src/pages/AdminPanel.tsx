"use client";

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
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

interface Button {
  id: number;
  name: string;
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

  // Botões customizáveis
  const [buttons, setButtons] = useState<Button[]>([
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
        if (settings.buttons) {
          setButtons(settings.buttons);
        }
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
      setAdminCode("");
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
      buttons,
    };
    localStorage.setItem("dashboardSettings", JSON.stringify(settings));
    toast.success("Configurações salvas com sucesso!");
  };

  const handleUpdateButton = (id: number, field: string, value: any) => {
    setButtons(buttons.map(b => 
      b.id === id ? { ...b, [field]: value } : b
    ));
  };

  const handleAddTransaction = () => {
    const newTransaction: Transaction = {
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
      name: "Nova Transação",
      description: "Descrição",
      amount: 0,
      type: "entry",
      icon: "📝",
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

  if (showCodeInput) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6">Painel Admin</h1>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Código de Administrador</Label>
              <Input
                type="password"
                placeholder="Digite o código"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleVerifyCode()}
                className="bg-gray-800 border-gray-700 text-white mt-2"
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
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Painel de Administração</h1>
          <Button
            onClick={() => setLocation("/dashboard")}
            variant="ghost"
            className="text-gray-300 hover:text-white"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </Button>
        </div>

        {/* Configurações */}
        <div className="space-y-6">
          {/* Título do Site */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Configurações Gerais</h2>
            <div>
              <Label className="text-gray-300">Título do Site</Label>
              <Input
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
                <Label className="text-gray-300">Saldo Total</Label>
                <Input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(parseFloat(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>
              <div>
                <Label className="text-gray-300">Entradas</Label>
                <Input
                  type="number"
                  value={entries}
                  onChange={(e) => setEntries(parseFloat(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>
              <div>
                <Label className="text-gray-300">Saídas</Label>
                <Input
                  type="number"
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
                <Label className="text-gray-300">Cor Inicial</Label>
                <div className="flex gap-2 mt-2">
                  <input
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
                <Label className="text-gray-300">Cor Média</Label>
                <div className="flex gap-2 mt-2">
                  <input
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
                <Label className="text-gray-300">Cor Final</Label>
                <div className="flex gap-2 mt-2">
                  <input
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
          </div>

          {/* Botões Customizáveis */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">Botões Customizáveis</h2>
            
            <div className="space-y-3">
              {buttons.map((btn) => (
                <div key={btn.id} className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label className="text-gray-300">Nome do Botão</Label>
                    <Input
                      value={btn.name}
                      onChange={(e) => handleUpdateButton(btn.id, "name", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Cor</Label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="color"
                        value={btn.color.replace("bg-", "#").replace("-600", "")}
                        onChange={(e) => {
                          const colorMap: {[key: string]: string} = {
                            "#0000ff": "bg-blue-600",
                            "#00ff00": "bg-green-600",
                            "#ff0000": "bg-red-600",
                            "#800080": "bg-purple-600",
                            "#ffa500": "bg-orange-600",
                          };
                          const color = colorMap[e.target.value] || btn.color;
                          handleUpdateButton(btn.id, "color", color);
                        }}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transações */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Transações</h2>
              <Button
                onClick={handleAddTransaction}
                className="bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                <Plus size={16} className="mr-2" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-gray-800 border border-gray-700 rounded p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
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
                    <div>
                      <Label className="text-gray-300">Valor</Label>
                      <Input
                        type="number"
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
                        className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 mt-2 w-full"
                      >
                        <option value="entry">Entrada</option>
                        <option value="exit">Saída</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteTransaction(tx.id)}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Botão Salvar */}
          <Button
            onClick={handleSaveSettings}
            className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
          >
            <Save size={20} className="mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}
