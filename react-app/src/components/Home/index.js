import React from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {

  const history = useHistory();

  const newMatch = async (e) => {
    e.preventDefault();
  }

  const loadMatch = (e) => {
    e.preventDefault();
    history.push('/match/demo')
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
    </div>
  )
}

export default Home;
