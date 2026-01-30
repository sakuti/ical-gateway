import { unfoldLines } from "./unfold";
import { parseContentLine } from "./content";
import { parseValue } from "./values";
import { IcalComponent, IcalProperty } from "./ast";

export function parseIcal(input: string): IcalComponent {
  const lines = unfoldLines(input);
  const stack: IcalComponent[] = [];

  let root: IcalComponent | null = null;

  for (const line of lines) {
    const { name, params, rawValue } = parseContentLine(line);

    if (name === "BEGIN") {
      const component: IcalComponent = {
        name: rawValue.toUpperCase(),
        properties: [],
        components: []
      };

      if (stack.length > 0) {
        stack[stack.length - 1].components.push(component);
      } else {
        root = component;
      }

      stack.push(component);
      continue;
    }

    if (name === "END") {
      const expected = rawValue.toUpperCase();
      const current = stack.pop();

      if (!current || current.name !== expected) {
        throw new Error(`Mismatched END:${rawValue}`);
      }
      continue;
    }

    if (stack.length === 0) {
      throw new Error(`Property outside component: ${line}`);
    }

    const property: IcalProperty = {
      name,
      params,
      value: parseValue(name, params, rawValue)
    };

    stack[stack.length - 1].properties.push(property);
  }

  if (stack.length !== 0) {
    throw new Error("Unclosed component(s)");
  }

  if (!root || root.name !== "VCALENDAR") {
    throw new Error("Root component must be VCALENDAR");
  }

  return root;
}