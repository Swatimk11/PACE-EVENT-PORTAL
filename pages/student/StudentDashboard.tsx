import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Search, ExternalLink, Globe, Loader2, RefreshCw, GraduationCap, Laptop, Music, Trophy, Hammer } from 'lucide-react';
import { searchEventsTopics } from '../../services/geminiService';

const StudentDashboard: React.FC = () => {
  const { getEventsForStudent } = useData();
  const { user } = useAuth();
  const allEvents = getEventsForStudent();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'browse' | 'pace_news'>('browse');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // External Data State
  const [paceEvents, setPaceEvents] = useState<{text: string, links: any[]} | null>(null);
  const [loadingPace, setLoadingPace] = useState(false);

  // Filter events with safety checks for missing fields
  const filteredEvents = allEvents.filter(e => {
    const title = e.title || '';
    const category = e.category || '';
    
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          category.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesCategory = categoryFilter === 'All' || 
                            (categoryFilter === 'Technical' && category === 'Technology') ||
                            (categoryFilter === 'Cultural' && category === 'Cultural') ||
                            (categoryFilter === 'Sports' && category === 'Sports') ||
                            (categoryFilter === 'Social' && category === 'Social Service') ||
                             category === categoryFilter;
                            
    return matchesSearch && matchesCategory;
  });

  const fetchPaceEvents = async () => {
      setLoadingPace(true);
      // Specifically search the PACE website for recent event news
      const result = await searchEventsTopics("latest events, news, and circulars site:pace.edu.in");
      setPaceEvents(result);
      setLoadingPace(false);
  };

  // Auto-fetch PACE events when tab changes
  useEffect(() => {
    if (activeTab === 'pace_news' && !paceEvents) {
        fetchPaceEvents();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <GraduationCap size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name.split(' ')[0]}</h1>
                {user?.usn && (
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                        USN: {user.usn} {user.department ? `• ${user.department}` : ''} {user.batch ? `• ${user.batch}` : ''}
                    </p>
                )}
             </div>
           </div>
        </div>
        
        <div className="bg-gray-100 p-1 rounded-lg border border-gray-200 inline-flex">
            <button 
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'browse' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
            >
                College Events
            </button>
            <button 
                onClick={() => setActiveTab('pace_news')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'pace_news' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
            >
                <Globe size={14} />
                PACE News
            </button>
        </div>
      </div>

      {activeTab === 'browse' && (
          <>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search events by name..." 
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                     {[
                         { name: 'All', icon: null },
                         { name: 'Technical', icon: Laptop },
                         { name: 'Cultural', icon: Music },
                         { name: 'Sports', icon: Trophy },
                         { name: 'Workshop', icon: Hammer }
                     ].map(cat => (
                         <button
                            key={cat.name}
                            onClick={() => setCategoryFilter(cat.name)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors border ${
                                categoryFilter === cat.name 
                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            }`}
                         >
                             {cat.icon && <cat.icon size={16} />}
                             <span className="text-sm font-medium">{cat.name}</span>
                         </button>
                     ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? filteredEvents.map(event => (
                <div key={event.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="h-48 overflow-hidden relative">
                         {event.imageUrl ? (
                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                        )}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                            {event.category || 'Event'}
                        </div>
                    </div>
                    <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-indigo-500" />
                            <span>{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-indigo-500" />
                            <span>{event.location}</span>
                        </div>
                    </div>

                    <Link 
                        to={`/event/${event.id}`} 
                        className="block w-full text-center py-2.5 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-600 hover:text-white transition-all"
                    >
                        View Details & Register
                    </Link>
                    </div>
                </div>
                )) : (
                    <div className="col-span-full py-16 text-center text-gray-500">
                        <p className="text-lg font-medium">No events found in this category.</p>
                        <button onClick={() => setCategoryFilter('All')} className="text-indigo-600 hover:underline mt-2">Clear filters</button>
                    </div>
                )}
            </div>
          </>
      )}

      {activeTab === 'pace_news' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-sm border border-blue-100 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <Globe className="text-blue-600" />
                            Live from pace.edu.in
                        </h2>
                        <p className="text-gray-600">
                            Checking official college website for latest announcements and events using AI Search.
                        </p>
                    </div>
                    <button 
                        onClick={fetchPaceEvents} 
                        disabled={loadingPace}
                        className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        <RefreshCw size={20} className={loadingPace ? "animate-spin" : ""} />
                    </button>
                  </div>
                  
                  {loadingPace ? (
                      <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                          <Loader2 size={32} className="animate-spin text-indigo-600 mb-3" />
                          <p>Syncing with College Website...</p>
                      </div>
                  ) : paceEvents ? (
                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                          <div className="prose prose-sm max-w-none text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
                              {paceEvents.text}
                          </div>
                          
                          {paceEvents.links.length > 0 && (
                              <div className="border-t border-gray-100 pt-4">
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Official Sources</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {paceEvents.links.map((link, idx) => (
                                          <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 rounded-lg group transition-all">
                                              <div className="bg-blue-100 p-2 rounded text-blue-600 group-hover:bg-blue-200">
                                                <ExternalLink size={16} />
                                              </div>
                                              <span className="text-sm text-blue-700 font-medium truncate">{link.title || link.url}</span>
                                          </a>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>
                  ) : (
                      <div className="text-center py-8 text-gray-500">
                          Failed to load data. Please try refreshing.
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default StudentDashboard;