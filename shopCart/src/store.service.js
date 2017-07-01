import $ from 'jquery';

const urlProduct = 'http://localhost:3000/product';

// Client Side State of the store
// Kind of caching...
var products = null;
var lastUpdatedOn;
const dataMaxAge = 60;


function getProducts() {

  // Simple Caching, if we already got them, just return.
  // if more than 1 min passed, get from server
  var secsSinceUpdate = (Date.now() - lastUpdatedOn) / 1000;
  if (products && secsSinceUpdate < dataMaxAge) {
    return Promise.resolve(products);
  }
  console.log('Getting Products from Server');
  var prmProducts = fetch(urlProduct);

  ////shortened:
  // return prmProducts
  //   .then(res => res.json()).then(prds => {
  //     products = prds;
  //     return products;
  //   });

  var prmToReturn = prmProducts.then(res => res.json());
  prmToReturn.then(prds => {
    products = prds;
    lastUpdatedOn = Date.now();
    console.log('Products updated from server');
    // return products;
    return Promise.resolve(products);
  });
  return prmToReturn;
}

function addProduct(productName) {
  const newProduct = { title: productName, price: 200, description: 'this is a good product!' };
  return $.post(urlProduct, newProduct)
    .then(newProduct => products.push(newProduct))
    .fail(err => console.log('wrong user details'));
}

function deleteProduct(productId) {
  return $.ajax({
    url: `${urlProduct}/${productId}`,
    type: 'DELETE',
    success: function (result) {
      console.log('Server returned succeess for delete product');
    }
  }).then(() => {
    const idx = products.findIndex(product => product.id === productId);
    products.splice(idx, 1);
  })
}


// function getProductById(productId) {
//   return getProducts().then(products => {
//     const product = products.find(product => productId === product.id);
//     return product;
//   });
// }

function getProductById(productId) {
  // var prmProduct = fetch(`${urlProduct}/${productId}`);
  // return prmProduct.then(res=>res.json());
  return fetch(`${urlProduct}/${productId}`).then(res => res.json());
}

function updateProduct(productId, newPrice) {
  // var newPrice = prompt('New Price?');

  return $.ajax({
    url: `${urlProduct}/${productId}/${newPrice}`,
    type: 'PUT',
    success: function (result) {
      console.log('Server returned succeess for put product');
    }
  }).done((res) => {
    products = res;
  })
}


// 
export default {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct
}


// function getProductsFromGenericAPI() {
//   const params = {
//     rows:       10,
//     id:        '{index}',
//     price:     '{number|1000}',
//     title: '{lorem|2}',
//     description: '{lorem|10}',
//     pretty: true
//   }

//   return $.getJSON('http://www.filltext.com', params);

// }


// Used to create local data with no AJAX
// function generateProducts() {
//   const skills = ['JavaScript', 'CSS', 'SASS', 'Node', 'Angular 2', 'VUE'];

//   return skills.map(generateProduct);
// }
// function generateProduct(skill, i) {
//   return {
//     id: i + 1,
//     title: `Mastering ${skill}`,
//     description: `${skill} lorem  ipsum dkhd daklhd dakhdk dakhdk da`,
//     price: (i + 1) * 10
//   }
// }



// function getProducts() {
//   return new Promise(resolve => {
//     // simple caching mechanism
//     if( products.length ) {
//       resolve(products);
//     }
//     else {
//       setTimeout(() => {
//         products = generateProducts();
//         resolve(products);
//       }, 2000);
//     }

//   });
// }


