import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { authService } from '../../services/authService';
import { GENDER_OPTIONS, DEPARTMENT_OPTIONS, QUALIFICATION_OPTIONS } from '../../utils/constants';
import { toast } from 'react-toastify';

const TeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    university_name: '',
    gender: '',
    year_joined: '',
    department: '',
    qualification: '',
    experience_years: '',
    specialization: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      loadTeacherData();
    }
  }, [id, isEdit]);

  const loadTeacherData = async () => {
    try {
      setLoadingData(true);
      const response = await authService.getTeacher(id);
      const teacher = response.data;

      setFormData({
        first_name: teacher.first_name || '',
        last_name: teacher.last_name || '',
        email: teacher.email || '',
        university_name: teacher.university_name || '',
        gender: teacher.gender || '',
        year_joined: teacher.year_joined || '',
        department: teacher.department || '',
        qualification: teacher.qualification || '',
        experience_years: teacher.experience_years || '',
        specialization: teacher.specialization || ''
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load teacher data';
      toast.error(message);
      navigate('/teachers');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.university_name) {
      newErrors.university_name = 'University name is required';
    } else if (formData.university_name.length < 3) {
      newErrors.university_name = 'University name must be at least 3 characters';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.year_joined) {
      newErrors.year_joined = 'Year joined is required';
    } else if (formData.year_joined < 1900 || formData.year_joined > currentYear) {
      newErrors.year_joined = `Year joined must be between 1900 and ${currentYear}`;
    }

    if (formData.experience_years && formData.experience_years < 0) {
      newErrors.experience_years = 'Experience years cannot be negative';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isEdit) {
        await authService.updateTeacher(id, formData);
        toast.success('Teacher updated successfully');
      } else {
        // For now, creation is handled in registration
        toast.info('Teacher creation will be implemented');
      }
      navigate('/teachers');
    } catch (err) {
      const message = err.response?.data?.message || 'Operation failed';
      const apiErrors = err.response?.data?.errors || {};
      setErrors(apiErrors);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading teacher data...</p>
        </div>
      </Container>
    );
  }

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1900; year--) {
    years.push(year);
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            {isEdit ? '✏️ Edit Teacher' : '➕ Add Teacher'}
          </h2>
          <p className="text-muted mb-0">
            {isEdit ? 'Update teacher information' : 'Add a new teacher to the system'}
          </p>
        </div>
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate('/teachers')}
        >
          ← Back to List
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0">Teacher Information</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {!isEdit && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      isInvalid={!!errors.first_name}
                      placeholder="Enter first name"
                      disabled={isEdit}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.first_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      isInvalid={!!errors.last_name}
                      placeholder="Enter last name"
                      disabled={isEdit}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.last_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            )}

            {!isEdit && (
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="Enter email address"
                  disabled={isEdit}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>University Name</Form.Label>
              <Form.Control
                type="text"
                name="university_name"
                value={formData.university_name}
                onChange={handleChange}
                isInvalid={!!errors.university_name}
                placeholder="Enter university name"
              />
              <Form.Control.Feedback type="invalid">
                {errors.university_name}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    isInvalid={!!errors.gender}
                  >
                    <option value="">Select gender</option>
                    {GENDER_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.gender}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Year Joined</Form.Label>
                  <Form.Select
                    name="year_joined"
                    value={formData.year_joined}
                    onChange={handleChange}
                    isInvalid={!!errors.year_joined}
                  >
                    <option value="">Select year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.year_joined}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="">Select department</option>
                    {DEPARTMENT_OPTIONS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Qualification</Form.Label>
                  <Form.Select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                  >
                    <option value="">Select qualification</option>
                    {QUALIFICATION_OPTIONS.map(qual => (
                      <option key={qual} value={qual}>{qual}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Experience Years</Form.Label>
              <Form.Control
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                isInvalid={!!errors.experience_years}
                placeholder="Enter years of experience"
                min="0"
                max="50"
              />
              <Form.Control.Feedback type="invalid">
                {errors.experience_years}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Enter areas of specialization"
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/teachers')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={isEdit ? "primary" : "success"}
                disabled={loading}
              >
                {loading ? 
                  (isEdit ? 'Updating...' : 'Creating...') : 
                  (isEdit ? 'Update Teacher' : 'Create Teacher')
                }
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TeacherForm;
