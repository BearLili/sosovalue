import * as crypto from 'crypto';

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

// 全局加密器实例（完全模拟目标项目的单例模式）
let globalEncryptor: JSEncryptLike | null = null;

/**
 * 模拟JSEncrypt的接口和行为
 */
interface JSEncryptLike {
  setPublicKey(key: string): void;
  encrypt(text: string): string | null;
}

/**
 * JSEncrypt兼容的加密器类
 * 完全模拟目标项目中使用的JSEncrypt库的行为
 */
class JSEncryptCompatible implements JSEncryptLike {
  private publicKey: string = '';

  /**
   * 设置公钥 - 完全模拟JSEncrypt的setPublicKey方法
   * @param key PEM格式的公钥字符串
   */
  setPublicKey(key: string): void {
    this.publicKey = key;
  }

  /**
   * 加密方法 - 完全模拟JSEncrypt的encrypt方法
   * @param text 要加密的文本
   * @returns 加密后的base64字符串，失败时返回null
   */
  encrypt(text: string): string | null {
    try {
      if (!this.publicKey) {
        console.error('Public key not set');
        return null;
      }

      // 使用Node.js内置crypto模块进行RSA加密
      // 使用PKCS1 padding，这是JSEncrypt默认的padding方式
      const encrypted = crypto.publicEncrypt(
        {
          key: this.publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING
        },
        Buffer.from(text, 'utf8')
      );

      return encrypted.toString('base64');
    } catch (error) {
      console.error('RSA encryption failed:', error);
      return null;
    }
  }
}

/**
 * 模拟目标项目的异步加密函数
 * 完全模拟混淆代码中的行为：
 * 1. 使用单例模式
 * 2. 异步初始化（模拟动态导入）
 * 3. 设置公钥
 * 4. 调用encrypt方法
 */
async function initializeJSEncrypt(): Promise<JSEncryptLike> {
  if (!globalEncryptor) {
    // 模拟目标项目的异步加载过程：await n.e(8361).then(n.bind(n, 98361))
    // 这里我们直接创建实例，但保持异步接口
    await new Promise(resolve => setTimeout(resolve, 0)); // 模拟异步加载
    
    globalEncryptor = new JSEncryptCompatible();
    // 模拟目标项目的公钥设置：(a = new e).setPublicKey("...")
    globalEncryptor.setPublicKey(PUBLIC_KEY);
  }
  return globalEncryptor;
}

/**
 * 主加密函数，完全模拟目标项目的加密方式
 * 对应混淆代码中的：let t = a.encrypt(e);
 * @param password 需要加密的密码
 * @returns 加密后的密码字符串
 */
export async function encryptPasswordRSA(password: string): Promise<string> {
  try {
    const encryptor = await initializeJSEncrypt();
    const encrypted = encryptor.encrypt(password);
    
    if (!encrypted) {
      throw new Error('RSA加密失败，可能是公钥格式错误或明文过长');
    }
    
    return encrypted;
  } catch (error) {
    console.error('Password encryption failed:', error);
    throw new Error('RSA加密失败，可能是公钥格式错误或明文过长');
  }
}

/**
 * 同步版本的加密函数（为了兼容现有代码）
 * 直接使用JSEncrypt兼容的加密器
 * @param password 需要加密的密码
 * @returns 加密后的密码字符串
 */
export function encryptPasswordRSASync(password: string): string {
  try {
    // 创建临时的加密器实例
    const encryptor = new JSEncryptCompatible();
    encryptor.setPublicKey(PUBLIC_KEY);
    
    const encrypted = encryptor.encrypt(password);
    
    if (!encrypted) {
      throw new Error('RSA加密失败，可能是公钥格式错误或明文过长');
    }
    
    return encrypted;
  } catch (error) {
    console.error('RSA encryption failed:', error);
    throw new Error('RSA加密失败，可能是公钥格式错误或明文过长');
  }
}

// 导出JSEncrypt兼容类，以便其他地方可以使用
export { JSEncryptCompatible };
