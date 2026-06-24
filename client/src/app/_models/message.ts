export interface Message {
  messageId: number;
  senderId: number;
  senderUsername: string;
  senderPhotoUrl: string;
  receiverId: number;
  receiverUsername: string;
  receiverPhotoUrl: string;
  content: string;
  dateRead?: string;
  dateSend: string;
}
