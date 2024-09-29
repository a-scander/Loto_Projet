import { Component, Input } from '@angular/core';
import { Tirage } from '../../models/tirage-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recap-tableau',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recap-tableau.component.html',
  styleUrl: './recap-tableau.component.css'
})
export class RecapTableauComponent {
  @Input() tirages: Tirage[] = [];
}
