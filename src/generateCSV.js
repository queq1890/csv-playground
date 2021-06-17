// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const NUMBER_OF_ROWS = 10000000;

const zeroPadding = (num, length) => {
  return ('0000000000000000000' + num).slice(-length);
};

const text = [...Array(NUMBER_OF_ROWS)]
  .map((_, i) => {
    return zeroPadding(i + 1, 12);
  })
  .join('\r\n');

fs.writeFile('out.csv', text, (err, data) => {
  if (err) console.log(err);
  else console.log('write end');
});
