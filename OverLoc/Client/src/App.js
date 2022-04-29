import './App.scss';
import Login from './Login';
import { useState } from 'react';
import { ERoute } from './ERoute';
import Welcome from './Welcome';
import SignUp from './SignUp';

function App() {
  const [route, setRoute] = useState(ERoute.Welcome);
  function fetchRenderer() {
    if (route === ERoute.Login) return <Login setRoute={setRoute} />;
    else if (route === ERoute.SignUp) return <SignUp setRoute={setRoute} />;
    return <Welcome key='welcome' setRoute={setRoute} />;
  }

  return <div>{fetchRenderer()}</div>;
}

export default App;
