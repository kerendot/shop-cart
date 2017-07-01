import './style.scss'

import $ from 'jquery';

// import * as dummy from './playWithPromise'

import storeService from './store.service';
import cartService from './cart.service';
import userService from './user.service';
import templates from './templates';

const getRelatedProductId = el => $(el).closest('[data-id]').data('id');

const generateProductsDOM = products => {
  const el = document.querySelector('.products');
  $(el).empty();
  const fragment = document.createDocumentFragment();
  for (let product of products) {
    const template = document.createElement('template');
    template.innerHTML = templates.getProductTpl(product);
    fragment.appendChild(template.content);
  }
  el.appendChild(fragment);
}

const generateCartItemsDOM = items => {
  const el = document.querySelector('.cart-items');
  $(el).empty();
  const fragment = document.createDocumentFragment();
  for (let item of items) {
    const template = document.createElement('template');
    template.innerHTML = templates.getCartTpl(item);
    fragment.appendChild(template.content);
  }
  el.appendChild(fragment);
}

const hideLoader = () => {
  const el = document.querySelector('.loader');
  el.style.display = 'none';
}

const storeClickHandlers = () => {
  // product card Buttons:
  $('[data-add]').on('click', addToCart);
  $('[data-substract]').on('click', substractFromCartBtns);
  $('[data-update]').on('click', updateProductClicked);

  if (userService.isAdmin()) {
    $('[data-delete]').show();
  }
  $('[data-delete]').on('click', function () {
    const productId = getRelatedProductId(this);
    storeService.deleteProduct(productId)
      .then(renderStore)
  });

  //modal click-handlers:
  $('.card-image, .card-content-inner').on('click', showProductModal);
  $('.modal-close').on('click', function () {
    $('.modal-product').removeClass('is-active');
  });

}

const showProductModal = function () {
  const productId = getRelatedProductId(this);
  var prmProduct = storeService.getProductById(productId);

  prmProduct.then(product => {
    const el = document.querySelector('.modal-content');
    $(el).empty();
    const template = document.createElement('template');
    template.innerHTML = templates.getProductTpl(product);
    el.appendChild(template.content);
    $('.modal-product .card-image,.modal-product .card-btns').hide();
    $('.modal-product').addClass('is-active');
  });

  prmProduct.catch(err => {
    console.log('Failed fetching Product, Try again later', err);
  });
}

const cartClickHandlers = () => {
  // Cart Buttons
  // We use Jquery style event delegation here, as those buttons 
  // are not in the dom yet, so we set a single click handler on the parent
  $('.cart-items').on('click', '[data-add]', addToCart);
  $('.cart-items').on('click', '[data-subs]', substractFromCartBtns);
  $('.cart-items').on('click', '[data-clear]', clearItem);
}

const addToCart = function () {
  const productId = getRelatedProductId(this);
  storeService.getProductById(productId).then(product => {
    const { id, title, price } = product;
    cartService.addToCart({
      id,
      title,
      price
    });

    renderCart();
  });
}

const substractFromCartBtns = function () {
  const productId = getRelatedProductId(this);
  cartService.substractFromCart(productId);
  renderCart();

};


const clearItem = function () {
  const productId = getRelatedProductId(this);
  cartService.clearItem(productId);
  renderCart();

}

const renderCart = () => {
  generateCartItemsDOM(cartService.getCartItems());
  renderCartTotal();
  showCartStatus();
}

const renderCartTotal = () => {
  const $el = $('[data-cart-total]');
  $el.text(cartService.getCartTotal());
}

const showCartStatus = () => {
  const el = document.querySelector('[data-cart-status]');
  if (cartService.getCartItems().length) {
    el.style.display = 'none';
  } else {
    el.style.display = 'block';
  }
}

const renderStore = () => {
  var prmProducts = storeService.getProducts();

  prmProducts.then(products => {
    // console.log(products);
    generateProductsDOM(products);
    storeClickHandlers();
    hideLoader();
  });
  prmProducts.catch(err => {
    console.log('Failed fetching Products, Try again later', err);
  });

}

const initStore = () => {

  renderStore();
  cartClickHandlers();

  $('[data-checkout-btn]').on("click", () => {
    var total = cartService.getCartTotal();
    var msg = `You paid ${total}$ for that!`;
    sweetAlert('WOW!', msg, 'success');
  })

  $('[data-add-product-btn]').on('click', () => {
    // var productName = prompt('Product Name?');
    promptAddProduct();

  })

  $('[data-admin-login-btn]').on("click", () => {
    promptLogin();
  })
}

const updateProductClicked = function () {
  const productId = getRelatedProductId(this);
  promptUpdateProduct(productId);
  // storeService.updateProduct(productId)
  //   .then(renderStore);
}

const promptUpdateProduct = (productId) => {
  swal({
    title: "Update Product",
    text: "Type new product price:",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "new price is..."
  },
    function (inputProductPrice) {
      if (inputProductPrice === false) return false;
      if (inputProductPrice === "") {
        swal.showInputError("You need to write something!");
        return false
      }
      //currently supported only 1 input, which is used for product title (the price and desc are hard coded)
      storeService.updateProduct(productId, inputProductPrice)
        .then(() => {
          renderStore();
          swal("Product price updated", "", "success");
        })
        .catch(() => swal("Ooops", "Something went wrong", "error"))
    });
}

const promptAddProduct = () => {
  swal({
    title: "Add Product",
    text: "Type product title:",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "title..."
  },
    function (inputProductName) {
      if (inputProductName === false) return false;
      if (inputProductName === "") {
        swal.showInputError("You need to write something!");
        return false
      }
      //currently supported only 1 input, which is used for product title (the price and desc are hard coded)
      storeService.addProduct(inputProductName)
        .then(() => {
          renderStore();
          swal("Product added", "", "success");
        })
        .catch(() => swal("Ooops", "Something went wrong", "error"))
    });
}

const promptLogin = () => {
  swal({
    title: "Admin Login",
    text: "Type password:",
    type: "input",
    showCancelButton: true,
    closeOnConfirm: false,
    animation: "slide-from-top",
    inputPlaceholder: "password..."
  },
    function (inputPass) {
      if (inputPass === false) return false;
      if (inputPass === "") {
        swal.showInputError("You need to write something!");
        return false
      }
      //currently supported only 1 input, which is used for both user and pass
      userService.login(inputPass, inputPass)
        .then(user => {
          if (user.isAdmin) {
            $('.admin-login').hide();
            $('.admin-section').show();
            $('[data-delete]').show();
            swal("Admin Login successful", "user: " + inputPass, "success");
          }
          else swal(`User ${inputPass} is not Admin`, "", "error");
        })
        .catch(()=>swal(`User ${inputPass} doesn't exist`, "Please try again", "error"))
    });
}

// $(window).load(initStore);
// $(document).ready(initStore);
$(initStore);