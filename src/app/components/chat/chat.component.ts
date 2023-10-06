import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  displayChat: boolean = false;
  loggedUser: any;
  newMessage: string = '';
  messages: any = [];
  newMessages: any = [];
  subscription: any;
  constructor(
    private authService: AuthService,
    private database: DatabaseService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.getUserLogged().subscribe((u) => {
      this.loggedUser = u;
    });

    this.database.getAll('chat_history').subscribe(
      (querySnapshot) => {
        if (querySnapshot.empty) {
          console.log('Documents not found');
          return;
        }
        const docs: any = [];

        querySnapshot.forEach((doc) => {
          const data: any = doc.data();
          docs.push(data);
        });

        docs.sort((a: any, b: any) => a.date - b.date);
        docs.forEach((doc: any) => {
          doc.date = this._getFormattedHours(doc.date);
          this.messages.push(doc);
        });
      },
      (err) => {
        console.error('Error reading chat history:', err);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  sendMessage() {
    if (!this.newMessage) return;
    const currentDate = Date.now();
    this.messages.push({
      from: this.loggedUser.uid,
      name: this.loggedUser.displayName,
      text: this.newMessage,
      date: this._getFormattedHours(currentDate),
    });
    this.database.create('chat_history', {
      from: this.loggedUser.uid,
      name: this.loggedUser.displayName,
      text: this.newMessage,
      date: currentDate,
    });

    this.newMessage = '';

    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 20);
  }

  _getFormattedHours(dateUnix: number) {
    const date = new Date(dateUnix);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

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
