const fs = require('fs');
const file = 'src/data/products.ts';
let content = fs.readFileSync(file, 'utf8');

// Add to type
content = content.replace(
  /price: number;\n  mrp: number;/,
  'price: number;\n  mrp: number;\n  wholesalePrice?: number;\n  minQty?: number;'
);

// Add to objects
content = content.replace(/price: (\d+),/g, (match, p1) => {
  const wholesale = Math.round(parseInt(p1) * 0.75);
  const qty = [10, 20, 50][Math.floor(Math.random() * 3)];
  return `price: ${p1},\n    wholesalePrice: ${wholesale},\n    minQty: ${qty},`;
});

fs.writeFileSync(file, content);
console.log('Updated products.ts');
