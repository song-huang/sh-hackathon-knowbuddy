'use client';

import React, { useState } from 'react';

export default function MarkdownTestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Test cases for different markdown formats
  const testCases = [
    {
      name: "Standard Markdown JSON",
      input: `\`\`\`json
{
  "name": "Baodega 小杨生煎",
  "description": "A popular Chinese restaurant specializing in pan-fried buns",
  "cuisine": "Chinese",
  "priceRange": "$$"
}
\`\`\``,
      expected: { name: "Baodega 小杨生煎", description: "A popular Chinese restaurant specializing in pan-fried buns", cuisine: "Chinese", priceRange: "$$" }
    },
    {
      name: "Markdown with Extra Text",
      input: `Here's the analysis:

\`\`\`json
{
  "name": "Test Restaurant",
  "location": "Singapore"
}
\`\`\`

This is the result.`,
      expected: { name: "Test Restaurant", location: "Singapore" }
    },
    {
      name: "No Language Specifier",
      input: `\`\`\`
{
  "name": "Another Restaurant",
  "type": "Fast Food"
}
\`\`\``,
      expected: { name: "Another Restaurant", type: "Fast Food" }
    },
    {
      name: "Multiple JSON Objects",
      input: `\`\`\`json
{
  "small": "object"
}
\`\`\`

\`\`\`json
{
  "name": "Larger Restaurant Object",
  "description": "This should be selected as it's longer",
  "cuisine": "International",
  "features": ["delivery", "dine-in", "takeout"]
}
\`\`\``,
      expected: { name: "Larger Restaurant Object", description: "This should be selected as it's longer", cuisine: "International", features: ["delivery", "dine-in", "takeout"] }
    },
    {
      name: "Chinese Characters",
      input: `\`\`\`json
{
  "name": "麻辣香锅",
  "description": "正宗四川麻辣香锅，香辣可口",
  "cuisine": "四川菜",
  "specialties": ["麻辣香锅", "水煮鱼", "宫保鸡丁"]
}
\`\`\``,
      expected: { name: "麻辣香锅", description: "正宗四川麻辣香锅，香辣可口", cuisine: "四川菜", specialties: ["麻辣香锅", "水煮鱼", "宫保鸡丁"] }
    }
  ];

  // Simulate the parsing logic from the service
  const parseJsonSafely = (text: string): any => {
    try {
      console.log("Original response text:", text.substring(0, 200) + "...");
      
      // Multiple strategies to extract JSON from markdown-wrapped responses
      let jsonStr = "";
      
      // Strategy 1: Look for JSON within markdown code blocks
      const markdownJsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
      if (markdownJsonMatch) {
        jsonStr = markdownJsonMatch[1];
        console.log("Found JSON in markdown code block");
      } else {
        // Strategy 2: Look for the largest JSON object in the response
        const jsonMatches = text.match(/\{[\s\S]*?\}/g);
        if (jsonMatches && jsonMatches.length > 0) {
          // Take the longest match (most likely to be the complete JSON)
          jsonStr = jsonMatches.reduce((longest, current) => 
            current.length > longest.length ? current : longest
          );
          console.log("Found JSON object, using longest match");
        } else {
          // Strategy 3: Try to find JSON between common delimiters
          const delimiterMatch = text.match(/(?:```json\s*)?(\{[\s\S]*\})(?:\s*```)?/i);
          if (delimiterMatch) {
            jsonStr = delimiterMatch[1];
            console.log("Found JSON with delimiter matching");
          } else {
            throw new Error("No JSON found in response");
          }
        }
      }

      console.log("Raw JSON string length:", jsonStr.length);
      console.log("Raw JSON preview:", jsonStr.substring(0, 100) + "...");

      // Clean the JSON string
      jsonStr = cleanJsonString(jsonStr);
      console.log("Cleaned JSON string length:", jsonStr.length);

      // Try to parse
      const parsed = JSON.parse(jsonStr);
      console.log("JSON parsed successfully");
      return parsed;
    } catch (error) {
      console.error("JSON parsing failed:", error);
      return {
        error: "Failed to parse AI response",
        rawResponse: text.substring(0, 200) + "...",
      };
    }
  };

  const cleanJsonString = (jsonStr: string): string => {
    // Enhanced markdown code block removal
    jsonStr = jsonStr
      // Remove opening markdown blocks (with optional language specifier)
      .replace(/```(?:json|javascript|js)?\s*/gi, "")
      // Remove closing markdown blocks
      .replace(/```\s*$/gm, "")
      // Remove any remaining triple backticks
      .replace(/```/g, "")
      // Remove any leading/trailing whitespace from each line
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      // Remove empty lines
      .replace(/\n\s*\n/g, '\n')
      .trim();

    // Fix common JSON formatting issues
    jsonStr = jsonStr
      // Fix single quotes to double quotes (but preserve quotes within strings)
      .replace(/(?<!\\)'/g, '"')
      // Fix unquoted property names
      .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
      // Fix trailing commas
      .replace(/,(\s*[}\]])/g, "$1")
      // Normalize whitespace but preserve structure
      .replace(/\s+/g, " ")
      // Final trim
      .trim();

    return jsonStr;
  };

  const runAllTests = () => {
    setLoading(true);
    const results: string[] = [];

    testCases.forEach((testCase, index) => {
      try {
        const result = parseJsonSafely(testCase.input);
        const success = !result.error && JSON.stringify(result) === JSON.stringify(testCase.expected);
        
        results.push(`Test ${index + 1}: ${testCase.name}`);
        results.push(`Status: ${success ? '✅ PASSED' : '❌ FAILED'}`);
        results.push(`Expected: ${JSON.stringify(testCase.expected, null, 2)}`);
        results.push(`Got: ${JSON.stringify(result, null, 2)}`);
        results.push('---');
      } catch (error) {
        results.push(`Test ${index + 1}: ${testCase.name}`);
        results.push(`Status: ❌ ERROR - ${error instanceof Error ? error.message : 'Unknown error'}`);
        results.push('---');
      }
    });

    setTestResult(results.join('\n'));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Markdown JSON Parsing Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Markdown JSON Extraction</h2>
          <p className="text-gray-600 mb-4">
            This tests the enhanced JSON parsing that handles markdown code blocks from Gemini API responses.
          </p>
          
          <button
            onClick={runAllTests}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-md font-medium"
          >
            {loading ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>

        {testResult && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="bg-gray-50 rounded-md p-4 overflow-auto">
              <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-blue-800 font-semibold mb-2">Markdown Parsing Improvements:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>✅ Enhanced markdown code block removal (```json, ```, etc.)</li>
            <li>✅ Multiple extraction strategies (markdown blocks, longest match, delimiters)</li>
            <li>✅ Better handling of Chinese characters and special text</li>
            <li>✅ Improved regex patterns for reliable JSON extraction</li>
            <li>✅ Updated prompts to request pure JSON without markdown</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
