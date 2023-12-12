// import React, { useState, useEffect } from "react";
import React from 'react';
// import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
// import SignupFormPage from "./components/SignupFormPage";
// import LoginFormPage from "./components/LoginFormPage";
// import { authenticate } from "./store/session";
// import Navigation from "./components/Navigation";
import Board from './components/Board';
import Dummy from './components/Dummy';

function App() {
  // const dispatch = useDispatch();
  // const [isLoaded, setIsLoaded] = useState(false);
  // useEffect(() => {
  //   dispatch(authenticate()).then(() => setIsLoaded(true));
  // }, [dispatch]);

  return (
    <>
      {/* <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
        </Switch>
      )} */}
      <Switch>
        <Route exact path='/'>
          <Board />
        </Route>
        <Route path='/test'>
          <Dummy />
        </Route>
      </Switch>
    </>
  );
}

export default App;
