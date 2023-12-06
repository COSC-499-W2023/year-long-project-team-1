/*
 * Copyright [2023] [Privacypal Authors]
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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