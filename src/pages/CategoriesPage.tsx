/**
 * Página de gerenciamento de Categorias
 * CRUD completo com validações
 */
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
  clearSuccess,
} from "@/features/categories/categoriesSlice";
import { Category, CreateCategoryDTO } from "@/types/Category";
import { validateCategoryDescription } from "@/utils/validation";
import { formatType, getTypeBadgeClass } from "@/utils/formatters";
import Modal from "@/components/ui/modal";
import AlertFeedback from "@/components/ui/alert-feedback";
import Loading from "@/components/ui/loading";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, loading, error, success } = useAppSelector(
    (state) => state.categories,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryDTO>({
    name: "",
    description: "",
    type: "expense",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        type: category.type,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "", type: "expense" });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", type: "expense" });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório";
    }

    const descValidation = validateCategoryDescription(formData.description);
    if (!descValidation.valid) {
      errors.description = descValidation.error!;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({ id: editingCategory.id!, data: formData }),
        ).unwrap();
      } else {
        await dispatch(createCategory(formData)).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Tem certeza que deseja deletar ${category.name}?`)) {
      return;
    }

    try {
      await dispatch(deleteCategory(category.id!)).unwrap();
    } catch (err) {
      console.error("Erro ao deletar categoria:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Categorias</h1>
          <p className="text-gray-600 mt-2">
            Gerencie as categorias de transações
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nova Categoria
        </button>
      </div>

      {error && (
        <AlertFeedback
          type="error"
          message={error}
          onClose={() => dispatch(clearError())}
        />
      )}
      {success && (
        <AlertFeedback
          type="success"
          message={success}
          onClose={() => dispatch(clearSuccess())}
        />
      )}

      {loading && <Loading />}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Nenhuma categoria cadastrada
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-md truncate">
                      {category.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(category.type)}`}
                    >
                      {formatType(category.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? "Editar Categoria" : "Nova Categoria"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.name && (
              <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
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
              maxLength={400}
            />
            {formErrors.description && (
              <p className="text-red-600 text-sm mt-1">
                {formErrors.description}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/400 caracteres
            </p>
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
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
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
