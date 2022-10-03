import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Bid } from 'src/app/model/bid.model';
import { Product } from 'src/app/model/product.model';
import { BuyerService } from 'src/app/services/buyer.service';
import { SellerService } from 'src/app/services/seller.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserInfo } from 'src/app/model/user';
import { max } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  user: UserInfo = new UserInfo;
  products: Array<Product> = [];
  productSelectControl = new UntypedFormControl(null, Validators.required);
  today = new Date();
  categories: Category[] = [
    { name: 'Painting', id: 1 },
    { name: 'Sculptor', id: 2 },
    { name: 'Ornament', id: 3 }
  ];
  disableProductUpdate: boolean = true;
  maxBidAmount: number = 0;
  minBidAmount: number = 0;

  productForm = new UntypedFormGroup({
    id: new UntypedFormControl(''),
    productName: new UntypedFormControl(),
    shortDescription: new UntypedFormControl(),
    longDescription: new UntypedFormControl(),
    category: new UntypedFormControl(),
    startingPrice: new UntypedFormControl(),
    bidEndDate: new UntypedFormControl(),
    firstName: new UntypedFormControl(),
    lastName: new UntypedFormControl(),
    address: new UntypedFormControl(),
    city: new UntypedFormControl(),
    state: new UntypedFormControl(),
    pin: new UntypedFormControl('', [Validators.pattern("^[0-9]{6,6}$"), Validators.minLength(6), Validators.maxLength(6)]),
    phone: new UntypedFormControl('', [Validators.pattern("^[0-9]{10,10}$"), Validators.minLength(10), Validators.maxLength(10)]),
    email: new UntypedFormControl('', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
  });

  displayedColumns: string[] = ['bidAmount', 'name', 'email', 'mobile'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  dataSource = new MatTableDataSource<Bid>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private sellerService: SellerService,
    private buyerService: BuyerService,
    private tokenStorageService: TokenStorageService) {
    this.user = this.tokenStorageService.getUser();
  }

  ngOnInit(): void {
    this.getProducts();
    this.today.setDate(this.today.getDate() + 1);
    this.productForm.disable()
  }

  getProducts() {
    this.sellerService.GetProductsByEmail(this.user.email).subscribe(data => {
      this.products = data;
    },
      error => {
        throw error;
      });
  }

  getProduct() {
    this.sellerService.GetProduct(this.productSelectControl.value).subscribe(data => {
      this.productForm.reset(data);
      this.disableProductUpdate = new Date(this.productForm.controls["bidEndDate"].value) < this.today;
      this.disableProductUpdate ? this.productForm.disable() : this.productForm.enable();
    }, error => { throw error });
    this.getProductBids();
  }

  getProductBids() {
    this.dataSource.data = [];
    this.buyerService.GetBids(this.productSelectControl.value).subscribe(data => {
      this.maxBidAmount = Math.max(...data.map(x => { return x.bidAmount; }));
      this.minBidAmount = Math.min(...data.map(x => { return x.bidAmount; }));
      this.dataSource.data = data.sort((a, b) => b.bidAmount - a.bidAmount);
      if (!this.disableProductUpdate)
        this.disableProductUpdate = this.dataSource.data.length > 0;
      this.disableProductUpdate ? this.productForm.disable() : this.productForm.enable();
    },
      error => {
        if (!error.ok && error.status != 404)
          throw error;
      });
  }

}

interface Category {
  name: string;
  id: number;
}