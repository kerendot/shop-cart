const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3000


const products = generateProducts();


app.get('/', (request, response) => {
  response.send('Hello from Express!')
})


app.post('/login', (request, response) => {
  const credentials = request.body;
  console.log('credentials',credentials);
  var user = users.find(user => user.name === credentials.name && user.pass === credentials.pass);
  if (user){
    console.log('login OK');
    response.json(user);
  }
  else {
    console.log('login failed');
    response.status(401);
    response.end();
  }

})

app.get('/product', (request, response) => {
  console.log(`Returning ${products.length} products`);
  response.json(products)
})

app.get('/product/:prdId', (request, response) => {
  const productId = +request.params.prdId;
  console.log(`Server Requested to get Product with id: ${productId}`);
  const product = products.find(product => product.id === productId);
  response.json(product);
})

app.put('/product/:prdId/:newPrice', (request, response) => {
  const productId = +request.params.prdId;
  const price = +request.params.newPrice;
  console.log(`server updating Product id: ${productId}, price: ${price}`);
  const idx = products.findIndex(product => product.id === productId);
  products[idx].price = price;
  response.json(products);
})


app.post('/product', (request, response) => {
  var newProduct = request.body;
  var lastUsedId = products[products.length-1].id;
  newProduct.id = lastUsedId + 1;
  console.log(`New Product with id ${newProduct.id} Added`);
  products.push(newProduct);
  response.json(newProduct);

})

app.delete('/product/:prdId', (request, response) => {
  const productId = +request.params.prdId;
  console.log(`Server Requested to delete Product with id: ${productId}`);

  const idx = products.findIndex(product => product.id === productId);
  products.splice(idx, 1);
  response.end();
});


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}!`)
})



function generateProducts() {
  const skills = ['JavaScript', 'CSS', 'SASS', 'Node', 'Angular 2', 'VUE'];

  return skills.map(generateProduct);
}

function generateProduct(skill, i) {
  return {
    id: i + 1,
    title: `Mastering ${skill}`,
    description: `${skill} lorem  ipsum dkhd daklhd dakhdk dakhdk da`,
    price: (i + 1) * 10
  }
}

var users = getUsers();

//in real world, this will get the users from db
function getUsers(){
  var users= [];
  users.push( {name: 'puki', pass: 'puki', isAdmin: true},
              {name: 'muki', pass: 'muki', isAdmin: false},
              {name: 'a', pass:'a', isAdmin: true});
  return users;
}