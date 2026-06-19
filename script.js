/**
 * MOD3EST PROJECT - Control Funcional de Frontend Autónomo
 * Arquitectura limpia en Vanilla JS sin dependencias externas.
 */

document.addEventListener('DOMContentLoaded', () => {

    // NÚMERO DE TELÉFONO DE DESTINO OFICIAL DE LA MARCA (Formato internacional limpio)
    const WHATSAPP_PHONE = "34640249205";

    // ESTRUCTURA DE ESTADO DEL CARRITO GLOBAL
    let cart = [];

    /* ==========================================================================
       COMPONENTES DE INTERFAZ DE USUARIO (ELEMENTOS DEL DOM)
       ========================================================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    const cartCount = document.getElementById('cartCount');
    const cartSubtotalAmount = document.getElementById('cartSubtotalAmount');
    
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtySelector = document.getElementById('qtySelector');
    const sizeSelector = document.getElementById('sizeSelector');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const directWhatsappBtn = document.getElementById('directWhatsappBtn');
    const checkoutCartBtn = document.getElementById('checkoutCartBtn');

    /* ==========================================================================
       MENÚ RESPONSIVE HAMBURGUESA
       ========================================================================== */
    const toggleMobileMenu = () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
    };

    hamburger.addEventListener('click', toggleMobileMenu);

    // Cerrar menú al interactuar con enlaces de ancla
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
            
            // Actualizar clase activa visual
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    /* ==========================================================================
       SELECTOR DE CANTIDAD (PRODUCT DETAIL)
       ========================================================================== */
    qtyMinus.addEventListener('click', () => {
        let currentQty = parseInt(qtySelector.value);
        if (currentQty > 1) {
            qtySelector.value = currentQty - 1;
        }
    });

    qtyPlus.addEventListener('click', () => {
        let currentQty = parseInt(qtySelector.value);
        if (currentQty < 10) { // Limitación razonable preventiva
            qtySelector.value = currentQty + 1;
        }
    });

    /* ==========================================================================
       LÓGICA INTERNA DEL CARRITO DE COMPRA
       ========================================================================== */
    const openCart = () => {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
    };

    const closeCart = () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
    };

    cartToggleBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Actualizar e Inyectar HTML dinámico en el Carrito Lateral
    const renderCart = () => {
        if (cart.length === 0) {
            cartBody.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
            cartFooter.style.display = 'none';
            cartCount.textContent = '0';
            return;
        }

        cartBody.innerHTML = '';
        let totalItems = 0;
        let subtotal = 0;

        cart.forEach((item, index) => {
            totalItems += item.quantity;
            subtotal += item.price * item.quantity;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-meta">Talla: <strong>${item.size}</strong> | Cantidad: ${item.quantity}</div>
                    <div class="cart-item-price">${(item.price * item.quantity).toFixed(2).replace('.', ',')} €</div>
                    <button class="remove-item-btn" data-index="${index}"><i class="fas fa-trash-can"></i> Eliminar</button>
                </div>
            `;
            cartBody.appendChild(itemElement);
        });

        cartCount.textContent = totalItems;
        cartSubtotalAmount.textContent = `${subtotal.toFixed(2).replace('.', ',')} €`;
        cartFooter.style.display = 'block';

        // Vincular eventos de eliminación reactivos
        const removeBtns = cartBody.querySelectorAll('.remove-item-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemIndex = e.currentTarget.getAttribute('data-index');
                removeItemFromCart(itemIndex);
            });
        });
    };

    const addItemToCart = (name, price, size, quantity) => {
        // Verificar si existe previamente un producto idéntico en la misma talla
        const existingItemIndex = cart.findIndex(item => item.name === name && item.size === size);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ name, price, size, quantity });
        }

        renderCart();
        openCart();
    };

    const removeItemFromCart = (index) => {
        cart.splice(index, 1);
        renderCart();
    };

    // Evento Añadir al Carrito
    addToCartBtn.addEventListener('click', () => {
        const priceElement = document.getElementById('productPriceDisplay');
        const price = parseFloat(priceElement.getAttribute('data-price'));
        const size = sizeSelector.value;
        const quantity = parseInt(qtySelector.value);
        
        addItemToCart("Shorts deportivos MOD3EST", price, size, quantity);
    });

    /* ==========================================================================
       CONEXIÓN Y COMUNICACIÓN AUTOMÁTICA CON WHATSAPP
       ========================================================================== */
    
    // Opción 1: Checkout desde el Carrito integrado
    checkoutCartBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        let message = "Salam, estoy interesado en realizar el siguiente pedido en MOD3EST PROJECT:\n\n";
        let total = 0;
        
        cart.forEach(item => {
            message += `- *${item.name}*\n  Talla: ${item.size}\n  Cantidad: ${item.quantity}\n  Precio: ${(item.price * item.quantity).toFixed(2)} €\n\n`;
            total += item.price * item.quantity;
        });

        message += `*Total estimado:* ${total.toFixed(2)} €\n`;
        message += "Quedo a la espera para facilitar los datos de envío.";

        const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    // Opción 2: Botón directo "Pedir por WhatsApp" sin pasar por carrito
    directWhatsappBtn.addEventListener('click', () => {
        const size = sizeSelector.value;
        const quantity = qtySelector.value;
        
        const message = `Salam, estoy interesado en pedir los Shorts MOD3EST. Talla: ${size}. Cantidad: ${quantity}.`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });


    /* ==========================================================================
       ACORDEÓN INTERACTIVO (SECCIÓN FAQ)
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const content = this.nextElementSibling;
            const isActive = item.classList.contains('active');

            // Cerrar otros elementos abiertos para un comportamiento Premium fluido
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    /* ==========================================================================
       ANIMACIONES SUAVES AL HACER SCROLL (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15 // Se activa cuando el 15% del elemento es visible
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
});