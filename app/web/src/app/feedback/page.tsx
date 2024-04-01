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
// pages/feedback.tsx

import FeedbackForm from "@components/welcome/FeedbackForm";
import { NextPage } from "next";

const FeedbackPage: NextPage = () => {
  return (
    <div>
      <h1>Feedback Form</h1>
      <FeedbackForm />
    </div>
  );
};

export default FeedbackPage;