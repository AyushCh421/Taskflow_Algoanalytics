export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
export const isStrongPassword = (password) => typeof password === 'string' && password.length >= 6;
