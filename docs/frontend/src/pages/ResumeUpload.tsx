import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { AlertCircle, Award, FileText, Sparkles, Trash2, UploadCloud } from 'lucide-react';

const ResumeUpload: React.FC = () => {
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'feedback' | 'structure'>('feedback');

  const fetchLatestResume = async () => {
    try {
      const response = await resumeAPI.getLatest();
      setResume(response.data.resume);
    } catch (err) {
      // Safe to ignore if they don't have a resume yet
    }
  };

  useEffect(() => {
    fetchLatestResume();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF document only.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);
    const toastId = toast.loading('Uploading and analyzing resume...');
    try {
      const response = await resumeAPI.upload(formData);
      setResume(response.data.resume);
      toast.success('Resume analyzed successfully!', { id: toastId });
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to analyze resume';
      toast.error(errMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteResume = async () => {
    if (!resume || !window.confirm('Are you sure you want to delete this resume? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await resumeAPI.delete(resume._id);
      toast.success('Resume deleted successfully');
      setResume(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete resume');
    } finally {
      setDeleting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const getStatusColorClass = (status: string) => {
    if (!status) return 'text-gray-500 bg-code-bg';
    if (status.includes('Excellent') || status.includes('🟢')) return 'text-green-600 bg-green-50 border-green-100';
    if (status.includes('Good') || status.includes('🟡')) return 'text-amber-600 bg-amber-50 border-amber-100';
    if (status.includes('Fair') || status.includes('🟠')) return 'text-orange-600 bg-orange-50 border-orange-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  return (
    <div className="flex-1 bg-code-bg/50 px-6 py-10 max-w-4xl mx-auto w-full text-left">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-h mb-2 flex items-center space-x-2">
          <Sparkles className="text-accent" />
          <span>Smart AI Resume Builder</span>
        </h1>
        <p className="text-sm text-text-body/80">
          Upload your resume in PDF format. We will extract structured skills and provide constructive feedback reviews.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all mb-10 ${
          isDragActive
            ? 'border-accent bg-accent-bg/10'
            : 'border-border-custom bg-bg-custom hover:border-accent-border/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <UploadCloud size={56} className={`${isDragActive ? 'text-accent' : 'text-text-body/40'} mb-4`} />
          <h3 className="text-base font-bold text-text-h mb-1">
            {isDragActive ? 'Drop your resume file here' : 'Drag & Drop PDF resume'}
          </h3>
          <p className="text-xs text-text-body/75 max-w-sm">
            Or click to browse files from your computer (PDF only, maximum file size 5MB)
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-bg-custom border border-border-custom rounded-3xl shadow-xs mb-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent mb-4"></div>
          <p className="text-sm font-semibold text-text-h">Analyzing resume text structure...</p>
          <p className="text-xs text-text-body/75">Running skill mappings and AI parsing services</p>
        </div>
      )}

      {resume && !loading && (
        <div className="bg-bg-custom border border-border-custom rounded-3xl shadow-xs overflow-hidden">
          {/* Top Panel Summary */}
          <div className="px-6 py-6 border-b border-border-custom bg-code-bg/50 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-0.5">Analysis Result</p>
              <h2 className="text-xl font-bold text-text-h flex items-center">
                <FileText className="mr-2 text-accent" size={20} />
                <span>Uploaded Resume Details</span>
              </h2>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3 bg-bg-custom border border-border-custom px-4 py-2 rounded-2xl">
                <Award className="text-accent" size={24} />
                <div>
                  <p className="text-[10px] text-text-body uppercase font-bold leading-none">AI Score</p>
                  <p className="text-lg font-black text-text-h leading-none mt-1">{resume.feedback?.score || 75}/100</p>
                </div>
              </div>
              <button
                onClick={handleDeleteResume}
                disabled={deleting}
                className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-red-200 hover:border-red-300"
                title="Delete this resume"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border-custom">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 py-3 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'feedback'
                  ? 'border-accent text-accent bg-accent-bg/5'
                  : 'border-transparent text-text-body hover:text-text-h'
              }`}
            >
              Constructive AI Feedback
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`flex-1 py-3 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'structure'
                  ? 'border-accent text-accent bg-accent-bg/5'
                  : 'border-transparent text-text-body hover:text-text-h'
              }`}
            >
              Extracted Profile Structure
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'feedback' ? (
              <div className="space-y-6">
                {/* Score Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-border-custom p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-text-body uppercase block mb-1">Formatting</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusColorClass(resume.feedback?.formatting?.status)}`}>
                      {resume.feedback?.formatting?.status || '🟡 Good'}
                    </span>
                    <ul className="text-xs text-text-body space-y-1 mt-3 pl-4 list-disc">
                      {resume.feedback?.formatting?.comments?.map((c: string, idx: number) => (
                        <li key={idx}>{c}</li>
                      )) || <li>Looks clean and structured.</li>}
                    </ul>
                  </div>

                  <div className="border border-border-custom p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-text-body uppercase block mb-1">Content Depth</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusColorClass(resume.feedback?.content?.status)}`}>
                      {resume.feedback?.content?.status || '🟡 Good'}
                    </span>
                    <ul className="text-xs text-text-body space-y-1 mt-3 pl-4 list-disc">
                      {resume.feedback?.content?.comments?.map((c: string, idx: number) => (
                        <li key={idx}>{c}</li>
                      )) || <li>Good job descriptions.</li>}
                    </ul>
                  </div>

                  <div className="border border-border-custom p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-text-body uppercase block mb-1">Skills Highlight</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusColorClass(resume.feedback?.skillsFeedback?.status)}`}>
                      {resume.feedback?.skillsFeedback?.status || '🟢 Excellent'}
                    </span>
                    <ul className="text-xs text-text-body space-y-1 mt-3 pl-4 list-disc">
                      {resume.feedback?.skillsFeedback?.comments?.map((c: string, idx: number) => (
                        <li key={idx}>{c}</li>
                      )) || <li>Strong technical expertise.</li>}
                    </ul>
                  </div>
                </div>

                {/* Overall Suggestions */}
                <div className="bg-code-bg border border-border-custom p-5 rounded-2xl">
                  <h3 className="text-sm font-bold text-text-h mb-2 flex items-center">
                    <AlertCircle className="text-accent mr-1.5" size={16} />
                    <span>Suggestions for Improvement</span>
                  </h3>
                  <p className="text-xs text-text-body leading-relaxed">
                    {resume.feedback?.overallSuggestions || 'Your resume looks great! Emphasize impact by quantifying achievements (e.g. increase performance by 15%, handle 5+ projects).'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Skills */}
                <div>
                  <h3 className="text-sm font-bold text-text-h uppercase tracking-wide mb-2">Detected Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.skills?.map((skill: string, index: number) => (
                      <span key={index} className="text-xs bg-accent-bg text-accent px-3 py-1.5 rounded-xl font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-sm font-bold text-text-h uppercase tracking-wide mb-2">Education Details</h3>
                  <div className="space-y-2">
                    {resume.education?.map((edu: string, index: number) => (
                      <div key={index} className="flex items-start text-xs text-text-body border-l-2 border-accent pl-3 py-0.5">
                        {edu}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-sm font-bold text-text-h uppercase tracking-wide mb-2">Work & Project History</h3>
                  <div className="space-y-2">
                    {resume.experience?.map((exp: string, index: number) => (
                      <div key={index} className="flex items-start text-xs text-text-body border-l-2 border-accent pl-3 py-0.5">
                        {exp}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
