function Registration() {
    var username = document.getElementById('email').value;
    var password = document.getElementById('pswrd').value;
    var confirmPassword = document.getElementById('cnfrm').value;
    var accountType = document.querySelector('input[name="acctype"]:checked');

    if (username && password && confirmPassword && accountType) {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const logindata = JSON.parse(localStorage.getItem("LoginData")) || [];

        if (logindata.find((x) => x.username === username)) {
            alert("This Account already exists");
        } else {
            logindata.push({ accountType: accountType.value, username: username, password: password });
            localStorage.setItem("LoginData", JSON.stringify(logindata));
            console.log(logindata);
            document.getElementById('email').value = '';
            document.getElementById('pswrd').value = '';
            document.getElementById('cnfrm').value = '';
            document.getElementById('user').checked = false;
            document.getElementById('admin').checked = false;
            window.location.href = "login.html";
        }
    } else {
        alert('Please fill in all fields and select an account type.');
    }
}
function Login(){
    const loginForm = document.getElementById('grp');
    console.log(loginForm);
    loginForm.addEventListener('submit',function(e){
        e.preventDefault();
        const logindata = JSON.parse(localStorage.getItem("LoginData")) || [];
        const email = document.getElementById('email').value;
        const passwordInput = document.getElementById('pswrd').value;
        let n = logindata.length;
        let flag =false;
        for(let i=0;i<n;i++){
            if(logindata[i].username === email && logindata[i].password === passwordInput){
                if (logindata[i].accountType === "admin") {
                    sessionStorage.setItem("currentUser",JSON.stringify({"email":logindata[i].email, "password":logindata[i].password,"accountType":"admin"}))
                    window.location.href = "admin.html";
                    flag = true;
                } else if (logindata[i].accountType === "user") {
                    sessionStorage.setItem("currentUser",JSON.stringify({"email":logindata[i].email, "password":logindata[i].password,"accountType":"user"}))
                    window.location.href = "home.html";
                    flag = true;
                }
            }
        }
        if(!flag){
            alert("Invalid email or password.");
        }
    });
}

let pId;
const currItem = JSON.parse(localStorage.getItem("Products")) || [];
if(currItem.length>0){
    pId = Math.max(...currItem.map(item=>item.pId))+1;
}
else{
    pId=101;
}
let displayItems =5;
function AddData(){
    const pname= document.getElementById('prod').value;
    const pprice= parseFloat(document.getElementById('price').value);
    const pstock= parseInt(document.getElementById('stock').value);
    const pdesc= document.getElementById('desc').value;
    const purl = document.getElementById('imageURL').value;

    if(pname && !isNaN(pprice) && !isNaN(pstock) && pdesc && purl){
        const items = JSON.parse(localStorage.getItem("Products")) || [];
        const alreadyexist =items.findIndex((x)=>x.pname===pname);
        if(alreadyexist ===-1){
            items.push({pId,pname,pprice,pstock,pdesc,purl});
            localStorage.setItem("Products",JSON.stringify(items));
            pId++;
            document.getElementById("prod").value="";
            document.getElementById('price').value="";
            document.getElementById('stock').value="";
            document.getElementById('desc').value="";
            document.getElementById('imageURL').value="";
            
            refreshProductList();
        }
        else{
            alert('Product already exists!');
        }
    }
    else{
        alert("Please fill in all the fields.");
    }
}

function Display(){
    const items = JSON.parse(localStorage.getItem("Products")) || [];
    const pbody = document.getElementById('prod-body').value;
}

function logout(){
    sessionStorage.clear();
    window.location.href="home.html";
    alert("Successfully Logged Out");
}
function removeProduct(PID) {
    let data = JSON.parse(localStorage.getItem("Products")) || [];
    data = data.filter(item => item.pId !== PID);
    if(data.length!==0 && data[0].pId!==1 )
    data[0].pId = 1;
    for (let i = 0; i < data.length-1; i++) {

        if(data[i].pId!= data[i+1].pId-1){
            data[i+1].pId = data[i].pId+1;
        }
        
    }if (data.length === 0 ) {
        pId = 1;
    }
    else
    pId = data[data.length - 1].pId + 1;
    localStorage.setItem("Products", JSON.stringify(data));
    
refreshProductList();
}
function updateProduct(PID) {
    const modal = document.getElementById("updateModal");
    const items = JSON.parse(localStorage.getItem("Products")) || [];
    const productIndex = items.findIndex((x) => x.pId === PID);

    if (productIndex !== -1) {
        const product = items[productIndex];

        document.getElementById("updatedName").value = product.pname;
        document.getElementById("updatedPrice").value = product.pprice;
        document.getElementById("updatedQuantity").value = product.pstock;
        document.getElementById("updatedDescription").value = product.pdesc;
        document.getElementById("updatedImageURL").value = product.purl;

        modal.style.display = "block";

        document.getElementById("updateButton").onclick = function () {
            const updatedName = document.getElementById("updatedName").value;
            const updatedPrice = parseFloat(document.getElementById("updatedPrice").value);
            const updatedQuantity = parseInt(document.getElementById("updatedQuantity").value);
            const updatedDescription = document.getElementById("updatedDescription").value;
            const updatedImageURL = document.getElementById("updatedImageURL").value;

            if (updatedName !== "" && !isNaN(updatedPrice) && !isNaN(updatedQuantity)) {
                items[productIndex].pname = updatedName;
                items[productIndex].pprice = updatedPrice;
                items[productIndex].pstock = updatedQuantity;
                items[productIndex].pdesc = updatedDescription;
                items[productIndex].purl = updatedImageURL;

                localStorage.setItem("Products", JSON.stringify(items));

                modal.style.display = "none";
                refreshProductList();
            } else {
                alert('Invalid input. Product was not updated.');
            }
        };
    }
}
function closeUpdateModal() {
    const modal = document.getElementById("updateModal");
    modal.style.display = "none";
}

