import crypto from 'crypto';

export const generatePassword = (length = 8) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each category
    password += getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // Uppercase
    password += getRandomChar('abcdefghijklmnopqrstuvwxyz'); // Lowercase
    password += getRandomChar('0123456789'); // Number
    password += getRandomChar('!@#$%^&*'); // Special char
    
    // Fill the rest with random characters
    while (password.length < length) {
        password += charset[crypto.randomInt(0, charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => 0.5 - Math.random()).join('');
};

function getRandomChar(charset) {
    return charset[crypto.randomInt(0, charset.length)];
}

export const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};
