import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Home = ({ freshGame, setFreshGame }) => {

  const history = useHistory();

  const [generating, setGenerating] = useState(false);
  const [loadingGame, setLoadingGame] = useState(false);
  const [matchCode, setMatchCode] = useState('');

  const newMatch = async (e) => {

    e.preventDefault();

    if (freshGame) {
      history.push(`/encounter/${freshGame}`);
    }

    else if (!generating) {

      setGenerating(true)

      const res = await fetch('/api/games/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })

      if (res.ok) {
        const match = await res.json();
        setGenerating(false);
        setFreshGame(match.code);
        history.push(`/encounter/${match.code}`);
      }
    }
  }

  const openLoadInput = (e) => {
    e.preventDefault();
    setLoadingGame(true);
  }

  const loadMatch = (e) => {
    e.preventDefault();
    if (matchCode) {
      history.push(`/encounter/${matchCode}`)
    }
  }

  return (
    <div className='home-menu'>
      <h1>Justo Chess</h1>
      <button id='new-match' onClick={newMatch}>
        <span className='home-upper'>N</span><span>ew </span><span className='home-upper'>M</span><span>atch</span>
      </button>
      {!loadingGame
        ? <button id='load-match' onClick={openLoadInput}>
          <span className='home-upper'>L</span><span>oad </span><span className='home-upper'>M</span><span>atch</span>
        </button>
        :
        <form id='load-form' onSubmit={loadMatch}>
          <input type="text" placeholder='Input Code' maxLength={12} value={matchCode}
            onChange={e => {
              setMatchCode(e.target.value);
            }}></input>
          <div id='load-buttons'>
            <button><i className='fa-solid fa-circle-check'></i></button>
            <button onClick={e => {
              e.preventDefault();
              setLoadingGame(false);
            }}><i className='fa-solid fa-circle-xmark'></i></button>
          </div>
        </form>}
      {generating && <span id='home-loading'>Loading...</span>}
    </div>
  )
}

export default Home;
