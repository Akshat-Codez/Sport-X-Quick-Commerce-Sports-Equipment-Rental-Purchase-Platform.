/************** GLOBAL DATA **************/
const SECURITY_DEPOSIT = 999;
let cart = [];
let walletBalance = 500;
let orderHistory = [];
let rentData = null;

/************** SECTION SWITCH **************/
function showSection(id){
  document.getElementById("products").classList.add("hidden");
  document.getElementById("contact").classList.add("hidden");
  document.getElementById(id).classList.remove("hidden");
}

/************** LOAD RENT DAYS 7–20 **************/
document.addEventListener("DOMContentLoaded", ()=>{
  const rentSelect = document.getElementById("rentDays");
  if(rentSelect){
    rentSelect.innerHTML = "";
    for(let i=7;i<=20;i++){
      let opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i + " Days";
      rentSelect.appendChild(opt);
    }
  }
});

/************** SEARCH **************/
function searchProducts(){
  const val = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".card");
  cards.forEach(c=>{
    const name = c.querySelector("h4").innerText.toLowerCase();
    c.style.display = name.includes(val) ? "block" : "none";
  });
}

/************** BUY **************/
function addBuy(name, price){
  cart.push({name, price, type:"buy"});
  alert(name + " added to cart");
}

/************** RENT **************/
function openRent(name, rate){
  rentData = {name, rate};
  document.getElementById("rentItem").innerText = name;
  document.getElementById("rentModal").style.display = "block";
}

function closeRent(){
  document.getElementById("rentModal").style.display = "none";
}

function addRent(){
  const days = parseInt(document.getElementById("rentDays").value);
  const total = days * rentData.rate;

  cart.push({
    name: `${rentData.name} (Rent ${days} days)`,
    price: total,
    type: "rent"
  });

  closeRent();
  alert("Rental item added to cart");
}

/************** SHOES (SIZE REQUIRED) **************/
function addShoeBuy(btn, name, price){
  const size = btn.closest(".card").querySelector(".size-select").value;
  if(!size){
    alert("Please select shoe size");
    return;
  }

  cart.push({
    name: `${name} (Size ${size})`,
    price,
    type:"buy"
  });

  alert("Added to cart");
}

function openShoeRent(btn, name, rate){
  const size = btn.closest(".card").querySelector(".size-select").value;
  if(!size){
    alert("Please select shoe size");
    return;
  }

  rentData = {name:`${name} (Size ${size})`, rate};
  document.getElementById("rentItem").innerText = rentData.name;
  document.getElementById("rentModal").style.display = "block";
}

/************** CART **************/
function openCart(){
  const box = document.getElementById("cartItems");
  box.innerHTML = "";
  let total = 0;
  let hasRent = false;

  cart.forEach((item,i)=>{
    const div = document.createElement("div");
    div.className = "cart-row";
    div.innerHTML = `
      ${item.name} - ₹${item.price}
      <span class="remove" onclick="removeItem(${i})">❌</span>
    `;
    box.appendChild(div);
    total += item.price;
    if(item.type==="rent") hasRent = true;
  });

  if(hasRent){
    const dep = document.createElement("p");
    dep.innerHTML = `<b>Security Deposit:</b> ₹${SECURITY_DEPOSIT} (Refundable)`;
    box.appendChild(dep);
    total += SECURITY_DEPOSIT;
  }

  document.getElementById("totalAmount").innerText = total;
  document.getElementById("cartModal").style.display = "block";
}

function closeCart(){
  document.getElementById("cartModal").style.display = "none";
}

function removeItem(i){
  cart.splice(i,1);
  openCart();
}

/************** CHECKOUT **************/
function checkout(){
  if(cart.length === 0){
    alert("Cart is empty");
    return;
  }
  document.getElementById("cartModal").style.display = "none";
  document.getElementById("paymentModal").style.display = "block";
}

function closePayment(){
  document.getElementById("paymentModal").style.display = "none";
}

function showPayment(method){
  document.getElementById("upiBox").classList.add("hidden");
  document.getElementById("cardBox").classList.add("hidden");
  document.getElementById("otpBox").classList.add("hidden");

  if(method === "upi"){
    document.getElementById("upiBox").classList.remove("hidden");
  }
  if(method === "card"){
    document.getElementById("cardBox").classList.remove("hidden");
  }
}

function proceedOTP(){
  const method = document.getElementById("payMethod").value;

  if(method === "upi"){
    const upi = document.getElementById("upiId").value.trim();
    if(!upi){
      alert("Enter UPI ID");
      return;
    }
  }

  document.getElementById("otpBox").classList.remove("hidden");
  alert("OTP sent successfully");
}

function confirmPayment(){
  alert("Payment Successful!");
  document.getElementById("paymentModal").style.display = "none";
  cart = [];
}


