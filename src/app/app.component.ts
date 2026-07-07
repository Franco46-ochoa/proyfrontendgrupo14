import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from "./shared/components/layout/layout.component";
import { CsrfService } from './core/services/csrf.service';

@Component({
  selector: 'app-root',
  imports: [ LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'proyfrontendgrupo14';
  private csrfService = inject(CsrfService);

  ngOnInit(): void {
    this.csrfService.fetchToken().subscribe();
  }
}