/*
 * References:
 *  https://netbasal.com/behind-the-scenes-how-typescript-decorators-operate-28f8dcacb224
 *  https://www.typescriptlang.org/docs/handbook/decorators.html
 */

function Controller(basePath: string) {
    console.log('Controller evaluated')
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    console.log('Controller called')
    console.log(constructor)
    console.log(constructor.prototype)
    console.log(Object.keys(constructor))
    if (constructor.prototype._d) {
      constructor.prototype._d.basePath = basePath
    }
  }
}

function Get(path: string) {
  console.log(`Get(${path}) evaluated`)
  return function(target, methodName: string, descriptor: PropertyDescriptor) {
    console.log('Get called')
    const info = {
      method: 'GET',
      name: methodName,
      path
    }
    if (target._d) {
      target._d.routes.push(info)
    } else {
      target._d = { routes: [info] }
    }

    console.log(target)
  }
}

@Controller('poc')
class Greeter {
  property = "property";
  hello: string;
  constructor(m: string) {
    this.hello = m;
    console.log('Class constructor called')
    console.log(Object.keys(this))
    for (let key in this) console.log(key)
  }

  @Get('list')
  list() {}

  @Get('list/:id')
  byId() {}
}

console.log('Instantiating class')
const greeter = new Greeter('Hello')
console.log(greeter)
console.log((greeter as any)._d)

