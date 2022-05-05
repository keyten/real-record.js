# real-record.js
Real type-safe record for JS.

```js
const object = new RealRecord({}, String, Number);
object.foo = 1; // ok
object.bar = 2; // ok
object.baz = '3'; // Error!
object[Symbol('baz')] = 4; // Error!
```

It also checks the object on create:
```js
const object = new RealRecord({
  abc: 0
}, String, String); // Error!
```

#### It works like proxy
You actually can add new props without type checks in a roundabout way:
```js
const target = { foo: 0 };
const realrecord = new RealRecord(target, String, Number);

realrecord.bar = 'abc'; // Error!
target.bar = 'abc'; // ok

realrecord.bar; // -> 'abc'
```

#### Strict mode
Optional 4th argument `strict` (false by default) also checks the type inside a getter.

It also doesn't allow it to return properties from prototypes.

For example:
```js
const target = {};
const realrecord = new RealRecord(target, String, String, true);
realrecord.constructor; // will return undefined, because 'constructor' exists only in prototype of target

target.abc = 0;
realrecord.abc; // Error!
```

That's where TypeScript gets confused:
```ts
const x: Record<string, string> = {};
x['constructor']; // typescript has no idea that it's not a string
```

