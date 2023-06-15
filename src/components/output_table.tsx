import { useContext } from 'react';
import styles from '@/app/page.module.css'
import { UtfdumpContext } from '@/context/utfdump';
import { EncodedCodepoint } from 'utfdump_wasm';

export function OutputTable(props: {
  currentString: string,
  transpose: boolean,
  toggleTranspose: () => void
}) {
  const ctx = useContext(UtfdumpContext);

  let nonEmpty = false;
  let rows = [];
  let transposedData: React.JSX.Element[][] = [[], [], [], [], [], [], [], [], [], [], [], [], [], []];

  if (ctx.utfdump) {
    for (const codepointStr of props.currentString) {
      const codepoint = codepointStr.codePointAt(0);
      
      if (codepoint !== undefined) {
        const charData = ctx.utfdump.codepoint_char_data(codepoint);

        if (charData !== undefined) {
          const encodedUtf8 = charData.encoded_utf8();
          let encodedUtf8Str;
          if (encodedUtf8 !== undefined) {
            encodedUtf8Str = codepointToString(encodedUtf8);
            encodedUtf8.free();
          }
          
          const encodedUtf16 = charData.encoded_utf16_le();
          let encodedUtf16Str;
          if (encodedUtf16 !== undefined) {
            encodedUtf16Str = codepointToString(encodedUtf16);
            encodedUtf16.free();
          }

          const combiningClassNum = charData.combining_class();
          const combiningClassName = ctx.utfdump.combining_class_name(combiningClassNum);
          
          let charDisplayStr = codepointStr.replace(/\s+/, ' ');
          if (combiningClassNum !== 0) {
            charDisplayStr = '\u25cc' + charDisplayStr;
          }

          const elemChar = <th>{charDisplayStr}</th>;
          const elemName = <td>{charData.name()}</td>;
          const elemCode = <td>U+{codepoint.toString(16).padStart(4, '0')}</td>;
          const elemUtf8 = <td>{encodedUtf8Str}</td>;
          const elemUtf16 = <td>{encodedUtf16Str}</td>;
          const elemCategory = <td>{charData.category_full()}</td>;
          const elemCombining = <td>{combiningClassName || combiningClassNum}</td>;
          const elemBidi = <td>{charData.bidi_full()}</td>;
          const elemMirrored = <td>{charData.mirrored() ? 'Yes' : 'No'}</td>;
          const elemDecomp = <td>{optCharCodes(charData.decomp_string())}</td>;
          const elemUpper = <td>{optCharCodes(charData.uppercase_string())}</td>;
          const elemLower = <td>{optCharCodes(charData.lowercase_string())}</td>;
          const elemTitle = <td>{optCharCodes(charData.titlecase_string())}</td>;
          const elemNumeric = <td>{charData.numeric_value()}</td>;

          if (props.transpose) {
            transposedData[0].push(elemChar);
            transposedData[1].push(elemName);
            transposedData[2].push(elemCode);
            transposedData[3].push(elemUtf8);
            transposedData[4].push(elemUtf16);
            transposedData[5].push(elemCategory);
            transposedData[6].push(elemCombining);
            transposedData[7].push(elemBidi);
            transposedData[8].push(elemMirrored);
            transposedData[9].push(elemDecomp);
            transposedData[10].push(elemUpper);
            transposedData[11].push(elemLower);
            transposedData[12].push(elemTitle);
            transposedData[13].push(elemNumeric);
          }

          else {
            rows.push((
              <tr>
                {elemChar}
                {elemName}
                {elemCode}
                {elemUtf8}
                {elemUtf16}
                {elemCategory}
                {elemCombining}
                {elemBidi}
                {elemMirrored}
                {elemDecomp}
                {elemUpper}
                {elemLower}
                {elemTitle}
                {elemNumeric}
              </tr>
            ));
          }

          nonEmpty = true;
  
          charData.free();
        }
        
        else {
          // TODO: push "invalid character" row in this case
        }
      }
    }
  }

  let table;
  
  if (nonEmpty) {
    if (props.transpose) {
      table = (
        <table id={styles.output_table} className={styles.output_table_transposed}>
          <thead>
            <tr><th></th>{transposedData[0]}</tr>
          </thead>
          <tbody>
            <tr><th>Name</th>{transposedData[1]}</tr>
            <tr><th>Code</th>{transposedData[2]}</tr>
            <tr><th>UTF-8</th>{transposedData[3]}</tr>
            <tr><th>UTF-16LE</th>{transposedData[4]}</tr>
            <tr><th>Category</th>{transposedData[5]}</tr>
            <tr><th>Combining</th>{transposedData[6]}</tr>
            <tr><th>Bidirectional</th>{transposedData[7]}</tr>
            <tr><th>Mirrored</th>{transposedData[8]}</tr>
            <tr><th>Decomp</th>{transposedData[9]}</tr>
            <tr><th>Upper</th>{transposedData[10]}</tr>
            <tr><th>Lower</th>{transposedData[11]}</tr>
            <tr><th>Title</th>{transposedData[12]}</tr>
            <tr><th>Numeric</th>{transposedData[13]}</tr>
          </tbody>
        </table>
      );
    }

    else {
      table = (
        <table id={styles.output_table} className={styles.output_table_regular}>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Code</th>
              <th>UTF-8</th>
              <th>UTF-16LE</th>
              <th>Category</th>
              <th>Combining</th>
              <th>Bidirectional</th>
              <th>Mirrored</th>
              <th>Decomp</th>
              <th>Upper</th>
              <th>Lower</th>
              <th>Title</th>
              <th>Numeric</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      );
    }
  } else {
    table = (<></>);
  }

  let transposeButton;
  if (nonEmpty) {
    transposeButton = (
      <button className={styles.button} onClick={props.toggleTranspose}>
        Flip table
      </button>
    );
  } else {
    transposeButton = (<></>);
  }

  return (
    <section className={styles.output_section}>
      <div className={styles.button_container}>
        {transposeButton}
      </div>
      <div className={styles.table_container}>
        <div className={styles.overflow_scroll}>
          {table}
        </div>
      </div>
    </section>
  );
}

function codepointToString(codepoint: EncodedCodepoint): string {
  const bytes = [
    codepoint.b0,
    codepoint.b1,
    codepoint.b2,
    codepoint.b3
  ].slice(0, codepoint.len);

  return bytes.map((b) => b.toString(16).padStart(2, '0')).join(' ');
}

function charCodes(s: string): string {
  let codes = [];
  for (const codepointStr of s) {
    const codepoint = codepointStr.codePointAt(0);
    codes.push('U+' + codepoint?.toString(16).padStart(4, '0'));
  }

  return codes.join(', ');
}

function optCharCodes(s: string | undefined): string | undefined {
  if (s !== undefined) {
    return charCodes(s);
  }
  return undefined;
}
