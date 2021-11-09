import React, { useState, useEffect, useRef } from 'react'
import Cookies from 'js-cookie'
import Logo from './Icon/RMlogo.png';
import { showSnackBar } from './utils/Global'
import './Login.scss';
import { ReactComponent as User } from './Icon/User.svg'
import { ReactComponent as Lock } from './Icon/lock.svg'
import { ReactComponent as Unlock } from './Icon/unlock.svg'
import useRockFetchGet, { useRockFetchPost } from './utils/RockFetch';
import { ERoute } from './ERoute';

function Welcome({setRoute}) {
 
  return (

    <div className="mainContainer">

      <div className="headerRow">
        <div className="headerTitle">
          <img className="titleImage"
            src={Logo}
            alt='RM title'
          />
        </div>
      </div>

      <div className="innerContainer">
        <div className="login flex-y-center flex-column">
          <div className="loginHeading flex-y-center flex-column">
            <div>
            Bonjour !
            </div>
            <div className="loginSubHeading">
              Welcome User !
            </div>
          </div>

          <div className="loginForm flex-y-center flex-column">
              You are logged in!
           </div>
        </div>

      </div>

    </div>
  )
}
export default Welcome;
