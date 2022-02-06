import React, { useState, useEffect, useRef } from 'react';
import Logo from '../Icon/RMlogo.png';
import Avatar from '../Icon/img_avatar.png';
import useRockFetchGet, { useRockFetchPost } from '../utils/RockFetch';
import CreatePost from '../CreatePost/CreatePost';
import Cookies from 'js-cookie';
import { isNullOrUndefined, clearCookies } from '../utils/Global';
import Profile from '../Profile/Profile';
import { ApproveAds } from './ApproveAds';
import Singalees from './Signalees';
import { DisplayAds } from '../DisplayAds/DisplayAds';
import Footer from '../Footer';
import ConditionGenerales from '../FooterRoutes/Conditions-generales';
import QuiSommes from '../FooterRoutes/QuiSommes';
import Contracter from '../FooterRoutes/Contacter';
import { ERoute } from '../ERoute';
export function Admin({ type, setRoute }) {
  const [index, setIndex] = useState(0);
  const [rockFetchPost] = useRockFetchPost();
  const [user, setUser] = useState();
  useEffect(() => {
    async function fetchData() {
      const userId = Cookies.get('userId');
      const res = await rockFetchPost('/getUser/', { userId });
      if (isNullOrUndefined(res)) return;
      setUser(res[0]);
    }
    fetchData();
  }, []);
  return (
    <>
      <div className='mainContainer'>
        <div className='headerRow'>
          <div style={{ width: '20%' }}>
            <div className='headerTitle'>
              <img
                className='titleImage'
                src={Logo}
                alt='RM title'
                width={700}
                onClick={() => setIndex(0)}
                style={{cursor: 'pointer'}}
              />
            </div>
          </div>
          <div
            style={{ width: '60%', display: 'flex', placeContent: 'center' }}
          >
            <div
              onClick={() => setIndex(0)}
              className={index === 0 ? 'headerItem' : 'unselectedHeaderItem'}
              style={{ zIndex: index === 0 ? 2 : 1, cursor: 'pointer' }}
            >
              <div className='headerItemText'>ACCUEIL</div>
            </div>
            <div
              onClick={() => setIndex(1)}
              className={index === 1 ? 'headerItem' : 'unselectedHeaderItem'}
              style={{ zIndex: index === 1 ? 2 : 1, cursor: 'pointer' }}
            >
              <div className='headerItemText'>EN ATTENTE</div>
            </div>
            <div
              onClick={() => setIndex(2)}
              className={index === 2 ? 'headerItem' : 'unselectedHeaderItem'}
              style={{ zIndex: index === 2 ? 2 : 1, cursor: 'pointer' }}
            >
              <div className='headerItemText'>SIGNALÉES</div>
            </div>
            <div
              onClick={() => setIndex(3)}
              className={index === 3 ? 'headerItem' : 'unselectedHeaderItem'}
              style={{ zIndex: index === 3 ? 2 : 1, cursor: 'pointer' }}
            >
              <div className='headerItemText'>MON COMPTE</div>
            </div>
          </div>

          <div
            align='center'
            style={{ width: '20%', float: 'right', display: 'flex' }}
          >
            <div class='dropdown'>
              <div className='flex'>
                <div className='userNameDashboard'>
                  Bonjour {isNullOrUndefined(user) ? 'User' : user.FirstName}!
                </div>
                <img
                  src={user && user.ProfilePic ? user.ProfilePic : Avatar}
                  alt='Avatar'
                  style={{
                    width: '50px',
                    borderRadius: '50%',
                    marginLeft: 10,
                    objectFit: 'cover',
                    height: '50px',
                  }}
                ></img>
              </div>
              <div
                class='dropdown-content'
                onClick={() => {
                  clearCookies();
                  setRoute(ERoute.Login);
                }}
              >
                <i class='fa fa-sign-out' aria-hidden='true'></i> Log out
              </div>
            </div>
          </div>
        </div>

        <div className='innerContainer'>
          {index === 0 && (
            <DisplayAds setRoute={setRoute} setIndex={setIndex} />
          )}
          {index === 1 && <ApproveAds setRoute={setRoute} />}
          {index === 2 && <Singalees setIndex={setIndex} />}
          {index === 3 && (
            <Profile user={user} setUser={setUser} setIndex={setIndex} />
          )}
          {index === 10 && <ConditionGenerales />}
          {index === 11 && <QuiSommes />}
          {index === 12 && <Contracter setRoute={setIndex} />}
        </div>
      </div>
      <Footer setType={setIndex} />
    </>
  );
}
