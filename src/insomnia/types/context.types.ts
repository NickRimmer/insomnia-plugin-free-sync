import { InsomniaContextStore } from './context-store.types'
import { InsomniaContextApp } from './context-app.types'
import { InsomniaContextData } from './context-data.types'

export type InsomniaContext = {
  store: InsomniaContextStore
  app: InsomniaContextApp
  data: InsomniaContextData
}
