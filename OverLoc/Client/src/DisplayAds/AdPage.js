import React, { useEffect, useState } from 'react';
import { isNullishCoalesce } from 'typescript';
import Avatar from '../Icon/img_avatar.png';
import Cookies from 'js-cookie';
import useRockFetchGet, { useRockFetchPost } from '../utils/RockFetch';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow,
} from 'react-google-maps';
import { isNullOrUndefined, showSnackBar } from '../utils/Global';
//   import * as parkData from "./data/skateboard-parks.json";
//   import mapStyles from "./mapStyles";

function Map() {
  return (
    <GoogleMap defaultZoom={10} defaultCenter={{ lat, lng }}>
      <Marker
        position={{ lat, lng }}
        icon={
          'http://www.jeffs-icons.com/map_icons/ICONS/Pin/pin-red_violet-R.png'
        }
      />
    </GoogleMap>
  );
}

const MapWrapped = withScriptjs(withGoogleMap(Map));
let lat = 41.739685;
let lng = -87.55442;
export default function AdPage({ post }) {
  const [rockFetchPost] = useRockFetchPost();
  const [rockFetchGet] = useRockFetchGet();
  const [user, setUser] = useState();
  const [displayContactDetails, setDisplayContactDetails] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=54000&key=AIzaSyBWW7cm7K05c9lGUlblo-oyBXH_rqTx7BI'
      );
      const responseJson = await response.json();
      console.log('Lat: ', responseJson);
      const res = await rockFetchPost('/getUser/', { userId: post.UserId });
      if (isNullOrUndefined(res)) return;
      setUser(res[0]);
    }
    if (!isNullOrUndefined(post.AreaOfApartment)) {
      const latlng = post.AreaOfApartment.split(',');
      if (latlng.length === 2) {
        lat = parseFloat(latlng[0]);
        lng = parseFloat(latlng[1]);
      }
    }
    setDisplayContactDetails(false);
    if (!isNullOrUndefined(post)) fetchData();
  }, []);
  function getDate() {
    var date = new Date(post.StartDate);
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
  }
  async function reportAd() {
    const userId = Cookies.get('userId');
    const res = await rockFetchPost('/reportAd/', {
      adId: post.ID,
      userId: userId,
    });
    if (isNullOrUndefined(res)) return;
    showSnackBar('Cette annonce a été signalée avec succès!');
  }

  return (
    <div className='row adForm'>
      <div className='adDescriptionParent'>
        <div className='row flex w60'>
          <div className='w50 adTitle'>{post.Title}</div>
          <div className='w50 adTitleBudget textAlginRight'>
            {post.MinEstimatedBudget} &nbsp; - &nbsp;
            {post.MaxEstimatedBudget}€
          </div>
        </div>
        <div className='row w100 margin2'>
          <div className='w70'>
            <div style={{ height: '100%' }}>
              <MapWrapped
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBWW7cm7K05c9lGUlblo-oyBXH_rqTx7BI`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </div>
            <div className='adTitleDetail'>
              {post.ApartmentType}&nbsp;&nbsp;|&nbsp;&nbsp;Weeks{' '}
              {post.WeeksInMonth}
              &nbsp;&nbsp;|&nbsp;&nbsp;
              {post.AreaOfApartment}
            </div>
            <div className='adStartDetail'>Start Date: {getDate()}</div>
            <div className='adDescriptiveDetail'>{post.Description}</div>
          </div>
          <div className='w30 textAlignCenter'>
            <div className='reportAd' onClick={() => reportAd()}>
              Report this ad
            </div>
            <div className='rightAdDetail textAlginLeft'>
              <div className='flex h70 padding5'>
                <div className='w40'>
                  <img
                    src={user && user.ProfilePic ? user.ProfilePic : Avatar}
                    alt='Avatar'
                    style={{
                      width: '80px',
                      borderRadius: '50%',
                      marginLeft: 10,    
                      objectFit: 'cover',
                      height: '75px',
                    }}
                  ></img>
                </div>
                <div className='w60 textAlignLeft alignSelfCenter'>
                  <div className='firstNameAd'>
                    {user ? user.FirstName : ''}
                  </div>
                  <div>{user ? user.University : ''}</div>
                </div>
              </div>
              {!displayContactDetails ? (
                <div
                  className='contacter'
                  onClick={
                    () => setDisplayContactDetails(true)
                    // window.open('tel://' + post.PhoneCode + post.PhoneNumber)
                  }
                >
                  CONTACTER
                </div>
              ) : (
                <div>
                  <div>{ post.PhoneCode + ' ' + post.PhoneNumber}</div>
                  <div>{post.Email}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
