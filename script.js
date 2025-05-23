document.addEventListener('DOMContentLoaded', function() {
    const cart = [];
    let subtotal = 0;

    // DOM Elements
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartCount = document.getElementById('cart-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const categoryButtons = document.querySelectorAll('.category-btn');

    // Toggle Cart Sidebar
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    function toggleCart() {
        cartSidebar.classList.toggle('translate-x-full');
        cartOverlay.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden');
    }

    // Add to Cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));

            // Check if item already exists in cart
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }

            updateCart();
            showAddToCartFeedback(this);
        });
    });

    // Show feedback when item is added to cart
    function showAddToCartFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.classList.remove('bg-red-500', 'hover:bg-red-600');
        button.classList.add('bg-green-500', 'hover:bg-green-600');

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-500', 'hover:bg-green-600');
            button.classList.add('bg-red-500', 'hover:bg-red-600');
        }, 1000);
    }

    // Update Cart UI
    function updateCart() {
        // Update cart count
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = itemCount;

        // Update cart items
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            checkoutBtn.disabled = true;
        } else {
            emptyCartMessage.classList.add('hidden');
            checkoutBtn.disabled = false;

            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item mb-4 pb-4 border-b border-gray-200';
                itemElement.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-medium">${item.name}</h3>
                        <span class="font-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <div class="flex items-center border border-gray-300 rounded-full">
                            <button class="decrease-quantity px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-full" data-id="${item.id}">-</button>
                            <span class="quantity px-2">${item.quantity}</span>
                            <button class="increase-quantity px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-full" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item text-red-500 hover:text-red-700" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            // Add event listeners to quantity buttons
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    if (item) {
                        item.quantity += 1;
                        updateCart();
                    }
                });
            });

            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    if (item && item.quantity > 1) {
                        item.quantity -= 1;
                        updateCart();
                    }
                });
            });

            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const index = cart.findIndex(item => item.id === id);
                    if (index !== -1) {
                        cart.splice(index, 1);
                        updateCart();
                    }
                });
            });
        }

        // Update subtotal and total
        subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const deliveryFee = subtotal > 0 ? 2.99 : 0;
        const total = subtotal + deliveryFee;

        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('delivery-fee').textContent = `$${deliveryFee.toFixed(2)}`;
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Category Filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // In a real app, you would filter the menu items here
        });
    });

    // Checkout Button
    checkoutBtn.addEventListener('click', function() {
        alert('Checkout functionality would be implemented here!');
        // In a real app, this would redirect to a checkout page or show a checkout form
    });
});