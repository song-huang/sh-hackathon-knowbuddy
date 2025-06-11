# ProspectPulse 项目结构

## 概述

ProspectPulse 采用现代化的 Next.js 15 架构，使用 App Router 和 TypeScript。项目结构遵循 Next.js 最佳实践，并针对 AI 驱动的销售智能工具进行了优化。

## 目录结构

```
prospect-pulse/
├── docs/                           # 项目文档
│   ├── technical-specification.md  # 技术规格文档
│   └── project-structure.md        # 项目结构说明（本文件）
├── public/                         # 静态资源
│   ├── *.svg                      # 图标文件
│   └── favicon.ico                # 网站图标
├── src/                           # 源代码目录
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API 路由
│   │   │   └── prospect/          # 潜在客户相关 API
│   │   │       ├── search/        # 搜索端点
│   │   │       │   └── route.ts   # GET /api/prospect/search
│   │   │       └── analyze/       # 分析端点
│   │   │           └── route.ts   # POST /api/prospect/analyze
│   │   ├── globals.css            # 全局样式
│   │   ├── layout.tsx             # 根布局组件
│   │   ├── page.tsx               # 主页面
│   │   └── favicon.ico            # 应用图标
│   ├── components/                # React 组件
│   │   ├── SearchComponent.tsx    # 搜索输入组件
│   │   ├── ResultCard.tsx         # 结果展示组件
│   │   └── LoadingState.tsx       # 加载状态组件
│   ├── services/                  # 业务服务层
│   │   ├── gemini.ts             # Google Gemini AI 服务
│   │   └── dataCollection.ts     # 数据收集服务
│   ├── types/                     # TypeScript 类型定义
│   │   └── index.ts              # 核心数据类型
│   ├── utils/                     # 工具函数
│   │   └── index.ts              # 通用工具函数
│   └── middleware.ts             # Next.js 中间件
├── .env.example                   # 环境变量示例
├── package.json                   # 项目依赖和脚本
├── tsconfig.json                  # TypeScript 配置
├── tailwind.config.js             # Tailwind CSS 配置
├── next.config.ts                 # Next.js 配置
└── README.md                      # 项目说明
```

## 核心组件说明

### 1. API 层 (`src/app/api/`)

#### 搜索端点 (`/api/prospect/search`)
- **功能**: 根据公司名称或域名搜索潜在客户信息
- **方法**: GET
- **参数**: `query` (必填)
- **返回**: 搜索结果和基础公司信息

#### 分析端点 (`/api/prospect/analyze`)
- **功能**: 深度分析潜在客户并生成销售工具
- **方法**: POST
- **输入**: 搜索结果数据
- **返回**: 完整的分析报告和销售建议

### 2. 服务层 (`src/services/`)

#### Gemini AI 服务 (`gemini.ts`)
- 集成 Google Gemini API
- 生成潜在客户简介
- 创建业务洞察
- 生成销售工具和对话开场白

#### 数据收集服务 (`dataCollection.ts`)
- 集成 Serper API 进行搜索
- 基础网页抓取功能
- 数据清洗和结构化

### 3. 组件层 (`src/components/`)

#### 搜索组件 (`SearchComponent.tsx`)
- 用户输入界面
- 搜索历史管理
- 输入验证和自动完成

#### 结果卡片 (`ResultCard.tsx`)
- 分析结果展示
- 可折叠的信息部分
- 一键复制功能

#### 加载状态 (`LoadingState.tsx`)
- 多阶段加载指示器
- 进度条和状态提示
- 用户体验优化

### 4. 类型系统 (`src/types/`)

定义了完整的 TypeScript 类型系统：
- `Prospect`: 潜在客户基础信息
- `Analysis`: 完整分析结果
- `ProspectProfile`: 客户简介
- `BusinessInsights`: 业务洞察
- `SalesTools`: 销售工具
- API 请求/响应类型

### 5. 工具函数 (`src/utils/`)

提供通用工具函数：
- URL 验证和域名提取
- 日期格式化
- 文本处理和关键词提取
- 置信度计算

## 技术栈详情

### 前端技术
- **Next.js 15**: React 框架，使用 App Router
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架
- **React Hooks**: 状态管理

### 后端技术
- **Next.js API Routes**: 服务端 API
- **Google Gemini API**: AI 文本生成
- **Serper API**: 搜索数据源
- **Fetch API**: HTTP 客户端

### 开发工具
- **ESLint**: 代码质量检查
- **TypeScript**: 静态类型检查
- **Tailwind CSS**: 样式开发

## 数据流

1. **用户输入** → SearchComponent
2. **搜索请求** → `/api/prospect/search`
3. **数据收集** → DataCollectionService → Serper API
4. **分析请求** → `/api/prospect/analyze`
5. **AI 处理** → GeminiService → Google Gemini API
6. **结果展示** → ResultCard

## 环境配置

### 必需的环境变量
```bash
GEMINI_API_KEY=your_gemini_api_key_here
SERPER_API_KEY=your_serper_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 可选的功能标志
```bash
ENABLE_SOCIAL_MEDIA=false
ENABLE_SENTIMENT_ANALYSIS=false
ENABLE_EXPORT=false
```

## 部署考虑

### 生产环境要求
- Node.js 18+
- 有效的 Gemini API 密钥
- 有效的 Serper API 密钥
- HTTPS 支持（用于 API 调用）

### 性能优化
- 组件懒加载
- API 响应缓存
- 图片优化
- 代码分割

## 扩展性

项目架构支持以下扩展：
- 新的数据源集成
- 额外的 AI 模型
- 更多的 UI 组件
- 高级分析功能
- 用户认证系统
- 数据持久化

## 安全考虑

- API 密钥环境变量管理
- CORS 配置
- 输入验证和清理
- 安全头部设置
- 错误处理和日志记录
