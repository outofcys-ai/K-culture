export interface PungryuScores {
  heung: number;
  hanAndJeong: number;
  meot: number;
  integration: number;
}

export interface PungryuExplanations {
  heung: string;
  hanAndJeong: string;
  meot: string;
  integration: string;
}

export interface TraditionalAncestor {
  traditionalName: string;
  modernMap: string;
  description: string;
}

export interface PungryuAnalysisResult {
  headline: string;
  scores: PungryuScores;
  scoresExplanation: PungryuExplanations;
  traditionalAncestors: TraditionalAncestor[];
  deepAnalysis: string;
  poeticVerdict: string;
}

export interface PresetContent {
  id: string;
  name: string;
  category: "music" | "drama" | "cinema";
  shortDesc: string;
  data: PungryuAnalysisResult;
}
