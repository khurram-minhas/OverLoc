import React, { useEffect, useState } from 'react';
import './DisplayAds.scss';
import useRockFetchGet, { useRockFetchPost } from '../utils/RockFetch';
import {
  getWeeksInMonths,
  isNullOrUndefined,
  TextAbstract,
} from '../utils/Global';
import Avatar from '../Icon/img_avatar.png';
import SearchFilter from './SearchFilter';
import AdPage from './AdPage';
import { ERoute } from '../ERoute';
import Cookies from 'js-cookie';

let totalAds = 0;
export function DisplayAds({ user, tabIndex, setTabIndex, setTotalCreateAds }) {
  const [rockFetchGet] = useRockFetchGet();
  const [rockFetchPost] = useRockFetchPost();
  const [displayAds, setDisplayAds] = useState([]);
  const [allAds, setAllAds] = useState([]);
  const [post, setPost] = useState(0);
  const [searchedDisplayAds, setSearchedDisplayAds] = useState([]);
  const [fetchBatch, setFetchBatch] = useState(0);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  async function fetchBatchAds() {
    const res = await rockFetchPost('/getAllUserAds', { batch: fetchBatch });
    if (isNullOrUndefined(res)) return;
    const userId = Cookies.get('userId');
    if(!isNullOrUndefined(userId) && !isNullOrUndefined(setTotalCreateAds))
      setTotalCreateAds(res.filter(r => r.UserId == userId).length)
    // setAllAds([].concat(filteredAds(res)));
    setAllAds([].concat(res.sort((a,b) => b.ID - a.ID)));
    setIsDataFetched(true);
  }
  function filteredAds(res) {
    const arr = {};
    res.map(
      (r) =>
        (arr[r.UserId] = !isNullOrUndefined(arr[r.UserId])
          ? [...arr[r.UserId], r]
          : [r])
    );
    totalAds = Math.ceil(res.length / 10);

    const detailedArr = [];
    Object.entries(arr).forEach(([key, value]) => {
      detailedArr.push(value);
    });
    const sortedArr = [];
    for (let i = 0; i < res.length; i++) {
      for (let j = 0; j < detailedArr.length; j++) {
        if (i < detailedArr[j].length) {
          sortedArr.push(detailedArr[j][i]);
        }
      }
    }
    return sortedArr;
  }
  useEffect(() => {
    async function fetchData() {
      // if(totalAds === 0) {
      //   const resUserAdsCount = await rockFetchGet('/getUserAdsCount');
      //   if (isNullOrUndefined(resUserAdsCount)) return;
      //   totalAds = Math.ceil(resUserAdsCount[0].count / 20);
      // }
      fetchBatchAds();
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (allAds.length > 0) {
      const arr = [];
      for (
        let i = fetchBatch * 10;
        i < fetchBatch * 10 + 10 && i < allAds.length;
        i++
      )
        arr.push(allAds[i]);
      setDisplayAds([].concat(arr));
      setSearchedDisplayAds([].concat(arr));
      setIsDataFetched(true);
    }
  }, [allAds, fetchBatch]);
  useEffect(() => {
    async function setProfilePics() {
      if (allAds.length > 0) {
        for (let ad of allAds) {
          const res = await rockFetchPost('/getProfilePic', {
            userId: ad.UserId,
          });
          if (isNullOrUndefined(res)) continue;
          ad.profilePic = res[0].profilepic;
        }
        setAllAds(allAds);
        setIsDataFetched(false);
      }
    }
    setProfilePics();
  }, [allAds]);

  function onSearch(searchText) {
    if (searchText === '') {
      totalAds = Math.ceil(displayAds.length / 10);
      setSearchedDisplayAds(displayAds);
    } else {
      const searches = displayAds.filter((ads) =>
        ads.AreaOfApartment.toLowerCase().includes(searchText.toLowerCase())
      );
      totalAds = Math.ceil(searches.length / 10);
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
        <div className='unApprovedPostDesc'>
          {TextAbstract(posts.Description)}
        </div>
        <div className='unApprovedPostDetails flex'>
          <div className='w50 paddingLeft5'>
            <div className='maxEstimatedCost'>
              {posts.MaxEstimatedBudget + '€'}
            </div>
            {/*
            <div className='budetDetails'>
              de {posts.MinEstimatedBudget + '€'} a {posts.MaxEstimatedBudget}
            </div> */}
            {/* <div className='budetDetails'>Semaines {getWeeksInMonths(posts.WeeksInMonth)}</div> */}
            <div className='budetDetails'>Semaines {posts.WeeksInMonth}</div>
            <div className='budetDetails'>{posts.AreaOfApartment}</div>
          </div>
          <div className='w50 align-self-center'>
            <div
              className='approveButton'
              onClick={() => {
                setTabIndex(ERoute.AdPage);
                setPost(posts);
              }}
            >
              Contacter
            </div>
          </div>
        </div>
      </div>
    ));
  }
  function getPagination() {
    if (totalAds <= 1) return null;
    const renderer = [];
    for (let i = 1; i <= totalAds; i++) {
      renderer.push(
        <li class='page-item'>
          <a class='page-link' onClick={() => setFetchBatch(i - 1)}>
            {i}
          </a>
        </li>
      );
    }
    return (
      <nav aria-label='Page navigation example'>
        <ul class='pagination justify-content-center'>
          <li class={`page-item ${fetchBatch + 1 === 1 ? 'disabled' : ''}`}>
            <a
              class='page-link'
              onClick={() => setFetchBatch(fetchBatch - 1)}
              tabindex='-1'
            >
              Previous
            </a>
          </li>
          {renderer}
          <li
            class={`page-item ${fetchBatch + 1 === totalAds ? 'disabled' : ''}`}
          >
            <a class='page-link' onClick={() => setFetchBatch(fetchBatch + 1)}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    );
  }
  function getMinVal() {
    let minVal = null;
    allAds.map((ad) => {
      if (minVal === null || minVal > ad.MinEstimatedBudget) {
        minVal = ad.MinEstimatedBudget;
      }
    });
    return minVal;
  }
  function getMaxVal() {
    let maxVal = null;
    allAds.map((ad) => {
      if (maxVal === null || maxVal < ad.MaxEstimatedBudget) {
        maxVal = ad.MaxEstimatedBudget;
      }
    });
    return maxVal;
  }
  function applyFilter(value, weeks) {
    setIsFilterApplied(true);
    // Applying min max
    const ads = allAds.filter(
      (d) =>
        d.MaxEstimatedBudget >= value[0] && d.MaxEstimatedBudget <= value[1]
    );
    totalAds = Math.ceil(ads.length / 10);
    // Applying weeks
    let processedArr = [];
    if (weeks.length > 0) {
      const filteredWeekAds = ads.filter((d) =>
        weeks.find((w) => d.WeeksInMonth.includes(w))
      );
      processedArr = filteredWeekAds;
    } else {
      processedArr = ads;
    }
    setDisplayAds([].concat(processedArr));
    setSearchedDisplayAds([].concat(processedArr));
  }
  function clearFilter() {
    setIsFilterApplied(false);
    if (allAds.length > 0) {
      const arr = [];
      for (
        let i = fetchBatch * 10;
        i < fetchBatch * 10 + 10 && i < allAds.length;
        i++
      )
        arr.push(allAds[i]);

      totalAds = Math.ceil(allAds.length / 10);
      setDisplayAds([].concat(arr));
      setSearchedDisplayAds([].concat(arr));
    }
  }
  function getChild() {
    if (tabIndex === ERoute.AdPage)
      return (
        <div className='w100'>
          <AdPage post={post} loggedInUser={user} />
        </div>
      );
    return (
      <div className='w100 h100'>
        <div className='displayAdsHeader'>
          <SearchFilter
            onSearch={onSearch}
            minVal={getMinVal()}
            maxVal={getMaxVal()}
            clearFilter={clearFilter}
            applyFilter={applyFilter}
            isFilterApplied={isFilterApplied}
          />
        </div>
        <div className='titleDisplayAd'>Les demandes les plus consultées</div>
        <div className='bodyApproveAds'>{getRow()}</div>

        <br />
        {!isFilterApplied && getPagination()}
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
