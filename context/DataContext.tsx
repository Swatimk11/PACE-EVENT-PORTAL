import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, Hall, Registration, EventStatus, UserRole } from '../types';
import { INITIAL_EVENTS, INITIAL_HALLS } from '../services/mockData';

interface DataContextType {
  events: Event[];
  halls: Hall[];
  registrations: Registration[];
  addEvent: (event: Event) => void;
  updateEventStatus: (id: string, status: EventStatus) => void;
  registerForEvent: (eventId: string, studentId: string, studentName: string) => void;
  deleteEvent: (id: string) => void;
  getEventsByClub: (clubId: string) => Event[];
  getEventsForStudent: () => Event[];
  isRegistered: (eventId: string, studentId: string) => boolean;
  resetDatabase: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage (Database) or fallback to Mock Data
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const saved = localStorage.getItem('pace_events');
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch (e) {
      console.error("Failed to load events from DB", e);
      return INITIAL_EVENTS;
    }
  });

  const [halls, setHalls] = useState<Hall[]>(() => {
    try {
      const saved = localStorage.getItem('pace_halls');
      return saved ? JSON.parse(saved) : INITIAL_HALLS;
    } catch (e) {
      return INITIAL_HALLS;
    }
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    try {
      const saved = localStorage.getItem('pace_registrations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Persist changes to LocalStorage (Database)
  useEffect(() => {
    try {
      localStorage.setItem('pace_events', JSON.stringify(events));
    } catch (e) {
      console.error("Database quota exceeded", e);
      alert("Warning: Local database is full. Some large images may not be saved.");
    }
  }, [events]);

  useEffect(() => {
    localStorage.setItem('pace_halls', JSON.stringify(halls));
  }, [halls]);

  useEffect(() => {
    localStorage.setItem('pace_registrations', JSON.stringify(registrations));
  }, [registrations]);

  const addEvent = (event: Event) => {
    setEvents(prev => [event, ...prev]);
  };

  const updateEventStatus = (id: string, status: EventStatus) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const registerForEvent = (eventId: string, studentId: string, studentName: string) => {
    const newReg: Registration = {
      id: Math.random().toString(36).substr(2, 9),
      eventId,
      studentId,
      studentName,
      timestamp: new Date().toISOString()
    };
    setRegistrations(prev => [...prev, newReg]);
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e));
  };

  const getEventsByClub = (clubId: string) => {
    return events.filter(e => e.clubId === clubId || (clubId === 'club_ieee' && e.clubId === 'club_ieee')); // Simplified logic
  };

  const getEventsForStudent = () => {
    return events.filter(e => e.status === EventStatus.APPROVED);
  };

  const isRegistered = (eventId: string, studentId: string) => {
    return registrations.some(r => r.eventId === eventId && r.studentId === studentId);
  };

  const resetDatabase = () => {
    if (window.confirm("Are you sure you want to reset the database? This will clear all created events and registrations.")) {
      localStorage.removeItem('pace_events');
      localStorage.removeItem('pace_halls');
      localStorage.removeItem('pace_registrations');
      setEvents(INITIAL_EVENTS);
      setHalls(INITIAL_HALLS);
      setRegistrations([]);
      window.location.reload();
    }
  };

  return (
    <DataContext.Provider value={{ 
      events, 
      halls, 
      registrations, 
      addEvent, 
      updateEventStatus, 
      registerForEvent, 
      deleteEvent,
      getEventsByClub,
      getEventsForStudent,
      isRegistered,
      resetDatabase
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};