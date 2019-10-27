
export class ToArrayValueConverter {
  toView(value) {
    const array = [];
    for (let i = 0; i < value; i++) {
       array.push(i);
    }
    return array;
  }
}