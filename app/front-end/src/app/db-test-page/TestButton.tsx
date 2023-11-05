"use client"

import { PatternflyExampleComponent } from "@components/PatternflyExampleComponent"

export default function TestButton() {
    const addUser = async () => {
		try {
			await fetch(
				`/api/users`,
                {
                    method:"POST"
                }
			);
		} catch (err) {
			console.log(err);
		}
	};
    return (<PatternflyExampleComponent onClick={addUser}/>)
}