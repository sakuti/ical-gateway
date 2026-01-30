export function unfoldLines(input: string): string[] {
  if (input.includes("\n") && !input.includes("\r\n")) {
    throw new Error("Invalid line endings: expected CRLF");
  }

  const rawLines = input.split("\r\n");
  const lines: string[] = [];

  for (const line of rawLines) {
    if (line.startsWith(" ") || line.startsWith("\t")) {
      if (lines.length === 0) {
        throw new Error("Invalid line folding");
      }
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }

  return lines.filter((l) => l.length > 0);
}
