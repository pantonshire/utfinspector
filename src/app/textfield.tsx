'use client';

import styles from './page.module.css'

type TextFieldProps = {
  onChange: (value: string) => void,
  placeholder?: string,
};

export function TextField(props: TextFieldProps) {
  function handleChange(event: React.FormEvent<HTMLTextAreaElement>) {
    props.onChange(event.currentTarget.value);
  }

  return (
    <textarea
      className={styles.text_field}
      placeholder={props.placeholder}
      onChange={handleChange}
    />
  )
}
