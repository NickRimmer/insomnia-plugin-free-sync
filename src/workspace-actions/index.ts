import { saveAction } from './save-action'
import { InsomniaWorkspaceAction } from '../insomnia/types/workspace-action.types'
import { readAction } from './read-action'
import { configurationAction } from './configuration-action'

const experimentalAction: InsomniaWorkspaceAction = {
  label: 'Experimental function',
  icon: 'fa-vial',
  action: () => {
    alert('Hello, Universe!')
  },
}

export const workspaceActions: InsomniaWorkspaceAction[] = [
  saveAction,
  readAction,
  configurationAction,
  experimentalAction,
]