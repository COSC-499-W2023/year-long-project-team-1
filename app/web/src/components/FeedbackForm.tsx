"use client";
import { useState } from 'react';

const FeedbackForm = () => {
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch('/api/submitFeedback', {
                method: 'POST',
                // headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, feedback }), // Ensure email and feedback are defined
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            // Reset form fields on successful submission
            setEmail('');
            setFeedback('');
            setSubmitting(false);

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required />
            <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Your feedback" required />
            <button type="submit" disabled={submitting}>Submit Feedback</button>
        </form>
    );
};

export default FeedbackForm;
