
// Helper function to generate random password
export const generatePassword = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let password = '';
  
  // Generate 5 random letters
  for (let i = 0; i < 5; i++) {
    password += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 3 random numbers
  for (let i = 0; i < 3; i++) {
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return password;
};
