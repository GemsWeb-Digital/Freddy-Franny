export interface HazardItem {
  id: number;
  label: string;
  isDanger: boolean;
  icon: string;
}

export interface TileItem {
  id: string;
  label: string;
  emoji: string;
  instanceId?: number; // To allow duplicate types if we were doing pair matching, though here we swap
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}