import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { MOCK_CLUBS, MOCK_STUDENTS } from '../services/mockData';
import { Shield, Users, GraduationCap, Building2, Loader2, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  // Login Modes
  const [activeMode, setActiveMode] = useState<'none' | 'student' | 'club'>('none');
  
  // Student State
  const [usn, setUsn] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [studentName, setStudentName] = useState('');

  // Club State
  const [selectedClubId, setSelectedClubId] = useState('');

  // Handle navigation based on user state changes
  useEffect(() => {
    if (user) {
      if (user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else if (user.role === UserRole.CLUB) {
        navigate('/club');
      } else if (user.role === UserRole.STUDENT) {
        navigate('/student');
      }
    }
  }, [user, navigate]);

  const verifyUSN = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStudentName('');
    
    // Validates PACE USN format (e.g., 4PA21CS001)
    const usnPattern = /^4PA\d{2}[A-Z]{2}\d{3}$/i;
    
    if (!usnPattern.test(usn.trim())) {
      setError('Invalid USN format. Example: 4PA21CS001');
      return;
    }

    setVerifying(true);
    
    // Simulate API verification delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundName = MOCK_STUDENTS[usn.toUpperCase()];
    
    if (foundName) {
        setStudentName(foundName);
        // Additional delay to show the name before logging in
        await new Promise(resolve => setTimeout(resolve, 600));
        login(UserRole.STUDENT, { usn: usn.toUpperCase() });
    } else {
        // Fallback for demo purposes if not in mock DB
        setStudentName(`Student ${usn.toUpperCase()}`);
        await new Promise(resolve => setTimeout(resolve, 600));
        login(UserRole.STUDENT, { usn: usn.toUpperCase() });
    }
    
    setVerifying(false);
  };

  const handleClubLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedClubId) return;
      login(UserRole.CLUB, { clubId: selectedClubId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl w-full z-10 relative">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20 shadow-xl shadow-indigo-500/20">
                <Building2 size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">PACE Event Portal</h1>
          <p className="text-xl text-slate-300">P.A. College of Engineering - Event Management System</p>
        </div>

        {activeMode === 'student' ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Verification</h2>
            <p className="text-gray-500 mb-6">Please enter your University Seat Number (USN) to verify your identity against the college database.</p>
            
            <form onSubmit={verifyUSN}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">USN Number</label>
                <input
                  type="text"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value.toUpperCase())}
                  placeholder="e.g. 4PA21CS001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg tracking-wide uppercase"
                  autoFocus
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {studentName && <p className="text-green-600 font-medium text-sm mt-2 flex items-center gap-1"><Shield size={14}/> Verified: {studentName}</p>}
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveMode('none')}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifying || !usn}
                  className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {verifying ? <Loader2 className="animate-spin" size={20} /> : <>Verify & Login <ArrowRight size={18} /></>}
                </button>
              </div>
            </form>
          </div>
        ) : activeMode === 'club' ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-2xl animate-fade-in">
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Club Coordinator</h2>
             <p className="text-gray-500 mb-6">Select your club to access the management dashboard.</p>
             
             <form onSubmit={handleClubLogin}>
                <div className="mb-6 space-y-3 max-h-60 overflow-y-auto pr-2">
                    {MOCK_CLUBS.map((club) => (
                        <label key={club.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedClubId === club.id ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-indigo-300'}`}>
                            <input 
                                type="radio" 
                                name="club" 
                                value={club.id} 
                                checked={selectedClubId === club.id}
                                onChange={(e) => setSelectedClubId(e.target.value)}
                                className="w-4 h-4 text-indigo-600"
                            />
                            <div>
                                <p className="font-semibold text-gray-900">{club.name}</p>
                                <p className="text-xs text-gray-500">{club.email}</p>
                            </div>
                        </label>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button
                    type="button"
                    onClick={() => setActiveMode('none')}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    disabled={!selectedClubId}
                    className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                    Access Dashboard <ArrowRight size={18} />
                    </button>
                </div>
             </form>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => setActiveMode('student')}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 p-8 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl text-left"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="text-white" size={20} />
              </div>
              <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
                <GraduationCap className="text-green-400 group-hover:text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Student Login</h3>
              <p className="text-slate-400 text-sm">Verify with USN to access events, registrations, and attendance.</p>
            </button>

            <button
              onClick={() => setActiveMode('club')}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 p-8 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl text-left"
            >
               <div className="bg-indigo-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-500 transition-colors">
                <Users className="text-indigo-400 group-hover:text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Club Coordinator</h3>
              <p className="text-slate-400 text-sm">Manage IEEE, GLUG, Embed and other club events.</p>
            </button>

            <button
              onClick={() => login(UserRole.ADMIN)}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 p-8 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-2xl text-left"
            >
               <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                <Shield className="text-purple-400 group-hover:text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Admin Portal</h3>
              <p className="text-slate-400 text-sm">Administrative access for Principal, HODs, and system managers.</p>
            </button>
          </div>
        )}
        
        <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm">Real-time Verification • Powered by Gemini AI</p>
            <p className="text-slate-600 text-xs mt-1">© P.A. College of Engineering</p>
        </div>
      </div>
    </div>
  );
};

export default Login;