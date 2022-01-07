$(() => {

    //mostrar menu mobile

    $('#btn-menu').click(() => {
        $('.nav__menu').slideToggle();
    });

    //class

    class Producto {
        constructor(url, marca, descripcion, precio, cantidad) {
            this.url = url;
            this.marca = marca;
            this.descripcion = descripcion;
            this.precio = precio;
            this.cantidad = cantidad;
        }
    }

    //Button animation

    $('.btn').mousedown((e) => {
        const btn = $(e.target);

        if (btn.hasClass('btn-green')) {
            btn.addClass('btn-press-green');
        } else if (btn.hasClass('btn-red')) {
            btn.addClass('btn-press-red');
        } else if (btn.hasClass('btn')) {
            btn.addClass('btn-press');
        }
    }).mouseup((e) => {
        const btn = $(e.target);

        btn.removeClass('btn-press');
        btn.removeClass('btn-press-red');
        btn.removeClass('btn-press-green');
    });

    //open modal 

    function openModal(btn, modal, modalSec, modalTwo) {
        btn.click(() => {
            modal.fadeToggle();
            modalSec.fadeOut();
            modalTwo.fadeOut();
        });
    }

    function closeBtn(btn, modal) {
        btn.click(() => {
            modal.fadeOut();
        });
    }

    openModal($('#btn-admin'), $('#admin'), $('#login'), $('#cart'));
    closeBtn($('#btn-close-admin'), $('#admin'));

    openModal($('#btn-login'), $('#login'), $('#admin'), $('#cart'));
    closeBtn($('#btn-close-login'), $('#login'));

    openModal($('#btn-cart'), $('#cart'), $('#login'), $('#admin'));
    closeBtn($('#btn-close-cart'), $('#cart'));

    //funcion crear productos en el DOM

    function crearProd(img, marca, desc, precio) {
        $('#main').append(
            `<div class="card">
                <div class="card-img">
                    <img id="card-img__cont" src="${img}" alt="" class="card-img__cont">
                </div>
                <h5 id="card-title" class="card-title">${marca}</h5>
                <p id="card-desc" class="card-desc">${desc}</p>
                <p id="card-precio" class="card-precio">${precio}</p>
                <button id="btn-add-cart" class="card-btn btn btn-blue">
                    <i class="fas fa-cart-plus"></i>Añadir al
                    carrito
                </button>
            </div>`
        );
    }

    //funcion crear productos en el carrito

    function addCart(img, marca, desc, precio, cantidad) {
        $('#cart-cont').append(
            `<div id="cart-card" class="cart-card">
            <div class="cart-card__cont">
                <img class="cart-card__cont__img"
                    src="${img}">
            </div>
            <h5 class="cart-card__title">${marca}</h5>
            <p class="cart-card__desc">${desc}</p>
            <p class="cart-card__precio">$${precio}</p>
            <div id="cart-num-cont" class="cart-btn-cont">
                    <button id="btn-menos" class="btn-menos btn btn-red">-</button>
                    <p id="cart-cant" class="cart-cant cart-cantidad">${cantidad}</p>
                    <button id="btn-mas" class="btn-mas btn btn-blue">+</button>
                </div>
        </div>
        `);
    }

    //datos desde JSON local

    async function productosJson() {
        const response = await fetch('./productos.json');
        const productos = await response.json();

        return productos;
    }

    productosJson().then(array => {
        array.forEach(producto => {
            crearProd(producto.img, producto.marca, producto.descripcion, producto.precio);
        });
    });

    //Añadir productos del local storage

    let productos = [];

    let productosMemoria = localStorage.getItem('productos');

    productosMemoria = JSON.parse(productosMemoria);

    if (productosMemoria != null) {
        productos = productos.concat(productosMemoria);
    }

    productos.forEach(producto => {
        if (producto != null) {
            crearProd(producto.url, producto.marca, producto.descripcion, producto.precio);
        }
    });

    //añadir productos Admin al local storage

    $('#formAdmin').submit((e) => {
        e.preventDefault();

        let datos = new FormData(e.target);

        if (datos.get('url') == '') {
            productos.push(new Producto('media/noImg.jpg', datos.get('marca'), datos.get('descripcion'), datos.get('precio')));
        } else {
            productos.push(new Producto(datos.get('url'), datos.get('marca'), datos.get('descripcion'), datos.get('precio')));
        }

        localStorage.setItem('productos', JSON.stringify(productos));

        $('#formAdmin').trigger('reset');

        location.reload();
    });

    //añadir al carrito

    let cart = [];

    let cartSave = localStorage.getItem('cart');

    cartSave = JSON.parse(cartSave);

    if (cartSave != null) {
        cart = cart.concat(cartSave);
    }

    cart.forEach(producto => {
        if (producto != null) {
            addCart(producto.url, producto.marca, producto.descripcion, producto.precio, producto.cantidad);
        }
    });


    $('.main').click((e) => {
        let target = $(e.target);
        let parent = target.parent();

        let imgSrc = parent.children('div.card-img').children('img').attr('src');
        let marca = parent.children('h5').text();
        let desc = parent.children('p.card-desc').text();
        let precio = parent.children('p.card-precio').text();

        let producto = new Producto(imgSrc, marca, desc, precio, 1);

        if (target.hasClass('btn')) {
            if (target.hasClass('btn-blue')) {
                cart.push(producto);
                localStorage.setItem('cart', JSON.stringify(cart));
                location.reload();
            }
        }
    });

    //limpiar local storage

    $('#btn-clear-memo').click(() => {
        localStorage.clear();
        location.reload();
    });
    $('#btn-clear-cart').click(() => {
        localStorage.removeItem('cart');
        location.reload();
    });

    //sumar cantidad cart y guardar en localStorage

    $('.cart-btn-cont').click((e) => {
        let target = $(e.target);
        let parent = target.parent();
        let container = parent.parent();
        let cantidad = Number(parent.children('#cart-cant').text());

        if (target.hasClass('btn-mas')) {
            let total = Number(cantidad) + 1;
            parent.children('#cart-cant').text(total);
        } else if (target.hasClass('btn-menos')) {
            if (cantidad > 1) {
                let total = Number(cantidad) - 1;
                parent.children('#cart-cant').text(total);
            }
        }

        let title = container.children('.cart-card__title').text();
        let desc = container.children('.cart-card__desc').text();
        let precio = container.children('.cart-card__precio').text().slice(1);
        let cartCant = Number(parent.children('#cart-cant').text());

        let cartSave = localStorage.getItem('cart');

        cartSave = JSON.parse(cartSave);

        cartSave.forEach(producto => {
            if (producto.marca == title && producto.descripcion == desc && producto.precio == precio) {
                producto.cantidad = cartCant;
            }
        });
        localStorage.setItem('cart', JSON.stringify(cartSave));
    });
})