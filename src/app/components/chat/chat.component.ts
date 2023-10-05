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
      name: 'Johnny Estudio',
      text: 'Hola',
      date: `22:25`,
    },
    {
      from: 'id2',
      name: 'Armando Esteban',
      text: 'Hola 2',
      date: `22:31`,
    },
    {
      from: 'id3',
      name: 'Quito',
      text: 'Buenas !!!',
      date: this._getCurrentFormattedHours(),
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
    console.log(this.loggedUser);
    const mssg = {
      from: this.loggedUser.uid,
      name: this.loggedUser.displayName,
      text: this.newMessage,
      date: this._getCurrentFormattedHours(),
    };

    this.messages.push(mssg);
    this.newMessage = '';

    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 20);
  }

  _getCurrentFormattedHours() {
    const currentDate = new Date();

    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${hours}:${minutes}`;

    return formattedDate;
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
