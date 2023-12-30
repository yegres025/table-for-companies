import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { Employees, InitialState } from '../store/companies-slice';
import { updateCompanyField } from '../store/companies-slice';

interface TableCellProps {
  className: string;
  item: string | number;
  editableClass: string;
  id?: number;
}

export default function TableCell({
  className,
  item,
  editableClass,
  id,
}: TableCellProps) {
  const [newDataField, setNewDataField] = useState<string>('');
  const dispatch: AppDispatch = useDispatch();
  const { editable, companies } = useSelector(
    (state: { companies: InitialState }) => state.companies
  );

  const handleUpdate = () => {
    if (editable) {
      const currentCompany = companies.find((company) => company.id === id);

      const updateCompany: { [key: string]: string | number | Employees[] } = {
        ...currentCompany,
      };

      for (const key in updateCompany) {
        if (updateCompany[key] === item) {
          updateCompany[key] = newDataField;
        }
      }

      dispatch(updateCompanyField(updateCompany));
    }
  };

  const [updateCell, setUpdateCell] = useState<boolean>(false);

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
            handleUpdate();
            setUpdateCell(false);
          }}
        >
          <input
            value={newDataField}
            onChange={(e) => setNewDataField(e.target.value)}
            placeholder='Enter для подтверждения'
          />
        </form>
      ) : (
        <span>{item}</span>
      )}
    </td>
  );
}
