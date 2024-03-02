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

import { UploadStatus } from '@components/upload/UploadStatus';
import { useRouter } from 'next/router';
import React from 'react';

const VideoReviewPage: React.FC = () => {
  const router = useRouter();
  const { appointmentId, id } = router.query; // Use router.query to extract both parameters

  return (
    <main>
      {/* Ensure the parameters are strings before passing them to your component */}
      <UploadStatus appointmentId={String(appointmentId)} filename={String(id)} />
    </main>
  );
};

export default VideoReviewPage;
