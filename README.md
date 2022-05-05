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

#### Number as a key
If you use key: String, you can use numbers anyway (they get converted by js automatically):
```js
const realrecord = new RealRecord({ foo: 'bar' }, String, String);
realrecord[0] = 'baz'; // works as realrecord['0']
```

If you use key: Number, RealRecord will check type and throw error if it's not integer:
```js
const realrecord = new RealRecord([0, 1, 2], Number, Number);
realrecord['0'] = 1; // works as realrecord[0]
realrecord['customstr'] = 1; // Error!
```

#### Custom type guard
```js
const realrecord = new RealRecord({
  foo: 'bar'
}, String, {
  guard: x => x === null || typeof x === 'string'
});

realrecord.foo = null;
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

