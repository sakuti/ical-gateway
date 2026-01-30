import { parser } from "../parser/index";
import { DeleteDateRule } from "../models/rules";
import { IcalComponent } from "../parser/logic/ast";

export function transformCalendar(
  sourceIcs: string,
  rules: DeleteDateRule[]
): IcalComponent {
  const calendar: IcalComponent = parser.parseIcal(sourceIcs);

  const newComponents: IcalComponent[] = [];

  for (const component of calendar.components) {
    if (component.name !== "VEVENT") {
      newComponents.push(component);
      continue;
    }

    const uidProp = component.properties.find((p) => p.name === "UID");
    if (!uidProp) {
      newComponents.push(component);
      continue;
    }

    const uid = uidProp.value.value;

    const matchingRules = rules.filter(
      (r) => r.event_uid === uid && r.kind === "DELETE_DATE"
    );

    if (matchingRules.length === 0) {
      newComponents.push(component);
      continue;
    }

    const hasRrule = component.properties.some((p) => p.name === "RRULE");

    if (hasRrule) {
      // Recurring → add EXDATE
      let exdateProp = component.properties.find((p) => p.name === "EXDATE");
      if (!exdateProp) {
        exdateProp = {
          name: "EXDATE",
          params: new Map(),
          value: { type: "DATE-TIME", value: "" },
        };
        component.properties.push(exdateProp);
      }

      const existingDates = exdateProp.value.value
        ? exdateProp.value.value.split(",")
        : [];

      const dates = matchingRules.map((r) => r.date); // adjust time if needed
      exdateProp.value.value = [...existingDates, ...dates].filter(Boolean).join(",");

      newComponents.push(component);
    } else {
      // Single event → fully remove it
      // Simply do NOT push this component into newComponents
      // That effectively deletes it from the output
    }
  }

  calendar.components = newComponents;
  return calendar;
}
