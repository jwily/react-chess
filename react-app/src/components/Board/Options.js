import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";

import { isWhite } from "../../game-logic";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";

const BUTTON_ORDER = [
  'reset',
  'copy',
  'switch',
  'offline',
  'help',
  'home',
]

const Options = ({ player, setPlayer, socket, turn, offline,
  setOffline, setSelected, resetGame, checkedPlayer }) => {

  const copiedTimeout = useRef(null);

  const [animated, setAnimated] = useState(true);
  const [help, setHelp] = useState(false);
  const [helpClosing, setHelpClosing] = useState(false);

  const { matchCode } = useParams();
  const history = useHistory();

  useEffect(() => {

    const removeAnimation = setTimeout(() => {
      setAnimated(false);
    }, 850)

    return () => clearTimeout(removeAnimation);

  }, [])

  const [status, setStatus] = useState('turn');

  const resetBoard = useCallback((e) => {

    if (offline) setPlayer('white');
    socket.emit("reset");
    resetGame();

  }, [socket, setPlayer, offline, resetGame]);

  const switchPlayer = useCallback((e) => {

    setPlayer((prev) => prev === 'white' ? 'black' : 'white');

  }, [setPlayer])

  useEffect(() => {

    const handleKeyPress = (e) => {

      if (animated) return;

      if (e.shiftKey && e.key === 'R') {
        setSelected('')
        resetBoard()
      } else if (e.shiftKey && e.key === 'Q') {
        if (!help) {
          setHelp(true);
        } else {
          setHelpClosing(true);
        }
      } else if (e.shiftKey && e.key === 'F') {
        // setSelected('')
        setOffline(prev => !prev);
      } else if (e.shiftKey && e.key === 'S' && !offline) {
        setSelected('')
        switchPlayer()
      } else if (e.shiftKey && e.key === 'C') {
        navigator.clipboard.writeText(matchCode).then(() => {
          setStatus('copied');
          copiedTimeout.current = setTimeout(() => {
            setStatus('turn');
          }, 2500)
        })
      }
    }

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearTimeout(copiedTimeout.current);
    };

  }, [resetBoard, switchPlayer, help, setOffline,
    setSelected, offline, matchCode, animated])

  useEffect(() => {

    if (status !== 'copied') {
      clearTimeout(copiedTimeout.current);
    };

  }, [status])

  useEffect(() => {

    let debounceTimer;

    if (offline) {
      debounceTimer = setTimeout(() => {
        setPlayer(turn);
      }, 650);
    }

    return () => clearInterval(debounceTimer);

  }, [offline, setPlayer, turn])

  useEffect(() => {

    let closeAnimation;

    if (helpClosing) {
      setStatus('turn');
      closeAnimation = setTimeout(() => {
        setHelp(false);
        setHelpClosing(false);
      }, 200)
    };

    return () => clearTimeout(closeAnimation);

  }, [helpClosing])

  const optionsData = useMemo(() => {
    return {
      turn: {
        // message: turn === player ? 'Your Move'
        //   : `${turn[0].toUpperCase() + turn.slice(1)} Moves`,
        message: (turn === player && !offline) ? 'Your Move'
          : `${turn[0].toUpperCase() + turn.slice(1)} Moves`,
        info: null,
        icon: null,
        action: null
      },
      reset: {
        message: 'Reset Game',
        info: 'shift + r',
        icon: "fa-solid fa-power-off",
        action: resetBoard,
      },
      switch: {
        message: `Switch to ${isWhite(player) ? 'Black' : 'White'}`,
        info: 'shift + s',
        icon: `fa-${isWhite(player) ? 'regular' : 'solid'} fa-chess-knight`,
        action: switchPlayer
      },
      help: {
        message: 'Help',
        info: 'shift + q',
        icon: "fa-solid fa-circle-question",
        action: (e) => {
          e.stopPropagation();
          setHelp(true);
        }
      },
      offline: {
        message: `${offline ? 'Disable' : 'Enable'} Offline Mode`,
        info: 'shift + f',
        icon: `fa-solid fa-${offline ? 'people-arrows' : 'street-view'}`,
        action: (e) => {
          e.stopPropagation();
          setOffline(prev => !prev);
        }
      },
      copy: {
        message: 'Copy Code',
        info: 'shift + c',
        icon: 'fa-regular fa-copy',
        action: (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(matchCode).then(() => {
            setStatus('copied');
          })
        }
      },
      copied: {
        message: 'Copied',
        info: matchCode,
        icon: null,
        action: null
      },
      home: {
        message: 'Back Home',
        info: null,
        icon: 'fa-solid fa-house',
        action: () => {
          history.push('/');
        }
      }
    }
  }, [player, turn, resetBoard, switchPlayer,
    offline, setOffline, matchCode, history])

  const statusDisplay = useMemo(() => {
    return (
      <div>
        <span id='message'>{optionsData[status].message}</span>
        {!!optionsData[status].info &&
          <span id='status'>{optionsData[status].info}</span>}
      </div>
    )
  }, [optionsData, status])

  const optionButtons = useMemo(() => {
    return BUTTON_ORDER.map(value => {
      const data = optionsData[value];

      return (
        <button key={value}
          onClick={animated ? null : data.action}
          onMouseEnter={() => setStatus(value)}
          onMouseLeave={() => setStatus('turn')}
          disabled={offline && value === 'switch'}>
          <i className={data.icon}></i>
        </button>
      )
    })
  }, [optionsData, offline, animated])

  if (help) {
    return (
      <div className={'help-window' + (helpClosing ? ' close' : ' open')}
        onClick={(e) => {
          e.stopPropagation();
          setHelpClosing(true);
        }}>
        <div className='help-text'>
          <h2>React Chess</h2>
          <p>Press the [copy] button to save the match code to your clipboard</p>
          <p>Share the match code with a friend</p>
          <p>Determine together who will play black and who will play white</p>
          <p>Press the [switch] button to choose your color</p>
          <p>Enable [offline] mode to rotate the board after each move</p>
          <p>May the nobler stand victorious</p>
          <p><i className="fa-solid fa-crow"></i><i className="fa-solid fa-crow"></i></p>
          <p>Click this window to dismiss it</p>
        </div>
      </div >
    )
  }

  return (
    <nav className={'game-options' + (animated ? ' fade-in-nav' : '')}>
      {statusDisplay}
      <div>
        {optionButtons}
      </div>
    </nav >
  )
}

export default Options;
