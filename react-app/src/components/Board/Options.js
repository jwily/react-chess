import React, { useCallback, useEffect, useState, useMemo } from "react";

import { isWhite } from "../../game-logic";

const BUTTON_ORDER = [
  'reset',
  'switch',
  'offline',
  'help',
]

const Options = ({ player, setPlayer, socket, turn, offline, setOffline, setSelected }) => {

  const [animated, setAnimated] = useState(true);
  const [help, setHelp] = useState(false);
  const [helpClosing, setHelpClosing] = useState(false);

  useEffect(() => {

    const removeAnimation = setTimeout(() => {
      setAnimated(false);
    }, 850)

    return () => clearTimeout(removeAnimation);

  }, [socket])

  const [status, setStatus] = useState('turn');

  const resetBoard = useCallback((e) => {
    if (!animated) {
      if (offline) {
        setPlayer('white')
      }
      socket.emit("reset");
    }
  }, [socket, animated, setPlayer, offline]);

  const switchPlayer = useCallback((e) => {
    if (!animated) {
      setPlayer((prev) => prev === 'white' ? 'black' : 'white');
    }
  }, [setPlayer, animated])

  useEffect(() => {

    const handleKeyPress = (e) => {
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
      }
    }

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };

  }, [resetBoard, switchPlayer, help, setOffline, setPlayer, turn, setSelected, offline])

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
        hotkey: null,
        icon: null,
        action: null
      },
      reset: {
        message: 'Reset Game',
        hotkey: 'shift + r',
        icon: "fa-solid fa-power-off",
        action: resetBoard,
      },
      switch: {
        message: `Switch to ${isWhite(player) ? 'Black' : 'White'}`,
        hotkey: 'shift + s',
        icon: `fa-${isWhite(player) ? 'regular' : 'solid'} fa-chess-knight`,
        action: switchPlayer
      },
      help: {
        message: 'Help',
        hotkey: 'shift + q',
        icon: "fa-solid fa-circle-question",
        action: (e) => {
          e.stopPropagation();
          setHelp(true);
        }
      },
      offline: {
        message: `${offline ? 'Disable' : 'Enable'} Offline Mode`,
        hotkey: 'shift + f',
        icon: `fa-solid fa-${offline ? 'people-arrows' : 'wifi'}`,
        action: (e) => {
          e.stopPropagation();
          setOffline(prev => !prev);
        }
      }
    }
  }, [player, turn, resetBoard, switchPlayer, offline, setOffline])

  const statusDisplay = useMemo(() => {
    return (
      <div>
        <span id='message'>{optionsData[status].message}</span>
        {!!optionsData[status].hotkey &&
          <span id='status'>{optionsData[status].hotkey}</span>}
      </div>
    )
  }, [optionsData, status])

  const optionButtons = useMemo(() => {
    return BUTTON_ORDER.map(value => {
      const data = optionsData[value];

      return (
        <button key={value}
          onClick={data.action}
          onMouseEnter={() => setStatus(value)}
          onMouseLeave={() => setStatus('turn')}
          disabled={offline && value === 'switch'}
          className={offline && value === 'switch' ? 'disabled' : ''}
        >
          <i className={data.icon}></i>
        </button>
      )
    })
  }, [optionsData, offline])

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
          <p>Enable [offline] mode to automate player switching</p>
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
