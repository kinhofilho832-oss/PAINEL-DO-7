import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AdminPanel() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [adminCodeVerified, setAdminCodeVerified] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [tempCode, setTempCode] = useState("");

  // Fetch data
  const { data: adminSettings } = trpc.admin.getSettings.useQuery();
  const { data: buttons } = trpc.buttons.list.useQuery();

  // Mutations
  const verifyCodeMutation = trpc.admin.verifyAdminCode.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        setAdminCodeVerified(true);
        setAdminCode(tempCode);
        toast.success("Código verificado com sucesso!");
      } else {
        toast.error("Código de administrador inválido");
      }
    },
  });

  const updateSettingsMutation = trpc.admin.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Configurações atualizadas com sucesso!");
    },
  });

  const updateButtonMutation = trpc.buttons.update.useMutation({
    onSuccess: () => {
      toast.success("Botão atualizado com sucesso!");
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleVerifyCode = () => {
    if (!tempCode) {
      toast.error("Digite o código de administrador");
      return;
    }
    verifyCodeMutation.mutate({ code: tempCode });
  };

  const handleUpdateColor = (colorType: "primaryColor" | "secondaryColor" | "accentColor", value: string) => {
    updateSettingsMutation.mutate({
      [colorType]: value,
    });
  };

  const handleUpdateButtonLabel = (buttonId: number, newLabel: string) => {
    updateButtonMutation.mutate({
      buttonId,
      buttonLabel: newLabel,
    });
  };

  const handleUpdateSiteTitle = (newTitle: string) => {
    updateSettingsMutation.mutate({
      siteTitle: newTitle,
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!adminCodeVerified) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Acesso ao Painel Admin</h1>
          <p className="text-gray-400 mb-6">Digite seu código de administrador para continuar</p>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminCode">Código de Administrador</Label>
              <Input
                id="adminCode"
                type="password"
                placeholder="Digite seu código"
                value={tempCode}
                onChange={(e) => setTempCode(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button
              onClick={handleVerifyCode}
              className="w-full bg-white text-black hover:bg-gray-200 font-semibold"
              disabled={verifyCodeMutation.isPending}
            >
              {verifyCodeMutation.isPending ? "Verificando..." : "Verificar Código"}
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <Button
              variant="ghost"
              onClick={() => setLocation("/dashboard")}
              className="w-full text-gray-400 hover:text-white"
            >
              <ArrowLeft size={18} className="mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Painel de Administração</h1>
          <div className="flex items-center gap-4">
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
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Site Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Configurações do Site</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="siteTitle">Título do Site</Label>
                <Input
                  id="siteTitle"
                  type="text"
                  defaultValue={adminSettings?.siteTitle || "Painel Premium"}
                  onBlur={(e) => handleUpdateSiteTitle(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Color Customization */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Personalização de Cores</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="primaryColor">Cor Primária</Label>
                <div className="flex gap-2 mt-2">
                  <input
                    id="primaryColor"
                    type="color"
                    defaultValue={adminSettings?.primaryColor || "#000000"}
                    onChange={(e) => handleUpdateColor("primaryColor", e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue={adminSettings?.primaryColor || "#000000"}
                    onChange={(e) => handleUpdateColor("primaryColor", e.target.value)}
                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor">Cor Secundária</Label>
                <div className="flex gap-2 mt-2">
                  <input
                    id="secondaryColor"
                    type="color"
                    defaultValue={adminSettings?.secondaryColor || "#FFFFFF"}
                    onChange={(e) => handleUpdateColor("secondaryColor", e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue={adminSettings?.secondaryColor || "#FFFFFF"}
                    onChange={(e) => handleUpdateColor("secondaryColor", e.target.value)}
                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accentColor">Cor de Destaque</Label>
                <div className="flex gap-2 mt-2">
                  <input
                    id="accentColor"
                    type="color"
                    defaultValue={adminSettings?.accentColor || "#FF0000"}
                    onChange={(e) => handleUpdateColor("accentColor", e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue={adminSettings?.accentColor || "#FF0000"}
                    onChange={(e) => handleUpdateColor("accentColor", e.target.value)}
                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Button Customization */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Personalização de Botões</h2>
            
            <div className="space-y-4">
              {buttons?.map((btn) => (
                <div key={btn.id} className="flex items-end gap-4 p-4 bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor={`button-${btn.id}`}>Nome do Botão</Label>
                    <Input
                      id={`button-${btn.id}`}
                      type="text"
                      defaultValue={btn.buttonLabel}
                      onBlur={(e) => handleUpdateButtonLabel(btn.id, e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white mt-2"
                    />
                  </div>
                  <Button
                    style={{ backgroundColor: adminSettings?.primaryColor || "#000000" }}
                    className="text-white font-semibold"
                  >
                    Pré-visualizar
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <Button
              onClick={() => setLocation("/dashboard")}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <ArrowLeft size={18} className="mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
