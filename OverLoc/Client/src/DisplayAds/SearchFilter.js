import { Slider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import RMModal from '../RMModal/RMModal';
export default function SearchFilter({
  onSearch,
  minVal,
  maxVal,
  applyFilter,
  clearFilter,
  isFilterApplied,
}) {
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState([minVal, maxVal]);
  const [checkBoxesVisibility, setCheckBoxesVisibility] = useState(false);
  const [weeksInMonth, setWeeksInMonth] = useState([]);
  useEffect(() =>{
    if(!isFilterApplied) {
      setValue([minVal, maxVal])
      setWeeksInMonth([])
    }
  },[isFilterApplied])
  useEffect(() => {
    setValue([minVal, maxVal]);
  }, [minVal, maxVal]);
  function valuetext(value) {
    return `${value}`;
  }
  function handleChange(e) {
    setValue(e.target.value);
  }
  function onWeekChange(week) {
    if(weeksInMonth.find(w => w === week)) {
      const filteredWeeks = weeksInMonth.filter(w => w !== week);
      setWeeksInMonth(filteredWeeks);
    }
    else {
      setWeeksInMonth([...weeksInMonth, week]);
    }
  }
  function getModalBody() {
    return (
      <>
        <div className='flex'>
          <div style={{ width: '20%' }}>
            {value[0] + ' - ' + value[1] + ' €'}
          </div>
          <Slider
            style={{ width: '80%' }}
            getAriaLabel={() => 'Minimum distance'}
            value={value}
            valueLabelDisplay='auto'
            getAriaValueText={valuetext}
            max={maxVal}
            onChange={handleChange}
            disableSwap
          />
        </div>
        <div id='list1' className='dropdown-check-list w100' tabindex='100'>
          <span
            class='anchor'
            onClick={() => setCheckBoxesVisibility(!checkBoxesVisibility)}
          >
            Select Week's
          </span>
          <ul
            class='items'
            style={{ display: checkBoxesVisibility ? 'block' : 'none' }}
          >
            <li className='flex alignItemsCenter'>
              <input
                className='dropdown-checkbox'
                checked={weeksInMonth.find((w) => w === 1)}
                type='checkbox'
                onChange={() => onWeekChange(1)}
              />
              <div className='marginleft5'>Week-1</div>
            </li>
            <li className='flex alignItemsCenter'>
              <input
                className='dropdown-checkbox'
                checked={weeksInMonth.find((w) => w === 2)}
                type='checkbox'
                onChange={() => onWeekChange(2)}
              />
              <div className='marginleft5'>Week-2</div>
            </li>
            <li className='flex alignItemsCenter'>
              <input
                className='dropdown-checkbox'
                type='checkbox'
                checked={weeksInMonth.find((w) => w === 3)}
                onChange={() => onWeekChange(3)}
              />
              <div className='marginleft5'>Week-3</div>
            </li>
            <li className='flex alignItemsCenter'>
              <input
                className='dropdown-checkbox'
                checked={weeksInMonth.find((w) => w === 4)}
                type='checkbox'
                onChange={() => onWeekChange(4)}
              />
              <div className='marginleft5'>Week-4</div>
            </li>
          </ul>
        </div>
      </>
    );
  }
  function onOkPress() {
    setShowModal(false);
    applyFilter(value, weeksInMonth);
  }
  return (
    <div className='w100 h100'>
      <RMModal
        showModal={showModal}
        setShowModal={setShowModal}
        onOk={() => onOkPress()}
        body={getModalBody()}
        heading='Filters'
        okButtonText={'Ok'}
        noButtonText={'Cancel'}
        isOkOnly={true}
      />
      <div className='parentSearchBar flex'>
        <div style={{ width: '70%' }}>
          <div style={{ position: 'absolute', margin: '0.5%' }}>
            <svg
              width='29'
              height='29'
              viewBox='0 0 29 29'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M28.3837 24.8488L22.9212 19.3863C24.2325 17.41 25 15.0438 25 12.5C25 5.6075 19.3925 0 12.5 0C5.6075 0 0 5.6075 0 12.5C0 19.3925 5.6075 25 12.5 25C15.0437 25 17.41 24.2325 19.3862 22.9213L24.8475 28.3838C25.3362 28.8725 26.1275 28.8725 26.615 28.3838L28.3825 26.6163C28.8712 26.1275 28.8725 25.3363 28.3837 24.8488ZM2.5 12.5C2.5 6.98625 6.98625 2.5 12.5 2.5C18.0137 2.5 22.5 6.98625 22.5 12.5C22.5 18.0138 18.0137 22.5 12.5 22.5C6.98625 22.5 2.5 18.0138 2.5 12.5Z'
                fill='#111111'
              />
            </svg>
          </div>
          <input
            className='textField'
            type='text'
            placeholder='Entrer la ville ou le code postal...'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div
          className='budetDetails plusDeFilters'
          onClick={() => setShowModal(true)}
        >
          Plus de filters...
        </div>
      </div>
      {isFilterApplied && (<div className='budetDetails plusDeFilters w100 textAlignCenter' onClick={() => clearFilter()}>
        Clear Filter
      </div>)}
      
      {/* <div>Plus de filtres...</div> */}
      <div className='searchButton' onClick={() => onSearch(searchText)}>
        CHERCHER
      </div>
    </div>
  );
}
