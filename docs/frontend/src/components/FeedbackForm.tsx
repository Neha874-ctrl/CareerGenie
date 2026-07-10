import React, { useState } from 'react';
import { feedbackAPI } from '../services/api';
import toast from 'react-hot-toast';
import { MessageSquare, Send } from 'lucide-react';

const FeedbackForm: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Subject and message are required');
      return;
    }
    
    setSubmitting(true);
    try {
      await feedbackAPI.submitFeedback({ subject, message });
      toast.success('Thank you! Your feedback has been sent to the admins.');
      setSubject('');
      setMessage('');
      setIsExpanded(false);
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs flex items-center justify-between mt-8 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-accent-bg text-accent rounded-2xl">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="font-bold text-text-h text-lg">Have a suggestion or found a bug?</h3>
            <p className="text-text-body text-sm">We'd love to hear from you. Help us improve CareerGenie.</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-accent text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-accent/90 transition-all shadow-md shadow-accent/20"
        >
          Give Feedback
        </button>
      </div>
    );
  }

  return (
    <div className="bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs mt-8">
      <div className="flex items-center space-x-3 mb-6 border-b border-border-custom pb-4">
        <div className="p-2 bg-accent-bg text-accent rounded-xl">
          <MessageSquare size={20} />
        </div>
        <h3 className="text-lg font-bold text-text-h">Submit Feedback</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-h mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="E.g. Bug on Resume page, Feature request..."
            className="w-full px-4 py-2 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-text-h mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind..."
            rows={4}
            className="w-full px-4 py-3 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h resize-none"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="px-6 py-2 rounded-xl text-text-body font-semibold hover:bg-code-bg transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center space-x-2 bg-accent text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-accent/90 transition-all shadow-md shadow-accent/20 disabled:opacity-50"
          >
            <Send size={16} />
            <span>{submitting ? 'Sending...' : 'Send Feedback'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
