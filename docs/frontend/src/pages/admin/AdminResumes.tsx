import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FileText, Trash2, Download } from 'lucide-react';

const AdminResumes: React.FC = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllResumes();
      setResumes(res.data.resumes);
    } catch (err) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this resume permanently?')) return;
    try {
      await adminAPI.deleteResume(id);
      toast.success('Resume deleted');
      fetchResumes();
    } catch (err) {
      toast.error('Failed to delete resume');
    }
  };

  return (
    <div className="text-left max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-h mb-2">Resume Management</h1>
        <p className="text-sm text-text-body/80 font-medium">View and manage all uploaded student resumes and their AI analysis.</p>
      </div>

      <div className="bg-bg-custom border border-border-custom rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="p-12 text-center text-text-body/60 text-sm">No resumes uploaded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-code-bg/50">
                <tr className="border-b border-border-custom text-text-body/70 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 font-bold">Student</th>
                  <th className="py-4 px-6 font-bold">Filename</th>
                  <th className="py-4 px-6 font-bold">ATS Score</th>
                  <th className="py-4 px-6 font-bold">Uploaded</th>
                  <th className="py-4 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/50">
                {resumes.map((resume) => (
                  <tr key={resume._id} className="hover:bg-code-bg/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-text-h">{resume.student?.name || 'Unknown'}</p>
                      <p className="text-xs text-text-body">{resume.student?.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 max-w-[200px] truncate">
                        <FileText size={14} className="text-accent" />
                        <span className="truncate">{resume.filename}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        resume.atsScore >= 80 ? 'bg-emerald-100 text-emerald-700' :
                        resume.atsScore >= 60 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {resume.atsScore || 0}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text-body/80 text-xs">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end space-x-2">
                        <a
                          href={`http://localhost:5000/${resume.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-text-body hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                          title="Download Resume"
                        >
                          <Download size={16} />
                        </a>
                        <button
                          onClick={() => handleDelete(resume._id)}
                          className="p-2 text-text-body hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete Resume"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResumes;
