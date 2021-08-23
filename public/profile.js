let UserName = document.getElementById("UserName");
let userLogInfo = document.getElementById("userLogInfo");
let loading = document.getElementById("splashScreen");


loading.setAttribute("class", "splash");
firebase.auth().onAuthStateChanged((userInfo) => {
    if (userInfo) {
        firebase.database().ref(`users/${userInfo.uid}`)
            .once('value', (data) => {
                let userLogin = data.val();
                if (userLogin.state == "User") {
                    UserName.innerHTML = userLogin.fullName;
                    loading.setAttribute("class", "splash splashHide");
                } else {
                    window.location = "index.html"
                }
            })
    } else {
        window.location = "index.html"
    }
})



firebase.auth().onAuthStateChanged((userInfo) => {
    if (userInfo) {
        firebase.database().ref(`orderData`).on("child_added", (data) => {
            var orderDetail = document.getElementById("orderDetail");
            if (data.val().customerID == userInfo.uid) {
                if (data.val().orderStatus == "pending" || data.val().orderStatus == "accept") {
                    orderDetail.innerHTML += `
                    <div class="card" style="width: 18rem;">
                     <img src="${data.val().dishUrl}" class="card-img-top" alt="...">
                     <div class="card-body">
                       <h5 class="card-title">${data.val().dishName}</h5>
                       <p style="color: black;">Rs: <span class="dishPrice" id="dPrice">${data.val().dishPrice}</span></p>
                       <p style="color: black;">Category: <span class="dishPrice" id="dCate">${data.val().dishCategory}</span></p>
                       <p class="dishPrice" id="dType">${data.val().deliveryType}</p>
                       <p class="text-danger" style="font-weight: bold;">${data.val().orderStatus}</p>
                     </div>
                   </div>`
                }
            }
        });
    }
});



// Nav menu
var MenuItems = document.getElementById("MenuItems");
MenuItems.style.height = "0px";

function menutoggle() {
    if (MenuItems.style.height == "0px") {
        MenuItems.style.height = "180px";
    }
    else {
        MenuItems.style.height = "0px";
    }
}



//User SignOut 
let signOut = () => {
    loading.setAttribute("class", "splash");
    setTimeout(() => {
        firebase.auth().signOut().then(() => {
            localStorage.removeItem("uid")
            loading.setAttribute("class", "splash splashHide");
            window.location = "index.html"
        });
    }, 500);
}
