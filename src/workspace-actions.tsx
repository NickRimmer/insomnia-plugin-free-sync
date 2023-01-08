import React from 'react'
import { InsomniaWorkspaceAction } from './insomnia/types/workspace-action.types'
import { showDialogComponent } from './insomnia/tools/dialogs'
import { ConfigurationDialog } from './components/configuration-dialog'
import { FileService } from './services/file-service'
import { ConfigurationService } from './services/configuration-service'

const saveAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Save workspace',
  icon: 'fa-upload',
  action: (context, models) => {
    const configurationService = new ConfigurationService(context.store)
    const fileService = new FileService(context.data, configurationService, models.workspace)

    fileService
      .writeCollectionFileAsync()
      .then(result => {
        if (!result) context.app.alert('Operation canceled', 'Oops. Collection cannot be saved to file')
        else context.app.alert('Success', 'Collection saved to file')
      })
  },
}

const readAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Load workspace',
  icon: 'fa-download',
  action: () => alert('Not implemented yet'),
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

export const workspaceActions: InsomniaWorkspaceAction[] = [
  saveAction,
  readAction,
  configurationAction,
]