function addToCart(item) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.pId === item.pId);
    
    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += 1;
    } else {
        item.quantity = 1;
        cartItems.push(item);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

document.addEventListener('DOMContentLoaded', function () {
    refreshProductList();

    document.querySelectorAll('.add-cart').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const item = getItemById(itemId); 
            addToCart(item);
        });
    });
});

function getItemById(itemId) {
    const products = JSON.parse(localStorage.getItem('Products')) || [];
    return products.find(product => product.pId === itemId);
}


function refreshProductList() {
    const LoggedUser = JSON.parse(sessionStorage.getItem("currentUser")) || [];
    const tableBody = document.getElementById("prod-body");
    const data = JSON.parse(localStorage.getItem("Products")) || [];

    if (tableBody) tableBody.innerHTML = "";

    if (LoggedUser.accountType === "admin") {
        data.forEach(item => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = item.pId;
            const imgele = document.createElement('img');
            imgele.src = item.purl;
            imgele.alt = 'Product Image';
            imgele.style.width = '200px';
            imgele.style.height = '150px';
            imgele.style.objectFit = 'contain';
            row.insertCell(1).appendChild(imgele);
            row.insertCell(2).innerText = item.pname;
            row.insertCell(3).innerText = `Rs.${item.pprice}`;
            row.insertCell(4).innerText = item.pstock;
            row.insertCell(5).innerText = item.pdesc;

            const cell = row.insertCell(6);
            const removeButton = createButton("Remove", () => removeProduct(item.pId));
            removeButton.classList.add("rembtm");
            const updateButton = createButton("Update", () => updateProduct(item.pId));
            updateButton.classList.add('updbtn');

            cell.appendChild(removeButton);
            cell.appendChild(updateButton);
        });
    } else {
        const showMoreButton = document.getElementById("ShowMore");
        const showLessButton = document.getElementById("ShowLess");
        let currItem = 5;

        if (showMoreButton && showLessButton) {
            showMoreButton.style.display = data.length > 5 ? "block" : "none";
            showLessButton.style.display = currItem < 5 || data.length <= 5 ? "none" : "block";

            showMoreButton.addEventListener('click', () => {
                currItem += 5;
                showLessButton.style.display = currItem > 5 ? "block" : "none";
                showMoreButton.style.display = currItem < data.length ? "block" : "none";
                displayItems();
            });

            showLessButton.addEventListener('click', () => {
                currItem -= 5;
                showLessButton.style.display = currItem > 5 ? "block" : "none";
                showMoreButton.style.display = currItem < data.length ? "block" : "none";
                displayItems();
            });
        }

        function displayItems() {
            tableBody.innerHTML = '';
            data.slice(0, currItem).forEach(item => {
                const row = tableBody.insertRow();
                row.insertCell(0).innerText = item.pId;
                const imgCell = row.insertCell(1);
                const img = document.createElement('img');
                img.src = item.purl;
                img.alt = 'Product Image';
                img.style.width = '200px';
                img.style.height = '150px';
                imgCell.appendChild(img);
                row.insertCell(2).innerText = item.pname;
                row.insertCell(3).innerText = `Rs.${item.pprice}`;
                row.insertCell(4).innerText = item.pdesc;

                const cell = row.insertCell(5);
                const addtoCartbtn = createButton("Add to Cart", () => addToCart(item.pId));
                addcartbtn.classList.add('add-cart');
                addcartbtn.dataset.itemId = item.pId;
                cell.appendChild(addtoCartbtn);
                row.classList.add("card");
            });
        }

        displayItems();
    }

    localStorage.setItem("Products", JSON.stringify(data));
}



function createButton(text, onClick) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", onClick);
    return button;
}

document.addEventListener('DOMContentLoaded', function () {
    const LoggedUser = JSON.parse(sessionStorage.getItem("currentUser")) || [];
    const currentPage = window.location.pathname.split("/").pop();
    
    if (LoggedUser.length === 0 && !["login.html", "registration.html", "home.html"].includes(currentPage)) {
        window.location.href = "login.html";
    } else {
        refreshProductList();
    }
});