function closePayment(){
  document.getElementById("paymentModal").style.display = "none";
}

/************** PAYMENT METHOD UI **************/
function showPayment(v){
  document.getElementById("upiBox").classList.add("hidden");
  document.getElementById("cardBox").classList.add("hidden");
  document.getElementById("otpBox").classList.add("hidden");

  if(v === "upi"){
    document.getElementById("upiBox").classList.remove("hidden");
  }
  if(v === "card"){
    document.getElementById("cardBox").classList.remove("hidden");
  }
}

/************** OTP STEP **************/
function proceedOTP(){
  const method = document.getElementById("payMethod").value;

  if(method === "upi"){
    const upi = document.getElementById("upiId").value.trim();
    if(!upi){
      alert("Please enter UPI ID");
      return;
    }
  }

  if(method === "card"){
    const inputs = document.getElementById("cardBox").querySelectorAll("input");
    for(let i=0;i<inputs.length;i++){
      if(inputs[i].value.trim()===""){
        alert("Please fill all card details");
        return;
      }
    }
  }

  document.getElementById("otpBox").classList.remove("hidden");
  alert("OTP sent to your registered mobile number");
}

/************** CONFIRM PAYMENT **************/
function confirmPayment(){
  const name = document.getElementById("userName").value.trim();
  const phone = document.getElementById("userPhone").value.trim();
  const address = document.getElementById("userAddress").value.trim();
  const method = document.getElementById("payMethod").value;
  const otp = document.querySelector("#otpBox input").value.trim();

  if(!/^[A-Za-z ]+$/.test(name)){
    alert("Name must contain only letters");
    return;
  }

  if(!/^[0-9]{10}$/.test(phone)){
    alert("Phone must be 10 digits");
    return;
  }

  if(address === ""){
    alert("Address is required");
    return;
  }

  if(otp === ""){
    alert("Please enter OTP");
    return;
  }

  let total = parseInt(document.getElementById("totalAmount").innerText);

  /* 💰 WALLET PAYMENT LOGIC */
  if(method === "wallet"){
    if(walletBalance < total){
      alert("❌ Insufficient Wallet Balance");
      return;
    }
    walletBalance -= total;
    document.getElementById("wallet").innerText = walletBalance;
    alert(`₹${total} deducted from wallet`);
  }

  /* CARD / UPI are already validated before OTP */

  orderHistory.push({
    name,
    phone,
    address,
    items: [...cart],
    amount: total,
    date: new Date().toLocaleString(),
    status: "Order in Progress"
  });

  cart = [];

  document.getElementById("paymentModal").style.display = "none";

  alert("✅ Order Placed Successfully!");
  openProfile();
}

/************** PROFILE **************/
function openProfile(){
  document.getElementById("profileModal").style.display = "block";

  document.getElementById("pName").innerText =
    document.getElementById("userName").value || "Guest";

  document.getElementById("wallet").innerText = walletBalance;

  const ordersBox = document.getElementById("orders");
  ordersBox.innerHTML = "";

  if(orderHistory.length === 0){
    ordersBox.innerHTML = "<p>No orders yet</p>";
    return;
  }

  orderHistory.forEach((o, index) => {
    let itemsHTML = "";
    o.items.forEach(it => {
      itemsHTML += `<li>${it.name} - ₹${it.price}</li>`;
    });

    ordersBox.innerHTML += `
      <div style="
        background:#f1f5f9;
        color:#000;
        padding:10px;
        border-radius:8px;
        margin-bottom:10px;
      ">
        <b>Order #${index + 1}</b><br>
        <b>Date:</b> ${o.date}<br>
        <b>Status:</b> ${o.status}<br>
        <b>Items:</b>
        <ul>${itemsHTML}</ul>
        <b>Total Paid:</b> ₹${o.amount}
      </div>
    `;
  });
}


function showPayment(v){
  document.getElementById("upiBox").classList.add("hidden");
  document.getElementById("cardBox").classList.add("hidden");
  document.getElementById("otpBox").classList.add("hidden");

  if(v === "upi"){
    document.getElementById("upiBox").classList.remove("hidden");
  }
  else if(v === "card"){
    document.getElementById("cardBox").classList.remove("hidden");
  }
  else if(v === "wallet"){
    document.getElementById("otpBox").classList.remove("hidden");
    alert("OTP sent for wallet verification");
  }
}

function closeProfile(){
  document.getElementById("profileModal").style.display = "none";
}

/************** WALLET **************/
function addWallet(){
  const amt = parseInt(document.getElementById("addMoney").value);
  if(!amt || amt<=0){
    alert("Enter valid amount");
    return;
  }
  walletBalance += amt;
  document.getElementById("wallet").innerText = walletBalance;
  document.getElementById("addMoney").value = "";
  alert("Wallet updated successfully");
}
