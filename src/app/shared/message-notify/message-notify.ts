import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-notify',
  imports: [
        NgIf,
    NgClass,
  ],
  templateUrl: './message-notify.html',
  styleUrl: './message-notify.scss',
})
export class MessageNotify {
@Input() MSG = '';
@Input() status: 'init' | 'loading' | 'success' | 'error' = 'init';
}
