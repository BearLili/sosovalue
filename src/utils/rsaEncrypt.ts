const JSEncrypt = require('jsencrypt');

// RSA公钥
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAurH0QeBkoZoLft3Kw0iv
MciojN0XkoAY59m+gVX6cxbeFY6RQ02DI3/sYCQnX062r1uO6UXlnQ0CwUaRfvGC
OBrlHX5Bh81JVdsqjMkm/AgipG75dlZggwwBob/1p/EJhbJ3fl8LzBRmjNHS29uF
usRYGCr1y5gstz8JRXA1cg8QP8Zjl6TZ0OVwAXBI+BZaRkxv8uhvRTMzmmo6jK2Y
FlCVCmPhkrGR1lyhoKRs9L+DimuU5pZ8zlU5xMwy0yM8D5okC1/M3KAIGc+hDZzO
Gqb0WtjUa8izvmNjERiXlhAP48T6AY6IlnX3fAZBupru563Su6djmTOFT0awZAQi
LQIDAQAB
-----END PUBLIC KEY-----`;

/**
 * 同步版本的加密函数（为了兼容现有代码）
 * 直接使用真正的JSEncrypt库
 * @param password 需要加密的密码
 * @returns 加密后的密码字符串
 */
export function encryptPasswordRSASync(password: string): string {
  try {
    // 创建JSEncrypt实例
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(PUBLIC_KEY);
    
    const encrypted = encrypt.encrypt(password);
    
    if (!encrypted) {
      throw new Error('RSA加密失败，可能是公钥格式错误或明文过长');
    }
    
    return encrypted;
  } catch (error) {
    console.error('RSA encryption failed:', error);
    throw new Error('RSA加密失败，可能是公钥格式错误或明文过长');
  }
}
