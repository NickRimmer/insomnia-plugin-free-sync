import { InsomniaContext } from './context.types'

export type InsomniaWorkspaceAction = {
  action: (
    context: InsomniaContext,
  ) => void | Promise<void>
  label: string
  icon?: string
}
