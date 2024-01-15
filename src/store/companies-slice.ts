import { createSlice } from '@reduxjs/toolkit';
import { companies } from '../util/mock-data';
export interface Employees {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
}

export interface Company {
  find?(arg0: string): unknown;
  name?: string;
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
        state.companies.push(action.payload);
      }
    },
    updateCompanyField(state, action) {
      const newStateCompany = action.payload;
    
      const updatedCompanies = state.companies.map((company) =>
        company.id === newStateCompany.id ? newStateCompany : company
      );
    
      state.companies = updatedCompanies;
    },
    addSelectedCompanies(state, action) {
      const selectedCompaniesIds = action.payload;

      state.selectedCompanies = state.companies.filter((company) =>
        selectedCompaniesIds.includes(company.id)
      );
    },
    deleteEmployee(state, action) {
      const { companyId, employeeId } = action.payload;
    
      const removeEmployee = (company: Company) => ({
        ...company,
        employees: company.employees.filter((employee) => employee.id !== employeeId),
      });
    
      state.companies = state.companies.map((company) =>
        company.id === companyId ? removeEmployee(company) : company
      );
    
      state.selectedCompanies = state.selectedCompanies.map((company) =>
        company.id === companyId ? removeEmployee(company) : company
      );
    },
    addEmployee: (state, action) => {
      const newEmployee = action.payload;
      const companyId = newEmployee.companyId;

      state.companies.forEach((company) => {
        if (company.id === companyId) {
          company.employees.push(newEmployee);
        }
      });

      state.selectedCompanies.forEach((company) => {
        if (company.id === companyId) {
          company.employees.push(newEmployee);
        }
      });
    },
    updateEmployeeField(state, action) {
      const updatedCompany = action.payload;
            
      state.companies = state.companies.map((company) =>
        company.id === updatedCompany.id ? updatedCompany : company
      );
    
      state.selectedCompanies = state.selectedCompanies.map((selectedCompany) =>
        selectedCompany.id === updatedCompany.id ? updatedCompany : selectedCompany
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
