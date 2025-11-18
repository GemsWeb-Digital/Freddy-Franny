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

// --- Integrity & Security Types (Based on PlatformStateSubmission Schema) ---

export interface ChallengeMetadata {
  challenge_id: number;
  challenge_type: 'MAZE' | 'DRAWING' | 'QUIZ';
  client_elapsed_time_ms: number;
}

export interface MazeSubmission {
  path_array: [number, number][];
  path_length: number;
}

export interface StrokePoint {
  x: number;
  y: number;
  time_offset_ms: number;
}

export interface DrawingSubmission {
  stroke_data: StrokePoint[][];
  total_stroke_count: number;
  total_drawing_time_ms: number;
}

export interface PlatformStateSubmission {
  user_uuid: string;
  session_id: string;
  challenge_metadata: ChallengeMetadata;
  submission_data: MazeSubmission | DrawingSubmission;
}