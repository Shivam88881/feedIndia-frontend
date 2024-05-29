import { CommonModule } from '@angular/common';
import { Component,HostListener } from '@angular/core';
import { CookieServices } from '../../../services/cookie.service';
import { DashboardComponent } from '../../layout/dashboard/dashboard.component';
import { TableComponent } from '../../table/table.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Food } from '../../../models/food';
import { FoodService } from '../../../services/food.service';
import { DonationService } from '../../../services/donation.service';

@Component({
  selector: 'app-all-donations',
  standalone: true,
  imports: [DashboardComponent,TableComponent,CommonModule],
  templateUrl: './all-donations.component.html',
  styleUrl: './all-donations.component.css'
})
export class AllDonationsComponent {
  showDashboard: boolean = window.innerWidth > 830 ? true : false;
  mobileView: boolean = window.innerWidth < 830 ? true : false;
  page:number=0;
  error:string|null=null;
  donations:Food[]=[];
  headers:string[]=[];

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.showDashboard = event.target.innerWidth > 830;
    this.mobileView = event.target.innerWidth < 830;
  }

  toggleDashboard():void{
    this.showDashboard = !this.showDashboard
  }

  constructor(private food:FoodService, private cookieService: CookieServices,private donation:DonationService) { }

  getAllDonations():void{
    this.donation.getTotalDonations(this.page).pipe(catchError(error => {
      
      this.error = error.error.message;
      setTimeout(() => {
        this.error = null;
      }, 2000);
      return throwError(error);
    })).subscribe((data: any) => {
      console.log(data);
      this.donations = data;
      this.headers = Object.keys(data[0]);
      this.headers= this.headers.filter((key) => key!=='user');
      console.log(this.headers);
    })
  }

  ngOnInit(): void {
    this.getAllDonations();
  }

  previousPage():void{
    if(this.page>0){
      this.page-=1;
    }
    this.getAllDonations();
  }

  nextPage():void{
    this.page+=1;
    this.getAllDonations();
  }
}
