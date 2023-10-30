import Link from "next/link";
import styles from "./Home.module.css";
import { Title } from "@patternfly/react-core";

export default function Home() {
    return (
        <main className={styles.column}>
            <h2>Welcome to PrivacyPal</h2>
            <Link href="/login">Log in</Link>
        </main>
    );
}
