/**
 * Página de gerenciamento de Pessoas
 * CRUD completo com validações
 */
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchPeople,
  createPerson,
  updatePerson,
  deletePerson,
  clearError,
  clearSuccess,
} from "@/features/people/peopleSlice";
import { removeTransactionsByPersonId } from "@/features/transactions/transactionsSlice";
import { Person, CreatePersonDTO } from "@/types/Person";
import {
  validatePersonName,
  validateBirthDate,
  calculateAge,
} from "@/utils/validation";
import { formatDate } from "@/utils/formatters";
import Modal from "@/components/ui/modal";
import Alert from "@/components/ui/alert-feedback";
import Loading from "@/components/ui/loading";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function PeoplePage() {
  const dispatch = useAppDispatch();
  const { people, loading, error, success } = useAppSelector(
    (state) => state.people,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [formData, setFormData] = useState<CreatePersonDTO>({
    name: "",
    birthDate: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(fetchPeople());
  }, [dispatch]);

  const handleOpenModal = (person?: Person) => {
    if (person) {
      setEditingPerson(person);
      setFormData({
        name: person.name,
        birthDate: person.birthDate,
      });
    } else {
      setEditingPerson(null);
      setFormData({ name: "", birthDate: "" });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPerson(null);
    setFormData({ name: "", birthDate: "" });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    const nameValidation = validatePersonName(formData.name);
    if (!nameValidation.valid) {
      errors.name = nameValidation.error!;
    }

    const birthDateValidation = validateBirthDate(formData.birthDate);
    if (!birthDateValidation.valid) {
      errors.birthDate = birthDateValidation.error!;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingPerson) {
        await dispatch(
          updatePerson({ id: editingPerson.id!, data: formData }),
        ).unwrap();
      } else {
        await dispatch(createPerson(formData)).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar pessoa:", err);
    }
  };

  const handleDelete = async (person: Person) => {
    if (!window.confirm(`Tem certeza que deseja deletar ${person.name}?`)) {
      return;
    }

    try {
      await dispatch(deletePerson(person.id!)).unwrap();
      // Atualizar transações relacionadas
      dispatch(removeTransactionsByPersonId(person.id!));
    } catch (err) {
      console.error("Erro ao deletar pessoa:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pessoas</h1>
          <p className="text-gray-600 mt-2">Gerencie as pessoas do sistema</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nova Pessoa
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Nascimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Idade
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {people.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Nenhuma pessoa cadastrada
                </td>
              </tr>
            ) : (
              people.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {person.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {formatDate(person.birthDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {calculateAge(person.birthDate)} anos
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(person)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(person)}
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
        title={editingPerson ? "Editar Pessoa" : "Nova Pessoa"}
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
              maxLength={200}
            />
            {formErrors.name && (
              <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Nascimento *
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.birthDate && (
              <p className="text-red-600 text-sm mt-1">
                {formErrors.birthDate}
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
