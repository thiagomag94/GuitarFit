

// types/TreinoType.ts

  

export interface ExercicioType {
  id: string;
  titulo: string;
  descricao: string;
  repeticoes: number;
  dica?: string;
  duracao: number; // Duração em segundos
  metronomo?: number; // BPM recomendado
  videoUrl?: string; // Link para demonstração
}

export  interface TreinoType {
  id: string;
  titulo: string;
  descricao: string;
  categoria?: 'técnica' | 'teoria' | 'repertório' | 'improvisação';
  nivel: 'iniciante' | 'intermediário' | 'avançado';
  exercicios: ExercicioType[];
  exerciciosCount: number; // Contagem de exercícios
  restTime?: number; // Tempo de descanso entre exercícios
  duracao: number; // Duração total do treino em minutos
}

export default TreinoType;