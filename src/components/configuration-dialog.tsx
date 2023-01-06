import './configuration-dialog.styles.scss'
import React, { FC, useEffect, useState } from 'react'
import { ConfigurationDialogProps } from './configuration-dialog.types'
import { Button } from './shared/button'

const STORE_KEY_FILE_PATH = 'insomnia-plugin-free-sync-configuration-file-path'
const STORE_KEY_AUTO_SAVE = 'insomnia-plugin-free-sync-configuration-auto-save'

export const ConfigurationDialog: FC<ConfigurationDialogProps> = ({context}) => {
  const [pathInputValue, setPathInputValue] = useState<string | null | undefined>()
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(false)
  const [isPathValid, setIsPathValid] = useState(true)

  useEffect(() => {
    context.store.getItem(STORE_KEY_FILE_PATH).then((currentPath: string | null) => {
      setPathInputValue(currentPath)
      setIsPathValid(validatePath(currentPath))
    })

    context.store.getItem(STORE_KEY_AUTO_SAVE).then((currentValue: string | null) => setIsAutoSaveEnabled(currentValue === String(true)))
  }, [])

  const savePath = (path: string) => {
    setIsPathValid(validatePath(path))
    context.store.setItem(STORE_KEY_FILE_PATH, path)
  }

  const onPathInputChange = (path: string) => {
    setIsPathValid(validatePath(path))
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
    console.log(checked)
    context.store.setItem(STORE_KEY_AUTO_SAVE, String(checked))
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
      {!isPathValid && (<div className={`error-message`}>Path value is incorrect</div>)}
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

const validatePath = (path: string | null | undefined) => !path || new RegExp('^(?:[a-z]:)?[\\/\\\\]{0,2}(?:[.\\/\\\\ ](?![.\\/\\\\\\n])|[^<>:"|?*.\\/\\\\ \\n])+$', 'gmi').exec(path) !== null
