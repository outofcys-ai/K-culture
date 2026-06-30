// 빌드 결과물을 단일 dist/ 폴더로 합치는 배포 스크립트
import { cpSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");

const subApps = [
  { src: join(root, "k-wave", "dist"), dest: join(dist, "k-wave") },
  { src: join(root, "HanBok", "dist"), dest: join(dist, "hanbok") },
];

for (const { src, dest } of subApps) {
  if (!existsSync(src)) {
    console.error(`빌드 결과물 없음: ${src}`);
    process.exit(1);
  }
  cpSync(src, dest, { recursive: true });
  console.log(`복사 완료: ${src} → ${dest}`);
}

console.log("dist/ 병합 완료.");
