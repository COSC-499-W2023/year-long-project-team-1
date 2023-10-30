import { PatternflyExampleComponent } from "@components/PatternflyExampleComponent";
import db from "@lib/db";
import { revalidatePath } from "next/cache";

export default async function TestPage() {
    // fetch data
    const users = await db.user.findMany();

    // post data
    const addUser = async () => {
        'use server';
        await db.user.createMany({
            data: [
                {
                    // mock data
                    username: "johhn",
                    firstname: "John",
                    lastname: "Doe",
                    email: "john.doe@gmail.com"
                }
            ]
        });
        revalidatePath('/');
    };
    return (
        <main className="center-column">
            <div className="masthead">
                <h1>PrivacyPal</h1>
                <h2>COSC 499 Capstone Team 1</h2>
            </div>
            <div>
                <br/><p>Click the button to add new row</p>
                <PatternflyExampleComponent onClick={addUser}/>
            </div>
            <p>Data is rendered from local postgres instance</p>
            {
                users.map((user)=>(
                    <div key={user.id}>username: {user.username}; firstname: {user.firstname}; lastname: {user.lastname}; email: {user.email}</div>
                ))
            }
        </main>
    );
}
