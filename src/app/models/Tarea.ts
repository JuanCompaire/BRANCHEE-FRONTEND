import { Chat } from "./Chat";

export class Tarea{
  tareaId?:number;
  id_proyecto:number = -1;
  name_task: string = "";
  descripcion: string = "";
  image: string = "";
  estado: string = "";
  importancia: string = "";
  date_create: string = "";
  date_last_update: string = "";
  user_id_created_task:number = -1;
  usuarios: { usuarioId: number; username: string; email: string }[] = [];
  chats: Chat[] =[];
}
