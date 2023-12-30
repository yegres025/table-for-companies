import EmployeesTable from './employees-table';
import CompanyTable from './company-table';
import AddCompanyModal from './add-company-modal';
import { useState } from 'react';
export default function MainSpace() {
  const [currentPlaceholder, setCurrentPlaceholder] = useState<string>('');

  const onSetPlaceholder = (placeholder: string) => {
    setCurrentPlaceholder(placeholder);
  };
  

  const placeholder =
    currentPlaceholder === 'company'
      ? {
          firstArea: 'Введите компанию -> Enter',
          secondArea: 'Введите кол-во -> Enter',
          thirdArea: 'Введите адрес -> Enter',
        }
      : {
          firstArea: 'Введите фамилию -> Enter',
          secondArea: 'Введите имя -> Enter',
          thirdArea: 'Введите должность -> Enter',
        };

  return (
    <div className='main-space-wrapper'>
      <AddCompanyModal currentPlaceholder={currentPlaceholder} placeholder={placeholder}/>
      <CompanyTable onSetPlaceholder={onSetPlaceholder} />
      <EmployeesTable onSetPlaceholder={onSetPlaceholder} />
    </div>
  );
}
