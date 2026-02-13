import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

export default function Analytics() {
  const [, setLocation] = useLocation();
  const [hasQuickAccess, setHasQuickAccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("quickAccessToken");
    if (!token) {
      setLocation("/");
      return;
    }
    setHasQuickAccess(true);
  }, [setLocation]);

  if (!hasQuickAccess) {
    return null;
  }

  // Dados de exemplo
  const totalIncome = 15200.00;
  const totalExpense = 5680.50;
  const netBalance = totalIncome - totalExpense;
  const incomePercentage = ((totalIncome / (totalIncome + totalExpense)) * 100).toFixed(1);
  const expensePercentage = ((totalExpense / (totalIncome + totalExpense)) * 100).toFixed(1);

  const monthlyData = [
    { month: "Jan", income: 5200, expense: 1500 },
    { month: "Fev", income: 5200, expense: 1800 },
    { month: "Mar", income: 4800, expense: 2380.50 },
  ];

  const categories = [
    { name: "Salário", amount: 5200.00, percentage: 34.2, color: "bg-green-600" },
    { name: "Freelance", amount: 3500.00, percentage: 23.0, color: "bg-blue-600" },
    { name: "Investimentos", amount: 6500.00, percentage: 42.8, color: "bg-purple-600" },
  ];

  const expenses = [
    { name: "Aluguel", amount: 1500.00, percentage: 26.4, color: "bg-red-600" },
    { name: "Alimentação", amount: 1200.00, percentage: 21.1, color: "bg-orange-600" },
    { name: "Transporte", amount: 980.50, percentage: 17.2, color: "bg-yellow-600" },
    { name: "Outros", amount: 2000.00, percentage: 35.3, color: "bg-gray-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-purple-500/20 px-6 py-4 bg-black/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/dashboard")}
              variant="ghost"
              size="sm"
              className="text-purple-200 hover:text-white"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold">Análise Financeira</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm mb-2">Renda Total</p>
                  <p className="text-3xl font-bold text-green-400">
                    R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <TrendingUp size={32} className="text-green-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm mb-2">Despesas Totais</p>
                  <p className="text-3xl font-bold text-red-400">
                    R$ {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <TrendingDown size={32} className="text-red-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm mb-2">Saldo Líquido</p>
                  <p className="text-3xl font-bold text-blue-400">
                    R$ {netBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign size={32} className="text-blue-400" />
              </div>
            </div>
          </div>

          {/* Proporção Renda vs Despesa */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold mb-6">Proporção Renda vs Despesa</h2>
            <div className="flex items-end gap-8">
              <div className="flex-1">
                <div className="h-48 bg-gray-800 rounded-lg overflow-hidden flex items-end gap-2 p-4">
                  <div className="flex-1 bg-green-600 rounded-t-lg" style={{ height: `${incomePercentage}%` }}></div>
                  <div className="flex-1 bg-red-600 rounded-t-lg" style={{ height: `${expensePercentage}%` }}></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <div>
                    <p className="text-gray-300 text-sm">Renda</p>
                    <p className="text-lg font-bold">{incomePercentage}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                  <div>
                    <p className="text-gray-300 text-sm">Despesa</p>
                    <p className="text-lg font-bold">{expensePercentage}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Receitas por Categoria */}
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold mb-6">Receitas por Categoria</h2>
              <div className="space-y-4">
                {categories.map((cat, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{cat.name}</p>
                      <p className="text-green-400">R$ {cat.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className={`${cat.color} h-2 rounded-full`}
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{cat.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Despesas por Categoria */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold mb-6">Despesas por Categoria</h2>
              <div className="space-y-4">
                {expenses.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{exp.name}</p>
                      <p className="text-red-400">R$ {exp.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className={`${exp.color} h-2 rounded-full`}
                        style={{ width: `${exp.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{exp.percentage}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Evolução Mensal */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-bold mb-6">Evolução Mensal</h2>
            <div className="space-y-6">
              {monthlyData.map((data, idx) => (
                <div key={idx}>
                  <p className="font-semibold mb-3">{data.month}</p>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs mb-1">Receita</p>
                      <div className="h-20 bg-green-600 rounded-lg flex items-end justify-center text-white text-xs font-bold">
                        R$ {data.income.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-xs mb-1">Despesa</p>
                      <div className="h-12 bg-red-600 rounded-lg flex items-end justify-center text-white text-xs font-bold">
                        R$ {data.expense.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                      </div>
                    </div>
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
