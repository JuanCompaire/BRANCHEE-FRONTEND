import { Tarea } from "./Tarea";
import { Usuario } from "./Usuario";

export class Proyecto{
  proyectoId:number = -1 ;
  name_proyect: string = "";
  id_boss: number = 0;
  date_create: string = "";
  usuarios:Usuario[] =[];
  tareas = null;

}
