import { saveAction } from './save-action'
import { InsomniaWorkspaceAction } from '../insomnia/types/workspace-action.types'
import { readAction } from './read-action'
import { configurationAction } from './configuration-action'

// const experimentalAction: InsomniaWorkspaceAction = {
//   label: 'Experimental function',
//   icon: 'fa-vial',
//   action: async (context, models) => {
//     const {canceled, filePaths} = await (window as any).dialog.showOpenDialog({
//       title: 'Workspace folder',
//       buttonLabel: 'Select folder',
//       properties: ['openDirectory'],
//     })
//
//     console.log(canceled)
//     console.log(filePaths)
//   },
// }

export const workspaceActions: InsomniaWorkspaceAction[] = [
  saveAction,
  readAction,
  configurationAction,
  // experimentalAction,
]