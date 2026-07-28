import Link from "next/link";
import styles from "./navBar.module.css";

export default function NavBar() {
  return (
    <header className={styles.navBar}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          SpeaTwin
        </Link>

        <div className={styles.links}>
          <Link href="/processingOrders" className={styles.link}>
            Processing
          </Link>
          <Link href="/completedOrders" className={styles.link}>
            Completed
          </Link>
        </div>
      </nav>
    </header>
  );
}
