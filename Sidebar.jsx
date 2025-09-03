import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: '/',
      icon: '🏠',
      label: 'Dashboard'
    },
    {
      path: '/teachers',
      icon: '👩‍🏫',
      label: 'Teachers'
    },
    {
      path: '/profile',
      icon: '👤',
      label: 'Profile'
    },
    {
      path: '/settings',
      icon: '⚙️',
      label: 'Settings'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1040
          }}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{
          position: 'fixed',
          top: '56px', // Height of navbar
          left: isOpen ? 0 : '-250px',
          width: '250px',
          height: 'calc(100vh - 56px)',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #dee2e6',
          transition: 'left 0.3s ease-in-out',
          zIndex: 1041,
          overflowY: 'auto'
        }}
      >
        <div className="p-3">
          <Nav className="flex-column">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`d-flex align-items-center py-2 px-3 mb-1 rounded ${
                  isActive(item.path) ? 'bg-primary text-white' : 'text-dark'
                }`}
                onClick={onClose}
              >
                <span className="me-3">{item.icon}</span>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
