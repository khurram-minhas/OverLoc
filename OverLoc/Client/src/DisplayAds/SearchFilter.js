import React, { useEffect, useState } from 'react';
export default function SearchFilter({ onSearch }) {
  const [searchText, setSearchText] = useState('');
  return (
    <div className='w100 h100'>
      <div className='parentSearchBar flex'>
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
      {/* <div>Plus de filtres...</div> */}
      <div className='searchButton' onClick={() => onSearch(searchText)}>
        CHERCHER
      </div>
    </div>
  );
}
