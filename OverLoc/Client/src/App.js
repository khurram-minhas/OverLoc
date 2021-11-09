import logo from './logo.svg';
import './App.scss';
import Login from './Login';
import { useState } from 'react';
import {ERoute} from './ERoute';
import Welcome from './Welcome';

function App() {
  const [route, setRoute] = useState(ERoute.Login);
  if(route === ERoute.Login)
    return (
      <Login setRoute={setRoute}/>
    );

  return (
    <Welcome setRoute={setRoute}/>
  );
}

export default App;
