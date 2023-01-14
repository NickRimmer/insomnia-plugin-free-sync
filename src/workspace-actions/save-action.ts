import { InsomniaWorkspaceAction } from '../insomnia/types/workspace-action.types'
import { DataService } from '../services/data-service'
import { WorkspaceService } from '../services/workspace-service'

export const saveAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Save workspace',
  icon: 'fa-upload',
  action: (context, models) => {
    const configurationService = new DataService(models.workspace._id, context.store)
    const workspaceService = new WorkspaceService(context.data, configurationService, models.workspace)

    workspaceService
      .exportAsync()
      .then(result => {
        if (!result) context.app.alert('Operation canceled', 'Oops. Workspace cannot be saved to file')
        else context.app.alert('Success', 'Workspace saved to file')
      })
      .catch(error => {
        console.error(error)
        context.app.alert('Operation failed', 'Sorry, workspace cannot be saved')
      })
  },
}