// pages/feedback.tsx

import FeedbackForm from '@components/FeedbackForm';
import { NextPage } from 'next';

const FeedbackPage: NextPage = () => {
    return (
        <div>
            <h1>Feedback Form</h1>
            <FeedbackForm />
        </div>
    );
};

export default FeedbackPage;
