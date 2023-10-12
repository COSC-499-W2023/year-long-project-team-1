import { PatternflyExampleComponent } from "@components/PatternflyExampleComponent";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-24">
            <div className="mb-12">
                <h1 className="text-5xl font-bold my-2">PrivacyPal</h1>
                <h2 className="text-3xl">COSC 499 Capstone Team 1</h2>
            </div>
            <p>Here is a patternfly example component:</p>
            <PatternflyExampleComponent />
        </main>
    );
}
