import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { InitialState } from '../store/companies-slice';
import {
  deleteCompany,
  isActiveModal,
  isEditable,
  addSelectedCompanies,
} from '../store/companies-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import TableCell from './table-cell';

interface CompanyTableProp {
  onSetPlaceholder: (placeholder: string) => void;
}

export default function CompanyTable({onSetPlaceholder}: CompanyTableProp) {
  const dispatch: AppDispatch = useDispatch();

  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
  const [isHeaderChecked, setIsHeaderChecked] = useState<boolean>(false);
  const [companiesToDeleteIds, setCompaniesToDeleteIds] = useState<number[]>([]);

  const { companies, editable, activeModal } = useSelector(
    (state: { companies: InitialState }) => state.companies
  );

  const handleCheckboxChange = (id: number) => {
    setCheckedItems({
      ...checkedItems,
      [id]: !checkedItems[id],
    });
  };

  useEffect(() => {
    dispatch(addSelectedCompanies(companiesToDeleteIds));
  }, [companiesToDeleteIds, dispatch]);

  const handleCheckboxHeaderChange = () => {
    const newCheckedState = !isHeaderChecked;

    setIsHeaderChecked(newCheckedState);

    const newCheckedItems: { [key: number]: boolean } = {};

    companies.forEach((item) => {
      newCheckedItems[item.id] = newCheckedState;
    });

    setCheckedItems(newCheckedItems);
  };
  

  const handleAddIdsForDelete = (id: number, isChecked: boolean) => {
    if (!isChecked) {
      setCompaniesToDeleteIds(
        companiesToDeleteIds.filter((item) => item !== id)
      );
    } else {
      setCompaniesToDeleteIds([...companiesToDeleteIds, id]);
    }
  };

  const handleClickDeleteCompany = () => {
    dispatch(deleteCompany(companiesToDeleteIds));
    setCompaniesToDeleteIds([]);
  };

  useEffect(() => {
    if (isHeaderChecked) {
      setCompaniesToDeleteIds(Object.keys(checkedItems).map(Number));
      return;
    }
    setCompaniesToDeleteIds([]);
  }, [isHeaderChecked]);

  return (
    <div className='company-table-wrapper'>
      <div className='company-table-buttons'>
        <button
          disabled={editable ? true : false}
          onClick={() => {
            dispatch(isActiveModal())
            onSetPlaceholder('company')
          }}
        >
          Добавить
        </button>
        <button
        disabled={activeModal ? true : false}
        onClick={() => dispatch(isEditable())}>
          {editable ? 'Готово' : 'Редактировать'}
        </button>
        <button
          disabled={companiesToDeleteIds.length !== 0 ? false : true}
          onClick={handleClickDeleteCompany}
        >
          Удалить
        </button>
      </div>
      <table className='company-table'>
        <thead>
          <tr>
            <th>
              <input
                type='checkbox'
                onChange={() => {
                  handleCheckboxHeaderChange();
                }}
              />
            </th>
            <th>Компания</th>
            <th>Сотрудников</th>
            <th>Адрес</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((item) => (
            <tr
              key={item.id}
              className={
                checkedItems[item.id]
                  ? 'company-table-current-company-active'
                  : 'company-table-current-company'
              }
            >
              <td>
                <input
                  type='checkbox'
                  onChange={(e) => {
                    handleCheckboxChange(item.id),
                    handleAddIdsForDelete(item.id, e.target.checked);
                  }}
                  checked={!!checkedItems[item.id]}
                />
              </td>
              <TableCell
                className='company-table-company-name'
                item={item.name}
                editableClass='editable'
                id={item.id}
              />
              <TableCell
                className='company-table-employees'
                editableClass='non-editable'
                item={item.employees.length}
              />
              <TableCell
                className='company-table-address'
                editableClass='editable'
                item={item.address}
                id={item.id}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
