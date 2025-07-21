import React from 'react';
import { Menu } from 'lucide-react';
import { useSidebar } from './Sidebar';

const MobileSidebarToggle = () => {
  const { expanded, setExpanded } = useSidebar();
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  return (
    <button
      onClick={toggleSidebar}
      className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-[#2563EB] text-white shadow-lg md:hidden"
      aria-label="Toggle Sidebar"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
};

export default MobileSidebarToggle;