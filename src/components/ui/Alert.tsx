/**
 * Componente Alert - Mensagens de feedback
 */
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  const isSuccess = type === "success";

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg mb-4 ${
        isSuccess ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
      }`}
    >
      {isSuccess ? (
        <CheckCircle size={20} className="flex-shrink-0" />
      ) : (
        <AlertCircle size={20} className="flex-shrink-0" />
      )}

      <p className="flex-1 text-sm font-medium">{message}</p>

      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
}
