/**
 * Componente Navbar - Barra superior do sistema
 */
export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">MoneyTracker</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">Bem-vindo ao sistema</div>
      </div>
    </header>
  );
}
