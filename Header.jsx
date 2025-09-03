import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatFullName, getInitials } from '../../utils/helpers';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🎓 Teacher Auth System
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated() ? (
            <>
              <Nav className="me-auto">
                <Nav.Link 
                  as={Link} 
                  to="/" 
                  className={isActive('/') ? 'active' : ''}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/teachers" 
                  className={isActive('/teachers') ? 'active' : ''}
                >
                  Teachers
                </Nav.Link>
              </Nav>

              <Nav>
                <NavDropdown
                  title={
                    <span>
                      <span className="badge bg-primary me-2">
                        {getInitials(user?.first_name, user?.last_name)}
                      </span>
                      {formatFullName(user?.first_name, user?.last_name)}
                    </span>
                  }
                  id="user-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item disabled>
                    <small className="text-muted">{user?.email}</small>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    🚪 Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link 
                as={Link} 
                to="/login"
                className={isActive('/login') ? 'active' : ''}
              >
                Login
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/register"
                className={isActive('/register') ? 'active' : ''}
              >
                Register
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
