import styles from "./Home.module.css";

export default function Home() {
    return (
        <main className={styles.column}>
            <h2 className={styles.subheading}>Test Login</h2>
            <p>
                You can login with the username &quot;<code>johnny@example.com</code>&quot; and password &quot;
                <code>password</code>&quot;
            </p>
            <br />
            <p>
                You can visit <a href="/api/session">this link</a> to see a breakdown of your current session.
            </p>
        </main>
    );
}
