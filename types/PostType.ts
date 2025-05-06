// Tipos básicos reutilizáveis
export type UserLevel = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Professor';
export type ContentType = 'video' | 'image' | 'challenge' | 'text' | 'poll';

// Tipo para o usuário
export interface User {
  id: string;
  name: string;
  avatar: string;
  level: UserLevel;
  verified?: boolean; // Para contas verificadas/professores
}

// Tipo para estatísticas de engajamento
export interface PostStats {
  likes: number;
  comments: number;
  shares: number;
  saves?: number; // Opcional para posts salvos
}

// Tipo para conteúdo de desafio
export interface ChallengeContent {
  challengeId: string;
  challengeName: string;
  progress: string; // "Dia 3/7"
  daysCompleted: number;
  totalDays: number;
}

// Tipo base para conteúdo do post
interface BasePostContent {
  type: ContentType;
  description: string;
  exercise?: string; // Exercício relacionado
  bpm?: number; // BPM quando aplicável
  tags?: string[]; // Tags como #GuitarFit, #DesafioDiario
}

// Tipos específicos para cada formato de conteúdo
interface VideoContent extends BasePostContent {
  type: 'video';
  url: string;
  thumbnail: string;
  duration?: number; // Em segundos
}

interface ImageContent extends BasePostContent {
  type: 'image';
  url: string;
  multiple?: boolean; // Para carrossel de imagens
}

interface ChallengePostContent extends BasePostContent {
  type: 'challenge';
  challenge: ChallengeContent;
}

interface TextPostContent extends BasePostContent {
  type: 'text';
  longText?: string; // Para posts mais longos
}

interface PollContent extends BasePostContent {
  type: 'poll';
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  voted?: string; // ID da opção votada
}

// União de todos os tipos de conteúdo
export type PostContent = 
  | VideoContent 
  | ImageContent 
  | ChallengePostContent 
  | TextPostContent 
  | PollContent;

// Tipo principal do Post
export interface Post {
  id: string;
  user: User;
  content: PostContent;
  stats: PostStats;
  timestamp: string; // Ou Date se preferir
  liked?: boolean; // Se o usuário atual curtiu
  saved?: boolean; // Se o usuário atual salvou
  location?: string; // Opcional para eventos/workshops
}

// Tipo para comentários
export interface Comment {
  id: string;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  text: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
  liked?: boolean;
}

// Tipo para Stories
export interface Story {
  id: string;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  content: {
    url: string;
    type: 'image' | 'video';
    duration?: number;
  };
  viewed?: boolean;
  timestamp: string;
}

// Tipo para desafios em destaque
export interface FeaturedChallenge {
  id: string;
  title: string;
  description: string;
  duration: string; // "7 dias"
  participants: number;
  difficulty: UserLevel;
  coverImage: string;
}