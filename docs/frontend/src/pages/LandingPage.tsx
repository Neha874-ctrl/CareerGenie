import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Briefcase, FileCheck, Sparkles, TrendingUp, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="bg-white flex-1 flex flex-col justify-start">
      {/* Hero Section */}
      <section className="px-6 py-20 md:py-28 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 bg-accent-bg border border-accent-border/30 rounded-full px-4 py-1.5 mb-6 animate-bounce">
          <Sparkles className="text-accent w-4 h-4" />
          <span className="text-xs font-semibold text-accent tracking-wide uppercase">AI-Powered Career Assistant</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-h mb-6 leading-tight">
          Unlock Your Dream Career with <br />
          <span className="text-accent relative">
            Smart AI Resume Matching
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-text-body/80 max-w-2xl mb-8 leading-relaxed">
          CareerGenie parses your resume in seconds, delivers targeted suggestions to double your callbacks, and instantly matches you to hot campus internships and jobs.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {isAuthenticated ? (
            <Link
              to={user?.role === 'student' ? '/dashboard/student' : '/dashboard/recruiter'}
              className="px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/25 flex items-center space-x-2"
            >
              <span>Go to Workspace</span>
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/25"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border border-border-custom text-text-h font-semibold rounded-xl hover:bg-accent-bg hover:text-accent transition-all"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Statistics Banner */}
      <section className="bg-accent-bg/50 border-y border-border-custom py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-6xl mx-auto w-full rounded-3xl mb-20">
        <div>
          <h3 className="text-3xl font-extrabold text-accent mb-2">98%</h3>
          <p className="text-sm font-medium text-text-body">AI Parsing Accuracy</p>
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-accent mb-2">5,000+</h3>
          <p className="text-sm font-medium text-text-body">Campus Applications Sent</p>
        </div>
        <div>
          <h3 className="text-3xl font-extrabold text-accent mb-2">45%</h3>
          <p className="text-sm font-medium text-text-body">Increase in Recruiter Callbacks</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 max-w-6xl mx-auto w-full mb-28">
        <h2 className="text-3xl font-bold text-text-h text-center mb-12">How CareerGenie Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 text-left shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent-bg text-accent rounded-xl flex items-center justify-center mb-4">
              <FileCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-text-h mb-2">1. Upload & Parse</h3>
            <p className="text-sm text-text-body">
              Simply upload your PDF resume. Our built-in systems scan, extract your skills, educational background, and experience.
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 text-left shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent-bg text-accent rounded-xl flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-lg font-bold text-text-h mb-2">2. Get AI Feedback</h3>
            <p className="text-sm text-text-body">
              Receive a detailed compatibility grade and suggestions regarding formatting, grammar, and skill mapping tailored to target roles.
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 text-left shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent-bg text-accent rounded-xl flex items-center justify-center mb-4">
              <Briefcase size={24} />
            </div>
            <h3 className="text-lg font-bold text-text-h mb-2">3. Match and Apply</h3>
            <p className="text-sm text-text-body">
              Instantly view relevant job matches with customized score breakdowns. Apply directly and monitor recruitment workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audiences Section */}
      <section className="bg-gray-50/50 border-t border-border-custom py-20 px-6 w-full">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-h text-center mb-16">Tailored for Every Actor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                <Users size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-text-h mb-2">For Students</h3>
                <p className="text-sm text-text-body leading-relaxed">
                  Optimize your credentials, get career path recommendations, search matching local openings, and easily manage your applications in one interactive dashboard.
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0">
                <Briefcase size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-text-h mb-2">For Recruiters & Coordinators</h3>
                <p className="text-sm text-text-body leading-relaxed">
                  Create clean job posts in minutes, search candidate pipelines, inspect AI-based candidate matching scores, and instantly update hiring stages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-custom py-8 px-6 text-center text-xs text-text-body/60 mt-auto">
        <p>&copy; {new Date().getFullYear()} CareerGenie Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
