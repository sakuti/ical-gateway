export type IcalValue =
  | { type: "TEXT"; value: string }
  | { type: "DATE"; value: string }
  | { type: "DATE-TIME"; value: string }
  | { type: "UNKNOWN"; value: string };

export interface IcalProperty {
  name: string;
  params: Map<string, string[]>;
  value: { type: string; value: string };
}

export interface IcalComponent {
  name: string;
  properties: IcalProperty[];
  components: IcalComponent[];
}
