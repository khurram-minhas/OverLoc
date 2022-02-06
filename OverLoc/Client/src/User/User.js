import React, { useState, useEffect, useRef } from 'react';
import Logo from '../Icon/RMlogo.png';
import Avatar from '../Icon/img_avatar.png';
import useRockFetchGet, { useRockFetchPost } from '../utils/RockFetch';
import CreatePost from '../CreatePost/CreatePost';
import Cookies from 'js-cookie';
import { clearCookies, isNullOrUndefined } from '../utils/Global';
import Profile from '../Profile/Profile';
import { DisplayAds } from '../DisplayAds/DisplayAds';
import Footer from '../Footer';
import { ERoute } from '../ERoute';
import ConditionGenerales from '../FooterRoutes/Conditions-generales';
import QuiSommes from '../FooterRoutes/QuiSommes';
import Contracter from '../FooterRoutes/Contacter';
export function User({ type, setRoute }) {
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
                onClick={() => setIndex(0)} style={{cursor: 'pointer'}}
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
              <div className='headerItemText'>Accueil</div>
            </div>
            <div
              onClick={() => setIndex(1)}
              className={index === 1 ? 'headerItem' : 'unselectedHeaderItem'}
              style={{ zIndex: index === 1 ? 2 : 1, cursor: 'pointer' }}
            >
              <div className='headerItemText'>Mon Compte</div>
            </div>
            <div
              onClick={() => setIndex(2)}
              className={index === 2 ? 'headerItem' : 'unselectedHeaderItem'}
              style={{ zIndex: index === 2 ? 2 : 1, cursor: 'pointer' }}
            >
              <div className='headerItemText'>Déposer un annonce</div>
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
          {/* <div className='login flex-y-center flex-column'>
          <div className='loginHeading flex-y-center flex-column'>
            <div>Bonjour !</div>
            <div className='loginSubHeading'>{getBody()}!</div>
          </div>

          <div className='loginForm flex-y-center flex-column'>
            You are logged in!
          </div>
        </div> */}
          {index === 0 ? <DisplayAds setIndex={setIndex} /> : null}
          {index === 1 ? (
            <Profile user={user} setUser={setUser} setIndex={setIndex} />
          ) : null}
          {index === 2 ? <CreatePost setIndex={setIndex} /> : null}
          
          {index === 10 && <ConditionGenerales />}
          {index === 11 && <QuiSommes />}
          {index === 12 && <Contracter setRoute={setIndex} />}
        </div>
      </div>
      <Footer setType={setIndex} />
    </>
  );
}
