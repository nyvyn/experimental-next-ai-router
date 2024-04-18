import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <h1>AI Router Demo</h1>
            </div>

            <div className={styles.center}>
                <h2><Link href="/adventure/">Click here to start demo</Link></h2>
            </div>

            <div className={styles.grid}>
                <p>Made by <Link href="https://www.ronlancaster.com">Ron Lancaster</Link></p>
            </div>
        </main>
    );
}
