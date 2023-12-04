import Link from "next/link";
import styles from "./Home.module.css";
import { LoginLogout } from "@components/auth/link/LoginLogout";

export default function Home() {
    return (
        <main className={styles.column}>
            <h2>Welcome to PrivacyPal</h2>
            <LoginLogout />
            <Link href="/login">Log in</Link>
            <Link href="/signup">Sign up</Link>
            <Link href="/staff">Staff Area</Link>
            <Link href="/user">User Area</Link>
        </main>
    );
}
