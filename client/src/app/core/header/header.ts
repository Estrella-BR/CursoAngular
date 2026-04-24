import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [CommonModule,
            RouterModule,
            MatIconModule,
            MatToolbarModule,],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {

}
