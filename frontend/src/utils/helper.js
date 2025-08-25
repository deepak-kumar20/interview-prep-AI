export const validateEmail = (email) => {
  // Basic email pattern: some text + @ + some text + . + domain
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};
