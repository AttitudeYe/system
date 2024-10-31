const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const password = 'password'; // 密钥
const key = crypto.scryptSync(password, 'salt', 32);
const iv = crypto.randomBytes(16); // 初始化向量

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

const decrypt = (encrypted) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log(decrypted, '=-----');
    
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
}