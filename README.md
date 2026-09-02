# 游漫社官方网站

福建师范大学旗山校区游戏协会（游漫社）官方站点：一套代码覆盖桌面网站、手机 H5 与 PWA，不上架应用商店。

策划与素材清单见 [`docs/策划案.md`](docs/策划案.md)、[`docs/素材与信息清单.md`](docs/素材与信息清单.md)。

## 本地运行

需要 Node.js 18 或以上。

```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

浏览器打开 http://localhost:3000 。

演示账号密码均为 `Youman@2024`：

| 学号 | 身份 |
| --- | --- |
| 20210001 | 社长 |
| 20210002 | 管理层 |
| 20210003 | 电竞部部长 |
| 20210004 | 研发部部长 |
| 20210005 | 社员 |
| 20210006 | 待审核 |

## 生产部署（学生云 + 学校二级域名）

1. 将 Prisma 数据源改为 MySQL 8：修改 `prisma/schema.prisma` 中 `provider = "mysql"`，`.env` 填写 `DATABASE_URL`。
2. `npx prisma db push && npx tsx prisma/seed.ts`（或自行导入社长账号，勿在正式库重复种子演示数据）。
3. `npm run build`，用 Nginx 反代 Node（`node .output/server/index.mjs`），配置 HTTPS。
4. 上传目录为项目下 `data/uploads/`，请纳入备份。
5. 修改 `.env` 中的 `SESSION_SECRET`。

建议域名：`youman.fjnu.edu.cn`（以校团委核发为准）。

## 模块说明

部门、活动、赛事、文件、成员权限均为独立数据域。新增部门在管理端提交即可，无需改导航代码。
