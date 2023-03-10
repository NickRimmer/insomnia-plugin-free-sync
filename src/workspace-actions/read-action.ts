import { InsomniaWorkspaceAction, InsomniaWorkspaceActionModels } from '../insomnia/types/workspace-action.types'
import {
  WorkspaceServiceBase,
  WorkspaceServiceMultipleFiles,
  WorkspaceServiceSingleFile,
} from '../services/workspace-service'
import { DataService } from '../services/data-service'
import { InsomniaContext } from '../insomnia/types/context.types'

export const readAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Load workspace',
  icon: 'fa-download',
  action: (context, models) => actionAsync(context, models),
}

const actionAsync = async (context: InsomniaContext, models: InsomniaWorkspaceActionModels): Promise<void> => {
  const dataService = new DataService(models.workspace._id, context.store)
  const configuration = await dataService.getConfigurationAsync()
  const workspaceService: WorkspaceServiceBase = configuration.saveAsSingleFile
    ? new WorkspaceServiceSingleFile(dataService, context.data, models.workspace)
    : new WorkspaceServiceMultipleFiles(dataService, context.data, models.workspace)

  try {
    const result = await workspaceService.importAsync()

    if (!result) context.app.alert('Operation canceled', 'Oops. Workspace cannot be read')
    else context.app.alert('Success', 'Workspace restored')
  } catch (error: any) {
    console.error(error)
    context.app.alert('Operation failed', error.message)
  }
}