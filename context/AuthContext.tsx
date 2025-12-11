import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_CLUBS, MOCK_STUDENTS } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, extraData?: { usn?: string, clubId?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Simulate persistent login session
  useEffect(() => {
    const storedUser = localStorage.getItem('uniEvent_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (role: UserRole, extraData?: { usn?: string, clubId?: string }) => {
    let mockUser: User;
    
    switch (role) {
      case UserRole.ADMIN:
        mockUser = { id: 'admin1', name: 'PACE Administrator', email: 'admin@pace.edu.in', role: UserRole.ADMIN, avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff' };
        break;
      case UserRole.CLUB:
        // Use selected club or default to first one
        const club = MOCK_CLUBS.find(c => c.id === extraData?.clubId) || MOCK_CLUBS[0];
        mockUser = { 
          id: club.id, 
          name: club.name, 
          email: club.email, 
          role: UserRole.CLUB, 
          avatar: club.avatar 
        };
        break;
      case UserRole.STUDENT:
        // Parse USN to simulate fetching data from college database
        const usn = extraData?.usn || '4PA21CS001';
        
        // Logic to extract department and year from USN (e.g., 4PA21CS001)
        const yearStr = usn.substring(3, 5); // 21
        const deptCode = usn.substring(5, 7); // CS
        
        const deptMap: Record<string, string> = {
            'CS': 'Computer Science',
            'IS': 'Information Science',
            'EC': 'Electronics & Comm.',
            'ME': 'Mechanical',
            'CV': 'Civil',
            'BT': 'Biotechnology',
            'AI': 'Artificial Intelligence'
        };
        
        const department = deptMap[deptCode] || 'Engineering';
        const batch = `20${yearStr} Batch`;
        
        // Fetch real name from mock DB or fallback
        const studentName = MOCK_STUDENTS[usn] || `Student ${usn}`;

        mockUser = { 
          id: `student_${usn}`, 
          name: studentName, 
          email: `${usn.toLowerCase()}@pace.edu.in`, 
          role: UserRole.STUDENT, 
          avatar: `https://ui-avatars.com/api/?name=${studentName}&background=22c55e&color=fff`,
          usn: usn,
          department: department,
          batch: batch
        };
        break;
      default:
        return;
    }

    localStorage.setItem('uniEvent_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('uniEvent_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};