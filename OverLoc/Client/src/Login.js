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

function Login({setRoute}) {
  const [rockFetchPost] = useRockFetchPost()
  const [rockFetchGet] = useRockFetchGet()
  const userNameRef = useRef(null);
  const [reload, setReload] = useState(false)
  const [isPasswordSelected, setIsPasswordSelected] = useState(false)
  const [username, setUserName] = useState(null)
  const [password, setPassword] = useState(null)
  const [passInputField, setPassInputField] = useState(<input className="inputField" type="password" placeholder="Password" value={password} onKeyDown={onKeyDown} onChange={changePassword} />)
  const [passIcon, setPassIcon] = useState(<Lock onClick={e => onPasswordIcon(false)} className="passwordIcon" />)
  useEffect(() => {
    async function fetchData() {
    //   const response = await rockFetchGet('api/Authentication/isValidToken');
    //   if (response !== null) {

    //   } else {
    //     const response = await rockFetchGet('api/Authentication/accesscontrol');
    //     if (response !== null) {
    //       Cookies.set('token', response.jwtToken, { expires: 1 })
    //       Cookies.set('refreshToken', response.refreshToken, { expires: 1 })
    //       Cookies.set('userId', response.userId, { expires: 1 })
    //       // localStorage.setItem('token', result.jwtToken);
    //       // localStorage.setItem('refreshToken', result.refreshToken);
    //       return null;
    //     }
    //     setReload(!reload)
    //   }
    }
    fetchData();
  }, [])
  useEffect(() => {
    if (userNameRef !== null && userNameRef.current !== null && isPasswordSelected === false)
      userNameRef.current.focus();
  })
  function onPasswordIcon(isShowPassword) {
    if (isShowPassword) {
      setPassIcon(<Lock onClick={e => onPasswordIcon(false)} className="passwordIcon" />)
      setPassInputField(<input className="inputField" type="password" placeholder="Password" value={password} onChange={changePassword} />)
    } else {
      setPassIcon(<Unlock onClick={e => onPasswordIcon(true)} className="passwordIcon" />)
      setPassInputField(<input className="inputField" type="text" placeholder="Password" value={password} onChange={changePassword} />)
    }
  }
  function openFormulatrixWebsite(e) {
    window.open('http://www.formulatrix.com/', '_blank');
  }
  async function changeUserName(e) {
    setUserName(e.target.value)
  }
  function changePassword(e) {
    if (isPasswordSelected === false)
      setIsPasswordSelected(true)
    setPassword(e.target.value)
  }
  function onKeyDown(e) {
    if (e.keyCode === 13 && username) {
      onLoginClick(e);
    }
  }
  async function onLoginClick(e) {
    showSnackBar('Logging in...')
    const body = { username, password }
    const result = await rockFetchPost('http://localhost:3000/login', body)
    if (result === null) {
      showSnackBar('Authentication Failed!')
      // alert('Username or password is Invalid!');
      return;
    }
    if (result.token === undefined || result.token === null) {
      showSnackBar('Authentication Failed!')
      // alert('Username or password is Invalid!');
    } else {
      showSnackBar('Login Successful!')
      Cookies.set('token', result.token, { expires: 1 })
      Cookies.set('userId', result._id, { expires: 1 })
      setRoute(ERoute.Welcome)
      // localStorage.setItem('token', result.jwtToken);
      // localStorage.setItem('refreshToken', result.refreshToken);
      //const licResponse = await rockFetchPost('api/license/isvalid', 'data');
      // if (!licResponse)
      //   history.push('/licenseMain');
      // else
      return null;
    }
  }

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
            Connectez vous afin de poster une annonce
            </div>
          </div>

          <div className="loginForm flex-y-center flex-column">
            <div className="userIcon">
              <User />
            </div>
            <div className="fields">
              <input className="inputField" ref={userNameRef} placeholder="Email" value={username} onKeyDown={onKeyDown} onChange={changeUserName} autoFocus />
            </div>
            <div className="fields">
              {passInputField}
              {passIcon}
            </div>
            <div className="fields flex-x-center">
              <button className="loginButton" onClick={onLoginClick}>
                <span className="buttonText">Login</span>
              </button>
            </div>
            <div className="fields content-right-align">
              <a className="forgetPassword">Forgot Password?</a>
            </div>
          </div>
          {/* <div className="row bottomDetails flex flex-space-between">
            <div className="col-md-4 bottomDetailsCols">
              Version {localStorage.getItem('version')}
            </div>
            <div className="col-md-4 bottomDetailsCols bottomDetailsColsSelected" onClick={openFormulatrixWebsite}>
              Formulatrix Inc.
            </div>
            <div className="col-md-4 bottomDetailsCols">
              ©2020
            </div>
          </div> */}
        </div>

      </div>

    </div>
  )
}
export default Login;
