import React, { useState, useEffect, useRef } from 'react';
import Logo from '../Icon/RMlogo.png';
import Avatar from '../Icon/img_avatar.png';
import useRockFetchGet, { useRockFetchPost } from '../utils/RockFetch';
import CreatePost from '../CreatePost/CreatePost';
import Cookies from 'js-cookie';
import { clearCookies, isNullOrUndefined, showSnackBar } from '../utils/Global';
import Profile from '../Profile/Profile';
import { DisplayAds } from '../DisplayAds/DisplayAds';
import Footer from '../Footer';
import { ERoute } from '../ERoute';
import ConditionGenerales from '../FooterRoutes/Conditions-generales';
import QuiSommes from '../FooterRoutes/QuiSommes';
import Contracter from '../FooterRoutes/Contacter';
export function User({ type, setRoute }) {
  const [localRoute, setLocalRoute] = useState(ERoute.DisplayAds);
  const [rockFetchPost] = useRockFetchPost();
  const [user, setUser] = useState();
  const [totalCreatedAds, setTotalCreatedAds] = useState(0);
  useEffect(() => {
    async function fetchData() {
      const userId = Cookies.get('userId');
      if(isNullOrUndefined(userId)) return;
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
                style={{ cursor: 'pointer' }}
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
              <div className='headerItemText'>Accueil</div>
            </div>
            {!isNullOrUndefined(user) ? (
              <>
                <div
                  onClick={() => setLocalRoute(ERoute.Profile)}
                  className={
                    localRoute === ERoute.Profile ? 'headerItem' : 'unselectedHeaderItem'
                  }
                  style={{ zIndex: localRoute === ERoute.Profile ? 2 : 1, cursor: 'pointer' }}
                >
                  <div className='headerItemText'>Mon Compte</div>
                </div>
                <div
                  onClick={() => {
                    if(totalCreatedAds < 3)  
                      setLocalRoute(ERoute.CreatePost)
                    else
                      showSnackBar('You have already created 3 ads!')
                  }}
                  className={
                    localRoute === ERoute.CreatePost ? 'headerItem' : 'unselectedHeaderItem'
                  }
                  style={{ zIndex: localRoute === ERoute.CreatePost ? 2 : 1, cursor: 'pointer' }}
                >
                  <div className='headerItemText'>Déposer un annonce</div>
                </div>
              </>
            ) : null}
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
                {isNullOrUndefined(user) ? (
                  <>
                    <i class='fa fa-sign-in' aria-hidden='true'></i> Log in
                  </>
                ) : (
                  <>
                    <i class='fa fa-sign-out' aria-hidden='true'></i> Log out
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='innerContainer alignItemsCenter'>
          {(localRoute === ERoute.DisplayAds || localRoute === ERoute.AdPage) ? <DisplayAds tabIndex={localRoute} setTabIndex={setLocalRoute} setTotalCreateAds={setTotalCreatedAds}  user={user}/> : null}
          {localRoute === ERoute.Profile && user ? (
            <Profile user={user} setUser={setUser} setTotalCreatedAds={setTotalCreatedAds} totalCreatedAds={totalCreatedAds}/>
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
