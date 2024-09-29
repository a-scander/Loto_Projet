import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent implements OnInit{
  @Input() label!: string ; // Texte par défaut du bouton
  @Input() type: string = 'button'; // Type par défaut du bouton
  @Input() disabled: boolean = false; // Désactivé par défaut (false)

  @Output() clicked = new EventEmitter<void>();


  ngOnInit(): void {
    if (!this.label) {
      throw new Error('L\'input `label` est requis pour le composant `ButtonComponent`.');
    }
  }
  onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
