import React from 'react';
import { useData } from '../../context/DataContext';
import { EventStatus } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import { Check, X, Calendar, User, TrendingUp, FileText, ExternalLink, RefreshCcw } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { events, updateEventStatus, registrations, resetDatabase } = useData();

  const pendingEvents = events.filter(e => e.status === EventStatus.PENDING);
  const approvedEvents = events.filter(e => e.status === EventStatus.APPROVED);
  
  // Analytics Data Preparation
  const categoryData = events.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});
  
  const chartData = Object.keys(categoryData).map(key => ({ name: key, count: categoryData[key] }));

  const registrationActivity = [
    { name: 'Mon', reg: 12 },
    { name: 'Tue', reg: 19 },
    { name: 'Wed', reg: 3 },
    { name: 'Thu', reg: 25 },
    { name: 'Fri', reg: 42 },
    { name: 'Sat', reg: 20 },
    { name: 'Sun', reg: 15 },
  ];

  return (
    <div className="space-y-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">Welcome back, Admin. Here is your system overview.</p>
        </div>
        <button 
            onClick={resetDatabase}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
        >
            <RefreshCcw size={16} />
            Reset Database
        </button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{events.length}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={20} /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Registrations</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{registrations.length + 515}</h3> {/* Mocking past data */}
            </div>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><User size={20} /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Approval</p>
              <h3 className="text-3xl font-bold text-orange-600 mt-2">{pendingEvents.length}</h3>
            </div>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Check size={20} /></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Clubs</p>
              <h3 className="text-3xl font-bold text-purple-600 mt-2">12</h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp size={20} /></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Events by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Weekly Registration Trends</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reg" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Approval Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Event & Hall Booking Approvals</h3>
          <p className="text-xs text-gray-500 mt-1">Verify HOD and Principal letters before approving.</p>
        </div>
        {pendingEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No pending events to review.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pendingEvents.map(event => (
              <div key={event.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50 transition-colors gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{event.title}</h4>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">{event.category}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{event.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="font-medium text-gray-700">{event.clubName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar size={12}/> {event.date} at {event.time}</span>
                    <span>•</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">Venue Request: {event.location}</span>
                  </div>

                  {/* Digital Documents Section */}
                  <div className="flex gap-3 mt-2">
                     {event.hodLetterUrl ? (
                         <a href={event.hodLetterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                             <FileText size={14} className="text-green-600" /> HOD Letter
                             <ExternalLink size={10} />
                         </a>
                     ) : (
                         <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-transparent rounded text-xs text-gray-400">HOD Letter Missing</span>
                     )}
                     
                     {event.principalLetterUrl ? (
                         <a href={event.principalLetterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                             <FileText size={14} className="text-purple-600" /> Principal Letter
                             <ExternalLink size={10} />
                         </a>
                     ) : (
                         <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-transparent rounded text-xs text-gray-400">Principal Letter Missing</span>
                     )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                  <button 
                    onClick={() => updateEventStatus(event.id, EventStatus.REJECTED)}
                    className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <X size={16} /> Reject
                  </button>
                  <button 
                    onClick={() => updateEventStatus(event.id, EventStatus.APPROVED)}
                    className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
                  >
                    <Check size={16} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;