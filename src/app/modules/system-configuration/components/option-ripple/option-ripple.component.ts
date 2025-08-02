import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-option-ripple',
  templateUrl: './option-ripple.component.html',
  styleUrl: './option-ripple.component.scss'
})
export class OptionRippleComponent {

  @Input() text = '';
  @Input() icon = '';
  @Input() navigation = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  navigate() {
    if (this.navigation !== '') {
      this.router.navigate([this.navigation],  {relativeTo: this.route});
    }
  }
}
