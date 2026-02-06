/**
 * Redux Slice para gerenciamento de People
 * Contém estado, reducers e actions para operações de CRUD
 */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Person, CreatePersonDTO, UpdatePersonDTO } from "@/types/Person";
import { personService } from "@/services/personService";

interface PeopleState {
  people: Person[];
  selectedPerson: Person | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: PeopleState = {
  people: [],
  selectedPerson: null,
  loading: false,
  error: null,
  success: null,
};

// Thunks assíncronos
export const fetchPeople = createAsyncThunk(
  "people/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await personService.getAll();
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao buscar pessoas");
    }
  },
);

export const fetchPersonById = createAsyncThunk(
  "people/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await personService.getById(id);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao buscar pessoa");
    }
  },
);

export const createPerson = createAsyncThunk(
  "people/create",
  async (data: CreatePersonDTO, { rejectWithValue }) => {
    try {
      const response = await personService.create(data);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao criar pessoa");
    }
  },
);

export const updatePerson = createAsyncThunk(
  "people/update",
  async (
    { id, data }: { id: string; data: UpdatePersonDTO },
    { rejectWithValue },
  ) => {
    try {
      const response = await personService.update(id, data);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao atualizar pessoa");
    }
  },
);

export const partialUpdatePerson = createAsyncThunk(
  "people/partialUpdate",
  async (
    { id, data }: { id: string; data: Partial<UpdatePersonDTO> },
    { rejectWithValue },
  ) => {
    try {
      const response = await personService.partialUpdate(id, data);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Erro ao atualizar parcialmente a pessoa",
      );
    }
  },
);

export const deletePerson = createAsyncThunk(
  "people/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await personService.delete(id);
      return id; // Retorna o ID para remover do estado
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao deletar pessoa");
    }
  },
);

const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setSelectedPerson: (state, action: PayloadAction<Person | null>) => {
      state.selectedPerson = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all people
    builder
      .addCase(fetchPeople.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeople.fulfilled, (state, action) => {
        state.loading = false;
        state.people = action.payload;
      })
      .addCase(fetchPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch person by ID
    builder
      .addCase(fetchPersonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPerson = action.payload;
      })
      .addCase(fetchPersonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create person
    builder
      .addCase(createPerson.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createPerson.fulfilled, (state, action) => {
        state.loading = false;
        state.people.push(action.payload);
        state.success = "Pessoa criada com sucesso";
      })
      .addCase(createPerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update person
    builder
      .addCase(updatePerson.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updatePerson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.people.findIndex(
          (person) => person.id === action.payload.id,
        );
        if (index !== -1) {
          state.people[index] = action.payload;
        }
        state.success = "Pessoa atualizada com sucesso";
      })
      .addCase(updatePerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Partial update person
    builder
      .addCase(partialUpdatePerson.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(partialUpdatePerson.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.people.findIndex(
          (person) => person.id === action.payload.id,
        );
        if (index !== -1) {
          state.people[index] = {
            ...state.people[index],
            ...action.payload,
          };
        }
        state.success = "Pessoa parcialmente atualizada com sucesso";
      })
      .addCase(partialUpdatePerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete person
    builder
      .addCase(deletePerson.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deletePerson.fulfilled, (state, action) => {
        state.loading = false;
        state.people = state.people.filter(
          (person) => person.id !== action.payload,
        );
        state.success = "Pessoa deletada com sucesso";
      })
      .addCase(deletePerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, setSelectedPerson } =
  peopleSlice.actions;
export default peopleSlice.reducer;
