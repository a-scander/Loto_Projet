import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Tirage } from '../../models/tirage-model';

@Component({
  selector: 'app-classement-tirage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classement-tirage.component.html',
  styleUrl: './classement-tirage.component.css',
})
export class ClassementTirageComponent {
  @Input() classement!: Tirage[];
  @Input() tirageWin!: Tirage;
  @Input() position!: number[];
  @Input() gains!: number[];
}
