export class ResourceList {
  constructor() {
    this.items = [];
    console.log('new resource list constructed.');
  }

  register(item) {
    if (this.items.length !== 0) {
      let foundItem = this.items.find((res) => {
        return res.resType === item.resType;
      });
      if (foundItem) return;
      this.items.push(item);
    }
    else {
      this.items.push(item);
    }
  }
}
