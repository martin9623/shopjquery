$(() => {

    //mostrar menu mobile

    $('#btn-menu').click(() => {
        $('.nav__menu').toggleClass('nav__menu-act');
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
        const btnClass = (e.target.classList);
        if (btnClass.contains('btn-green')) {
            $(e.target).addClass('btn-press-green');
        } else if (btnClass.contains('btn-red')) {
            $(e.target).addClass('btn-press-red');
        } else if (btnClass.contains('btn')) {
            $(e.target).addClass('btn-press');
        }
    });
    $('.btn').mouseup((e) => {
        $(e.target).removeClass('btn-press');
        $(e.target).removeClass('btn-press-red');
        $(e.target).removeClass('btn-press-green');
    });

    //open modal 

    function openModal(btn, modal, modalSec, modalTwo) {
        btn.click(() => {
            if (modal.css('display') === 'none') {
                modal.fadeIn();
            } else {
                modal.fadeOut();
            }
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
            `
        );
    }

    //datos desde JSON local

    fetch('./productos.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(producto => {
                crearProd(producto.img, producto.marca, producto.descripcion, producto.precio);
            });
        });


    //Añadir productos del local storage

    let productos = [];

    let productosMemoria = localStorage.getItem('productos');

    productosMemoria = JSON.parse(productosMemoria);

    productos = productos.concat(productosMemoria);

    productos.forEach(producto => {
        if (producto != null) {
            crearProd(producto.url, producto.marca, producto.descripcion, producto.precio);
        }
    });

    //añadir productos Admin al local storage

    $('#formAdmin').submit((e) => {
        e.preventDefault();

        let datos = new FormData(e.target);

        productos.push(new Producto(datos.get('url'), datos.get('marca'), datos.get('descripcion'), datos.get('precio')));

        localStorage.setItem('productos', JSON.stringify(productos));

        $('#formAdmin').trigger('reset');

        location.reload();
    });

    //añadir al carrito

    let carrito = [];

    let carritoMemoria = localStorage.getItem('carrito');

    carritoMemoria = JSON.parse(carritoMemoria);

    if (carritoMemoria != null) {
        carrito = carrito.concat(carritoMemoria);
    }

    carrito.forEach(producto => {
        if (producto != null) {
            addCart(producto.url, producto.marca, producto.descripcion, producto.precio, producto.cantidad);
        }
    });


    $('.main').click((e) => {
        console.log(e.target);

        const nodoPadre = e.target.parentNode;

        const url = nodoPadre.querySelector('.card-img__cont').src;
        const nombre = nodoPadre.querySelector('.card-title').textContent;
        const desc = nodoPadre.querySelector('.card-desc').textContent;
        const precio = nodoPadre.querySelector('.card-precio').textContent;

        carrito.push(new Producto(url, nombre, desc, precio, 1));

        localStorage.setItem('carrito', JSON.stringify(carrito));

        location.reload();
    });

    //limpiar local storage

    $('#btn-clear-memo').click(() => {
        localStorage.clear();
        location.reload();
    });
    $('#btn-clear-cart').click(() => {
        localStorage.removeItem('carrito');
        location.reload();
    });

    //sumar cantidad cart y guardar en localStorage

    $('.cart-btn-cont').click((e) => {
        const nodoPadre = e.target.parentNode;
        const cart = nodoPadre.parentNode;
        const title = cart.querySelector('.cart-card__title').textContent;
        const desc = cart.querySelector('.cart-card__desc').textContent;
        const precio = cart.querySelector('.cart-card__precio').textContent.slice(1);

        const btnMas = nodoPadre.querySelector('.btn-mas');
        const btnMenos = nodoPadre.querySelector('.btn-menos');
        let cartCant = nodoPadre.querySelector('.cart-cant');

        let carritoMemoria = localStorage.getItem('carrito');

        carritoMemoria = JSON.parse(carritoMemoria);

        if (e.target === btnMas) {
            let value = Number(cartCant.textContent);
            cartCant.textContent = value + 1;
        } else if (e.target === btnMenos) {
            let value = Number(cartCant.textContent);
            if (value > 1) {
                cartCant.textContent = value - 1;
            }
        }

        carritoMemoria.forEach(producto => {
            if (producto.marca == title && producto.descripcion == desc && producto.precio == precio) {
                producto.cantidad = cartCant.textContent;
            }
        });

        localStorage.setItem('carrito', JSON.stringify(carritoMemoria));
    });
});