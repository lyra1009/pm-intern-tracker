# 27届PM实习生阶段跟踪看板 - 部署说明

## 部署步骤

### 1. 创建 GitHub 仓库
- 在 GitHub 创建私有仓库（建议私有，代码更安全）
- 将 `deploy` 文件夹内的所有文件上传到仓库根目录

### 2. 设置密码（重要）
1. 进入仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. Name: `SITE_PASSWORD`
4. Value: 你的访问密码（例如：`27PM2025`）
5. 点击 "Add secret"

### 3. 启用 GitHub Pages
1. 进入仓库 → Settings → Pages
2. Source: 选择 "GitHub Actions"
3. 保存

### 4. 触发部署
- 推送代码后会自动部署
- 或手动运行：Actions → Deploy to GitHub Pages → Run workflow

### 5. 访问
- 部署完成后，在 Actions 页面或 Settings → Pages 查看访问链接
- 首次访问需要输入密码

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 登录页（密码验证） |
| `auth.js` | 认证逻辑（构建时注入密码） |
| `tracker.html` | 主看板页面 |
| `.github/workflows/deploy.yml` | 自动部署配置 |

---

## 安全说明

1. **密码存储**：密码通过 GitHub Secrets 存储，不会暴露在代码中
2. **前端安全**：认证 token 存储在 localStorage，24小时过期
3. **代码安全**：建议仓库设为私有，避免敏感信息泄露
4. **传输安全**：GitHub Pages 默认使用 HTTPS

---

## 本地开发

如需本地测试，直接打开 `index.html`，默认密码为 `27PM`（开发模式）。

生产环境密码通过 GitHub Actions 注入。
