/**
 * Página de Relatórios Financeiros
 * Exibe totais por pessoa e por categoria
 */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchPeople } from "@/features/people/peopleSlice";
import { fetchCategories } from "@/features/categories/categoriesSlice";
import { fetchTransactions } from "@/features/transactions/transactionsSlice";
import {
  calculateGeneralReport,
  calculateCategoryReports,
} from "@/features/reports/reportsSlice";
import {
  formatCurrency,
  formatType,
  getTypeBadgeClass,
} from "@/utils/formatters";
import Loading from "@/components/ui/loading";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function ReportsPage() {
  const dispatch = useAppDispatch();

  const { generalReport, categoryReports, loading } = useAppSelector(
    (state) => state.reports,
  );

  useEffect(() => {
    // Carregar dados
    dispatch(fetchPeople());
    dispatch(fetchCategories());
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    // Calcular relatórios
    dispatch(calculateGeneralReport());
    dispatch(calculateCategoryReports());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Relatórios Financeiros
        </h1>
        <p className="text-gray-600 mt-2">
          Análise detalhada de receitas e despesas
        </p>
      </div>

      {/* Resumo Geral */}
      {generalReport && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp size={24} className="text-emerald-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Total de Receitas
              </h3>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {formatCurrency(generalReport.totalIncome)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown size={24} className="text-red-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Total de Despesas
              </h3>
            </div>
            <p className="text-3xl font-bold text-red-600">
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
                <DollarSign
                  size={24}
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
              className={`text-3xl font-bold ${
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

      {/* Relatório por Pessoa */}
      {generalReport && generalReport.peopleReports.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Totais por Pessoa
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pessoa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Receitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Despesas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {generalReport.peopleReports.map((report) => (
                  <tr key={report.personId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {report.personName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-emerald-600 font-medium">
                        {formatCurrency(report.totalIncome)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-red-600 font-medium">
                        {formatCurrency(report.totalExpense)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-bold ${
                          report.balance >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(report.balance)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Relatório por Categoria */}
      {categoryReports.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Totais por Categoria
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nº Transações
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryReports.map((report) => (
                  <tr key={report.categoryId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {report.categoryName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(report.type)}`}
                      >
                        {formatType(report.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {report.transactionCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-bold ${
                          report.type === "income"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(report.total)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mensagem quando não há dados */}
      {(!generalReport || generalReport.peopleReports.length === 0) &&
        categoryReports.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              Nenhum dado disponível para gerar relatórios.
            </p>
            <p className="text-gray-400 mt-2">
              Cadastre pessoas, categorias e transações para visualizar os
              relatórios.
            </p>
          </div>
        )}
    </div>
  );
}
