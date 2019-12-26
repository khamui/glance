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
    name: 'glance',
    route: ['glance'],
    moduleId: PLATFORM.moduleName('glance/glance'),
    nav: true,
    title: 'Glances',
    settings: { iconClass: ''}
  },
  {
    name: 'xltable',
    route: ['xltable'],
    moduleId: PLATFORM.moduleName('xltable/xltable'),
    title: 'xltable',
    settings: { iconClass: ''}
  }
];
