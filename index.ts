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
  list() {
    return 'list'
  }

  @Get('message')
  getMessage(value: string) {
    return `${this.hello} ${value}`
  }
}

class Caller {
  handlers = {
    'GET': [],
    'POST': []
  }
  register(c: any) {
    if ('_d' in c) {
      const basePath = c._d.basePath
      c._d.routes.forEach(it => {
        console.log(it)
        const handler = {
          path: `${basePath}/${it.path}`,
          handler: c[it.name].bind(c)
        }
        console.log(handler)
        this.handlers[it.method].push(handler)
      })
    }
  }

  call(method: string, path: string) {
    const handler = this.handlers[method].find(it => it.path == path)
    if (handler) {
      const res = handler.handler()
      console.log(res)
    }
  }
}


console.log('Instantiating class')
const greeter = new Greeter('Hello')
console.log(greeter)
console.log((greeter as any)._d)

const caller = new Caller()
caller.register(greeter)
caller.call('GET', 'poc/list')

