import './configuration-dialog.styles.scss'
import React, { FC, useEffect, useState } from 'react'
import { ConfigurationDialogProps } from './configuration-dialog.types'
import { validatePath } from '../services/file-service'
import { ConfigurationService } from '../services/configuration-service'
import { Button } from './shared/button'

export const ConfigurationDialog: FC<ConfigurationDialogProps> = ({context}) => {
  const [pathInputValue, setPathInputValue] = useState<string | null | undefined>()
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false)
  const [isFilePathInputWrong, setIsFilePathInputWrong] = useState(true)
  const configurationService = new ConfigurationService(context.store)

  const validateFilePathInput = (path: string | null | undefined) => !path || validatePath(path)

  useEffect(() => {
    configurationService.getCollectionFilePathAsync().then((currentPath: string | null) => {
      setPathInputValue(currentPath)
      setIsFilePathInputWrong(validateFilePathInput(currentPath))
    })

    configurationService.getAutoSaveOptionAsync().then(setIsAutoSaveEnabled)
  }, [])

  const savePath = (path: string) => {
    setIsFilePathInputWrong(validateFilePathInput(path))
    configurationService.setCollectionFilePathAsync(path)
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

  return (
    <div className="form-control form-control--outlined plugin-free-sync configuration-dialog">
      <div>Configuration file path</div>
      <div>
        <input type={'text'} placeholder="Please, specify the path or select the file"
               value={pathInputValue || ''}
               onChange={e => onPathInputChange(e.target.value)}
               onBlur={e => savePath(e.target.value)}/>
      </div>
      {!isFilePathInputWrong && (<div className={`error-message`}>Path value is incorrect</div>)}
      <div className="buttons">
        <Button icon="fa-file" onClick={onSelectFileClicked}>Select file...</Button>
        <label className="auto-save-checkbox">
          Periodically auto save
          <input type={'checkbox'}
                 onChange={e => onAutoSaveChanged(e.target.checked)}
                 checked={isAutoSaveEnabled}/>
        </label>
      </div>
    </div>
  )
}
