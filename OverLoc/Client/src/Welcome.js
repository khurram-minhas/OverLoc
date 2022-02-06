import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import './Login.scss';
import { User } from './User/User';
import { Admin } from './Admin/Admin';
import Footer from './Footer';
import ConditionGenerales from './FooterRoutes/Conditions-generales';
import QuiSommes from './FooterRoutes/QuiSommes';
import Contracter from './FooterRoutes/Contacter';

function Welcome({ setRoute }) {
  const [type, setType] = useState(0);
  useEffect(() => {
    async function fetchData() {
      const userTypeId = Cookies.get('userTypeId');
      setType(userTypeId);
    }
    fetchData();
  }, []);
  let renderer;
  if (type === '2') renderer = <User setRoute={setRoute} type={type} />;
  else renderer = <Admin setRoute={setRoute} type={type} />;
  return renderer;
}
export default Welcome;
