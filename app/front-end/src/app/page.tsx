import "./home.css";
import { PatternflyExampleComponent } from "@components/PatternflyExampleComponent";

export default function Home() {
    return (
        <main className="center-column">
            <div className="masthead">
                <h1>PrivacyPal</h1>
                <h2>COSC 499 Capstone Team 1</h2>
            </div>
            <p>Here is a patternfly example component:</p>
            <PatternflyExampleComponent />
        </main>
    );
}
