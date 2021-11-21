import { toast } from 'react-toastify'
import { ConfettiContextInterface } from 'components/common/ConfettiContext'

interface EasterEggsFoundInterface {
  egg1: boolean
  egg2: boolean
  egg3: boolean
}

// variables
let easterEggFound: EasterEggsFoundInterface = {
  egg1: false,
  egg2: false,
  egg3: false,
}
let numEggsFound: number = 0

// constants
const TOTAL_EGGS_COUNT: number = 3

// hint notifications
const giveHint = (): void => {
  if (!easterEggFound.egg1) {
    egg1Hint()
  } else if (!easterEggFound.egg2) {
    egg2Hint()
  } else if (!easterEggFound.egg3) {
    egg3Hint()
  }
}
const egg1Hint = (): void => {
  toast.dark("There's something _about_ one of the other easter eggs", {toastId: 'egg-1-hint-toast'})
}
const egg2Hint = (): void => {
  toast.dark("Let's see if you can find the next 🥚 MUHAHAHA", {
    toastId: 'egg-2-hint-toast',
  })
}
const egg3Hint = (): void => {
  toast.dark('_Joining_ others in pursuit of a common goal often makes us stronger', {
    toastId: 'egg-3-hint-toast',
  })
}

const syncEasterEggsToLocalStorage = (): void => {
  easterEggFound['egg1'] = !!window.localStorage.getItem('easterEgg1IsFound') || false
  easterEggFound['egg2'] = !!window.localStorage.getItem('easterEgg2IsFound') || false
  easterEggFound['egg3'] = !!window.localStorage.getItem('easterEgg3IsFound') || false
  numEggsFound = Object.values(easterEggFound).filter(Boolean).length
}

// egg found notifications
export const notifyEasterEgg = (eggKey: string, confettiCtx: ConfettiContextInterface): void => {
  syncEasterEggsToLocalStorage()
  const currEasterEggLocalStorageKey: string = `easter${eggKey.charAt(0).toUpperCase() + eggKey.slice(1)}IsFound`
  const allEasterEggsAreFound: boolean = !!window.localStorage.getItem('allEasterEggsAreFound')
  const currEasterEggIsFound: boolean = !!window.localStorage.getItem(currEasterEggLocalStorageKey)


  if (!allEasterEggsAreFound && !currEasterEggIsFound && !easterEggFound[eggKey]) {
    easterEggFound[eggKey] = true
    numEggsFound++
    window.localStorage.setItem(currEasterEggLocalStorageKey, 'true')

    if (allEasterEggsFound()) {
      window.localStorage.setItem('allEasterEggsAreFound', 'true')
      celeberate(confettiCtx)
      return
    }

    toast.success(`${numEggsFound}/3 easter eggs found!`, {
      onClose: () => giveHint(),
      autoClose: 4000,
    })
  }
}

export const allEasterEggsFound = (): boolean => {
  return numEggsFound === TOTAL_EGGS_COUNT
}

const celeberate = (confettiCtx: ConfettiContextInterface): void => {
  toast.success('You found all easter eggs! \n Get ready for a dance party🥳🎊🎉💃')
  confettiCtx.setRunConfetti(true)
  const soundHTMLEl = <HTMLIFrameElement>document.getElementById('sound')
  soundHTMLEl.src =
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/313627932&color=%23ff5500&auto_play=true&aallow_comments=false'
  soundHTMLEl.height = '100px'
  soundHTMLEl.width = '245px'
}
