import { Component } from '@angular/core';
import { OrderHistoryService } from '../../services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {
  orderHistoryList : any[] = [];
  storage : Storage = sessionStorage;

  constructor(private orderHistroyService: OrderHistoryService){}

  ngOnInit(){
    this.handleOrderHistory()
  }

  handleOrderHistory(){
    const email = JSON.parse(this.storage.getItem('userEmail') as string);
    this.orderHistroyService.getOrderHistory(email).subscribe(
      res => {
        this.orderHistoryList = res.data;
      }
    );
  }
}
