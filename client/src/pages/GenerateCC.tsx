import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface CreditCard {
  bin: string;
  cc: string;
  name: string;
  cpf: string;
  expiry: string;
}

// Nomes aleatórios para gerar
const NAMES = [
  "Cláudio Martines Castro",
  "Ana Silva Santos",
  "João Pedro Costa",
  "Maria Oliveira",
  "Carlos Alberto Souza",
  "Fernanda Lima Dias",
  "Roberto Martins",
  "Juliana Rocha",
  "Lucas Ferreira",
  "Beatriz Alves",
  "Diego Mendes",
  "Patricia Gomes",
  "Rafael Barbosa",
  "Camila Ribeiro",
  "Gustavo Pereira",
];

function generateRandomBIN(): string {
  return Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join("");
}

function generateRandomCC(): string {
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join("");
}

function generateRandomCPF(): string {
  const part1 = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  const part2 = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  const part3 = String(Math.floor(Math.random() * 10000)).padStart(5, "0");
  return `${part1}.${part2}.${part3}`;
}

function generateRandomExpiry(): string {
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const year = String(Math.floor(Math.random() * 10) + 24);
  return `${month}/${year}`;
}

function generateRandomName(): string {
  return NAMES[Math.floor(Math.random() * NAMES.length)];
}

function generateCard(): CreditCard {
  return {
    bin: generateRandomBIN(),
    cc: generateRandomCC(),
    name: generateRandomName(),
    cpf: generateRandomCPF(),
    expiry: generateRandomExpiry(),
  };
}

export default function GenerateCC() {
  const [, setLocation] = useLocation();
  const [card, setCard] = useState<CreditCard>(generateCard());

  const handleGenerate = () => {
    setCard(generateCard());
  };

  const handleBack = () => {
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black text-white p-6">
      {/* Header */}
      <header className="mb-8">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="text-purple-200 hover:text-white mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Voltar
        </Button>
        <h1 className="text-4xl font-bold">Gerador de Cartão</h1>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md">
          {/* Cartão de Crédito */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 shadow-2xl mb-8 border border-purple-400/30">
            <div className="space-y-6">
              {/* BIN */}
              <div>
                <div className="text-purple-200 text-sm font-semibold mb-2">BIN</div>
                <div className="text-2xl font-mono font-bold tracking-wider">{card.bin}</div>
              </div>

              {/* CC */}
              <div>
                <div className="text-purple-200 text-sm font-semibold mb-2">CC</div>
                <div className="text-2xl font-mono font-bold tracking-wider">{card.cc}</div>
              </div>

              {/* Nome */}
              <div>
                <div className="text-purple-200 text-sm font-semibold mb-2">NOME</div>
                <div className="text-xl font-bold">{card.name}</div>
              </div>

              {/* CPF */}
              <div>
                <div className="text-purple-200 text-sm font-semibold mb-2">CPF</div>
                <div className="text-xl font-mono font-bold">{card.cpf}</div>
              </div>

              {/* Validade */}
              <div>
                <div className="text-purple-200 text-sm font-semibold mb-2">VALIDADE</div>
                <div className="text-2xl font-mono font-bold">{card.expiry}</div>
              </div>
            </div>
          </div>

          {/* Botão Gerar */}
          <Button
            onClick={handleGenerate}
            className="w-full bg-purple-600 hover:bg-purple-700 h-14 text-lg font-bold flex items-center justify-center gap-2 rounded-xl"
          >
            <RefreshCw size={20} />
            Gerar Novo
          </Button>

          {/* Aviso */}
          <div className="mt-6 text-center text-purple-300 text-sm">
            💡 Dados gerados aleatoriamente apenas para diversão
          </div>
        </div>
      </main>
    </div>
  );
}
