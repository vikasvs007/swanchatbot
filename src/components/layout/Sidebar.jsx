import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Cookies from 'js-cookie';

const Sidebar = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Load state from cookie
    const savedState = Cookies.get('sidebarCollapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Keyboard shortcut
    const handleKeyPress = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    Cookies.set('sidebarCollapsed', newState.toString());
  };

  return (
    <div className="flex h-screen">
      <div
        className={`
          fixed top-0 left-0 h-full bg-light-background dark:bg-dark-background
          border-r border-light-secondary dark:border-dark-secondary
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-12' : isMobile ? 'w-72' : 'w-64'}
          ${isMobile && isCollapsed ? '-translate-x-full' : ''}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-light-secondary dark:border-dark-secondary">
          {!isCollapsed && <h2 className="font-bold text-xl">SwanSorter</h2>}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <FiMenu /> : <FiX />}
          </button>
        </div>
        <div className="p-4">
          {!isCollapsed && children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 