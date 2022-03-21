
/**
 * Validate username
 * Returns error message if invalid, false if valid.
 */
const validateUsername = (username: string) => {
  if (username.length < 3) {
    // show error message
    return 'Name must be at least 3 characters.';
  } else if (username.length > 20) {
    return 'Up to 15 characters allowed for name.';
  } else if (!username.match(/[a-zA-Z0-9]/)) {
    return 'Only alphanumerics allowed.'
  } else return false;
}

export {
  validateUsername
}