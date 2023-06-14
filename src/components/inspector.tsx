'use client';

import { useContext, useState } from 'react';
import styles from '@/app/page.module.css'
import { TextField } from './textfield';
import { UtfdumpContext, UtfdumpContextProvider } from '@/context/utfdump';

type InspectorProps = {
  sourceUrl: string,
};

export function Inspector(props: InspectorProps) {
  const [currentString, setCurrentString] = useState('');

  return (
    <UtfdumpContextProvider>
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
    </UtfdumpContextProvider>
  );
}

function Out(props: { currentString: string }) {
  const ctx = useContext(UtfdumpContext);
  
  let rows = [];

  if (ctx.utfdump) {
    for (const codepointStr of props.currentString) {
      const codepoint = codepointStr.codePointAt(0);
      
      if (codepoint !== undefined) {
        const charData = ctx.utfdump.codepoint_char_data(codepoint);

        rows.push((
          <tr>
            <td>{codepointStr.replace(/\s+/, ' ')}</td>
            <td>{charData?.name()}</td>
            <td>U+{codepoint.toString(16).padStart(4, '0')}</td>
          </tr>
        ));

        charData?.free();
      }
    }
  }

  return (
    <section className={styles.table_container}>
      <div className={styles.overflow_scroll}>
        <table id={styles.output_table}>
          <thead>
            <tr>
              <th>Char</th>
              <th>Name</th>
              <th>Codepoint</th>
              <th>UTF-8</th>
              <th>UTF-16</th>
              <th>Category</th>
              <th>Combining</th>
              <th>Bidirectional</th>
              <th>Numeric value</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    </section>
  );
}
