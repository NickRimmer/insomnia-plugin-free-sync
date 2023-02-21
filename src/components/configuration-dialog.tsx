import './configuration-dialog.styles.scss'
import React, { FC, useEffect, useState } from 'react'
import { ConfigurationDialogProps } from './configuration-dialog.types'
import { validatePath } from '../services/file-service'
import { DataService } from '../services/data-service'
import { Button } from './shared/button'
import {
  PluginConfiguration,
  PluginConfigurationDefault,
  PluginModelsConfiguration,
} from '../services/configuration-service.types'

export const ConfigurationDialog: FC<ConfigurationDialogProps> = ({workspaceId, context}) => {
  const [isFilePathInputWrong, setIsFilePathInputWrong] = useState(true)
  const [configuration, _setConfiguration] = useState<PluginConfiguration>(PluginConfigurationDefault)

  const configurationService = new DataService(workspaceId, context.store)
  const validateFilePathInput = (path: string | null | undefined) => !path || validatePath(path)

  // on mount
  useEffect(() => {
    configurationService.getConfigurationAsync().then(data => {
      const result = data ?? PluginConfigurationDefault
      _setConfiguration(result)
      setIsFilePathInputWrong(validateFilePathInput(result.filePath))
    })
  }, [])

  // methods
  const setConfigurationAsync = async (updates: Partial<PluginConfiguration>): Promise<void> => {
    const result = {...configuration, ...updates}
    await configurationService.setConfigurationAsync(result)
    _setConfiguration(result)
  }

  const onPathInputChangeAsync = async (path: string) => {
    await setConfigurationAsync({filePath: path})
    setIsFilePathInputWrong(validateFilePathInput(path))
  }

  const onSelectFileClickedAsync = async (): Promise<void> => {
    let path = await context.app.showSaveDialog()

    if (!path) return
    if (!path?.toLocaleLowerCase().endsWith('.json')) path += '.json'

    await onPathInputChangeAsync(path)
  }

  const onAutoSaveChangedAsync = (checked: boolean) => setConfigurationAsync({autoSave: checked})
  const onSaveAndLoadAsMultipleFilesChangedAsync = (checked: boolean) => {
    setConfigurationAsync({SaveAndLoadAsMultipleFiles: checked})
  }

  const onModelsChangedAsync = (enabledModels: Partial<PluginModelsConfiguration>): Promise<void> => {
    const result = {...configuration, enabledModels: {...configuration.enabledModels, ...enabledModels}}
    return setConfigurationAsync(result)
  }

  return (
    <div className='form-control form-control--outlined plugin-free-sync configuration-dialog'>
      <div>Configuration file path</div>
      <div>
        <input type={'text'} placeholder='Please, specify the path or select the file'
               value={configuration.filePath || ''}
               onChange={e => onPathInputChangeAsync(e.target.value)}/>
      </div>

      {!isFilePathInputWrong && (<div className={`error-message`}>Path value is incorrect</div>)}

      <div className='buttons'>
        <Button icon='fa-file' onClick={onSelectFileClickedAsync}>Select file...</Button>
        <label className='checkbox'>
          <input type={'checkbox'}
                 onChange={e => onSaveAndLoadAsMultipleFilesChangedAsync(e.target.checked)}
                 checked={configuration.SaveAndLoadAsMultipleFiles}/>
          Save/Load as multiple files
        </label>
        <label className='checkbox'>
          <input type={'checkbox'}
                 disabled={true}
                 onChange={e => onAutoSaveChangedAsync(e.target.checked)}
                 checked={configuration.autoSave}/>
          Auto save on changes
        </label>
      </div>

      <hr className='pad-top'/>

      <h2 className='models-title'>Data to synchronize</h2>
      <div className='models-list'>
        <label>
          <input type={'checkbox'} checked={configuration.enabledModels.environmentBase}
                 onChange={e => onModelsChangedAsync({environmentBase: e.target.checked})}/>
          Base environment variables
        </label>
        <label>
          <input type={'checkbox'} checked={configuration.enabledModels.cookiesNotSecure}
                 onChange={e => onModelsChangedAsync({cookiesNotSecure: e.target.checked})}/>
          Not secure cookies
        </label>
        <label>
          <input type={'checkbox'} checked={configuration.enabledModels.environmentCustom}
                 onChange={e => onModelsChangedAsync({environmentCustom: e.target.checked})}/>
          Custom environment variables
        </label>
        <label>
          <input type={'checkbox'} checked={configuration.enabledModels.cookiesSecure}
                 onChange={e => onModelsChangedAsync({cookiesSecure: e.target.checked})}/>
          Secure cookie values
        </label>
        <label>
          <input type={'checkbox'} checked={configuration.enabledModels.request}
                 onChange={e => onModelsChangedAsync({request: e.target.checked})}/>
          Requests / Groups
        </label>
        <label>
          <input type={'checkbox'} checked={configuration.enabledModels.unitTest}
                 onChange={e => onModelsChangedAsync({unitTest: e.target.checked})}/>
          Unit tests
        </label>
        <label>
          <input type={'checkbox'} checked={configuration.enabledModels.apiSpec}
                 onChange={e => onModelsChangedAsync({apiSpec: e.target.checked})}/>
          Api specification JSON
        </label>
      </div>
    </div>
  )
}
