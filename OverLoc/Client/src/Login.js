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
  const [passInputField, setPassInputField] = useState(<input className="inputField" type="password" placeholder="Mot de passe" value={password} onKeyDown={onKeyDown} onChange={changePassword} />)
  const [passIcon, setPassIcon] = useState(<Lock onClick={e => onPasswordIcon(false)} className="passwordIcon" />)
  useEffect(() => {
    async function fetchData() {
      const response = await rockFetchGet('/welcome');
      if (response !== null) {
        setRoute(ERoute.Welcome)
      }
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
    const body = { email: username, password }
    const result = await rockFetchPost('/login', body)
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
      Cookies.set('userId', result.userId, { expires: 1 })
      Cookies.set('userTypeId', result.userTypeId, { expires: 1 })
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
            width={700}
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
              <input className="inputField" type='email' ref={userNameRef} placeholder="Email" value={username} onKeyDown={onKeyDown} onChange={changeUserName} autoFocus />
            </div>
            <div className="fields">
              {passInputField}
              {passIcon}
            </div>
            <div className="fields flex-x-center">
              <button className="loginButton" onClick={onLoginClick}>
                <span className="buttonText">SE CONNECTER</span>
              </button>
            </div>
            <div className="fields content-right-align">
              <a className="forgetPassword">Mot de passe oublié ?</a>
            </div>
            <div className="fields content-right-align">
              <a className="notRegister">Pas encore inscrit ?&nbsp;<div className='register' onClick={() =>setRoute(ERoute.SignUp)}>Inscription</div></a>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
export default Login;
