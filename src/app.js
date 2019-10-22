import {Server} from './backend/Server'

export class App {
  s = new Server;
  message = 'Info: ' + this.s.run();
}
