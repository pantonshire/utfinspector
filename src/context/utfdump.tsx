import { useState, createContext, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type UtfdumpContextTy = {
  utfdump?: typeof import('utfdump_wasm'),
};

type UtfdumpContextProviderProps = {
  children: ReactNode,
};

export const UtfdumpContext = createContext<UtfdumpContextTy>({});

export function UtfdumpContextProvider(props: UtfdumpContextProviderProps) {
  const hasLoaded = useRef(false);
  const [contextValue, setContextValue] = useState<UtfdumpContextTy>({});
  
  useEffect(() => {
    // Ensure the WASM module is only run once, as this effect callback is called twice when React
    // is in strict mode.
    // FIXME: is atomic compare-and-swap necessary? Does React run this in a multithreaded context?
    if (!hasLoaded.current) {
      hasLoaded.current = true;

      (async() => {
        const utfdumpWasmModule = await import('utfdump_wasm');
        await utfdumpWasmModule.default();
        setContextValue({ utfdump: utfdumpWasmModule });
      })();
    }
  }, []);

  return (
    <UtfdumpContext.Provider value={contextValue}>
      {props.children}
    </UtfdumpContext.Provider>
  );
}
