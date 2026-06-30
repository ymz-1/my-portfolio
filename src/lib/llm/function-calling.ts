export type ParamType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array";

export type FunctionParam = {
  id: string;
  name: string;
  type: ParamType;
  description: string;
  required: boolean;
};

export type FunctionDefinition = {
  name: string;
  description: string;
  parameters: FunctionParam[];
};

export type OutputFormat = "openai" | "claude" | "langchain" | "json-schema";

export const PARAM_TYPES: ParamType[] = [
  "string",
  "number",
  "integer",
  "boolean",
  "object",
  "array",
];

function buildJsonSchemaProperties(params: FunctionParam[]) {
  const properties: Record<string, { type: string; description?: string }> =
    {};
  const required: string[] = [];

  for (const p of params) {
    if (!p.name.trim()) continue;
    properties[p.name.trim()] = {
      type: p.type,
      ...(p.description.trim() ? { description: p.description.trim() } : {}),
    };
    if (p.required) required.push(p.name.trim());
  }

  return {
    type: "object" as const,
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}

export function toOpenAIFormat(def: FunctionDefinition): string {
  const schema = buildJsonSchemaProperties(def.parameters);
  return JSON.stringify(
    {
      type: "function",
      function: {
        name: def.name.trim() || "unnamed_function",
        description: def.description.trim() || "",
        parameters: schema,
      },
    },
    null,
    2,
  );
}

export function toClaudeFormat(def: FunctionDefinition): string {
  const schema = buildJsonSchemaProperties(def.parameters);
  return JSON.stringify(
    {
      name: def.name.trim() || "unnamed_function",
      description: def.description.trim() || "",
      input_schema: schema,
    },
    null,
    2,
  );
}

export function toJsonSchemaFormat(def: FunctionDefinition): string {
  const schema = buildJsonSchemaProperties(def.parameters);
  return JSON.stringify(
    {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      title: def.name.trim() || "unnamed_function",
      description: def.description.trim() || "",
      ...schema,
    },
    null,
    2,
  );
}

export function toLangChainFormat(def: FunctionDefinition): string {
  const fnName = def.name.trim() || "unnamed_function";
  const schema = buildJsonSchemaProperties(def.parameters);
  const paramLines = def.parameters
    .filter((p) => p.name.trim())
    .map((p) => {
      const req = p.required ? "" : "?";
      const pyType =
        p.type === "integer"
          ? "int"
          : p.type === "number"
            ? "float"
            : p.type === "boolean"
              ? "bool"
              : p.type === "array"
                ? "list"
                : p.type === "object"
                  ? "dict"
                  : "str";
      return `    ${p.name.trim()}${req}: ${pyType}${p.description.trim() ? `  # ${p.description.trim()}` : ""}`;
    });

  const argsBlock =
    paramLines.length > 0 ? paramLines.join("\n") + "\n" : "    pass\n";

  return `# LangChain @tool 示例（Python）
from langchain_core.tools import tool

@tool
def ${fnName}(
${argsBlock}) -> str:
    """${def.description.trim() || fnName}"""
    # TODO: implement
    return "ok"

# JSON Schema（StructuredTool / bind_tools）
tool_schema = ${JSON.stringify(schema, null, 2)}`;
}

export function formatOutput(
  def: FunctionDefinition,
  format: OutputFormat,
): string {
  switch (format) {
    case "openai":
      return toOpenAIFormat(def);
    case "claude":
      return toClaudeFormat(def);
    case "langchain":
      return toLangChainFormat(def);
    case "json-schema":
      return toJsonSchemaFormat(def);
  }
}

export function createEmptyParam(): FunctionParam {
  return {
    id: crypto.randomUUID(),
    name: "",
    type: "string",
    description: "",
    required: true,
  };
}

export const functionTemplates: FunctionDefinition[] = [
  {
    name: "get_weather",
    description: "获取指定城市的当前天气信息",
    parameters: [
      {
        id: "t1",
        name: "city",
        type: "string",
        description: "城市名称，如 Beijing、上海",
        required: true,
      },
      {
        id: "t2",
        name: "unit",
        type: "string",
        description: "温度单位：celsius 或 fahrenheit",
        required: false,
      },
    ],
  },
  {
    name: "send_email",
    description: "发送电子邮件给指定收件人",
    parameters: [
      {
        id: "t3",
        name: "to",
        type: "string",
        description: "收件人邮箱地址",
        required: true,
      },
      {
        id: "t4",
        name: "subject",
        type: "string",
        description: "邮件主题",
        required: true,
      },
      {
        id: "t5",
        name: "body",
        type: "string",
        description: "邮件正文",
        required: true,
      },
    ],
  },
  {
    name: "query_database",
    description: "执行只读 SQL 查询并返回结果",
    parameters: [
      {
        id: "t6",
        name: "sql",
        type: "string",
        description: "SELECT 查询语句",
        required: true,
      },
      {
        id: "t7",
        name: "limit",
        type: "integer",
        description: "最大返回行数",
        required: false,
      },
    ],
  },
  {
    name: "book_flight",
    description: "预订指定日期和航线的机票",
    parameters: [
      {
        id: "t8",
        name: "from",
        type: "string",
        description: "出发城市",
        required: true,
      },
      {
        id: "t9",
        name: "to",
        type: "string",
        description: "目的地城市",
        required: true,
      },
      {
        id: "t10",
        name: "date",
        type: "string",
        description: "出发日期，ISO 8601 格式",
        required: true,
      },
    ],
  },
];

export function cloneTemplate(template: FunctionDefinition): FunctionDefinition {
  return {
    name: template.name,
    description: template.description,
    parameters: template.parameters.map((p) => ({
      ...p,
      id: crypto.randomUUID(),
    })),
  };
}

export function validateDefinition(def: FunctionDefinition): string | null {
  if (!def.name.trim()) return "Function name is required";
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(def.name.trim())) {
    return "Function name must be a valid identifier (letters, numbers, underscore)";
  }
  const names = def.parameters.map((p) => p.name.trim()).filter(Boolean);
  if (new Set(names).size !== names.length) {
    return "Parameter names must be unique";
  }
  return null;
}
