
function classDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
    console.log('Decorator')
  return class extends constructor {
    newProperty = "new property";
    hello = "override";
  };
}

@classDecorator
class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
    this.hello = m;
    console.log('Classe')
  }
}

console.log('Iniciando teste')
console.log(new Greeter("world"))
