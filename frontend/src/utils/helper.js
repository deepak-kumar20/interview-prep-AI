export const validateEmail = (email) => {
  // Basic email pattern: some text + @ + some text + . + domain
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

export const getInitials = (title) => {
  if (!title) return "";
  const words = title.split(" ")
  let initials = "";
  for (let i = 0; i < Math.min(words.length, 2); i++){
    initials += words[i][0];
  }
  return initials.toUpperCase();
}