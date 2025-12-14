// Default profile avatar as a data URI (Instagram-style user silhouette)
export const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Ccircle cx='64' cy='64' r='64' fill='%23e4e6eb'/%3E%3Ccircle cx='64' cy='47' r='22' fill='%23bcc0c4'/%3E%3Cpath d='M64 78c-28 0-46 16-46 38a64 64 0 0 0 92 0c0-22-18-38-46-38z' fill='%23bcc0c4'/%3E%3C/svg%3E";

// Function to get avatar URL with fallback (Instagram-style)
export const getAvatarUrl = (imageUrl, name = "User") => {
  // If user has a real uploaded image (not from ui-avatars), use it
  if (imageUrl && !imageUrl.includes('ui-avatars.com') && !imageUrl.includes('via.placeholder')) {
    return imageUrl;
  }
  
  // Return Instagram-style default avatar
  return DEFAULT_AVATAR;
};

// Alternative: Use initials-based avatar
export const getInitialsAvatar = (name = "User") => {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=e4e6eb&color=65676b&size=128&bold=true`;
};

// Get avatar with name fallback (shows initials if name provided, otherwise default silhouette)
export const getDefaultAvatar = (name = "User") => {
  if (!name || name === "User") return DEFAULT_AVATAR;
  return DEFAULT_AVATAR; // Always use Instagram-style silhouette
};
