import React, { useEffect, useState } from 'react';
import './ApproveAds.scss';
import useRockFetchGet, {useRockFetchPost} from '../utils/RockFetch';
import { isNullOrUndefined } from '../utils/Global';
import Avatar from '../Icon/img_avatar.png';

export default function Signalees() {
  const [rockFetchGet] = useRockFetchGet();
  const [rockFetchPost] = useRockFetchPost();
  const [unApprovedPosts, setUnApprovedPosts] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const res = await rockFetchGet('/getAllReportedAds');
      if (isNullOrUndefined(res)) return;
      const filteredResult = [];
      res.forEach(ad => {
          if(filteredResult.findIndex(r => r.AdId === ad.AdId) < 0) {
              const reportedAdCount = res.filter(rAd => rAd.AdId === ad.AdId).length
            filteredResult.push({...ad, count: reportedAdCount});

          }
      })
      setUnApprovedPosts(filteredResult.reverse());
    }
    fetchData();
  }, []);
  async function deleteAd(id) {
    const res = await rockFetchPost('/deleteAd', {id});
      if (isNullOrUndefined(res)) return;
      const updatedAds = unApprovedPosts.filter(post => post.AdId !== id);
      setUnApprovedPosts(updatedAds);
  }
  function getRow() {
      if(unApprovedPosts.length === 0) return "No Reported Ad Found!"
    return unApprovedPosts.map((posts) => (
      <div className='unApprovedRow flex'>
        <div className='profileDetail'>
          <div className='profileName'>{posts.FirstName}</div>
          <img
            src={posts && posts.ProfilePic ? posts.ProfilePic : Avatar}
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
            <div className='budetDetails'>
              de {posts.MinEstimatedBudget + '€'} a {posts.MaxEstimatedBudget}
            </div>
            <div className='budetDetails'>
              {posts.AreaOfApartment}
            </div>
          </div>
          <div className='w50 align-self-center'>
            <div>
              Reports: {posts.count}
            </div>
            <div className='approveButton' onClick={() => deleteAd(posts.AdId)}>
              Delete
            </div>
          </div>
        </div>
      </div>
    ));
  }
  return (
    <div className='w100'>
      <div className='headerApproveAd'>Reported Ads</div>
      <div className='bodyApproveAds'>{getRow()}</div>
    </div>
  );
}
