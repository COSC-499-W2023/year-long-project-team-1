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
import logo from "@assets/light_logo.png";
import Githublogo from "@assets/Github_logo.png";
import Youtubelogo from "@assets/Youtube_logo.png";
import Emaillogo from "@assets/Email_logo.png";
import { LoginLogoutLink } from "@components/auth/link/LoginLogoutLink";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-item">
        <Link href="/">
          <Image alt="PrivacyPal logo" className="footer-logo" src={logo} />
        </Link>
      </div>
      <div className="footer-item">
        <div className="footer-links">
          <Link href="#welcomepage">Welcome</Link>
          <span>|</span>
          <Link href="#aboutus">About Us</Link>
          <span>|</span>
          <LoginLogoutLink />
        </div>
      </div>
      <div className="footer-item">
        Follow Us:
        <div className="contact">
          <a href="https://github.com/COSC-499-W2023/year-long-project-team-1">
            <Image alt="GitHub logo" src={Githublogo} />
          </a>
        </div>
      </div>
    </footer>
  );
}
