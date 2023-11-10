import * as React from "react";
import DataView from "./DataView";
import TestButton from "./TestButton";

export default function TestPage() {
    return (
    <main className="center-column">
        <div className="masthead">
            <h1>PrivacyPal</h1>
            <h2>COSC 499 Capstone Team 1</h2>
        </div>
        <div>
            <br/><p>Click the button to add new row</p>
            <TestButton />
        </div>
        <p>Data is rendered from local postgres instance</p>
        <DataView />
    </main>
    );
}