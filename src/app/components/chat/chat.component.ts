import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @ViewChild('containerMessages') containerMessages!: ElementRef;
  displayChat: boolean = false;
  loggedUser: any;
  newMessage: string = '';
  messages: any = [];
  newMessages: any = [];
  subscriptionAuth: any;
  subscriptionDB: any;
  db: any;
  constructor(
    private authService: AuthService,
    private database: DatabaseService
  ) {}

  ngOnInit(): void {
    this.subscriptionAuth = this.authService.getUserLogged().subscribe((u) => {
      this.loggedUser = u;
    });
    this.db = this.database.getDatabase('chat_history');

    this.subscriptionDB = this.db.valueChanges().subscribe((data: any) => {
      data.sort((a: any, b: any) => a.date - b.date);
      data.forEach((x: any) => {
        x.date = this._getFormattedHours(x.date);
      });
      this.messages = data;
      this.scrollToTheLastElementByClassName();
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionAuth) {
      this.subscriptionAuth.unsubscribe();
    }

    if (this.subscriptionDB) {
      this.subscriptionDB.unsubscribe();
    }
  }

  sendMessage() {
    if (!this.newMessage) return;
    const currentDate = Date.now();

    this.db.push({
      from: this.loggedUser.uid,
      name: this.loggedUser.displayName || this.loggedUser.email.split('@')[0],
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
    setTimeout(() => {
      const container = this.containerMessages.nativeElement;
      const elements = document.getElementsByClassName('mssg');
      const lastElement: any = elements[elements.length - 1];
      const toppos = lastElement.offsetTop;

      if (container) {
        container.scrollTop = toppos;
      }
    });
  }

  onOpen() {
    this.displayChat = true;
    this.scrollToTheLastElementByClassName();
  }
}
