import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const QUICK_ACCESS_CODE = "acesso123";

export default function QuickAccess() {
  const [code, setCode] = useState("");
  const [, setLocation] = useLocation();

  const handleAccess = () => {
    if (!code) {
      toast.error("Digite o código de acesso");
      return;
    }

    if (code === QUICK_ACCESS_CODE) {
      // Store access token in localStorage
      localStorage.setItem("quickAccessToken", code);
      localStorage.setItem("quickAccessTime", new Date().getTime().toString());
      toast.success("Acesso concedido!");
      setLocation("/dashboard");
    } else {
      toast.error("Código de acesso inválido");
      setCode("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAccess();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Painel Premium</h1>
        <p className="text-gray-400 mb-8">Digite seu código de acesso para continuar</p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="accessCode">Código de Acesso</Label>
            <Input
              id="accessCode"
              type="password"
              placeholder="Digite seu código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-gray-800 border-gray-700 text-white mt-2"
              autoFocus
            />
          </div>

          <Button
            onClick={handleAccess}
            className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-3"
          >
            Acessar
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            Acesso rápido ao painel de administração
          </p>
        </div>
      </div>
    </div>
  );
}
