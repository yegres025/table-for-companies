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
    const findCompany = () => {
      if (!editable) return;
      const result = selectedCompanies.find((company) =>
        company.employees.some((employee) => employee.id === id)
      );

      return result;
    };

    const findEmployee = () => {
      if (!findCompany()) return;
      const result: Employees | undefined = findCompany()?.employees.find(
        (employee) => employee.id === id
      );

      return result;
    };

    const copyEmployee = { ...findEmployee() };

    const updateCurrentEmployeeCell = () => {
      for (const employee in copyEmployee) {
        if (copyEmployee[employee as keyof Employees] === data) {
          copyEmployee[employee as keyof Employees] = newDataField; // ???
        }
      }
    };
    updateCurrentEmployeeCell();

    const updateEmployeeInCompany = () => {
      const result = findCompany()?.employees.map((employee) =>
        employee.id === id ? copyEmployee : employee
      );

      return result
    };

    const updatedCompany = {
      ...findCompany(),
      employees: updateEmployeeInCompany(),
    };

    dispatch(updateEmployeeField(updatedCompany))
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
