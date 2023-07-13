import { InsomniaWindowApp } from './insomnia/types/window-app.types'

declare global {
  interface Window { app: InsomniaWindowApp }
}
