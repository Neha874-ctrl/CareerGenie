import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Save, Server, Shield, FileText } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    maxResumeUploadSizeMB: 5,
    geminiModelVersion: 'gemini-1.5-flash',
  });

  const fetchSettings = async () => {
    try {
      const response = await adminAPI.getSettings();
      if (response.data.settings) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex justify-center mt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-text-h mb-2">Platform Settings</h1>
            <p className="text-text-body">Manage global application configurations</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-accent text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-accent/90 transition-all shadow-md shadow-accent/20 disabled:opacity-50"
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs">
            <div className="flex items-center space-x-3 mb-6 border-b border-border-custom pb-4">
              <div className="p-2 bg-accent-bg text-accent rounded-xl">
                <Server size={20} />
              </div>
              <h2 className="text-lg font-bold text-text-h">System Controls</h2>
            </div>
            
            <div className="space-y-6">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-semibold text-text-h group-hover:text-accent transition-colors">Maintenance Mode</p>
                  <p className="text-sm text-text-body/70">Disables access to the frontend for users</p>
                </div>
                <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                  <input 
                    type="checkbox" 
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-6 checked:border-accent"
                  />
                  <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${settings.maintenanceMode ? 'bg-accent' : 'bg-gray-300'}`}></div>
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="font-semibold text-text-h group-hover:text-accent transition-colors">Allow Registrations</p>
                  <p className="text-sm text-text-body/70">Enable new users to sign up</p>
                </div>
                <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                  <input 
                    type="checkbox" 
                    checked={settings.allowRegistrations}
                    onChange={(e) => setSettings({...settings, allowRegistrations: e.target.checked})}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-6 checked:border-accent"
                  />
                  <div className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${settings.allowRegistrations ? 'bg-accent' : 'bg-gray-300'}`}></div>
                </div>
              </label>
            </div>
          </div>

          {/* AI & File Settings */}
          <div className="bg-bg-custom border border-border-custom rounded-3xl p-6 shadow-xs">
            <div className="flex items-center space-x-3 mb-6 border-b border-border-custom pb-4">
              <div className="p-2 bg-accent-bg text-accent rounded-xl">
                <Shield size={20} />
              </div>
              <h2 className="text-lg font-bold text-text-h">Configuration</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block font-semibold text-text-h mb-1">Max Resume Size (MB)</label>
                <p className="text-sm text-text-body/70 mb-3">Maximum file upload size for PDF resumes</p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-body/60">
                    <FileText size={18} />
                  </div>
                  <input
                    type="number"
                    value={settings.maxResumeUploadSizeMB}
                    onChange={(e) => setSettings({...settings, maxResumeUploadSizeMB: Number(e.target.value)})}
                    className="w-full pl-10 pr-4 py-2 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-h mb-1">Gemini AI Model</label>
                <p className="text-sm text-text-body/70 mb-3">LLM version used for parsing and matching</p>
                <select
                  value={settings.geminiModelVersion}
                  onChange={(e) => setSettings({...settings, geminiModelVersion: e.target.value})}
                  className="w-full px-4 py-2 bg-code-bg border border-border-custom rounded-xl text-sm focus:outline-none focus:border-accent text-text-h"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Accurate)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
