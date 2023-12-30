import { createSlice } from '@reduxjs/toolkit';
import { companies } from '../util/mock-data';
export interface Employees {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
}

interface Company {
  name: string;
  employees: Employees[];
  address: string;
  id: number;
}

export interface InitialState {
  companies: Company[];
  activeModal: boolean;
  editable: boolean;
  selectedCompanies: Company[] | [];
}

const initialState: InitialState = {
  companies,
  activeModal: false,
  editable: false,
  selectedCompanies: [],
};

const companiesReducer = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    deleteCompany(state, action) {
      const deleteIds: number[] = action.payload;

      state.companies = state.companies.filter(
        (company) => !deleteIds.includes(company.id)
      );
    },
    isActiveModal(state) {
      state.activeModal = !state.activeModal;
    },
    isEditable(state) {
      state.editable = !state.editable;
    },
    addCompany(state, action) {
      if (action.payload) {
        state.companies = [...state.companies, action.payload];
      }
    },
    updateCompanyField(state, action) {
      const newStateCompany = action.payload;
      console.log(newStateCompany);

      const currentIndex = state.companies.findIndex(
        (company) => company.id === newStateCompany.id
      );
      state.companies[currentIndex] = newStateCompany;
    },
    addSelectedCompanies(state, action) {
      const selectedCompaniesIds = action.payload;

      state.selectedCompanies = state.companies.filter((company) =>
        selectedCompaniesIds.includes(company.id)
      );
    },
    deleteEmployee(state, action) {
      const { companyId, employeeId } = action.payload;

      const updatedCompanies = state.companies.map((company) => {
        if (company.id === companyId) {
          return {
            ...company,
            employees: company.employees.filter(
              (employee) => employee.id !== employeeId
            ),
          };
        }
        return company;
      });

      const updatedSelectedCompanies = state.selectedCompanies.map(
        (company) => {
          if (company.id === companyId) {
            return {
              ...company,
              employees: company.employees.filter(
                (employee) => employee.id !== employeeId
              ),
            };
          }
          return company;
        }
      );

      return {
        ...state,
        companies: updatedCompanies,
        selectedCompanies: updatedSelectedCompanies,
      };
    },
    addEmployee(state, action) {
      const newEmployee = action.payload;
      const companyId = newEmployee.companyId;

      const updatedCompanies = state.companies.map((company) => {
        if (company.id === companyId) {
          return {
            ...company,
            employees: [...company.employees, newEmployee],
          };
        }
        return company;
      });

      const updatedSelectedCompanies = state.selectedCompanies.map(
        (company) => {
          if (company.id === companyId) {
            return {
              ...company,
              employees: [...company.employees, newEmployee],
            };
          }
          return company;
        }
      );

      return {
        ...state,
        companies: updatedCompanies,
        selectedCompanies: updatedSelectedCompanies,
      };
    },
    updateEmployeeField(state, action) {
      const updatedCompany = action.payload;

      state.companies = state.companies.map((company) => {
        if (company.id === updatedCompany.id) {
          return updatedCompany;
        }
        return company;
      });

      state.selectedCompanies = state.selectedCompanies.map(
        (selectedCompany) => {
          if (selectedCompany.id === updatedCompany.id) {
            return updatedCompany;
          }
          return selectedCompany;
        }
      );
    },
  },
});

export const {
  deleteCompany,
  isActiveModal,
  addCompany,
  isEditable,
  updateCompanyField,
  addSelectedCompanies,
  deleteEmployee,
  addEmployee,
  updateEmployeeField,
} = companiesReducer.actions;

export default companiesReducer.reducer;
