export interface IUserData {
  nom: string;
  id: number;
}

export declare type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export declare type RequestContentType =
  | "application/json"
  | "multipart/form-data";

export interface RequestHeader {
  Accept?: "application/hal+json";
  Authorization?: string;
  "Content-Type": RequestContentType;
}

export interface UtilisateurConnexion {
  token: string;
}

export interface PasswordError {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  confirmPassword: boolean;
  showError: boolean;
  showConfirmError: boolean;
}

export interface UtilisateurInscription {
  nom: string;
  mail: string;
  mdp: string;
  adresse: Adresse;
  botaniste: false;
}

export interface Utilisateur {
  mail: string;
  nom: string;
  image_url: string;
  botaniste: boolean;
  adresse: Adresse;
}

export interface Adresse {
  latitude: string;
  longitude: string;
  adresse: string;
}

export interface AnnonceAttente {
  titre: string;
  description: string;
  date_creation: Date;
  date_debut: Date;
  date_fin: Date;
  besoin_aide: boolean;
  utilisateur: Utilisateur;
}

export interface Annonce {
  id: number;
  adresse: Adresse;
  titre: string;
  description: string;
  date_creation: Date;
  date_debut: Date;
  date_fin: Date;
  utilisateur_nom: string;
  plante: Plante;
}

export interface Plante {
  id: number;
  espece: string;
  image_url?: string;
}

export interface ListAnnonce {
  annonces: Annonce[];
}

export interface AnnoncePost {
  titre: string;
  description: string;
  date_debut: Date;
  date_fin: Date;
  plante_id: number;
}

export interface AnnonceMessage {
  image_url?: string;
  message?: string;
  date: Date;
  utilisateur_nom: string;
  utilisateur_botaniste: boolean;
}

export interface ListeAnnonceMessage {
  messages: AnnonceMessage[];
}

export interface AnnonceMessagePost {
  message?: string;
  image?: Blob;
}

export interface Proposition {
  id: number;
  date: Date;
  utilisateur_nom: string;
  message: string;
  annonce_id: number;
  distance: number;
}

export interface ListeProposition {
  propositions: Proposition[];
}

export interface PropositionPost {
  message: string;
  annonce_id: number;
}

export interface PropositionPatch {
  proposition_id: number;
  proposition_etat: boolean;
}

export interface Article {
  id: number;
  contenu: string;
  titre: string;
  date: Date;
  utilisateur_nom: string;
}

export interface ListeArticle {
  articles: Article[];
}

export interface ArticlePost {
  contenu: string;
  titre: string;
}

export interface Commentaire {
  date: Date;
  utilisateur_nom: string;
  message?: string;
  image_url?: string;
  utilisateur_botaniste: boolean;
}

export interface ListeCommentaire {
  commentaires: Commentaire[];
}

export interface CommentairePost {
  message?: string;
  image?: Blob;
}

export interface ListePlante {
  plantes: Plante[];
}

export interface PlantePost {
  espece: string;
  image?: Blob;
}

export interface Image {
  image_url: string;
  titre: string;
}

export interface ImagePost {
  image: Blob;
}

export interface ImagePostReponse {
  url: string;
}

export interface ListArticleOrderByAlphabet {
  [letter: string]: { name: string; id: number }[];
}

export interface ImagePostBiblioteque {
  image_url: string;
  titre: string;
}

export interface AddresseApi {
  type: string;
  version: string;
  features: Feature[];
  attribution: string;
  licence: string;
  query: string;
  limit: number;
}

export interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

interface Geometry {
  type: string;
  coordinates: number[];
}

interface Properties {
  label: string;
}

export interface updateProfil {
  nom: string;
  adresse: Adresse;
}

export interface updateEmail {
  newMail: string;
  mdp: string;
}

export interface updatePassword {
  mdp: string;
  newMdp: string;
}
