
import fs from "fs";
import { ImapFlow } from "imapflow";
import path from "path";

const configPath = path.resolve(__dirname, "../../config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const confEmail = config.email;
const pass = config.password;

export async function authorize(retries: number = 1): Promise<ImapFlow> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const client = new ImapFlow({
      host: "imap.gmail.com",
      port: 993,
      secure: false,
      auth: {
        user: confEmail,
        pass: pass,
      },
      logger: false,
      // 添加连接超时设置
      socketTimeout: 30000,
      greetingTimeout: 30000,
      connectionTimeout: 30000,
    });

    try {
      console.log(`[${attempt}/${retries}] Attempting to connect to Gmail IMAP...`);
      await client.connect();
      console.log("✅ Successfully connected to Gmail IMAP server");
      return client;
    } catch (err) {
      console.error(`❌ Error connecting to IMAP server (attempt ${attempt}/${retries}):`, err);
      
      // 确保客户端被正确关闭
      try {
        await client.close();
      } catch (closeErr) {
        // 忽略关闭错误
      }

      if (attempt === retries) {
        console.error("🔴 All IMAP connection attempts failed");
        throw new Error(`Failed to connect to Gmail IMAP after ${retries} attempts: ${(err as Error).message}`);
      }

      // 等待后重试
      const waitTime = attempt * 2000; // 递增等待时间: 2s, 4s, 6s...
      console.log(`⏳ Waiting ${waitTime/1000}s before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw new Error("Unexpected error in authorize function");
}

