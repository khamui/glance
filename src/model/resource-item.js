export class ResourceItem {
  constructor(type) {
    this.data = null;
    this.resType = type;
    this.glaId = null;
    this.container = null;
    console.log('new resource constructed.');
  }

  setResource(data) {
    this.data = data.sheetData;
    this.resType = data.type;
    this.glaId = data['gla_id'];
  }
}
