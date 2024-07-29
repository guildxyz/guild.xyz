"use client"

import {
  MutableRefObject,
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from "react"
import ReactCanvasConfetti from "react-canvas-confetti/dist"
import { TCanvasConfettiInstance } from "react-canvas-confetti/dist/types"

const doubleConfetti = (confetti: TCanvasConfettiInstance) => {
  const count = 200
  const defaultsPerBarrage: confetti.Options[] = [
    {
      origin: { x: -0.05 },
      angle: 50,
    },
    {
      origin: { x: 1.05 },
      angle: 130,
    },
  ] as const

  const fire = (particleRatio: number, opts: confetti.Options) => {
    confetti({
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    })
  }

  for (const defaults of defaultsPerBarrage) {
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      ...defaults,
    })
    fire(0.2, {
      spread: 60,
      ...defaults,
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      ...defaults,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      ...defaults,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      ...defaults,
    })
  }
}

const ConfettiContext = createContext<
  MutableRefObject<TCanvasConfettiInstance | undefined>
>({} as MutableRefObject<TCanvasConfettiInstance | undefined>)

export const useConfetti = () => {
  return { confetti: useContext(ConfettiContext) }
}

export const ConfettiProvider = ({ children }: PropsWithChildren) => {
  const confettiRef = useRef<TCanvasConfettiInstance>()
  const audioRef = useRef<HTMLAudioElement>(null)
  const onInitHandler = ({ confetti }: { confetti: TCanvasConfettiInstance }) => {
    const confettiClosure = async (...args: Parameters<typeof confetti>) => {
      if (args[0] === undefined) {
        doubleConfetti(confetti)
        audioRef.current?.play()
        return null
      }
      return confetti()
    }
    confettiClosure.reset = confetti.reset
    confettiRef.current = confettiClosure
  }
  return (
    <ConfettiContext.Provider value={confettiRef}>
      {children}
      <ReactCanvasConfetti
        onInit={onInitHandler}
        globalOptions={{
          disableForReducedMotion: true,
          useWorker: true,
          resize: true,
        }}
      />
      <audio ref={audioRef} src="sfx/confetti-party-popper.mp3" />
    </ConfettiContext.Provider>
  )
}
