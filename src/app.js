import {Server} from './backend/server'

export class App {
  configureRouter(config, router) {
    this.router = router;
    config.title = 'Glance App';
    config.map([
      { route: 'dashboard', moduleId: PLATFORM.moduleName('components/dashboard'), title:'Dashboard' },
      { route: 'number', moduleId: PLATFORM.moduleName('components/number'), title:'Number' }
    ]);
  }
}