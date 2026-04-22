export const validateUser = (values) => {
  let errors = {};

  // First Name: Required, min 3 chars
  if (!values.firstName) {
    errors.firstName = "First name is required";
  } else if (values.firstName.length < 3) {
    errors.firstName = "First name must be at least 3 characters";
  }

  // Last Name: Required
  if (!values.lastName) {
    errors.lastName = "Last name is required";
  }

  // Email: Valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Phone: 10 digits
  const phoneRegex = /^\d{10}$/;
  if (!values.phone) {
    errors.phone = "Phone number is required";
  } else if (!phoneRegex.test(values.phone)) {
    errors.phone = "Phone must be exactly 10 digits";
  }

  return errors;
};