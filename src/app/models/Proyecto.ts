import { Tarea } from "./Tarea";
import { Usuario } from "./Usuario";

export class Proyecto{
  proyectoId:number = -1 ;
  name_proyect: string = "";
  id_boss: number = 0;
  date_created: string = "";
  usuarios:Usuario[] =[];
  tareas: Tarea[] = [];

}
