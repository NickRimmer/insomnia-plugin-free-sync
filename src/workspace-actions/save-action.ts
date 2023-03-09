﻿import { InsomniaWorkspaceAction, InsomniaWorkspaceActionModels } from '../insomnia/types/workspace-action.types'
import { DataService } from '../services/data-service'
import {
  WorkspaceServiceBase,
  WorkspaceServiceMultipleFiles,
  WorkspaceServiceSingleFile,
} from '../services/workspace-service'
import { InsomniaContext } from '../insomnia/types/context.types'

export const saveAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Save workspace',
  icon: 'fa-upload',
  action: (context, models) => actionAsync(context, models),
}

const actionAsync = async (context: InsomniaContext, models: InsomniaWorkspaceActionModels): Promise<void> => {
  const dataService = new DataService(models.workspace._id, context.store)
  const configuration = await dataService.getConfigurationAsync()
  const workspaceService: WorkspaceServiceBase = configuration.SaveAndLoadAsMultipleFiles
    ? new WorkspaceServiceMultipleFiles(dataService, context.data, models.workspace)
    : new WorkspaceServiceSingleFile(dataService, context.data, models.workspace)

  try {
    const result = await workspaceService.exportAsync()

    if (!result) context.app.alert('Operation canceled', 'Oops. Workspace cannot be saved to file')
    else context.app.alert('Success', 'Workspace saved to file')
  } catch (error) {
    console.error(error)
    context.app.alert('Operation failed', 'Sorry, workspace cannot be saved')
  }
}