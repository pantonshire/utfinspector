'use client';

import { useContext, useState } from 'react';
import styles from '@/app/page.module.css'
import { TextField } from './textfield';
import { WASMContext, WASMContextProvider } from '@/context/utfdump';

type InspectorProps = {
  sourceUrl: string,
};

export function Inspector(props: InspectorProps) {
  const [currentString, setCurrentString] = useState('');

  return (
    <WASMContextProvider>
      <section className={styles.inspector_section}>
        <section className={styles.input_section}>
          <TextField
            onChange={setCurrentString}
            placeholder='Enter Unicode text here'
          />

          <div className={styles.info_box}>
            <p>
              Source code is available <a href={props.sourceUrl}>here</a>.
              Text entered above is not sent over the network.
            </p>
          </div>
        </section>

        <Out currentString={currentString} />
      </section>
    </WASMContextProvider>
  );
}

function Out(props: { currentString: string }) {
  const ctx = useContext(WASMContext);

  if (!ctx.wasm) {
    return (
      <p>Loading WASM...</p>
    );
  }

  return (
    <section className={styles.output_section}>
      {/* <p id='out_test'>{spongebob_case(currentString)}</p> */}
      <p id='out_test'>{ctx.wasm.spongebob_case(props.currentString)}</p>
    </section>
  );
}
