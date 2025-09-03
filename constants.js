// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
};

// Application Constants
export const APP_CONFIG = {
  APP_NAME: 'Teacher Authentication System',
  VERSION: '1.0.0',
  AUTHOR: 'Your Name',
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  UNIVERSITY_MIN_LENGTH: 3,
  UNIVERSITY_MAX_LENGTH: 200,
};

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

// Qualification Options
export const QUALIFICATION_OPTIONS = [
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'PhD',
  'Post-Doctoral',
  'Other'
];

// Department Options (sample)
export const DEPARTMENT_OPTIONS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Literature',
  'History',
  'Psychology',
  'Economics',
  'Other'
];

// Toast Configuration
export const TOAST_CONFIG = {
  POSITION: 'top-right',
  AUTO_CLOSE: 3000,
  HIDE_PROGRESS_BAR: false,
  CLOSE_ON_CLICK: true,
  PAUSEABLE: true,
};
