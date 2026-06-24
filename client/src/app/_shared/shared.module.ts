import { NgModule } from '@angular/core';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FilterRecipesPipe } from '../_pipes/filter-recipes.pipe';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ToastrModule } from 'ngx-toastr';
import { TimestampPipe } from '../_pipes/timestamp.pipe';
import { TruncatePipe } from '../_pipes/truncate.pipe';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FileUploadModule } from 'ng2-file-upload';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@NgModule({
  declarations: [FilterRecipesPipe, TimestampPipe, TruncatePipe],
  imports: [
    NgxSpinnerModule.forRoot({ type: 'pacman' }),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ProgressbarModule.forRoot(),
    CarouselModule.forRoot(),
    RatingModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FileUploadModule,
    ModalModule.forRoot(),
    InfiniteScrollModule,
    ButtonsModule.forRoot(),
  ],
  providers: [],
  exports: [
    NgxSpinnerModule,
    BsDropdownModule,
    TabsModule,
    ProgressbarModule,
    FilterRecipesPipe,
    CarouselModule,
    RatingModule,
    ToastrModule,
    TimestampPipe,
    TruncatePipe,
    ModalModule,
    BsDatepickerModule,
    FileUploadModule,
    ModalModule,
    InfiniteScrollModule,
    ButtonsModule
  ],
})
export class SharedModule {}
