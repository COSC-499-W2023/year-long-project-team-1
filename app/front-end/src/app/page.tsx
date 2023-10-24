import TestLoginForm from "@components/auth/TestLoginForm";
import styles from "./Home.module.css";
import { PatternflyExampleComponent } from "@components/PatternflyExampleComponent";
import { PrimaryButton } from "@components/form/PalButton";

interface HomeProps {
    useAuth?: boolean;
}

export default function Home({ useAuth = true }: HomeProps) {
    return (
        <main className={styles.column}>
            <div className={styles.masthead}>
                <h1 className={styles.heading}>PrivacyPal</h1>
                <h2 className={styles.subheading}>COSC 499 Capstone Team 1</h2>
            </div>
            <p>Here is a patternfly example component:</p>
            <PatternflyExampleComponent />
            <h2 className={styles.subheading}>Test Login</h2>
            <p>
                You can login with the username &quot;<code>johnny@example.com</code>&quot; and password &quot;
                <code>password</code>&quot;
            </p>
            <br />
            {useAuth ? (
                <div className={styles.column}>
                    <TestLoginForm />
                </div>
            ) : null}
            <p>
                You can visit <a href="/api/session">this link</a> to see a breakdown of your current session.
            </p>
            <PrimaryButton>Login</PrimaryButton>
        </main>
    );
}
