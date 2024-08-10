export interface ILoginResponse {
  accessToken: string;
  expiresIn: number;
}

export interface IResponse<T> {
  data: T;
}

export interface IPartcipationOutdoor {
  participationOutdoorId?: number;
  evidence?: string;
  status?: string;
  fechaPublicacion?: string;
  fechaRevision?: string;
  challengeOutdoor?: IChallengeOutdoor;
  user?: IUser;
}
export interface IChallengeOutdoor {
  outdoorChallengeId?: number;
  requirement?: string;
  description?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  badgeId?: IBadge;
}
export interface IComment {
  commentId?: number;
  content?: string;
  anonymous?: boolean;
  user?: IUser;
  forum?: IForum;
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
export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  email?: string;
  image?: string;
  password?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  role?: IUserRole | null;
  birthDate?: string;
  authorities?: IAuthority[];
}
export interface IUserRole {
  id?: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserBadge {
  userBadgeId?: number;
  badge?: IBadge;
  user?: IUser;
  obtainedDate?: string;
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
  badgeId?: IBadge;
  gameId?: IGame;
}

export interface IForum {
  forumId?: number;
  title?: string;
  description?: string;
  anonymous?: boolean;
  user?: IUser;
}

export interface IChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: [
    {
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
      index: number;
    }
  ];
}

export interface ErrorResponse {
  error: {
    message: string;
    type?: string;
    param?: string | null;
    code?: string | null;
  };
}
export interface Message {
  role: "user" | "assistant" | "system" | "error";
  content: string;
}

export interface IContent {
  contentId?: number;
  title?: string;
  description?: string;
  typeMedia?: string;
  url?: string;
  publishDate?: Date;
}