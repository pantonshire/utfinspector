import { useContext } from 'react';
import styles from '@/app/page.module.css'
import { UtfdumpContext } from '@/context/utfdump';
import { EncodedCodepoint } from 'utfdump_wasm';

export function OutputTable(props: { currentString: string }) {
  const ctx = useContext(UtfdumpContext);
  
  let rows = [];

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

          rows.push((
            <tr>
              <th>{charDisplayStr}</th>
              <td>{charData.name()}</td>
              <td>U+{codepoint.toString(16).padStart(4, '0')}</td>
              <td>{encodedUtf8Str}</td>
              <td>{encodedUtf16Str}</td>
              <td>{charData.category_full()}</td>
              <td>{combiningClassName || combiningClassNum}</td>
              <td>{charData.bidi_full()}</td>
              <td>{charData.mirrored() ? 'Yes' : 'No'}</td>
              <td>{optCharCodes(charData.decomp_string())}</td>
              <td>{optCharCodes(charData.uppercase_string())}</td>
              <td>{optCharCodes(charData.lowercase_string())}</td>
              <td>{optCharCodes(charData.titlecase_string())}</td>
              <td>{charData.numeric_value()}</td>
            </tr>
          ));
  
          charData.free();
        }
        
        else {
          // TODO: push "invalid character" row in this case
        }
      }
    }
  }

  return (
    <section className={styles.table_container}>
      <div className={styles.overflow_scroll}>
        <table id={styles.output_table}>
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
