export default [
  {
    name: 'home',
    route: ['', 'home'],
    moduleId: PLATFORM.moduleName('home/home'),
    nav: true,
    title: 'Home',
    settings: { iconClass: 'fa-home'}
  },
  {
    name: 'sheets',
    route: ['sheets'],
    moduleId: PLATFORM.moduleName('editor/sheets'),
    nav: true,
    title: 'Editor',
    settings: { iconClass: ''}
  }
];
