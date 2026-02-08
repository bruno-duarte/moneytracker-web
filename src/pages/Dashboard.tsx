/**
 * Página Dashboard - Visão geral do sistema
 */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchPeople } from "@/features/people/peopleSlice";
import { fetchCategories } from "@/features/categories/categoriesSlice";
import { fetchTransactions } from "@/features/transactions/transactionsSlice";
import { calculateGeneralReport } from "@/features/reports/reportsSlice";
import {
  Users,
  FolderOpen,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import Loading from "@/components/ui/loading";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  const { people } = useAppSelector((state) => state.people);
  const { categories } = useAppSelector((state) => state.categories);
  const { transactions } = useAppSelector((state) => state.transactions);
  const { generalReport, loading } = useAppSelector((state) => state.reports);

  useEffect(() => {
    // Carregar dados iniciais
    dispatch(fetchPeople());
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    // Calcular relatório quando os dados estiverem carregados
    if (people.length > 0 || transactions.length > 0) {
      dispatch(calculateGeneralReport());
    }
  }, [people, transactions, dispatch]);

  const stats = [
    {
      label: "Total de Pessoas",
      value: people.length,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total de Categorias",
      value: categories.length,
      icon: FolderOpen,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Total de Transações",
      value: transactions.length,
      icon: CreditCard,
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema financeiro</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo financeiro */}
      {generalReport && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp size={20} className="text-emerald-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Total de Receitas
              </h3>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {formatCurrency(generalReport.totalIncome)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown size={20} className="text-red-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Total de Despesas
              </h3>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(generalReport.totalExpense)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-lg ${
                  generalReport.netBalance >= 0
                    ? "bg-emerald-100"
                    : "bg-red-100"
                }`}
              >
                <CreditCard
                  size={20}
                  className={
                    generalReport.netBalance >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }
                />
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Saldo Líquido
              </h3>
            </div>
            <p
              className={`text-2xl font-bold ${
                generalReport.netBalance >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(generalReport.netBalance)}
            </p>
          </div>
        </div>
      )}

      {/* Mensagem de boas-vindas */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Bem-vindo ao Sistema de Controle de Gastos!
        </h2>
        <p className="text-blue-100">
          Gerencie suas finanças de forma eficiente. Cadastre pessoas,
          categorias e transações para ter controle total dos seus gastos.
        </p>
      </div>
    </div>
  );
}
