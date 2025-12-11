import React from 'react';
import Sidebar from './Sidebar';
import ChatAssistant from './ChatAssistant';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <ChatAssistant />
    </div>
  );
};

export default Layout;