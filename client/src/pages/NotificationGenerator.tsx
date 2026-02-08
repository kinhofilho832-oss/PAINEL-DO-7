import { useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download } from "lucide-react";
import html2canvas from "html2canvas";

export default function NotificationGenerator() {
  const [, setLocation] = useLocation();
  const [senderName, setSenderName] = useState("Nubank");
  const [message, setMessage] = useState("Você recebeu uma transferência de R$ 100,00");
  const [time, setTime] = useState(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDownload = async () => {
    if (notificationRef.current) {
      try {
        const canvas = await html2canvas(notificationRef.current, {
          backgroundColor: "#000000",
          scale: 2,
        });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `notificacao-${Date.now()}.png`;
        link.click();
      } catch (error) {
        console.error("Erro ao gerar imagem:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gerador de Notificações</h1>
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
      <main className="flex-1 px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6">
            <h2 className="text-xl font-semibold">Configurar Notificação</h2>

            <div>
              <Label htmlFor="senderName">Nome do Remetente</Label>
              <Input
                id="senderName"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-2"
                placeholder="Ex: Nubank"
              />
            </div>

            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-2 min-h-32"
                placeholder="Digite a mensagem da notificação"
              />
            </div>

            <Button
              onClick={handleDownload}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            >
              <Download size={18} className="mr-2" />
              Baixar Notificação
            </Button>
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm">
              <div
                ref={notificationRef}
                className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  aspectRatio: "9/16",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Status Bar */}
                <div className="bg-black px-4 py-2 flex items-center justify-between text-xs text-gray-400">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <span>📶</span>
                    <span>📡</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Notification */}
                <div className="flex-1 flex items-center justify-center px-4">
                  <div className="w-full bg-gray-800 rounded-xl p-4 shadow-lg">
                    {/* Notification Header */}
                    <div className="flex items-center gap-3 mb-3">
                      {/* Nubank Logo */}
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">Nu</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{senderName}</p>
                        <p className="text-xs text-gray-400">{time}</p>
                      </div>
                    </div>

                    {/* Notification Message */}
                    <div className="bg-gray-700 rounded-lg p-3 mb-3">
                      <p className="text-sm text-white break-words">{message}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-gray-600 hover:bg-gray-500 text-white text-xs font-semibold py-2 rounded-lg transition">
                        Descartar
                      </button>
                      <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2 rounded-lg transition">
                        Abrir
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="bg-black px-4 py-3 flex items-center justify-around text-gray-400 text-xs">
                  <span>⬅️</span>
                  <span>⭕</span>
                  <span>⬜</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
