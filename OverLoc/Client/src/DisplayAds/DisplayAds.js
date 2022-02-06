import React, { useEffect, useState } from 'react';
import './DisplayAds.scss';
import useRockFetchGet, { useRockFetchPost } from '../utils/RockFetch';
import { isNullOrUndefined } from '../utils/Global';
import Avatar from '../Icon/img_avatar.png';
import SearchFilter from './SearchFilter';
import AdPage from './AdPage';

export function DisplayAds() {
  const [rockFetchGet] = useRockFetchGet();
  const [rockFetchPost] = useRockFetchPost();
  const [displayAds, setDisplayAds] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [post, setPost] = useState(0);
  const [searchedDisplayAds, setSearchedDisplayAds] = useState([]);
  function reverseArr(input) {
    var ret = new Array;
    for(var i = input.length-1; i >= 0; i--) {
        ret.push(input[i]);
    }
    return ret;
}
  useEffect(() => {
    async function fetchData() {
      const res = await rockFetchGet('/getAllUserAds');
      if (isNullOrUndefined(res)) return;
      setDisplayAds([].concat(res));
      setSearchedDisplayAds([].concat(res));
    }
    fetchData();
  }, []);
  function onSearch(searchText) {
    if (searchText === '') setSearchedDisplayAds(displayAds);
    else {
      const searches = displayAds.filter((ads) =>
        ads.AreaOfApartment.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchedDisplayAds(searches);
    }
  }
  function getRow() {
    if (searchedDisplayAds.length === 0) return 'No Record Found!';
    return searchedDisplayAds.map((posts) => (
      <div className='unApprovedRow flex'>
        <div className='profileDetail'>
          <div className='profileName'>{posts.FirstName.split(' ')[0]}</div>
          <img
            src={posts && posts.profilePic ? posts.profilePic : Avatar}
            alt='Avatar'
            className='profilePicture'
          ></img>
        </div>
        <div className='unApprovedPostDesc'>{posts.Description}</div>
        <div className='unApprovedPostDetails flex'>
          <div className='w50 paddingLeft5'>
            <div className='maxEstimatedCost'>
              {posts.MaxEstimatedBudget + '€'}
            </div>
            {/*
            <div className='budetDetails'>
              de {posts.MinEstimatedBudget + '€'} a {posts.MaxEstimatedBudget}
            </div> */}
            <div className='budetDetails'>Semaines {posts.WeeksInMonth}</div>
            <div className='budetDetails'>{posts.AreaOfApartment}</div>
          </div>
          <div className='w50 align-self-center'>
            <div className='approveButton' onClick={() => {setTabIndex(1);setPost(posts)}}>
              Contacter
            </div>
          </div>
        </div>
      </div>
    ));
  }
  function getChild() {
    if (tabIndex === 1)
      return (
        <div className='w100'>
          <AdPage post={post} />
        </div>
      );
    return (
      <div className='w100'>
        <div className='displayAdsHeader'>
          <SearchFilter onSearch={onSearch} />
        </div>
        <div className='titleDisplayAd'>Les demandes les plus consultées</div>
        <div className='bodyApproveAds'>{getRow()}</div>
      </div>
    );
  }
  return getChild();

  //   <ul class="pagination">
  //   <li class="page-item"><a class="page-link" href="#">Previous</a></li>
  //   <li class="page-item"><a class="page-link" href="#">1</a></li>
  //   <li class="page-item"><a class="page-link" href="#">2</a></li>
  //   <li class="page-item"><a class="page-link" href="#">3</a></li>
  //   <li class="page-item"><a class="page-link" href="#">Next</a></li>
  // </ul>
}
