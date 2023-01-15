import { InsomniaWorkspaceAction } from '../insomnia/types/workspace-action.types'
import { WorkspaceService } from '../services/workspace-service'
import { DataService } from '../services/data-service'

export const readAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Load workspace',
  icon: 'fa-download',
  action: (context, models) => {
    const configurationService = new DataService(models.workspace._id, context.store)
    const workspaceService = new WorkspaceService(context.data, configurationService, models.workspace)

    workspaceService
      .importAsync()
      .then(result => {
        if (!result) context.app.alert('Operation canceled', 'Oops. Workspace cannot be read')
        else context.app.alert('Success', 'Workspace restored')
      })
      .catch((error: Error) => {
        console.error(error)
        context.app.alert('Operation failed', error.message)
      })
  },
}