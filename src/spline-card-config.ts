export type SplineCardConfig = {
  type: "custom:spline-card";
  url?: string;
  items?: SplineItem[];
};

export type SplineItem = {
  object_name: string;
  entity: string;
  state?: string | string[];
  brightness_control?: boolean;
};
