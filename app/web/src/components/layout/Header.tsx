/*
 * Created on Sun Oct 29 2023
 * Author: Connor Doman
 */

import "./Header.css";
import Image from "next/image";
import logo from "@assets/logo.png";
import Link from "next/link";

export const Header = () => {
    return (
        <header className="site-header">
            <Link href="/">
                <Image alt="logo" className="logo" src={logo} />
            </Link>
            <div>
                <h1 className="text">
                    A SOLUTION TO ABSOLUTE <span style={{ color: "#F58658" }}>PRIVACY.</span>
                </h1>
            </div>
        </header>
    );
};
