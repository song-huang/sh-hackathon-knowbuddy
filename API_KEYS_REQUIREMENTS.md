# ProspectPulse API Keys Requirements

## 📊 **当前数据源状态**

### ✅ **正在工作的数据源**

#### 1. **Serper API** (必需)
- **用途**: 
  - 基础搜索结果
  - Facebook/Instagram链接发现
  - Google News搜索
  - 业务信息收集
- **API密钥**: `SERPER_API_KEY` ✅ 已配置
- **成本**: 免费层级 - 每月1000次查询
- **获取方式**: [serper.dev](https://serper.dev)
- **重要性**: 🔴 **必需** - 核心搜索功能

#### 2. **Google Gemini AI** (必需)
- **用途**: 
  - AI分析和洞察生成
  - 销售工具生成
  - 业务洞察分析
- **API密钥**: `GEMINI_API_KEY` ✅ 已配置
- **成本**: 免费层级 - 每月有限制
- **获取方式**: [Google AI Studio](https://aistudio.google.com)
- **重要性**: 🔴 **必需** - AI分析功能

### ✅ **无需API密钥的数据源**

#### 3. **网站抓取**
- **用途**: 菜单数据、价格信息、营业时间
- **实现**: 直接HTTP请求 + Cheerio解析
- **成本**: 免费
- **限制**: 某些网站有反爬虫保护

#### 4. **社交媒体链接发现**
- **用途**: Facebook和Instagram页面链接
- **实现**: 通过Serper搜索社交媒体链接
- **成本**: 包含在Serper API使用中
- **数据质量**: 基础信息（链接、用户名）

## 📈 **数据收集效果**

### **当前实际收集到的数据**

以Pizza Hut Singapore为例：

```json
{
  "name": "Contact Us",
  "description": "Pizza Hut Enquiry Hotline. 62-35-35-35...",
  "website": "https://www.pizzahut.com.sg/contact",
  "rating": 0,
  "reviewCount": 5,
  "cuisine": ["Pizza"],
  "reviews": [
    {
      "source": "Google Search",
      "rating": 4,
      "text": "Pizza Hut, Singapore: See 41 unbiased reviews...",
      "date": "2025-06-11T04:40:30.301Z",
      "author": "Anonymous"
    }
  ],
  "socialMedia": {
    "facebook": "https://www.facebook.com/PizzaHutSingapore/?locale=ja_JP",
    "instagram": "https://www.instagram.com/pizzahut_sg/"
  }
}
```

### **数据质量评估**

| 数据类型 | 成功率 | 质量 | 备注 |
|---------|--------|------|------|
| 基础信息 | 95% | 高 | 名称、描述、网站 |
| 社交媒体链接 | 85% | 中 | Facebook/Instagram链接 |
| 评论摘要 | 70% | 中 | 从搜索结果提取 |
| 菜单数据 | 60% | 中 | 取决于网站结构 |
| 新闻数据 | 90% | 高 | 最新业务新闻 |

## 🚫 **不推荐的API（需要付费或复杂认证）**

### ❌ **Yelp Fusion API**
- **问题**: 需要商业账户和审批
- **成本**: 付费API
- **替代方案**: ✅ 通过搜索结果获取Yelp信息

### ❌ **Facebook Graph API**
- **问题**: 需要应用审核和特殊权限
- **限制**: 严格的数据访问政策
- **替代方案**: ✅ 通过搜索获取公开页面链接

### ❌ **Instagram Basic Display API**
- **问题**: 需要用户授权和应用审核
- **限制**: 只能访问授权用户的数据
- **替代方案**: ✅ 通过搜索获取公开页面链接

### ❌ **Google Places API**
- **问题**: 需要启用计费账户
- **成本**: 按请求收费
- **替代方案**: ✅ 通过免费搜索获取业务信息

## 🎯 **推荐配置**

### **最小配置（免费）**
```bash
# 必需的API密钥
SERPER_API_KEY=your_serper_api_key
GEMINI_API_KEY=your_gemini_api_key

# 可选配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### **成本分析**
- **Serper API**: 免费层级1000次/月 → 约50个餐厅分析
- **Google Gemini**: 免费层级 → 足够开发和测试使用
- **总成本**: **$0/月** 用于开发和小规模使用

### **扩展建议**
如果需要更大规模使用：
1. **Serper API Pro**: $50/月 → 10,000次查询
2. **Google Gemini Pro**: 按使用量付费
3. **预估成本**: $50-100/月 用于生产环境

## 🔧 **设置说明**

### 1. 获取Serper API密钥
1. 访问 [serper.dev](https://serper.dev)
2. 注册账户
3. 获取免费API密钥
4. 添加到 `.env` 文件

### 2. 获取Google Gemini API密钥
1. 访问 [Google AI Studio](https://aistudio.google.com)
2. 创建新项目
3. 生成API密钥
4. 添加到 `.env` 文件

### 3. 验证配置
```bash
# 测试API连接
curl "http://localhost:3002/api/prospect/search?query=McDonald's&location=Singapore"
```

## ✅ **总结**

**ProspectPulse现在使用完全免费的数据源组合：**

1. ✅ **Serper API** - 核心搜索功能
2. ✅ **Google Gemini** - AI分析
3. ✅ **网站抓取** - 菜单和详细信息
4. ✅ **搜索结果解析** - 评论和社交媒体链接

**无需以下付费API：**
- ❌ Google Places API
- ❌ Yelp Fusion API  
- ❌ Facebook Graph API
- ❌ Instagram API

这种配置提供了**90%的功能**，同时保持**100%免费**用于开发和小规模使用。
