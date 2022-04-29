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
  const [localRoute, setLocalRoute] = useState(ERoute.DisplayAds);
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
                onClick={() => setLocalRoute(ERoute.DisplayAds)}
                style={{cursor: 'pointer'}}
              />
            </div>
          </div>
          <div
            style={{ width: '60%', display: 'flex', placeContent: 'center' }}
          >
            <div
              onClick={() => setLocalRoute(ERoute.DisplayAds)}
              className={localRoute === ERoute.DisplayAds ? 'headerItem' : 'unselectedHeaderItem'}
              style={{ zIndex: localRoute === ERoute.DisplayAds ? 2 : 1, cursor: 'pointer' }}
            >
              <div className='headerItemText'>ACCUEIL</div>
            </div>
            <div
              onClick={() => setLocalRoute(ERoute.UnApproved)}
              className={localRoute === ERoute.UnApproved ? 'headerItem' : 'unselectedHeaderItem'}
              style={{ zIndex: localRoute === ERoute.UnApproved ? 2 : 1, cursor: 'pointer' }}
            >
              <div className='headerItemText'>EN ATTENTE</div>
            </div>
            <div
              onClick={() => setLocalRoute(ERoute.Reported)}
              className={localRoute === ERoute.Reported ? 'headerItem' : 'unselectedHeaderItem'}
              style={{ zIndex: localRoute === ERoute.Reported ? 2 : 1, cursor: 'pointer' }}
            >
              <div className='headerItemText'>SIGNALÉES</div>
            </div>
            <div
              onClick={() => setLocalRoute(ERoute.Profile)}
              className={localRoute === ERoute.Profile ? 'headerItem' : 'unselectedHeaderItem'}
              style={{ zIndex: localRoute === ERoute.Profile ? 2 : 1, cursor: 'pointer' }}
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
                  Bonjour {user && user.FirstName ? user.FirstName : 'User'}!
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

        <div className='innerContainer alignItemsCenter'>
          {(localRoute === ERoute.DisplayAds || localRoute === ERoute.AdPage) ? <DisplayAds tabIndex={localRoute} setTabIndex={setLocalRoute}  user={user}/> : null}
          
          
          {localRoute === ERoute.UnApproved && <ApproveAds setRoute={setLocalRoute} />}
          {localRoute === ERoute.Reported && <Singalees setIndex={setLocalRoute} />}
          {localRoute === ERoute.Profile && user ? (
            <Profile user={user} setUser={setUser} />
          ) : null}
          {localRoute === ERoute.CreatePost ? <CreatePost setRoute={setLocalRoute} /> : null}
          {localRoute === ERoute.ConditionGenerales && <ConditionGenerales />}
          {localRoute === ERoute.QuiSommes && <QuiSommes />}
          {localRoute === ERoute.Contracter && <Contracter />}
        </div>
      </div>
      <Footer setRoute={setLocalRoute} />
    </>
  );
}
