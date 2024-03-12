import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent implements OnInit {
  taskForm: any;
  @Output() refreshTask = new EventEmitter<boolean>();
  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      name: ['',[Validators.required, Validators.minLength(4)]],
    });
  }

  submitNewTask() {
    this.taskService.addTask({ ...this.taskForm.value }).subscribe((res) => {
      this.refreshTask.emit(true);
      this.resetForm();
    });
  }

  resetForm() {
    this.taskForm.reset();
  }
}
