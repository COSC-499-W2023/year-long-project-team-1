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

// Import necessary modules from Next.js
import { useRouter } from 'next/router';
import React from 'react';
import VideoReview from '@components/VideoReview';

const VideoReviewPage: React.FC = () => {
  // Use the useRouter hook to access the router object
  const router = useRouter();
  const { appointment, id } = router.query; // Destructure both parameters from router.query

  return (
    <main>
      {/* Ensure both parameters are strings before passing them to your component */}
      <VideoReview videoId={String(id)} appointmentId={String(appointment)} />
    </main>
  );
};

export default VideoReviewPage;

