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

import "./Footer.css";
import Link from "next/link";
import Image from "next/image";
import logo from "@assets/dark_logo.png";
import Githublogo from "@assets/Github_logo.png";
import Youtubelogo from "@assets/Youtube_logo.png";
import Emaillogo from "@assets/Email_logo.png";
import { LoginLogoutLink } from "@components/auth/link/LoginLogoutLink";
import { auth } from "src/auth";
import { UserRole } from "@lib/userRole";

export default async function Footer() {
  const session = await auth();

  const footerLinks = session?.user ? (
    <>
      <Link href={session.user.role === UserRole.CLIENT ? "/user" : "/staff"} className="bold-text">
        Go to Your Hub
      </Link>
      <span>|</span>
      <LoginLogoutLink />
    </>
  ) : (
    <LoginLogoutLink />
  );

  return (
    <footer className="site-footer">
      <div className="footer-item">
        <Link href="/">
          <Image alt="PrivacyPal logo" className="footer-logo" src={logo} />
        </Link>
      </div>
      <div className="footer-links">{footerLinks}</div>
      <div className="footer-item">
        Follow Us:
        <div className="contact">
          <a
            href="https://github.com/COSC-499-W2023/year-long-project-team-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image alt="GitHub logo" src={Githublogo} />
          </a>
        </div>
      </div>
    </footer>
  );
}