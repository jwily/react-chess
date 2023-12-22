import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {

  const history = useHistory();

  const [generating, setGenerating] = useState(false);

  const newMatch = async (e) => {

    e.preventDefault();

    if (!generating) {

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
        history.push(`/${match.code}`);
      }
    }
  }

  const loadMatch = (e) => {
    e.preventDefault();
    history.push('/demo')
  }

  return (
    <div className='home-menu'>
      <h2>React Chess</h2>
      <button id='new-match' onClick={newMatch}>
        <span className='home-upper'>N</span><span>ew </span><span className='home-upper'>M</span><span>atch</span>
      </button>
      <button id='load-match' onClick={loadMatch}>
        <span className='home-upper'>L</span><span>oad </span><span className='home-upper'>M</span><span>atch</span>
      </button>
      {generating && <span id='home-loading'>Loading...</span>}
    </div>
  )
}

export default Home;
