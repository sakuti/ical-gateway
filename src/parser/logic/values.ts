import { IcalValue } from "./ast";

export function parseValue(
  propertyName: string,
  params: Map<string, string[]>,
  raw: string,
): IcalValue {
  const explicitType = params.get("VALUE")?.[0];

  const type = explicitType ?? defaultType(propertyName);

  switch (type) {
    case "TEXT":
      return { type: "TEXT", value: unescapeText(raw) };

    case "DATE":
      if (!/^\d{8}$/.test(raw)) {
        throw new Error(`Invalid DATE value: ${raw}`);
      }
      return { type: "DATE", value: raw };

    case "DATE-TIME":
      if (!/^\d{8}T\d{6}Z?$/.test(raw)) {
        throw new Error(`Invalid DATE-TIME value: ${raw}`);
      }
      return { type: "DATE-TIME", value: raw };

    default:
      return { type: "UNKNOWN", value: raw };
  }
}

function defaultType(name: string): string {
  switch (name) {
    case "DTSTART":
    case "DTEND":
    case "DTSTAMP":
      return "DATE-TIME";
    case "SUMMARY":
    case "DESCRIPTION":
      return "TEXT";
    default:
      return "TEXT";
  }
}

function unescapeText(text: string): string {
  return text
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}
