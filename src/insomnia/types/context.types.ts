import { InsomniaContextStore } from './context-store.types'
import { InsomniaContextApp } from './context-app.types'

export type InsomniaContext = {
  store: InsomniaContextStore
  app: InsomniaContextApp
}
