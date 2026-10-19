'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../docs/assets/locale.js'), 'utf8');

function simulate({zone='Europe/London', saved=null, url='https://example.com/RTRTL/', lang='en', blocked=false}={}) {
  let destination = null;
  let address = url;
  let selected = saved;
  const storage = {
    getItem() { if (blocked) throw new Error('Blocked'); return selected; },
    setItem(key, value) { if (blocked) throw new Error('Blocked'); selected = value; }
  };
  vm.runInNewContext(source, {
    URL,
    window:{location:{href:url, replace(value){destination=value;}},localStorage:storage, history:{state:null, replaceState(state, title, value){address=value;}}},
    document:{documentElement:{lang},currentScript:{src:url.startsWith('file:') ? new URL('assets/locale.js', url).href : 'https://example.com/RTRTL/assets/locale.js'}},
    Intl:{DateTimeFormat(){return{resolvedOptions(){return{timeZone:zone};}}}}
  });
  return {destination, selected, address};
}

assert.equal(simulate({zone:'Asia/Jerusalem'}).destination, 'https://example.com/RTRTL/he/');
assert.equal(simulate({zone:'America/New_York'}).destination, null);
assert.equal(simulate({zone:'Asia/Jerusalem', saved:'en'}).destination, null);
assert.equal(simulate({saved:'he'}).destination, 'https://example.com/RTRTL/he/');
assert.equal(simulate({zone:'Asia/Jerusalem', url:'https://example.com/RTRTL/?lang=en'}).selected, 'en');
assert.equal(simulate({zone:'Asia/Jerusalem', url:'https://example.com/RTRTL/?lang=en', blocked:true}).destination, null);
assert.equal(simulate({url:'https://example.com/RTRTL/he/',lang:'he'}).destination, null);
assert.equal(simulate({zone:'Asia/Jerusalem',url:'https://example.com/RTRTL/#install'}).destination, 'https://example.com/RTRTL/he/#install');
assert.equal(simulate({zone:'Asia/Jerusalem',blocked:true}).destination, 'https://example.com/RTRTL/he/');
assert.equal(simulate({url:'https://example.com/RTRTL/?lang=invalid'}).destination, null);
assert.equal(simulate({zone:'Israel'}).destination, 'https://example.com/RTRTL/he/');
assert.equal(simulate({zone:''}).destination, 'https://example.com/RTRTL/he/');
assert.equal(simulate({saved:'ar'}).destination, 'https://example.com/RTRTL/ar/');
assert.equal(simulate({url:'https://example.com/RTRTL/ar/',lang:'ar'}).destination, null);
assert.equal(simulate({url:'https://example.com/RTRTL/?lang=ar'}).selected, 'ar');
assert.equal(simulate({url:'https://example.com/RTRTL/?lang=ar',blocked:true}).destination, 'https://example.com/RTRTL/ar/?lang=ar');
assert.equal(simulate({saved:'ar',url:'file:///site/index.html'}).destination, 'file:///site/ar/index.html');
for (const [lang, path] of [['en', ''], ['he', 'he/'], ['ar', 'ar/']]) {
  const url = `https://example.com/RTRTL/${path}index.html?lang=${lang}&campaign=test#install`;
  const result = simulate({url, lang, blocked:true});
  assert.equal(result.destination, null);
  assert.equal(result.address, `https://example.com/RTRTL/${path}?campaign=test#install`);
}
assert.equal(simulate({url:'https://example.com/RTRTL/index.html'}).address, 'https://example.com/RTRTL/');
assert.equal(simulate({url:'https://example.com/RTRTL/he/?lang=invalid',lang:'he'}).address, 'https://example.com/RTRTL/he/');
assert.equal(simulate({saved:'en',url:'file:///site/index.html'}).address, 'file:///site/index.html');
// A cross-edition legacy choice survives both page loads even with blocked storage.
const redirect = simulate({url:'https://example.com/RTRTL/he/index.html?lang=en',lang:'he',blocked:true}).destination;
assert.equal(redirect, 'https://example.com/RTRTL/?lang=en');
assert.equal(simulate({url:redirect,zone:'Asia/Jerusalem',blocked:true}).address, 'https://example.com/RTRTL/');
console.log('Language routing: defaults, manual choices, legacy URL cleanup, blocked storage and local files passed');
