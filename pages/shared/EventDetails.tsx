import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Calendar, Clock, MapPin, Users, ArrowLeft, CheckCircle2 } from 'lucide-react';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, registerForEvent, isRegistered } = useData();
  const { user } = useAuth();
  
  const [successMsg, setSuccessMsg] = useState('');

  const event = events.find(e => e.id === id);

  if (!event) {
    return <div className="p-8 text-center">Event not found</div>;
  }

  const registered = user && isRegistered(event.id, user.id);
  const isFull = event.registeredCount >= event.capacity;

  const handleRegister = () => {
    if (!user) return;
    registerForEvent(event.id, user.id, user.name);
    setSuccessMsg('Registration Successful! A confirmation email has been sent.');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-64 md:h-80 bg-gray-200 relative">
            {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white">
                    <span className="inline-block px-3 py-1 bg-indigo-600 rounded-full text-xs font-bold mb-3">{event.category}</span>
                    <h1 className="text-4xl font-bold">{event.title}</h1>
                </div>
            </div>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">About Event</h3>
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>
                
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Organized By</h3>
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                             {event.clubName.charAt(0)}
                         </div>
                         <span className="font-medium text-gray-700">{event.clubName}</span>
                    </div>
                </div>
            </div>

            <div className="md:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
                     <div className="flex items-center gap-3 text-gray-700">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600"><Calendar size={20} /></div>
                        <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="font-semibold">{event.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600"><Clock size={20} /></div>
                        <div>
                             <p className="text-xs text-gray-500">Time</p>
                             <p className="font-semibold">{event.time}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600"><MapPin size={20} /></div>
                        <div>
                             <p className="text-xs text-gray-500">Venue</p>
                             <p className="font-semibold">{event.location}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3 text-gray-700">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600"><Users size={20} /></div>
                        <div>
                             <p className="text-xs text-gray-500">Seats</p>
                             <p className="font-semibold">{event.capacity - event.registeredCount} / {event.capacity} left</p>
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-200">
                        {user?.role === UserRole.STUDENT && (
                            <>
                                {successMsg ? (
                                    <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center font-medium flex items-center justify-center gap-2">
                                        <CheckCircle2 size={16} /> Registered
                                    </div>
                                ) : registered ? (
                                    <button disabled className="w-full bg-gray-200 text-gray-500 py-3 rounded-lg font-bold cursor-not-allowed">
                                        Already Registered
                                    </button>
                                ) : isFull ? (
                                     <button disabled className="w-full bg-red-100 text-red-500 py-3 rounded-lg font-bold cursor-not-allowed">
                                        Sold Out
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleRegister}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        Register Now
                                    </button>
                                )}
                            </>
                        )}
                        {user?.role === UserRole.ADMIN && (
                            <div className="text-center text-sm text-gray-500 italic">Admin View Mode</div>
                        )}
                         {user?.role === UserRole.CLUB && (
                            <div className="text-center text-sm text-gray-500 italic">Club View Mode</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;