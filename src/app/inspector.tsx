'use client';

import { useState } from 'react';
import styles from './page.module.css'
import { TextField } from './textfield';

type InspectorProps = {
  sourceUrl: string,
};

export function Inspector(props: InspectorProps) {
  const [currentString, setCurrentString] = useState('');

  return (
    <section className={styles.inspector_section}>
      <section className={styles.input_section}>
        <TextField
          onChange={setCurrentString}
          placeholder='Enter Unicode text here'
        />

        <div className={styles.info_box}>
          <p>
            Source code is available
            <a href={props.sourceUrl}>here</a>.
            Text entered above is not sent over the network.
          </p>
        </div>
      </section>

      <section className={styles.output_section}>
        <p id='out_test'>{currentString}</p>
      </section>
    </section>
  )
}
