# ProspectPulse

AI 驱动的销售智能工具，为 StoreHub 销售团队提供餐饮业潜在客户分析。

## 项目概述

ProspectPulse 是一款专为 StoreHub 销售代表设计的 AI 驱动销售智能工具，旨在帮助销售人员更好地分析和了解潜在的餐饮业客户。该工具允许销售代表快速生成全面的潜在客户简报，提供最新的公司信息、近期新闻、社交媒体活动和业务洞察，并生成针对餐饮企业的定制对话开场白和预测潜在异议。

### 核心功能

- **快速客户分析**：输入企业名称或网站域名，获取综合分析
- **公司简介生成**：自动生成包含关键业务信息的简洁公司简介
- **对话开场白**：生成针对特定餐饮企业的个性化对话开场白
- **潜在异议预测**：预测可能的销售异议并提供应对建议
- **响应式设计**：适合销售代表在任何设备上使用

## 技术栈

- **前端**：Next.js + Tailwind CSS
- **后端**：Node.js + Express
- **AI**：Groq API (Llama-3/Gemini)
- **数据**：Serper API + Web 抓取

## 快速开始

### 前提条件

- Node.js 18+
- npm 或 yarn
- Groq API 密钥
- Serper API 密钥

### 安装

1. 克隆仓库
```bash
git clone https://github.com/yourusername/prospect-pulse.git
cd prospect-pulse
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，添加必要的 API 密钥
```

4. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

5. 访问 http://localhost:3000 查看应用

## 项目结构

```
prospect-pulse/
├── docs/                  # 项目文档
│   └── technical-specification.md  # 技术规格文档
├── public/                # 静态资源
├── src/
│   ├── components/        # UI 组件
│   ├── pages/             # Next.js 页面
│   ├── services/          # 后端服务
│   ├── utils/             # 工具函数
│   └── styles/            # 样式文件
├── .env.example           # 环境变量示例
├── package.json           # 项目依赖
└── README.md              # 项目说明
```

## 贡献指南

这是一个黑客马拉松项目，欢迎贡献！请遵循以下步骤：

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

MIT

## 联系方式

项目团队 - [your-email@example.com](mailto:your-email@example.com)

项目链接: [https://github.com/yourusername/prospect-pulse](https://github.com/yourusername/prospect-pulse)
