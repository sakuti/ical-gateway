import { ast } from "../parser/index";

function escapeICalValue(value: string): string {
  return value
    .replace(/\r\n|\r|\n/g, "\\n") 
}

export function emitIcs(calendar: ast.IcalComponent): string {
  const lines: string[] = [];

  function emitComponent(c: ast.IcalComponent) {
    lines.push(`BEGIN:${c.name}`);

    for (const p of c.properties) {
      const escaped = escapeICalValue(String(p.value.value));
      lines.push(`${p.name}:${escaped}`);
    }

    for (const child of c.components) {
      emitComponent(child);
    }

    lines.push(`END:${c.name}`);
  }

  emitComponent(calendar);

  return lines.join("\r\n") + "\r\n";
}
