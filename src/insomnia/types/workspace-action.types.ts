import { InsomniaContext } from './context.types'
import { InsomniaWorkspace } from './workspace.types'

export type InsomniaWorkspaceAction = {
  action: (
    context: InsomniaContext,
    models: InsomniaWorkspaceActionModels,
  ) => void | Promise<void>
  label: string
  icon?: string
}

export interface InsomniaWorkspaceActionModels {
  workspace: InsomniaWorkspace
}