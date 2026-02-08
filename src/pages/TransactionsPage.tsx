/**
 * Página de gerenciamento de Transações
 * CRUD completo com validações de regras de negócio
 */
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  clearError,
  clearSuccess,
} from "@/features/transactions/transactionsSlice";
import { fetchPeople } from "@/features/people/peopleSlice";
import { fetchCategories } from "@/features/categories/categoriesSlice";
import { Transaction, CreateTransactionDTO } from "@/types/Transaction";
import {
  validateTransactionAmount,
  validateCategoryType,
  validateMinorTransaction,
  isMinor,
} from "@/utils/validation";
import {
  formatCurrency,
  formatDate,
  formatType,
  getTypeBadgeClass,
} from "@/utils/formatters";
import Modal from "@/components/ui/modal";
import Alert from "@/components/ui/alert-feedback";
import Loading from "@/components/ui/loading";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const { transactions, loading, error, success } = useAppSelector(
    (state) => state.transactions,
  );
  const { people } = useAppSelector((state) => state.people);
  const { categories } = useAppSelector((state) => state.categories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [formData, setFormData] = useState<CreateTransactionDTO>({
    personId: "",
    categoryId: "",
    amount: 0,
    description: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchPeople());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Enriquecer transações com nomes
  const enrichedTransactions = transactions.map((transaction) => {
    const person = people.find((p) => p.id === transaction.personId);
    const category = categories.find((c) => c.id === transaction.categoryId);
    return {
      ...transaction,
      personName: person?.name || "Desconhecido",
      categoryName: category?.name || "Desconhecida",
    };
  });

  const handleOpenModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        personId: transaction.personId,
        categoryId: transaction.categoryId,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        type: transaction.type,
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        personId: "",
        categoryId: "",
        amount: 0,
        description: "",
        date: new Date().toISOString().split("T")[0],
        type: "expense",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.personId) {
      errors.personId = "Selecione uma pessoa";
    }

    if (!formData.categoryId) {
      errors.categoryId = "Selecione uma categoria";
    }

    const amountValidation = validateTransactionAmount(formData.amount);
    if (!amountValidation.valid) {
      errors.amount = amountValidation.error!;
    }

    if (!formData.description.trim()) {
      errors.description = "Descrição é obrigatória";
    }

    if (!formData.date) {
      errors.date = "Data é obrigatória";
    }

    // Validar categoria compatível com tipo
    if (formData.categoryId) {
      const category = categories.find((c) => c.id === formData.categoryId);
      if (category) {
        const categoryValidation = validateCategoryType(
          formData.type,
          category.type,
        );
        if (!categoryValidation.valid) {
          errors.categoryId = categoryValidation.error!;
        }
      }
    }

    // Validar se menor de idade pode criar receita
    if (formData.personId) {
      const person = people.find((p) => p.id === formData.personId);
      if (person) {
        const minorValidation = validateMinorTransaction(
          person.birthDate,
          formData.type,
        );
        if (!minorValidation.valid) {
          errors.type = minorValidation.error!;
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingTransaction) {
        await dispatch(
          updateTransaction({ id: editingTransaction.id!, data: formData }),
        ).unwrap();
      } else {
        await dispatch(createTransaction(formData)).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar transação:", err);
    }
  };

  const handleDelete = async (transaction: Transaction) => {
    if (!window.confirm("Tem certeza que deseja deletar esta transação?")) {
      return;
    }

    try {
      await dispatch(deleteTransaction(transaction.id!)).unwrap();
    } catch (err) {
      console.error("Erro ao deletar transação:", err);
    }
  };

  // Filtrar categorias compatíveis com o tipo selecionado
  const compatibleCategories = categories.filter(
    (c) => c.type === formData.type,
  );

  // Verificar se pessoa selecionada é menor de idade
  const selectedPerson = people.find((p) => p.id === formData.personId);
  const isPersonMinor = selectedPerson
    ? isMinor(selectedPerson.birthDate)
    : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Transações</h1>
          <p className="text-gray-600 mt-2">Gerencie receitas e despesas</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nova Transação
        </button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => dispatch(clearError())}
        />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => dispatch(clearSuccess())}
        />
      )}

      {loading && <Loading />}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pessoa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrichedTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhuma transação cadastrada
                  </td>
                </tr>
              ) : (
                enrichedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.personName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.categoryName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {transaction.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(transaction.type)}`}
                      >
                        {formatType(transaction.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${transaction.type === "income" ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(transaction)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? "Editar Transação" : "Nova Transação"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pessoa *
            </label>
            <select
              value={formData.personId}
              onChange={(e) =>
                setFormData({ ...formData, personId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma pessoa</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
            {formErrors.personId && (
              <p className="text-red-600 text-sm mt-1">{formErrors.personId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo *
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "income" | "expense",
                  categoryId: "",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isPersonMinor}
            >
              <option value="expense">Despesa</option>
              <option value="income" disabled={isPersonMinor}>
                Receita
              </option>
            </select>
            {formErrors.type && (
              <p className="text-red-600 text-sm mt-1">{formErrors.type}</p>
            )}
            {isPersonMinor && (
              <p className="text-amber-600 text-sm mt-1">
                ⚠️ Pessoa menor de 18 anos só pode cadastrar despesas
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Selecione uma categoria</option>
              {compatibleCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {formErrors.categoryId && (
              <p className="text-red-600 text-sm mt-1">
                {formErrors.categoryId}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.amount && (
              <p className="text-red-600 text-sm mt-1">{formErrors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.date && (
              <p className="text-red-600 text-sm mt-1">{formErrors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            {formErrors.description && (
              <p className="text-red-600 text-sm mt-1">
                {formErrors.description}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
