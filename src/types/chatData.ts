import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export interface chatData {
  chat: QueryDocumentSnapshot<DocumentData, DocumentData>;
  user: QueryDocumentSnapshot<DocumentData, DocumentData>;
  isSelected: boolean;
}
