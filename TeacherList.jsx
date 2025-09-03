import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Form, InputGroup, 
  Spinner, Alert, Badge, Modal, Pagination 
} from 'react-bootstrap';
import { authService } from '../../services/authService';
import { formatFullName, formatDate, calculateExperience, debounce } from '../../utils/helpers';
import { toast } from 'react-toastify';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage] = useState(10);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const response = await authService.getTeachers();
      setTeachers(response.data || []);
      setError('');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load teachers';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const searchTeachers = async (term) => {
    if (!term.trim()) {
      loadTeachers();
      return;
    }

    try {
      setSearching(true);
      const response = await authService.searchTeachers(term);
      setTeachers(response.data || []);
      setError('');
    } catch (err) {
      const message = err.response?.data?.message || 'Search failed';
      setError(message);
      toast.error(message);
    } finally {
      setSearching(false);
    }
  };

  const debouncedSearch = debounce(searchTeachers, 500);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;

    try {
      await authService.deleteTeacher(teacherToDelete.id);
      toast.success('Teacher deactivated successfully');
      setShowDeleteModal(false);
      setTeacherToDelete(null);
      loadTeachers();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete teacher';
      toast.error(message);
    }
  };

  // Pagination logic
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = teachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(teachers.length / teachersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading teachers...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">👩‍🏫 Teachers</h2>
          <p className="text-muted mb-0">Manage teacher profiles and information</p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search teachers by name, email, university..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Button variant="outline-secondary" disabled={searching}>
                  {searching ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    '🔍'
                  )}
                </Button>
              </InputGroup>
            </Col>
            <Col md={6} className="text-md-end mt-2 mt-md-0">
              <Button variant="outline-primary" className="me-2" disabled>
                📁 Export
              </Button>
              <Button variant="primary" disabled>
                ➕ Add Teacher
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Teachers Table */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              Teachers List ({teachers.length} total)
            </h5>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {currentTeachers.length > 0 ? (
            <>
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Teacher</th>
                      <th>University</th>
                      <th>Department</th>
                      <th>Gender</th>
                      <th>Experience</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTeachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <Badge 
                              bg="primary" 
                              className="rounded-circle p-2 me-3"
                            >
                              {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                            </Badge>
                            <div>
                              <div className="fw-bold">
                                {formatFullName(teacher.first_name, teacher.last_name)}
                              </div>
                              <small className="text-muted">{teacher.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>{teacher.university_name}</td>
                        <td>
                          {teacher.department || (
                            <span className="text-muted">Not specified</span>
                          )}
                        </td>
                        <td>
                          <Badge 
                            bg={teacher.gender === 'Male' ? 'info' : teacher.gender === 'Female' ? 'pink' : 'secondary'}
                            className="text-dark"
                          >
                            {teacher.gender}
                          </Badge>
                        </td>
                        <td>
                          {calculateExperience(teacher.year_joined)} years
                        </td>
                        <td>
                          <small>{formatDate(teacher.created_at)}</small>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Button variant="outline-primary" size="sm" disabled>
                              👁️
                            </Button>
                            <Button variant="outline-secondary" size="sm" disabled>
                              ✏️
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteClick(teacher)}
                            >
                              🗑️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center p-3">
                  <Pagination>
                    <Pagination.Prev 
                      disabled={currentPage === 1}
                      onClick={() => paginate(currentPage - 1)}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      disabled={currentPage === totalPages}
                      onClick={() => paginate(currentPage + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <div className="display-1 text-muted mb-3">👩‍🏫</div>
              <h4 className="text-muted mb-2">No Teachers Found</h4>
              <p className="text-muted mb-4">
                {searchTerm ? 
                  `No teachers match your search "${searchTerm}"` : 
                  'No teachers have been added yet'
                }
              </p>
              <Button variant="primary" disabled>
                ➕ Add First Teacher
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to deactivate{' '}
          <strong>
            {teacherToDelete && formatFullName(teacherToDelete.first_name, teacherToDelete.last_name)}
          </strong>
          ? This will deactivate their account and they will no longer be able to login.
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
          >
            Deactivate Teacher
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TeacherList;
