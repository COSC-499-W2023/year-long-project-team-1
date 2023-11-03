import Link from "next/link";
import styles from "./Home.module.css";

export default function Home() {
    return (
        <main className={styles.column}>
            <h2>Welcome to PrivacyPal</h2>
            <Link href="/login">Log in</Link>
            <Link href="/staff">Staff Area</Link>
            <Link href="/users">User Area</Link>
        </main>
    );
}
