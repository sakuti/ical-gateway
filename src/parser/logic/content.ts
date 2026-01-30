export interface ParsedContentLine {
  name: string;
  params: Map<string, string[]>;
  rawValue: string;
}

export function parseContentLine(line: string): ParsedContentLine {
  let inQuotes = false;
  let colonIndex = -1;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    if (c === ":" && !inQuotes) {
      colonIndex = i;
      break;
    }
  }

  if (colonIndex === -1) {
    throw new Error(`Invalid content line: ${line}`);
  }

  const head = line.slice(0, colonIndex);
  const rawValue = line.slice(colonIndex + 1);

  const parts = head.split(";");
  const name = parts[0].toUpperCase();
  const params = new Map<string, string[]>();

  for (let i = 1; i < parts.length; i++) {
    const [rawKey, rawVal] = parts[i].split("=");
    if (!rawVal) throw new Error(`Invalid parameter: ${parts[i]}`);

    const key = rawKey.toUpperCase();
    const values = rawVal.split(",").map((v) => unquote(v));

    params.set(key, values);
  }

  return { name, params, rawValue };
}

function unquote(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  return value;
}
