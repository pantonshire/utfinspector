import Image from 'next/image'
import styles from './page.module.css'
import { Inspector } from '@/components/inspector';

const sourceUrl = 'https://example.com';

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.title_section}>
        <h1 className={styles.title}>
          Utf Inspector
        </h1>
      </header>

      <Inspector sourceUrl={sourceUrl} />
    </main>
  )
}
