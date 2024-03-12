import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseurl: string = "  http://localhost:3000"

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]>{
    return this.http.get<Task[]>(`${this.baseurl}/tasks`);
  }

  addTask(task:Task): Observable<any>{
    return this.http.post<Task>(`${this.baseurl}/tasks`,task );
  }
}
