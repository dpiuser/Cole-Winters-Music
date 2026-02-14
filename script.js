// 1. Initialize Cart from LocalStorage
// This retrieves saved items so they don't disappear on refresh
let cart = JSON.parse(localStorage.getItem('cwm_cart')) || [];
const taxRate = 0.0975; // 9.75% tax

/**
 * Updates the visual cart UI
 */
function updateCart() {
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');

    // Safety check: if the elements aren't on the page, don't run the UI code
    if (!itemsEl || !totalEl) return;

    itemsEl.innerHTML = '';
    let subtotal = 0;
    let totalQuantity = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        totalQuantity += item.quantity;

        itemsEl.innerHTML += `
            <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:8px;">
                <div>
                    <div style="font-weight:bold; color:gold;">${item.name}</div>
                    <div style="font-size:0.8em;">Qty: ${item.quantity} x $${item.price.toFixed(2)}</div>
                </div>
                <div style="text-align:right;">
                    <div>$${itemTotal.toFixed(2)}</div>
                    <button onclick="removeItem('${item.id}')" style="color:#ff4d4d; background:none; border:none; cursor:pointer; font-size:0.7em;">Remove</button>
                </div>
            </div>`;
    });

    const taxAmount = subtotal * taxRate;
    const grandTotal = subtotal + taxAmount;

    if (countEl) countEl.innerText = totalQuantity;

    totalEl.innerHTML = `
        <div style="margin-top:20px; border-top: 2px solid gold; padding-top:10px;">
            <div style="display:flex; justify-content:space-between;"><span>Subtotal:</span> <span>$${subtotal.toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Tax (9.75%):</span> <span>$${taxAmount.toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; color:gold; font-size:1.2em; margin-top:5px;">
                <span>Total:</span> <span>$${grandTotal.toFixed(2)}</span>
            </div>
        </div>`;
}

/**
 * Adds an item to the cart
 */
function addItemToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveAndRefresh();
}

/**
 * Removes or decrements an item
 */
function removeItem(id) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    saveAndRefresh();
}

/**
 * Saves to local storage and updates UI
 */
function saveAndRefresh() {
    localStorage.setItem('cwm_cart', JSON.stringify(cart));
    updateCart();
}

/**
 * Drawer Controls
 */
function openCart() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
}

// 2. Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial UI load
    updateCart();

    // Listen for "Add to Cart" button clicks
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const btn = e.target;
            addItemToCart(
                btn.getAttribute('data-id'),
                btn.getAttribute('data-name'),
                parseFloat(btn.getAttribute('data-price'))
            );
            openCart(); // Automatically open drawer when item is added
        }
    });

    // Close buttons
    const closeBtn = document.getElementById('close-cart');
    const overlay = document.getElementById('cart-overlay');
    
    if (closeBtn) closeBtn.onclick = closeCart;
    if (overlay) overlay.onclick = closeCart;
});