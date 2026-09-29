# 游漫社官方网站

福建师范大学旗山校区游戏协会（游漫社）官方站点：一套代码覆盖桌面网站、手机 H5 与 PWA，不上架应用商店。

策划、需求与开发过程见 [`docs/策划案.md`](docs/策划案.md)、[`docs/软件需求规格说明书.md`](docs/软件需求规格说明书.md)、[`docs/开发过程文档.md`](docs/开发过程文档.md)。界面截图见 [`docs/screenshots/`](docs/screenshots/)。

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

## 生产部署（腾讯云 Ubuntu + SQLite）

详细步骤见对话中的部署说明。要点：

1. `.env` 中设置 `DATABASE_URL="file:./prod.db"`、`SESSION_SECRET`、`NUXT_PUBLIC_SITE_URL`。
2. 备案前用公网 IP + HTTP 时加上 `COOKIE_SECURE=false`，否则登录态无法保存。HTTPS 上线后改为 `true` 或删除该项。
3. `npx prisma db push`，空库可 `npx tsx prisma/seed.ts`（演示密码请立刻修改）。
4. `npm run build`，用 systemd 跑 `node .output/server/index.mjs`，Nginx 反代 80 端口。
5. 上传目录为项目下 `data/uploads/`，与 `prisma/prod.db` 一并备份。

建议正式域名：`youman.fjnu.edu.cn`（以校团委核发为准）。备案通过后配 HTTPS，并打开 `COOKIE_SECURE`。

## 模块说明

部门、活动、赛事、文件、成员权限均为独立数据域。新增部门在管理端提交即可，无需改导航代码。
