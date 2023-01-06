import {
  InsomniaWorkspaceActionModel,
  InsomniaContext,
} from './insomnia.types'
import { InsomniaPlugin } from './plugin.type'

export interface InsomniaWorkspaceAction {
  plugin?: InsomniaPlugin
  action: (
    context: InsomniaContext,
    models: InsomniaWorkspaceActionModel,
  ) => void | Promise<void>
  label: string
  icon?: string
}