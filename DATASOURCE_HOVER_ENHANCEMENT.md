# DataSources 悬停和URL显示增强

## 🎯 **功能概述**

我已经成功为 DataSources 组件添加了悬停事件和URL显示功能，特别针对搜索类型的数据源进行了特殊处理。

## ✅ **新增功能**

### **1. 悬停显示详细信息**
- **丰富的工具提示**: 悬停时显示完整的数据源信息
- **URL完整显示**: 在工具提示中显示完整的URL地址
- **平台特定信息**: 显示数据源的具体平台名称
- **质量指标**: 显示置信度评分和数据点数量
- **时间戳**: 显示数据分析的时间

### **2. 搜索源特殊处理**
- **视觉突出**: 搜索类型的数据源有特殊的绿色边框高亮
- **特殊标识**: 在工具提示中显示"SEARCH"标签
- **URL强调**: 搜索源的URL使用不同颜色显示

### **3. 交互功能**
- **点击复制**: 点击任何数据源标签复制URL到剪贴板
- **成功通知**: 复制成功后显示确认通知
- **悬停动画**: 平滑的缩放和阴影效果

## 🔧 **技术实现**

### **1. 状态管理**
```typescript
const [hoveredSource, setHoveredSource] = useState<number | null>(null);
const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
```

### **2. 鼠标事件处理**
```typescript
const handleMouseEnter = (event: React.MouseEvent, index: number) => {
  const rect = event.currentTarget.getBoundingClientRect();
  setTooltipPosition({
    x: rect.left + rect.width / 2,
    y: rect.top - 10
  });
  setHoveredSource(index);
};

const handleMouseLeave = () => {
  setHoveredSource(null);
};
```

### **3. URL复制功能**
```typescript
const handleCopyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  } catch (error) {
    console.error('Failed to copy URL:', error);
  }
};
```

### **4. 搜索源特殊样式**
```typescript
const getPlatformStyle = (type: string) => {
  const styleMap: Record<string, string> = {
    // ... 其他平台样式
    'search': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 ring-2 ring-green-300',
  };
  return styleMap[type] || 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
};

const isSearchSource = source.type === 'search';
```

## 🎨 **视觉设计**

### **1. 工具提示设计**
```typescript
<div className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg max-w-sm">
  <div className="space-y-1">
    <div className="flex items-center space-x-2">
      <span className="text-lg">{displayInfo.icon}</span>
      <div className="font-semibold text-yellow-300">{displayInfo.name}</div>
      {isSearchSource && (
        <span className="bg-green-600 text-white px-1.5 py-0.5 rounded text-xs">SEARCH</span>
      )}
    </div>
    <div className="text-gray-300">{displayInfo.description}</div>
    <div className="border-t border-gray-700 pt-2 mt-2">
      <div className={`break-all ${isSearchSource ? 'text-green-300' : 'text-blue-300'}`}>
        <span className="font-medium">🔗 URL: </span>
        <span className="font-mono text-xs bg-gray-800 px-1 py-0.5 rounded">
          {source.url}
        </span>
      </div>
      {/* 更多信息... */}
    </div>
  </div>
</div>
```

### **2. 成功通知设计**
```typescript
{copiedUrl && (
  <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
    <div className="flex items-center space-x-2">
      <span>✅</span>
      <span className="font-medium">URL copied to clipboard!</span>
    </div>
    <div className="text-xs text-green-100 mt-1 break-all max-w-xs">
      {copiedUrl.length > 50 ? copiedUrl.substring(0, 47) + '...' : copiedUrl}
    </div>
  </div>
)}
```

### **3. 搜索源高亮样式**
- **绿色背景**: `bg-green-100 text-green-800`
- **特殊边框**: `ring-2 ring-green-300`
- **悬停效果**: `hover:bg-green-200 hover:scale-105`
- **工具提示标识**: 绿色"SEARCH"标签

## 📊 **功能对比**

### **之前的实现**
- ✅ 基础的 `title` 属性显示信息
- ✅ 简单的数据源标签
- ❌ 没有URL的突出显示
- ❌ 没有交互功能
- ❌ 没有搜索源的特殊处理

### **现在的实现**
- ✅ 丰富的悬停工具提示
- ✅ **URL完整显示和复制功能**
- ✅ **搜索源特殊高亮处理**
- ✅ 点击复制URL到剪贴板
- ✅ 成功通知反馈
- ✅ 平台特定的视觉样式
- ✅ 质量指标和时间戳显示
- ✅ 响应式工具提示定位

## 🧪 **测试验证**

### **测试页面** (`/datasource-hover-test`)
包含以下测试场景：

#### **1. 标准数据源测试**
- 14个不同类型的数据源
- 包含搜索源、专业平台、评价网站、社交媒体等
- 验证悬停效果和URL显示

#### **2. 长URL处理测试**
- 测试超长URL的显示和处理
- 验证工具提示中的URL换行
- 测试复制通知中的URL截断

#### **3. 空数据源测试**
- 验证默认显示状态
- 确保没有数据源时的正常显示

#### **4. 搜索源专项测试**
- 只显示搜索类型的数据源
- 验证特殊高亮效果
- 测试搜索源的特殊标识

### **测试用例**
```typescript
// 搜索源示例
{
  type: 'search',
  url: 'https://google.com/search?q=KFC+Singapore+restaurant+menu+location',
  timestamp: new Date(),
  confidence: 0.80,
  dataPoints: 5,
  platform: 'Google Search'
}

// 长URL示例
{
  type: 'search',
  url: 'https://google.com/search?q=KFC+Singapore+restaurant+menu+location+contact+information+delivery+hours+franchise+opportunities&hl=en&gl=sg&tbm=nws&source=lnt&tbs=qdr:m',
  // ...
}
```

## 🎯 **用户体验改进**

### **1. 信息可访问性**
- **完整URL显示**: 用户可以看到完整的数据源URL
- **平台识别**: 清楚地标识每个数据源的平台
- **质量评估**: 通过置信度评分评估数据质量

### **2. 交互便利性**
- **一键复制**: 点击即可复制URL，方便用户访问
- **即时反馈**: 复制成功后立即显示确认通知
- **视觉引导**: 工具提示中的"点击复制"提示

### **3. 搜索源突出**
- **视觉区分**: 搜索源通过特殊样式突出显示
- **功能强调**: 在工具提示中特别标识搜索源
- **URL重点**: 搜索源的URL使用不同颜色显示

## ✅ **总结**

DataSources 组件现在具备了**完整的悬停和URL显示功能**：

- ✅ **丰富的工具提示** - 显示URL、平台、置信度、时间戳等完整信息
- ✅ **搜索源特殊处理** - 绿色高亮边框和特殊标识
- ✅ **URL复制功能** - 点击复制，成功通知
- ✅ **响应式设计** - 工具提示自动定位，适配不同屏幕
- ✅ **长URL处理** - 智能换行和截断显示
- ✅ **平滑动画** - 悬停缩放和阴影效果

这些增强功能显著提升了用户体验，让用户能够轻松查看和访问数据源的详细信息，特别是对搜索类型的数据源提供了更好的可见性和交互体验。
