import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import './Login.scss';
import { User } from './User/User';
import { Admin } from './Admin/Admin';
import { isNullOrUndefined } from './utils/Global';

function Welcome({ setRoute }) {
  const [type, setType] = useState(2);
  useEffect(() => {
    async function fetchData() {
      const userTypeId = Cookies.get('userTypeId');
      if(!isNullOrUndefined(userTypeId))
        setType(parseInt(userTypeId));
    }
    fetchData();
  }, []);
  let renderer;
  if (type === 2) renderer = <User setRoute={setRoute} type={type} />;
  else renderer = <Admin setRoute={setRoute} type={type} />;
  return renderer;
}
export default Welcome;
