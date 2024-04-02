import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import Board from './components/Board';
import Home from "./components/Home";

function App() {

  const [freshGame, setFreshGame] = useState('');

  return (
    <>
      <Switch>
        <Route exact path='/'>
          <Home freshGame={freshGame} setFreshGame={setFreshGame} />
        </Route>
        <Route path='/encounter/:matchCode'>
          <Board freshGame={freshGame} setFreshGame={setFreshGame} />
        </Route>
        <Route>
          <div className="not-found">Page Not Found</div>
        </Route>
      </Switch>
    </>
  );
}

export default App;
