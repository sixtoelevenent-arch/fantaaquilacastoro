export type LivePlayer = {
  id: number;
  nome: string;
  ruolo: string;
  nazionale: string;

  titolare: boolean;

  posizione: number | null;
  ordine_panchina: number | null;

  vote?: any;
};