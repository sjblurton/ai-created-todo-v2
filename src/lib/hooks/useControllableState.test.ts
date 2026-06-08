import { describe, it, expect, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useControllableState } from './useControllableState'

describe('useControllableState', () => {
  it('returns the default value when uncontrolled', () => {
    const { result } = renderHook(() => useControllableState(false))

    expect(result.current[0]).toBe(false)
  })

  it('returns the controlled value when provided', () => {
    const { result } = renderHook(() => useControllableState(false, true))

    expect(result.current[0]).toBe(true)
  })

  it('updates internal state when uncontrolled', () => {
    const { result } = renderHook(() => useControllableState(false))

    act(() => result.current[1](true))

    expect(result.current[0]).toBe(true)
  })

  it('calls onChange instead of updating internal state when controlled', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useControllableState(false, false, onChange))

    act(() => result.current[1](true))

    expect(onChange).toHaveBeenCalledWith(true)
    expect(result.current[0]).toBe(false)
  })
})
