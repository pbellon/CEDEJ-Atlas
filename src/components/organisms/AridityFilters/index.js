import React from 'react';
import { ToggleAridityVisibility } from 'components';


const AridityFilters = ()=>{
  return (
    <div>
      <ToggleAridityVisibility label={ 'Hyper Aride' } aridity={ 'hyper'} />
      <ToggleAridityVisibility label={ 'Aride' } aridity={ 'arid' } />
      <ToggleAridityVisibility label={ 'Semi Aride' } aridity={ 'semi' }/>
      <ToggleAridityVisibility label={ 'Sub Humide' } aridity={ 'subHumide' }/>
    </div>
  );
}
export default AridityFilters;
