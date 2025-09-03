import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { formatFullName, formatDate, calculateExperience } from '../../utils/helpers';
import { toast } from 'react-toastify';

const TeacherDashboard = () => {
  const { user, teacher } = useAuth();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    recentTeachers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await authService.getTeachers();
      const teachers = response.data || [];

      // Calculate stats
      const totalTeachers = teachers.length;
      const recentTeachers = teachers
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      setStats({ totalTeachers, recentTeachers });
      setError('');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load dashboard data';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Welcome Section */}
      <div className="mb-4">
        <h2 className="mb-2">
          Welcome back, {formatFullName(user?.first_name, user?.last_name)}! 👋
        </h2>
        <p className="text-muted">
          Here's an overview of the teacher management system.
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <div className="display-4 text-primary mb-2">👩‍🏫</div>
              <h3 className="mb-1">{stats.totalTeachers}</h3>
              <p className="text-muted mb-0">Total Teachers</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <div className="display-4 text-success mb-2">✅</div>
              <h3 className="mb-1">{stats.totalTeachers}</h3>
              <p className="text-muted mb-0">Active Profiles</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <div className="display-4 text-info mb-2">🎓</div>
              <h3 className="mb-1">{teacher?.university_name ? '1' : '0'}</h3>
              <p className="text-muted mb-0">Your Universities</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <div className="display-4 text-warning mb-2">📊</div>
              <h3 className="mb-1">
                {teacher?.year_joined ? calculateExperience(teacher.year_joined) : '0'}
              </h3>
              <p className="text-muted mb-0">Years Experience</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Your Profile Card */}
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">👤 Your Profile</h5>
            </Card.Header>
            <Card.Body>
              {teacher ? (
                <div>
                  <div className="mb-3">
                    <strong>Name:</strong> {formatFullName(user?.first_name, user?.last_name)}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {user?.email}
                  </div>
                  <div className="mb-3">
                    <strong>University:</strong> {teacher.university_name}
                  </div>
                  <div className="mb-3">
                    <strong>Gender:</strong> {teacher.gender}
                  </div>
                  <div className="mb-3">
                    <strong>Year Joined:</strong> {teacher.year_joined}
                  </div>
                  {teacher.department && (
                    <div className="mb-3">
                      <strong>Department:</strong> {teacher.department}
                    </div>
                  )}
                  {teacher.qualification && (
                    <div className="mb-3">
                      <strong>Qualification:</strong> {teacher.qualification}
                    </div>
                  )}
                  <div className="mb-3">
                    <strong>Experience:</strong> {calculateExperience(teacher.year_joined)} years
                  </div>
                  <Button variant="outline-primary" size="sm">
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-muted">No teacher profile found</p>
                  <Button variant="primary" size="sm">
                    Complete Profile
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Teachers */}
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center bg-light">
              <h5 className="mb-0">📋 Recent Teachers</h5>
              <Button 
                as={Link} 
                to="/teachers" 
                variant="outline-primary" 
                size="sm"
              >
                View All
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {stats.recentTeachers.length > 0 ? (
                <Table hover className="mb-0">
                  <tbody>
                    {stats.recentTeachers.map((teacher, index) => (
                      <tr key={teacher.id}>
                        <td className="ps-3">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <Badge 
                                bg="primary" 
                                className="rounded-circle p-2"
                              >
                                {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                              </Badge>
                            </div>
                            <div>
                              <div className="fw-bold">
                                {formatFullName(teacher.first_name, teacher.last_name)}
                              </div>
                              <small className="text-muted">{teacher.university_name}</small>
                            </div>
                          </div>
                        </td>
                        <td className="pe-3 text-end">
                          <small className="text-muted">
                            {formatDate(teacher.created_at)}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No teachers found</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="shadow-sm mt-4">
        <Card.Header className="bg-light">
          <h5 className="mb-0">🚀 Quick Actions</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Button 
                as={Link} 
                to="/teachers" 
                variant="outline-primary" 
                className="w-100 mb-2"
              >
                📋 View All Teachers
              </Button>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-success" 
                className="w-100 mb-2"
                disabled
              >
                ➕ Add Teacher
              </Button>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-info" 
                className="w-100 mb-2"
                disabled
              >
                📊 Generate Report
              </Button>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-warning" 
                className="w-100 mb-2"
                disabled
              >
                ⚙️ Settings
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TeacherDashboard;
