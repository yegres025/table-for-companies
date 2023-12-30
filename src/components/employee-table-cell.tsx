import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Employees,
  InitialState,
  updateEmployeeField,
} from '../store/companies-slice';
import { AppDispatch } from '../store';
interface EmployeesTableCellProp {
  employee: string;
  className: string;
  editableClass: string;
  id: number;
  data: string;
}

export default function EmployeesTableCell({
  employee,
  className,
  editableClass,
  id,
  data,
}: EmployeesTableCellProp) {
  const { editable, selectedCompanies } = useSelector(
    (state: { companies: InitialState }) => state.companies
  );
  const [updateCell, setUpdateCell] = useState<boolean>(false);
  const [newDataField, setNewDataField] = useState<string>('');
  const dispatch: AppDispatch = useDispatch();

  const handleUpdateEmployee = () => {
    if (editable) {
      const foundCompany = selectedCompanies.find((company) =>
        company.employees.some((employee) => employee.id === id)
      );

      if (foundCompany) {
        const updatedEmployees: Employees[] = foundCompany.employees.map(
          (employee) => {
            if (employee.id === id) {
              const updatedEmployee: Employees = { ...employee };

              for (const key in updatedEmployee) {
                if (updatedEmployee[key as keyof Employees] === data) {
                  updatedEmployee[key as keyof Employees] =
                    newDataField as never;
                  break;
                }
              }

              return updatedEmployee;
            }
            return employee;
          }
        );

        const updatedCompany = {
          ...foundCompany,
          employees: updatedEmployees,
        };

        dispatch(updateEmployeeField(updatedCompany));
      }
    }
  };
  return (
    <td
      onClick={() => {
        if (editable) {
          setUpdateCell(true);
        }
      }}
      className={`${className} ${editable ? editableClass : ''}`}
    >
      {updateCell ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateEmployee();
            setUpdateCell(false);
          }}
        >
          <input
            placeholder='Enter для подтверждения'
            value={newDataField}
            onChange={(e) => setNewDataField(e.target.value)}
          />
        </form>
      ) : (
        <span>{employee}</span>
      )}
    </td>
  );
}
