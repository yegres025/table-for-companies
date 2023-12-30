import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import {
  InitialState,
  isActiveModal,
  isEditable,
} from '../store/companies-slice';
import { useState } from 'react';
import { deleteEmployee } from '../store/companies-slice';
import EmployeesTableCell from './employee-table-cell';
interface EmployeesTableProps {
  onSetPlaceholder: (placeholder: string) => void;
}

export default function EmployeesTable({
  onSetPlaceholder,
}: EmployeesTableProps) {
  const dispatch: AppDispatch = useDispatch();
  const { selectedCompanies, editable, activeModal } = useSelector(
    (state: { companies: InitialState }) => state.companies
  );
  const [checkedEmployeeIds, setCheckedEmployeeIds] = useState<{
    [key: number]: boolean;
  }>([]);
  const [isHeaderChecked, setIsHeaderChecked] = useState<boolean>(false);

  const handleChangeCheckbox = (id: number) => {
    setCheckedEmployeeIds((prevCheckedEmployeeIds) => ({
      ...prevCheckedEmployeeIds,
      [id]: !prevCheckedEmployeeIds[id],
    }));
  };

  const handleCheckboxHeaderChange = () => {
    const newCheckedState = !isHeaderChecked;
    setIsHeaderChecked(newCheckedState);

    if (newCheckedState) {
      const allEmployeeIds = selectedCompanies.flatMap((company) =>
        company.employees.map((employee) => employee.id)
      );
      allEmployeeIds.forEach((employeeId) => handleChangeCheckbox(employeeId));
    } else {
      setCheckedEmployeeIds([]);
    }
  };

  const handleButtonDeleteEmployee = () => {
    const companyId = selectedCompanies.find((company) => company.id)?.id;
    const employeeIds = Object.keys(checkedEmployeeIds).map(Number);

    employeeIds.forEach((employeeId) => {
      dispatch(
        deleteEmployee({ companyId: companyId, employeeId: employeeId })
      );
    });

    setCheckedEmployeeIds({});
  };

  if (selectedCompanies.length >= 1) {
    return (
      <div className='employee-table-wrapper'>
        <div className='company-table-buttons'>
          <button
            disabled={editable ? true : false}
            onClick={() => {
              dispatch(isActiveModal());
              onSetPlaceholder('employee');
            }}
          >
            Добавить
          </button>
          <button
            disabled={activeModal ? true : false}
            onClick={() => dispatch(isEditable())}
          >
            {editable ? 'Готово' : 'Редактировать'}
          </button>
          <button
            disabled={
              Object.keys(checkedEmployeeIds).length === 0 ? true : false
            }
            onClick={() => handleButtonDeleteEmployee()}
          >
            Удалить
          </button>
        </div>
        {selectedCompanies.map((company) => (
          <div key={company.id} className='company-employees'>
            <h3>{company.name}</h3>
            <table className='employee-table'>
              <thead>
                <tr>
                  <th>
                    <input
                      type='checkbox'
                      onChange={handleCheckboxHeaderChange}
                    />
                  </th>
                  <th>Фамилия</th>
                  <th>Имя</th>
                  <th>Должность</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(company.employees)
                  ? company.employees.map((employee) => (
                      <tr
                        key={employee.id}
                        className={
                          checkedEmployeeIds[employee.id]
                            ? 'employee-table-current-company-active'
                            : 'employee-table-current-company'
                        }
                      >
                        <td>
                          <input
                            onChange={() => handleChangeCheckbox(employee.id)}
                            checked={!!checkedEmployeeIds[employee.id]}
                            type='checkbox'
                          />
                        </td>
                        <EmployeesTableCell
                          data={employee.lastName}
                          id={employee.id}
                          editableClass='editable'
                          className='company-table-company-name'
                          employee={employee.lastName}
                        />
                        <EmployeesTableCell
                          data={employee.firstName}
                          id={employee.id}
                          editableClass='editable'
                          className='company-table-company-name'
                          employee={employee.firstName}
                        />
                        <EmployeesTableCell
                          data={employee.position}
                          id={employee.id}
                          editableClass='editable'
                          className='company-table-company-name'
                          employee={employee.position}
                        />
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
