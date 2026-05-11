# ACG 档案馆

二次元作品收藏与分享网站。记录那些触动我们的动画、漫画、小说和游戏。

## 技术栈

- **前端框架**: Vue 3（Composition API + `<script setup>`）
- **路由**: Vue Router（`createWebHistory`）
- **状态管理**: Pinia
- **构建工具**: Vite 6
- **Markdown 渲染**: marked
- **样式**: 纯 CSS 自定义属性（无 UI 框架）
- **部署**: Cloudflare Pages
- **数据存储**: Cloudflare KV（留言板）
- **内容管理**: Pages CMS（可视化编辑）+ GitHub API（隐藏管理后台）

## 目录结构

```
describe/
├── functions/
│   └── api/
│       └── messages.js       # Pages Functions - 留言板 API
├── public/
│   ├── covers/               # 封面图片目录
│   │   ├── anime/
│   │   ├── manga/
│   │   ├── novel/
│   │   └── game/
│   └── _redirects            # Cloudflare Pages SPA 路由重定向
├── src/
│   ├── components/           # 公共组件
│   │   ├── CalendarWidget.vue
│   │   ├── NavBar.vue
│   │   ├── RichEditor.vue    # 富文本编辑器（留言板用）
│   │   ├── SidebarLayout.vue
│   │   ├── TagFilter.vue
│   │   └── WorkCard.vue
│   ├── composables/
│   │   └── useWorks.js       # Markdown 前置元解析
│   ├── data/                 # 作品数据（Markdown 文件）
│   │   ├── anime/
│   │   ├── manga/
│   │   ├── novel/
│   │   └── game/
│   ├── stores/
│   │   ├── works.js          # 作品数据 Pinia store
│   │   └── messages.js       # 留言板 Pinia store
│   ├── styles/
│   │   └── global.css        # 全局样式变量
│   ├── views/
│   │   ├── HomeView.vue      # 首页
│   │   ├── DetailView.vue    # 作品详情页
│   │   ├── MessageView.vue   # 留言板
│   │   ├── AboutView.vue     # 关于页面
│   │   ├── SearchView.vue    # 搜索页
│   │   └── AdminView.vue     # 隐藏管理后台
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── .pages.yml                # Pages CMS 配置文件
├── index.html
├── package.json
└── vite.config.js
```

## 快速开始

### 本地开发

```bash
cd describe
npm install
npm run dev
```

启动后在浏览器打开 `http://localhost:5173`。

### 生产构建

```bash
npm run build       # 构建到 dist/
npm run preview     # 预览构建结果
```

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 作品分类展示、标签筛选 |
| `/detail/:type/:id` | 详情页 | 作品详情 + Markdown 正文 |
| `/message` | 留言板 | 支持富文本编辑，数据存储在 Cloudflare KV |
| `/about` | 关于 | 站点介绍 |
| `/search?q=` | 搜索 | 按标题搜索 |
| `/admin?psw=123` | 管理后台 | 数据 CRUD 操作 |

## 作品数据管理

### 添加作品

所有作品数据以 Markdown 文件形式存放在 `src/data/` 目录下，按分类存放：

```
src/data/
├── anime/   # 番剧
├── manga/   # 漫画
├── novel/   # 小说
└── game/    # 游戏
```

每个作品一个 `.md` 文件，格式如下：

```markdown
---
title: "作品名称"
cover: "/covers/分类/图片文件名.jpg"
tags: ["标签1", "标签2"]
publishDate: "2020-10-09"
url: "https://相关链接"
type: "anime"
id: "作品唯一标识"
---

这里是作品正文，支持 **Markdown** 格式。
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 作品标题 |
| `cover` | 否 | 封面图片路径 |
| `tags` | 否 | 标签数组 |
| `publishDate` | 否 | 发布日期 |
| `url` | 否 | 外部链接 |
| `type` | 是 | 分类（anime/manga/novel/game） |
| `id` | 是 | 唯一标识，小写字母+连字符 |

### 封面图片

图片放在 `public/covers/` 下对应的分类目录中：

```
public/covers/
├── anime/
├── manga/
├── novel/
└── game/
```

路径写法示例：`cover: "/covers/anime/图片名.jpg"`

## 隐藏管理后台

访问 `/admin?psw=123` 进入管理后台，支持：

- **新增作品**: 填写表单，自动生成 Markdown 文件
- **编辑作品**: 修改已有作品的内容
- **删除作品**: 删除作品文件
- **封面上传**: 选择图片自动上传到对应分类目录
- **正文编辑**: 支持 Markdown 语法快捷工具栏

管理后台通过 GitHub Contents API 直接提交文件到仓库，需要配置 GitHub Personal Access Token（`repo` 权限）。Token 保存在浏览器本地存储中。

## Pages CMS

项目配置了 `.pages.yml`，支持通过 [Pages CMS](https://app.pagescms.org) 可视化编辑内容：

1. 访问 `https://app.pagescms.org` 连接你的 GitHub 仓库
2. 在可视化界面中新增/编辑作品
3. 变更会自动提交到 GitHub 仓库

注意：`.pages.yml` 中不能使用 YAML 锚点，Pages CMS 解析器可能不支持。

## Cloudflare 部署

### Pages 构建设置

| 配置项 | 值 |
|--------|-----|
| Build command | `npm run build` |
| Build output | `dist` |
| Deploy command | `true` |

### KV 绑定（留言板）

1. 在 Cloudflare Dashboard 创建一个 KV namespace（如 `messages`）
2. 在 Pages 项目 Settings → Bindings 中添加 KV 绑定：
   - 变量名：`MESSAGES`
   - 选择刚创建的 namespace
3. 重新部署项目

### 环境变量

留言板使用 Cloudflare KV 存储数据，无需额外环境变量。

## 注意事项

- **Vite 版本**: 使用 Vite 6.x（Rollup），不要升级到 Vite 7+。Vite 7/8 使用 Rolldown（Rust 打包器），对 `import.meta.glob` + `as: 'raw'` 存在兼容性问题。
- **密码安全**: 管理后台密码硬编码在源码中，仅供简单保护，不能用于生产环境的安全验证。
- **仓库权限**: 建议使用私有 GitHub 仓库，Token 不要写死在代码中。
