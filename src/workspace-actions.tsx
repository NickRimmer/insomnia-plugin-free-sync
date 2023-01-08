import React from 'react'
import { InsomniaWorkspaceAction } from './insomnia/types/workspace-action.types'
import { showDialogComponent } from './insomnia/tools/dialogs'
import { ConfigurationDialog } from './components/configuration-dialog'

const saveAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Save workspace',
  icon: 'fa-upload',
  action: () => alert('Not implemented yet'),
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