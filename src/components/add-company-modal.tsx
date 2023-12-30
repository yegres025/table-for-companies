import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  InitialState,
  isActiveModal,
  addCompany,
  addEmployee,
} from '../store/companies-slice';
import { AppDispatch } from '../store';
import { randomId } from '../util/random-id';

interface AddCompanyModalProp {
  placeholder: {
    firstArea: string;
    secondArea: string;
    thirdArea: string;
  };
  currentPlaceholder: string;
}

export default function AddCompanyModal({
  placeholder,
  currentPlaceholder,
}: AddCompanyModalProp) {
  const { activeModal, selectedCompanies } = useSelector(
    (state: { companies: InitialState }) => state.companies
  );

  const dispatch: AppDispatch = useDispatch();

  const [firstArea, setFirstArea] = useState<string>('');
  const [secondArea, setSecondArea] = useState<string>('');
  const [thirdArea, setThirdArea] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const handleSubmitAddItem = () => {
    if (firstArea && secondArea && thirdArea) {
      const newCompany = {
        name: firstArea,
        employees: secondArea,
        address: thirdArea,
        id: randomId(),
      };
      if (currentPlaceholder === 'company') {
        dispatch(addCompany(newCompany));
        dispatch(isActiveModal());
        return;
      } else {
        const selectedCompanyId = selectedCompanies[0].id;
        const newEmployee = {
          companyId: selectedCompanyId,
          id: randomId(),
          firstName: firstArea,
          lastName: secondArea,
          position: thirdArea,
        };
        dispatch(addEmployee(newEmployee));
        dispatch(isActiveModal());
      }
    } else {
      setError(true);
    }
  };

  if (error) {
    return (
      <div className='error-add-modal'>
        <span>Заполните все поля</span>
        <button onClick={() => setError(false)}>ок</button>
      </div>
    );
  }

  return (
    <div className={activeModal ? 'add-modal-content' : 'add-modal'}>
      <span>Заполните поля</span>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitAddItem();
        }}
      >
        <input
          placeholder={placeholder.firstArea}
          onChange={(e) => setFirstArea(e.target.value)}
        />
        <input
          placeholder={placeholder.secondArea}
          onChange={(e) => setSecondArea(e.target.value)}
        />
        <input
          placeholder={placeholder.thirdArea}
          onChange={(e) => setThirdArea(e.target.value)}
        />
        <div className='error-add-modal-buttons'>
          <button>Добавить</button>
          <button type='button' onClick={() => dispatch(isActiveModal())}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
