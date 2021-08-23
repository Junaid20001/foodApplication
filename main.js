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

var dishItems = document.getElementById("dishItems");

firebase.database().ref(`dishData`).on("child_added", (data) => {
  dishItems.innerHTML += `
  <div class="col-4">
            <img id="dUrl-${data.val().dishID}" src="${data.val().dishUrl}">
            <h4 id="dName-${data.val().dishID}">${data.val().dishName}</h4>
            <p style="color: black;">Rs: <span class="dishPrice" id="dPrice-${data.val().dishID}">${data.val().dishPrice}</span></p>
            <p style="color: black;">Category: <span class="dishPrice" id="dCate-${data.val().dishID}">${data.val().dishCategory}</span></p>
            <p class="dishPrice" id="dType-${data.val().dishID}">${data.val().deliveryType}</p>
            <button type="button" class="btn orderBtn" onclick="orderFunc('${data.val().dishID}','${data.val().restaurantID}')">Order Now</button>
        </div>`
})


let orderFunc = (dishID, resID) => {
  firebase.auth().onAuthStateChanged((userInfo) => {
    if (userInfo) {
      firebase.database().ref(`users/${userInfo.uid}`)
        .once('value', (data) => {
          let userLogin = data.val();
          if (userLogin.state == "User") {
            let dUrl = document.getElementById("dUrl-" + dishID)
            let dName = document.getElementById("dName-" + dishID)
            let dPrice = document.getElementById("dPrice-" + dishID)
            let dCate = document.getElementById("dCate-" + dishID)
            let dType = document.getElementById("dType-" + dishID)
            let orderObj = {
              dishName: dName.innerText,
              dishPrice: dPrice.innerText,
              dishCategory: dCate.innerText,
              dishUrl: dUrl.src,
              deliveryType: dType.innerText,
              restaurantID: resID,
              orderStatus: "pending",
              customerID: userInfo.uid,
              randomDishId: dishID
            }
            // console.log(orderObj)
            firebase.database().ref(`orderData`).push(orderObj).then(() => {
              swal({
                title: "Dish Order Complete",
                text: "check status in profile",
                icon: "success",
                button: "Ok",
              })

            });
          }
          else {
            swal({
              title: "Sorry! ",
              text: "You can't order yourself",
              icon: "error",
              button: "Ok",
            });
          }
        })
    }
    else {
      swal({
        title: "Resigtration Error",
        text: "To place the order first signin/signup",
        icon: "error",
        button: "Ok",
      });
    }
  });

}


let checkUser = () => {
  firebase.auth().onAuthStateChanged((userInfo) => {
    if (userInfo) {
      window.location = "index.html";
    }
    else {
      window.location = "signup.html"
    }
  });
}

var signedUser = localStorage.getItem("uid");
let logoutBtn = document.getElementById("logoutBtn")
if (signedUser) {
  logoutBtn.innerHTML = "Logout"
  logoutBtn.setAttribute("onclick", "signOut()")
}


// signout
let signOut = () => {
  setTimeout(() => {
    firebase.auth().signOut().then(() => {
      localStorage.removeItem("uid")
      logoutBtn.innerHTML = "Login"
    });
  }, 500);
}