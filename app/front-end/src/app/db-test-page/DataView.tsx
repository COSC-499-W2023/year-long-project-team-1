"use client";
import * as React from "react";

export default function DataView(){
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        fetch(
            `/api/users`,
            {
                method:"GET",
            }
        ).then((resp) => resp.json()).then((body) => setUsers(body.result.data));
    }, [setUsers]);

    return users.map((user: any)=>(
        <div key={user.id}>username: {user.username}; firstname: {user.firstname}; lastname: {user.lastname}; email: {user.email}</div>
    ))
}
