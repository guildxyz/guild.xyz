import React, { useState, createContext, useEffect } from 'react'
import Confetti from 'react-confetti'


export interface ConfettiContextInterface {
  setRunConfetti: (runConfetti: boolean) => void
}

export const ConfettiContext = createContext<ConfettiContextInterface | null>(null);

export const ConfettiContextProvider = ({children}) => {
  const [runConfetti, setRunConfetti] = useState(false)
  const [screenSize, setScreenSize] = useState({
    width: 300,
    height: 200
  })

  useEffect(() => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [])

  return (
    <ConfettiContext.Provider
      value={{
        setRunConfetti,
      }}
    >
      <Confetti width={screenSize.width} height={screenSize.height} run={runConfetti} />
      {children}
    </ConfettiContext.Provider>
  );
};
