import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal" [class.show]="show">
      <div class="modal-content">
        <span class="close" (click)="closeModal()">&times;</span>
        <p>{{ message }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() message: string = '';
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.show = false;
    this.close.emit();
  }
}
