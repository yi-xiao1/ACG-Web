# ACG 档案馆

二次元作品收藏与分享社区。记录那些触动我们的故事。

## 技术栈

- **Vue 3**（Composition API + `<script setup>`）
- **Vue Router**（前端路由）
- **Pinia**（状态管理）
- **Vite**（构建工具）
- **marked**（Markdown 渲染）
- **纯 CSS**（无 UI 框架）

## 构建与运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后在浏览器打开终端输出的地址（默认 http://localhost:5173）。


## 首页数据添加

所有作品数据以 Markdown 文件形式存放在 `src/data/` 目录下，按分类存放：

```
src/data/
├── anime/   # 番剧
├── manga/   # 漫画
├── novel/   # 小说
└── game/    # 游戏
```

每个分类下每个作品一个 `.md` 文件，格式如下：

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
可以写多段文字、列表、引用等。
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 作品标题 |
| `cover` | 否 | 封面图片路径，图片放在 `public/covers/分类/` 下 |
| `tags` | 否 | 标签数组 |
| `publishDate` | 否 | 发布日期 |
| `url` | 否 | 外部链接 |
| `type` | 是 | 分类，必须和目录名一致（anime/manga/novel/game） |
| `id` | 是 | 唯一标识，用于路由，只能使用小写字母、数字、连字符 |

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

### 注意事项

- `id` **不能包含空格**，否则路由无法匹配
- 添加新 `.md` 文件后需要**重启 dev server**才能生效
- 正文部分支持完整的 Markdown 语法
- 留言部分没有做好

## 目录结构

```
src/
├── components/      # 公共组件
│   ├── CalendarWidget.vue
│   ├── NavBar.vue
│   ├── RichEditor.vue
│   ├── SidebarLayout.vue
│   ├── TagFilter.vue
│   └── WorkCard.vue
├── composables/     # 工具函数
│   └── useWorks.js
├── data/            # 作品数据（Markdown）
│   ├── anime/
│   ├── manga/
│   ├── novel/
│   └── game/
├── stores/          # Pinia 状态
│   ├── works.js
│   └── messages.js
├── styles/          # 全局样式
│   └── global.css
├── views/           # 页面
│   ├── HomeView.vue
│   ├── DetailView.vue
│   ├── MessageView.vue
│   ├── AboutView.vue
│   └── SearchView.vue
├── router/
│   └── index.js
├── App.vue
└── main.js
```
## 悄悄话
在hidden分支悄悄添加了功能更完善、指导更详细的能放进服务器部署的可用的网站。
hidden的项目在根据指导部署完成后，可以直接进入/admin页面直接对网站数据修改(当然需要进行配置的)，留言部分也做好了
