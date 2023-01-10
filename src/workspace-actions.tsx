import React from 'react'
import { InsomniaWorkspaceAction, InsomniaWorkspaceActionModels } from './insomnia/types/workspace-action.types'
import { showDialogComponent } from './insomnia/tools/dialogs'
import { ConfigurationDialog } from './components/configuration-dialog'
import { FileService } from './services/file-service'
import { ConfigurationService } from './services/configuration-service'
import { InsomniaContext } from './insomnia/types/context.types'

const saveAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Save workspace',
  icon: 'fa-upload',
  action: (context, models) => {
    const fileService = FileServiceBuilder(context, models)
    fileService
      .exportCollectionFileAsync()
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

const readAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Load workspace',
  icon: 'fa-download',
  action: (context, models) => {
    const fileService = FileServiceBuilder(context, models)
    fileService
      .importCollectionFileAsync()
      .then(result => {
        if (!result) context.app.alert('Operation canceled', 'Oops. Workspace cannot be read')
        else context.app.alert('Success', 'Workspace restored')
      })
      .catch(error => {
        console.error(error)
        context.app.alert('Operation failed', 'Sorry, workspace cannot be read')
      })
  },
}

const configurationAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Configuration',
  icon: 'fa-cog',
  action: context => showDialogComponent({
    context,
    title: 'Free sync: Configuration',
    children: (<ConfigurationDialog context={context}/>),
  }),
}

const FileServiceBuilder = (context: InsomniaContext, models: InsomniaWorkspaceActionModels) => {
  const configurationService = new ConfigurationService(context.store)
  return new FileService(context.data, configurationService, models.workspace)
}

export const workspaceActions: InsomniaWorkspaceAction[] = [
  saveAction,
  readAction,
  configurationAction,
]