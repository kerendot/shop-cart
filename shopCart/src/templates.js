const getProductTpl = product => {
  return `
  <div class="card product" data-id="${product.id}">
            <div class="card-image">
              <figure class="image is-4by3">
                <img src="http://placehold.it/300x160" alt="coding academy store">
              </figure>
            </div>
            <div class="card-content">
              <div class="card-content-inner">
              <p class="title is-5">${product.title}</p>
              <div class="content">
                <p>${product.description}</p>
                <span>Price: <b>${product.price}$</b></span>
                <br>
              </div>
              <hr>
            </div>
            <div class="card-btns flex justify-center">
              <button class="button is-primary" data-add>+</button>
              <button class="button is-warning" data-substract>-</button>
              <button class="button is-info fa fa-pencil-square-o" data-update></button>
              <button style="display:none" class="button is-danger fa fa-trash-o" data-delete></button>
          </div>
        </div>
    </div>
  `
}

const getCartTpl = item => {
  return `
  <div class="card is-fullwidth" data-id="${item.id}">
              <header class="card-header">
                <p class="card-header-title">
                  ${item.title}
                </p>
              </header>
              <div class="card-content">
                <div class="content">
                  Quantity: ${item.quantity}
                </div>
              </div>
              <footer class="card-footer">
                <a class="card-footer-item" data-add>+</a>
                <a class="card-footer-item" data-subs>-</a>
                <a class="card-footer-item" data-clear>Clear</a>
              </footer>
            </div>
  `
}

export default {
  getProductTpl,
  getCartTpl
}