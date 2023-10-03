import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  displayChat: boolean = false;
  loggedUser: any;
  newMessage: string = '';
  messages: any = [
    {
      from: 'id',
      text: 'Hola',
    },
    {
      from: 'id2',
      text: 'Hola 2',
    },
    {
      from: 'id3',
      text: 'Buenas !!!',
    },
  ];
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserLogged().subscribe((u) => {
      this.loggedUser = u;
    });
  }

  sendMessage() {
    if (!this.newMessage) return;

    const mssg = {
      from: this.loggedUser.uid,
      text: this.newMessage,
    };

    this.messages.push(mssg);
    this.newMessage = '';

    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 20);
  }

  scrollToTheLastElementByClassName() {
    const container = document.getElementById('containerMessages');
    const elements = document.getElementsByClassName('mssg');
    const lastElement: any = elements[elements.length - 1];
    const toppos = lastElement.offsetTop;

    if (container) {
      container.scrollTop = toppos;
    }
  }
}
