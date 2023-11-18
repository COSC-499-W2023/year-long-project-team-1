/*
 * Created on Sun Oct 29 2023
 * Author: Connor Doman
 */

import "./Header.css";
import Image from "next/image";
import logo from "@assets/logo.png";
import Link from "next/link";

const style = {
    header: {
        backgroundColor: "var(--pf-v5-global--primary-color--100)",
        textAlign: "center",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem 0",
    } as React.CSSProperties,
    logo: {
        maxWidth: "6rem",
        height: "auto",
    },
    text: {
        fontSize: "30px",
        fontWeight: "bolder",
        color: "white",
    },
};

export const Header = () => {
    return (
        <header style={style.header}>
            <Link href="/">
                <Image alt="logo" style={style.logo} src={logo} />
            </Link>
            <div>
                <h1 style={style.text}>
                    A SOLUTION TO ABSOLUTE <span style={{ color: "#F58658" }}>PRIVACY.</span>
                </h1>
            </div>
        </header>
    );
};
