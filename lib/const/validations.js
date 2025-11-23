export const validate = (fieldName = '', options = {}) => {
  const { required = false, minLength, maxLength, type, pattern, customMessage } = options;

  // Make label user-friendly
  const label =
    fieldName?.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()) || 'Field';

  const rules = [];

  if (required) {
    rules.push({
      required: true,
      message: customMessage || `${label} is required`,
    });
  }

  if (minLength) {
    rules.push({
      min: minLength,
      message: `${label} must be at least ${minLength} characters`,
    });
  }

  if (maxLength) {
    rules.push({
      max: maxLength,
      message: `${label} cannot be more than ${maxLength} characters`,
    });
  }

  if (type === 'email') {
    rules.push({
      type: 'email',
      message: 'Please enter a valid email address',
    });
  }

  if (type === 'number') {
    rules.push({
      type: 'number',
      message: 'Please enter numeric value',
    });
  }

  if (type === 'password') {
    rules.push({
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message:
        customMessage ||
        `${label} must be at least 8 characters and include uppercase, lowercase, number, and special character`,
    });
  }

  // ✅ Fix: match actual field name and use functional validator
  if (fieldName === 'Confirm Password') {
    rules.push(({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || value === getFieldValue('password')) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(`${label} does not match Password`));
      },
    }));
  }

  if (pattern) {
    rules.push({
      pattern,
      message: customMessage || `Invalid ${label}`,
    });
  }

  return rules;
};
