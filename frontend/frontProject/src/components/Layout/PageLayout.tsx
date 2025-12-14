import React from 'react';
import Topbar from '../Topbar/Topbar';
import './PageLayout.css';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`page-layout ${className}`}>
      <Topbar />
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
