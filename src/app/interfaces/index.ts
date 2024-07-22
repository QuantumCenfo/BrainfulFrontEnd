export interface ILoginResponse {
  accessToken: string;
  expiresIn: number;
}

export interface IResponse<T> {
  data: T;
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = "",
}

export enum IRole {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER",
  superAdmin = "ROLE_SUPER_ADMIN",
}

export interface IGame {
  gameId?: number;
  name?: string;
  description?: string;
  typeExercise?: string;
}

export interface IGameResults {
  resultId?: number;
  gameDate?: string;
  levelDifficulty?: string;
  score?: number;
  time?: number;
  gameId?: IGame;
  userId?: IUser;
}

export interface IForm {
  formId?: number;
  date?: string;
  age?: number;
  exerciseDays?: string;
  useDrugs?: boolean;
  useAlcohol?: boolean;
  gender?: string;
  job?: string;
  eduacationLevel?: string;
  familyHistory?: string;
  medicalCondition?: string;
  mentalIllness?: string;
  dietType?: string;
  sleepHours?: number;
  screenTime?: number;
  stressManagement?: string;
  user?: IUser;
}
export interface IRecomendation {
  recommendationId?: number;
  date?: string;
  description?: string;
  recommendationType?: string;
  form?: IForm;
}



export interface ICard {
  imageId: string;
  state: "default" | "flipped" | "matched";
}

export interface IButton {
  color: "default" | "green" | "red";
}
export interface PuzzlePiece {
  src: string; // URL de la imagen
  originalOrder: number; // Orden original de la pieza
  x: number; // Posición X
  y: number; // Posición Y
  width: number; // Ancho
  height: number; // Alto
  position: { x: number; y: number }; // Posición en la cuadrícula
}

export interface IBadge {
  badgeId?: number;
  title?: string;
  description?: string;
  url?: string;
}

export interface IChallengeGame {
  challengeId?: number;
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  objectiveScore?: number;
  objectiveTime?: number;
  objectiveFrecuency?: number;
  badge?: IBadge;
  game?: IGame;
}
