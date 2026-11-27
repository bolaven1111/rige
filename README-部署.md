# 日格 PWA 部署说明

这个目录已经是可部署的 PWA 结构，不是单个 HTML 文件。

## 文件清单

- `index.html`：日格应用主体（原 `rige.html`）
- `manifest.webmanifest`：PWA 名称、图标、启动方式
- `sw.js`：离线缓存和版本更新
- `icons/`：180 / 192 / 512 图标和 favicon
- `README-部署.md`：本说明

## 必须满足

1. 用 **HTTPS** 打开；`file://` 直接打开不能启用 Service Worker，只能当普通网页。
2. `sw.js` 必须和 `index.html` 放在同一个目录，并且能通过 `https://你的域名/sw.js` 访问。
3. 不要把 `index.html` 改名，也不要把它放到子目录而让 `sw.js` 留在根目录，否则 scope 会不匹配。
4. 手机和电脑访问的是同一个固定网址。换域名等于换了一个新的本地数据空间，旧任务不会自动迁移。

## 推荐部署方式

### Cloudflare Pages

1. 登录 Cloudflare Pages，创建一个新项目。
2. 选择“直接上传”或连接 Git 仓库。
3. 把整个 `日格PWA` 目录（不是只传 `index.html`）上传。
4. 部署完成后得到 `https://xxx.pages.dev` 地址。
5. 用 iPhone Safari 打开这个地址。

### GitHub Pages

1. 新建一个仓库，把 `日格PWA` 里的所有文件放到仓库根目录。
2. 在仓库 Settings → Pages 里选择部署分支和根目录。
3. 等待 Pages 生成 `https://你的用户名.github.io/仓库名/`。
4. 在 iPhone Safari 打开这个地址。

如果使用子目录地址，确保 `index.html`、`manifest.webmanifest`、`sw.js` 都在这个子目录里；当前代码用的是相对路径。

## iPhone 安装

1. Safari 打开 HTTPS 地址（不要用微信内置浏览器）。
2. 点底部“分享”。
3. 选择“添加到主屏幕”。
4. 名称填“日格”，点“添加”。
5. 从主屏图标启动，确认是独立窗口、没有 Safari 地址栏。

第一次打开需要联网，之后 Service Worker 会缓存页面，断网也能打开。

## 数据迁移（重要）

旧版本的任务可能保存在 `file://` 或旧网址的本地存储里。迁移到新的 HTTPS 来源时，不会自动读取旧数据。

1. 先打开旧版本页面。
2. 进“设置”→“导出备份”，保存 JSON。
3. 安装 PWA 后进“设置”→“导入备份”，选择刚才的 JSON。
4. 检查任务、日期、备注是否完整。

之后只要不换域名、不删除主屏图标、不清除 Safari 网站数据，更新代码不会清空任务。

## 以后改需求怎么更新

不需要重新下载或重新安装。

1. 改 `index.html`。
2. 打开 `sw.js`，把 `CACHE_NAME` 从 `rige-pwa-v1-3-0` 改成新版本，例如 `rige-pwa-v1-3-1`。
3. 重新部署同一网址。
4. iPhone 上彻底关闭日格（从多任务里划掉），再打开；必要时打开两次，让新 Service Worker 接管。

如果页面仍是旧版：

- 确认 `sw.js` 确实更新了版本号；
- 确认浏览器访问的是同一个域名；
- 在 Safari 设置里清除该网站数据会强制刷新，但也会清空任务，操作前先导出备份。

## 本地预览（只在电脑上验证）

在 `日格PWA` 目录执行：

```bash
python3 -m http.server 8765
```

电脑浏览器打开 `http://localhost:8765/`。localhost 被视为安全上下文，可以测试 Service Worker；但这个地址不能直接拿去 iPhone 上安装，手机安装必须用 HTTPS 静态地址。
