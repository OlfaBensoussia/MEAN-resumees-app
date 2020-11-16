import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
var apiUrl = 'http://localhost:3800';


export interface UserData {
  id: string;
  nom: Date;
  prenom: string;
  email: string;
  numTel: string;
  etatCondidature: string;
}
/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-list-condidat',
  templateUrl: './list-condidat.component.html',
  styleUrls: ['./list-condidat.component.css']
})
export class ListCondidatComponent implements OnInit, AfterViewInit {
  backendUrl : string;
  displayedColumns: string[] = ['nom', 'prenom', 'email', 'numTel', 'etatCondidature', 'statusEmail', 'action'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient) {
    this.backendUrl = apiUrl; 
  }
  ngOnInit(): void {
    this.http.get(this.backendUrl+'/api/condidature').subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      console.log('res', res)
     })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


 update() {

 } 
}

