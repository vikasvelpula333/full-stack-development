import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6}>
            <h6 className="fw-bold">Teacher Authentication System</h6>
            <p className="mb-0 small text-muted">
              A modern authentication system built with CodeIgniter 4 and React
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0 small text-muted">
              © {currentYear} Teacher Auth System. All rights reserved.
            </p>
            <p className="mb-0 small text-muted">
              Built with ❤️ using CodeIgniter & React
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
