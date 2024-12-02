import '@tanstack/react-query'
import { ErrorLike } from './src/lib/types'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ErrorLike
  }
}

