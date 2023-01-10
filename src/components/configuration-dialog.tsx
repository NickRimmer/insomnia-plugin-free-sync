import './configuration-dialog.styles.scss'
import React, { FC, useEffect, useState } from 'react'
import { ConfigurationDialogProps, SyncModels } from './configuration-dialog.types'
import { validatePath } from '../services/file-service'
import { ConfigurationService } from '../services/configuration-service'
import { Button } from './shared/button'

export const ConfigurationDialog: FC<ConfigurationDialogProps> = ({context}) => {
  const [pathInputValue, setPathInputValue] = useState<string | null | undefined>()
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false)
  const [isFilePathInputWrong, setIsFilePathInputWrong] = useState(true)
  const [syncModels, setSyncModels] = useState<SyncModels>({
    api_spec: false,
    cookie_jar: false,
    environment: false,
    request: false,
    unit_test: false,
    workspace: false,
  })

  const configurationService = new ConfigurationService(context.store)

  const validateFilePathInput = (path: string | null | undefined) => !path || validatePath(path)

  useEffect(() => {
    configurationService.getWorkspaceFilePathAsync().then((currentPath: string | null) => {
      setPathInputValue(currentPath)
      setIsFilePathInputWrong(validateFilePathInput(currentPath))
    })

    configurationService.getAutoSaveOptionAsync().then(setIsAutoSaveEnabled)
    configurationService.getModelsAsync().then(v => {
      console.log(v)
      setSyncModels(v)
    })
  }, [])

  const savePath = (path: string) => {
    setIsFilePathInputWrong(validateFilePathInput(path))
    configurationService.setWorkspaceFilePathAsync(path)
  }

  const onPathInputChange = (path: string) => {
    setIsFilePathInputWrong(validateFilePathInput(path))
    setPathInputValue(path)
  }

  const onSelectFileClicked = () => context.app.showSaveDialog().then((path: string | null) => {
    if (!path) return
    if (!path?.toLocaleLowerCase().endsWith('.json')) path += '.json'

    setPathInputValue(path)
    savePath(path)
  })

  const onAutoSaveChanged = (checked: boolean) => {
    setIsAutoSaveEnabled(checked)
    configurationService.setAutoSaveOptionAsync(checked)
  }

  const onModelsChanged = (prop: Partial<SyncModels>) => {
    const result = {...syncModels, ...prop}
    setSyncModels(result)
    configurationService.setModelsAsync(result)
  }

  return (
    <div className='form-control form-control--outlined plugin-free-sync configuration-dialog'>
      <div>Configuration file path</div>
      <div>
        <input type={'text'} placeholder='Please, specify the path or select the file'
               value={pathInputValue || ''}
               onChange={e => onPathInputChange(e.target.value)}
               onBlur={e => savePath(e.target.value)}/>
      </div>
      {!isFilePathInputWrong && (<div className={`error-message`}>Path value is incorrect</div>)}
      <div className='buttons'>
        <Button icon='fa-file' onClick={onSelectFileClicked}>Select file...</Button>
        <label className='auto-save-checkbox'>
          Periodically auto save
          <input type={'checkbox'}
                 onChange={e => onAutoSaveChanged(e.target.checked)}
                 checked={isAutoSaveEnabled}/>
        </label>
      </div>

      <hr className='pad-top'/>

      <h2 className='models-title'>Data to synchronize</h2>
      <div className='models-list'>
        <label>
          <input type={'checkbox'} checked={syncModels.api_spec}
                 onChange={e => onModelsChanged({api_spec: e.target.checked})}/>
          Api specification JSON
        </label>
        <label>
          <input type={'checkbox'} checked={syncModels.workspace}
                 onChange={e => onModelsChanged({workspace: e.target.checked})}/>
          Workspace information
        </label>
        <label>
          <input type={'checkbox'} checked={syncModels.environment}
                 onChange={e => onModelsChanged({environment: e.target.checked})}/>
          Environment variables
        </label>
        <label>
          <input type={'checkbox'} checked={syncModels.request}
                 onChange={e => onModelsChanged({request: e.target.checked})}/>
          Requests / Groups
        </label>
        <label>
          <input type={'checkbox'} checked={syncModels.unit_test}
                 onChange={e => onModelsChanged({unit_test: e.target.checked})}/>
          Unit tests
        </label>
        <label>
          <input type={'checkbox'} checked={syncModels.cookie_jar}
                 onChange={e => onModelsChanged({cookie_jar: e.target.checked})}/>
          Cookie values
        </label>
      </div>
    </div>
  )
}
