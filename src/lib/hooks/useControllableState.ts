import { useState } from 'react'

export function useControllableState<T>(
  defaultValue: T,
  controlledValue?: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [internal, setInternal] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internal

  function setValue(next: T) {
    if (isControlled) {
      onChange?.(next)
    } else {
      setInternal(next)
    }
  }

  return [value, setValue]
}
