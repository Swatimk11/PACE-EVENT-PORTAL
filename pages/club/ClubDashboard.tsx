import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { EventStatus } from '../../types';
import { Plus, MapPin, Calendar, Clock, Users } from 'lucide-react';

const ClubDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getEventsByClub } = useData();
  
  const myEvents = getEventsByClub(user?.id || '');

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.APPROVED: return 'bg-green-100 text-green-700';
      case EventStatus.REJECTED: return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Club Dashboard</h1>
           <p className="text-gray-500 mt-2">Manage your events and bookings</p>
        </div>
        <Link 
          to="/club/create-event"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus size={20} />
          Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myEvents.map(event => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-200 relative">
                {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(event.status)}`}>
                    {event.status}
                </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{event.description}</p>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>{event.time}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span>{event.registeredCount} / {event.capacity} Registered</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">ID: {event.id}</span>
                <Link to={`/event/${event.id}`} className="text-indigo-600 text-sm font-semibold hover:text-indigo-800">
                    View Details
                </Link>
            </div>
          </div>
        ))}
        
        {myEvents.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
                <Link to="/club/create-event" className="text-indigo-600 font-medium hover:underline">Get started by creating one!</Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default ClubDashboard;