import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { InitialState, Company } from '../store/companies-slice';
import { updateCompanyField } from '../store/companies-slice';
interface TableCellProps {
  className: string;
  item: string | number | undefined;
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
    (state: { companies: InitialState }) => state.companies);

  const handleUpdate = () => {
    if (!editable) return
    
    const findCompany =() => {
      const result = companies.find((company) => company.id === id);
      return result
    }

      const copyCompany: Company | undefined = {
        ...findCompany()!,
      }


      const updateCurrentCompanyCell = () => {
        for (const key in copyCompany) {
          if (copyCompany[key as keyof Company] === item) {
            copyCompany[key as keyof Company] = newDataField; // ??? 
          }
        }
      } 
      updateCurrentCompanyCell()

      dispatch(updateCompanyField(copyCompany));
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
