import './configuration-dialog.styles.scss'
import React, { FC, useEffect, useState } from 'react'
import { ConfigurationDialogProps } from './configuration-dialog.types'
import { isValidPath } from '../services/file-service'
import { DataService } from '../services/data-service'
import { Button } from './shared/button'
import {
  PluginConfiguration,
  PluginConfigurationDefault,
  PluginModelsConfiguration,
} from '../services/data-service.types'
import { showDialogSelectDirectoryAsync, showDialogSelectFileAsync } from '../insomnia/tools/dialogs'

export const ConfigurationDialog: FC<ConfigurationDialogProps> = ({workspaceId, context}) => {
  const [isFilePathInputWrong, setIsFilePathInputWrong] = useState(true)
  const [configuration, _setConfiguration] = useState<PluginConfiguration>(PluginConfigurationDefault)

  const configurationService = new DataService(workspaceId, context.store)
  const validateFilePathInput =
    (path: string | null | undefined) => !path ||
      isValidPath(path, configuration.saveAsSingleFile)

  // on mount
  useEffect(() => {
    configurationService.getConfigurationAsync().then(data => {
      const result = data ?? PluginConfigurationDefault
      _setConfiguration(result)
      setIsFilePathInputWrong(validateFilePathInput(result.filePath))
    })
  }, [])

  useEffect(() => {
    setIsFilePathInputWrong(validateFilePathInput(configuration.filePath))
  }, [configuration])

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
    const path = configuration.saveAsSingleFile
      ? await showDialogSelectFileAsync('json')
      : await showDialogSelectDirectoryAsync('Workspace directory')

    if (!path) return
    await onPathInputChangeAsync(path)
  }

  const onAutoSaveChangedAsync = (checked: boolean) => setConfigurationAsync({autoSave: checked})
  const onSaveAsSingleFileChangedAsync = async (checked: boolean): Promise<void> => {
    await setConfigurationAsync({saveAsSingleFile: checked})
  }

  const onModelsChangedAsync = (enabledModels: Partial<PluginModelsConfiguration>): Promise<void> => {
    const result = {...configuration, enabledModels: {...configuration.enabledModels, ...enabledModels}}
    return setConfigurationAsync(result)
  }

  return (
    <div className='form-control form-control--outlined plugin-free-sync configuration-dialog'>
      <div className={'input-label-with-error'}>
        <div>Configuration file path</div>
        {!isFilePathInputWrong && (<div className={`error-message`}>Path value is incorrect</div>)}
      </div>


      <div>
        <input type={'text'} placeholder='Please, specify the path'
               value={configuration.filePath || ''}
               onChange={e => onPathInputChangeAsync(e.target.value)}/>
      </div>

      <div className='buttons'>
        <Button icon='fa-file'
                onClick={onSelectFileClickedAsync}>{configuration.saveAsSingleFile ? 'Select file...' : 'Select directory...'}</Button>

        <div className='checkboxes'>
          <label className='checkbox' title={'Save all settings in a single file'}>
            <input type={'checkbox'}
                   onChange={e => onSaveAsSingleFileChangedAsync(e.target.checked)}
                   checked={configuration.saveAsSingleFile}/>
            As a single file
          </label>

          <label className='checkbox' title={'Not available yet'}>
            <input type={'checkbox'}
                   disabled={true}
                   onChange={e => onAutoSaveChangedAsync(e.target.checked)}
                   checked={configuration.autoSave}/>
            Auto save
          </label>
        </div>
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
