// using solution from https://github.com/satelllte/nextjs-wasm for now

import { useState, createContext, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

const initial: IWASMContext = {}

const useMountEffectOnce = (fn: () => void) => {
  const wasExecutedRef = useRef(false)
  useEffect(() => {
    if (!wasExecutedRef.current) {
      fn()
    }
    wasExecutedRef.current = true
  }, [fn])
}

export const WASMContext = createContext(initial)

export const WASMContextProvider: React.FC<WASMContextProviderProps> = ({
  children
}) => {
  const [state, setState] = useState<IWASMContext>(initial)

  // This has to run only once: https://github.com/rustwasm/wasm-bindgen/issues/3153
  // Though, in development React renders twice when Strict Mode is enabled: https://reactjs.org/docs/strict-mode.html
  // That's why it must be limited to a single mount run
  useMountEffectOnce(() => {
    (async() => {
      const wasm = await import("utfdump_wasm");
      await wasm.default();
      setState({ wasm });
    })()
  })

  return (
    <WASMContext.Provider value={state}>
      {children}
    </WASMContext.Provider>
  )
}

interface IWASMContext {
  wasm?: typeof import('utfdump_wasm')
}

interface WASMContextProviderProps {
  children: ReactNode
}
