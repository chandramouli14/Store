import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from 'src/app/models/task';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit{
  tasks: Task[] = [];
  taskList$: any;
  isDisabled='true';
  constructor(private taskService:TaskService){
  }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(){
    this.taskService.getTasks().subscribe(res =>{
      this.tasks = res;
    });
    this.taskList$ = this.taskService.getTasks();
  }
  trackByFun(index:number, item: Task) {
    return item;
  }

  refreshTaskList(isTaskAdded: boolean){
    this.getTasks();
  }
  
  onSectionChange(event: any){
    console.log(event)
  }
}
