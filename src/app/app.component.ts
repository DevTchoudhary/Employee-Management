import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { EmployeeModel } from './model/Employee';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  employeeForm: FormGroup;
  employeeObj: EmployeeModel = new EmployeeModel();
  employeeList: EmployeeModel[] = [];

  constructor() {
    this.employeeForm = new FormGroup({});
    this.createForm();
    const oldData = localStorage.getItem('EmpData');
    if (oldData !== null) {
      const parseData = JSON.parse(oldData);
      this.employeeList = parseData;
    }
  }

  createForm() {
    this.employeeForm = new FormGroup({
      empId: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name, [Validators.required]),
      city: new FormControl(this.employeeObj.city),
      address: new FormControl(this.employeeObj.address),
      contactNo: new FormControl(this.employeeObj.contactNo),
      emailId: new FormControl(this.employeeObj.emailId),
      pinCode: new FormControl(this.employeeObj.pinCode, [Validators.required, Validators.minLength(6)]),
      state: new FormControl(this.employeeObj.state),
    });
  }

  onSave() {
    const oldData = localStorage.getItem('EmpData');

    if (oldData !== null) {
      const parseData = JSON.parse(oldData);
      const newEmpId = parseData.length + 1;
      this.employeeForm.controls['empId'].setValue(newEmpId);
      this.employeeList.unshift(this.employeeForm.value);
    } else {
      this.employeeForm.controls['empId'].setValue(1); // First entry as 1
      this.employeeList.unshift(this.employeeForm.value);
    }

    localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
    this.employeeObj = new EmployeeModel();
    this.createForm();
    this.employeeForm.reset();
  }

  onEdit(item: EmployeeModel) {
    this.employeeObj = item;
    this.employeeForm.patchValue(item); 
  }

  onUpdate() {
    const record = this.employeeList.find(m => m.empId == this.employeeForm.controls['empId'].value); 
    if (record) {
      record.address = this.employeeForm.controls['address'].value;
      record.name = this.employeeForm.controls['name'].value;
      record.contactNo = this.employeeForm.controls['contactNo'].value;
      record.emailId = this.employeeForm.controls['emailId'].value;
    }
    localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
    this.employeeObj = new EmployeeModel();
    this.createForm();
  }

  onDelete(id: number) {
    const idDelete = confirm("Are you sure?");
    if (idDelete) {
      const index = this.employeeList.findIndex(m => m.empId == id);
      this.employeeList.splice(index, 1);
      localStorage.setItem('EmpData', JSON.stringify(this.employeeList));
    }
  }
}
