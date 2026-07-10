import React, { useEffect, useState } from 'react';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { AlertCircle, Award, Calendar, ChevronRight, FileText, History, TrendingUp } from 'lucide-react';

const ResumeHistory: React.FC = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feedback' | 'structure'>('feedback');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await resumeAPI.getHistory();
      const list = response.data.resumes || [];
      setResumes(list);
      if (list.length > 0) {
        setSelectedResume(list[0]);
      }
    } catch (err) {
      toast.error('Failed to load resume analysis history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getStatusColorClass = (status: string) => {
    if (!status) return 'text-gray-500 bg-code-bg';
    if (status.includes('Excellent') || status.includes('🟢')) return 'text-green-600 bg-green-50 border-green-100';
    if (status.includes('Good') || status.includes('🟡')) return 'text-amber-600 bg-amber-50 border-amber-100';
    if (status.includes('Fair') || status.includes('🟠')) return 'text-orange-600 bg-orange-50 border-orange-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-code-bg/50 px-6 py-10 max-w-6xl mx-auto w-full text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-h mb-2 flex items-center space-x-2">
          <History className="text-accent" />
          <span>Resume Feedback History</span>
        </h1>
        <p className="text-sm text-text-body/80">
          Track details of all your previous resume feedback scores and improvement records.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-bg-custom border border-border-custom rounded-3xl p-12 text-center flex flex-col items-center">
          <FileText size={56} className="text-text-body/30 mb-4" />
          <h3 className="text-lg font-bold text-text-h mb-2">No History Recorded</h3>
          <p className="text-sm text-text-body/75 max-w-sm mb-6">
            Upload your resume on the Resume Builder page to receive instant feedback checks and save report records.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel - history sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-text-h mb-2 flex items-center space-x-2">
              <TrendingUp size={18} className="text-accent" />
              <span>Past Checks</span>
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {resumes.map((resItem) => (
                <div
                  key={resItem._id}
                  onClick={() => setSelectedResume(resItem)}
                  className={`p-4 border rounded-2xl hover:border-accent-border/30 transition-all cursor-pointer flex justify-between items-center ${
                    selectedResume?._id === resItem._id ? 'border-accent bg-accent-bg/10' : 'border-border-custom bg-bg-custom'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-text-h flex items-center">
                      <Calendar size={12} className="mr-1 text-text-body/60" />
                      {new Date(resItem.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-[10px] text-text-body/80">
                      {resItem.skills?.length || 0} skills detected
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-black text-accent bg-accent-bg px-2.5 py-1 rounded-full">
                      {resItem.feedback?.score || 75}
                    </span>
                    <ChevronRight size={16} className="text-text-body/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel - detailed analysis preview */}
          <div className="lg:col-span-2">
            {selectedResume ? (
              <div className="bg-bg-custom border border-border-custom rounded-3xl shadow-xs overflow-hidden">
                {/* Header Summary */}
                <div className="px-6 py-6 border-b border-border-custom bg-code-bg/50 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-0.5">
                      Checked on {new Date(selectedResume.createdAt).toLocaleDateString()}
                    </span>
                    <h2 className="text-xl font-bold text-text-h flex items-center">
                      <FileText className="mr-2 text-accent" size={20} />
                      <span>Resume Details</span>
                    </h2>
                  </div>

                  <div className="flex items-center space-x-3 bg-bg-custom border border-border-custom px-4 py-2 rounded-2xl">
                    <Award className="text-accent" size={24} />
                    <div>
                      <p className="text-[10px] text-text-body uppercase font-bold leading-none">AI Score</p>
                      <p className="text-lg font-black text-text-h leading-none mt-1">
                        {selectedResume.feedback?.score || 75}/100
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border-custom">
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className={`flex-1 py-3 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${
                      activeTab === 'feedback'
                        ? 'border-accent text-accent bg-accent-bg/5'
                        : 'border-transparent text-text-body hover:text-text-h'
                    }`}
                  >
                    Feedback Details
                  </button>
                  <button
                    onClick={() => setActiveTab('structure')}
                    className={`flex-1 py-3 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${
                      activeTab === 'structure'
                        ? 'border-accent text-accent bg-accent-bg/5'
                        : 'border-transparent text-text-body hover:text-text-h'
                    }`}
                  >
                    Extracted Profile
                  </button>
                </div>

                {/* Tab content */}
                <div className="p-6">
                  {activeTab === 'feedback' ? (
                    <div className="space-y-6">
                      {/* Sub-scores */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-border-custom p-4 rounded-2xl">
                          <span className="text-[10px] font-bold text-text-body uppercase block mb-1">Formatting</span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusColorClass(
                              selectedResume.feedback?.formatting?.status
                            )}`}
                          >
                            {selectedResume.feedback?.formatting?.status || '🟡 Good'}
                          </span>
                          <ul className="text-xs text-text-body space-y-1 mt-3 pl-4 list-disc">
                            {selectedResume.feedback?.formatting?.comments?.map((c: string, idx: number) => (
                              <li key={idx}>{c}</li>
                            )) || <li>Looks clean and structured.</li>}
                          </ul>
                        </div>

                        <div className="border border-border-custom p-4 rounded-2xl">
                          <span className="text-[10px] font-bold text-text-body uppercase block mb-1">Content Depth</span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusColorClass(
                              selectedResume.feedback?.content?.status
                            )}`}
                          >
                            {selectedResume.feedback?.content?.status || '🟡 Good'}
                          </span>
                          <ul className="text-xs text-text-body space-y-1 mt-3 pl-4 list-disc">
                            {selectedResume.feedback?.content?.comments?.map((c: string, idx: number) => (
                              <li key={idx}>{c}</li>
                            )) || <li>Good job descriptions.</li>}
                          </ul>
                        </div>

                        <div className="border border-border-custom p-4 rounded-2xl">
                          <span className="text-[10px] font-bold text-text-body uppercase block mb-1">Skills Highlight</span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusColorClass(
                              selectedResume.feedback?.skillsFeedback?.status
                            )}`}
                          >
                            {selectedResume.feedback?.skillsFeedback?.status || '🟢 Excellent'}
                          </span>
                          <ul className="text-xs text-text-body space-y-1 mt-3 pl-4 list-disc">
                            {selectedResume.feedback?.skillsFeedback?.comments?.map((c: string, idx: number) => (
                              <li key={idx}>{c}</li>
                            )) || <li>Strong technical expertise.</li>}
                          </ul>
                        </div>
                      </div>

                      {/* Overall suggestions */}
                      <div className="bg-code-bg border border-border-custom p-5 rounded-2xl">
                        <h3 className="text-sm font-bold text-text-h mb-2 flex items-center">
                          <AlertCircle className="text-accent mr-1.5" size={16} />
                          <span>Suggestions for Improvement</span>
                        </h3>
                        <p className="text-xs text-text-body leading-relaxed">
                          {selectedResume.feedback?.overallSuggestions ||
                            'Your resume looks great! Emphasize impact by quantifying achievements.'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Skills */}
                      <div>
                        <h3 className="text-sm font-bold text-text-h uppercase tracking-wide mb-2">Detected Skills</h3>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedResume.skills?.map((skill: string, index: number) => (
                            <span key={index} className="text-xs bg-accent-bg text-accent px-3 py-1.5 rounded-xl font-semibold">
                              {skill}
                            </span>
                          )) || <p className="text-xs text-text-body/60">No skills detected.</p>}
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <h3 className="text-sm font-bold text-text-h uppercase tracking-wide mb-2">Education Details</h3>
                        <div className="space-y-2">
                          {selectedResume.education?.map((edu: string, index: number) => (
                            <div key={index} className="flex items-start text-xs text-text-body border-l-2 border-accent pl-3 py-0.5">
                              {edu}
                            </div>
                          )) || <p className="text-xs text-text-body/60">No education details parsed.</p>}
                        </div>
                      </div>

                      {/* Experience */}
                      <div>
                        <h3 className="text-sm font-bold text-text-h uppercase tracking-wide mb-2">Work & Project History</h3>
                        <div className="space-y-2">
                          {selectedResume.experience?.map((exp: string, index: number) => (
                            <div key={index} className="flex items-start text-xs text-text-body border-l-2 border-accent pl-3 py-0.5">
                              {exp}
                            </div>
                          )) || <p className="text-xs text-text-body/60">No experience details parsed.</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeHistory;
