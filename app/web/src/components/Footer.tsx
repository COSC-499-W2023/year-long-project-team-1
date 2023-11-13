/*
 * Created on Sun Oct 29 2023
 * Author: Connor Doman
 */

import "./Footer.css";
import Link from "next/link";
import Image from "next/image";
import logo from "@assets/logo.png";
import Githublogo from "@assets/Github_logo.png";
import Youtubelogo from "@assets/Youtube_logo.png";
import Emaillogo from "@assets/Email_logo.png";

export default async function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-item">
                <Link href="/">
                    <Image alt="PrivacyPal logo" className="footer-logo" src={logo} />
                </Link>
            </div>
            <div className="footer-item">
                Other Sites:
                <div className="footer-links">
                    <Link href="#welcomepage">Welcome</Link>
                    <Link href="#aboutus">About Us</Link>
                    <span>|</span>
                    <Link href="#signup">Sign Up</Link>
                </div>
            </div>
            <div className="footer-item">
                Follow Us:
                <div className="contact">
                    <Link href="https://github.com/COSC-499-W2023/year-long-project-team-1">
                        <Image alt="GitHub logo" src={Githublogo} />
                    </Link>
                    <Link href="#youtube">
                        <Image alt="YouTube logo" src={Youtubelogo} />
                    </Link>
                    <Link href="#Email">
                        <Image alt="mail icon" src={Emaillogo} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
