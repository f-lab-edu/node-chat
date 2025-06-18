// scripts/generate-devlog.js
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// 커밋 메시지 파일 경로에서 메시지 추출
const commitMsgFile = process.argv[2];
const commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim();

// 1. 줄별로 나눔
const lines = commitMsg.split('\n');

// 2. 주석(#) 줄 제외
const filtered = lines.filter(
  (line) => !line.trim().startsWith('#') && line.trim() !== '',
);

// 3. 필터링된 내용 구성
const cleanedMessage = filtered.join('\n');

console.log('[devlog] commit message content:', cleanedMessage);

// 변경된 파일 목록 추출
const changedFiles = execSync('git diff --cached --name-only')
  .toString()
  .split('\n')
  .filter(Boolean);

// 날짜
const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
const devlogDir = path.resolve(__dirname, '../devlog');
const devlogFile = path.join(devlogDir, `${today}.md`);

// devlog 폴더 없으면 생성
if (!fs.existsSync(devlogDir)) {
  fs.mkdirSync(devlogDir);
}

// 템플릿 작성
const content = `
📅 ${today}

✅ 커밋: ${cleanedMessage}
📝 변경 파일:
${changedFiles.map((f) => `- ${f}`).join('\n')}

📌 다음 할 일:
- 
`;

fs.writeFileSync(devlogFile, content, { flag: 'a' });

console.log(`✅ 개발일지 기록 완료 → ${devlogFile}`);
