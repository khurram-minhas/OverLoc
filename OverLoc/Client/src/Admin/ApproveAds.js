import React, { useEffect, useState } from 'react';
import './ApproveAds.scss';
import useRockFetchGet, {useRockFetchPost} from '../utils/RockFetch';
import { isNullOrUndefined, TextAbstract } from '../utils/Global';
import Avatar from '../Icon/img_avatar.png';

export function ApproveAds() {
  const [rockFetchGet] = useRockFetchGet();
  const [rockFetchPost] = useRockFetchPost();
  const [unApprovedPosts, setUnApprovedPosts] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const res = await rockFetchGet('/getAllUnApprovedAds');
      if (isNullOrUndefined(res)) return;
      setUnApprovedPosts(res.reverse());
      console.log(res);
    }
    fetchData();
  }, []);
  async function approvePost(id) {
    const res = await rockFetchPost('/approveAd', {id});
      if (isNullOrUndefined(res)) return;
      const updatedAds = unApprovedPosts.filter(post => post.ID !== id);
      setUnApprovedPosts(updatedAds);
  }
  function getRow() {
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
        <div className='unApprovedPostDesc'>{TextAbstract(posts.Description)}</div>
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
            <div className='approveButton' onClick={() => approvePost(posts.ID)}>
              Approve
            </div>
          </div>
        </div>
      </div>
    ));
  }
  return (
    <div className='w100'>
      <div className='headerApproveAd'>Non approuvées encore</div>
      <div className='bodyApproveAds'>{getRow()}</div>
    </div>
  );
}
