let UserName = document.getElementById("UserName");
let loading = document.getElementById("splashScreen");



loading.setAttribute("class", "splash");
firebase.auth().onAuthStateChanged((userInfo) => {
    if (userInfo) {
        firebase.database().ref(`users/${userInfo.uid}`)
            .once('value', (data) => {
                let userLogin = data.val();
                if (userLogin.state == "Restaurant") {
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



let uploadFiles = (file) => {
    return new Promise((resolve, reject) => {
        let storageRef = firebase.storage().ref(`dishImages/${file.name}`);
        let uploading = storageRef.put(file)
        uploading.on('state_changed',
            (snapshot) => {

                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                uploading.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL)
                });
            }
        );
    })
}

let uploadDish = async () => {
    let user_uid;
    firebase.auth().onAuthStateChanged((userInfo) => {
        if (userInfo) {
            user_uid = userInfo.uid
        }
    });
    let dish_id = Math.floor(Math.random() * 100);
    let dishName = document.getElementById('dishName');
    let dishPrice = document.getElementById('dishPrice');
    let dishCategory = document.getElementById('dishCategory');
    let dishImg = document.getElementById('dishImg');
    let deliveryType = document.getElementById('deliveryType');
    let uploadedImage = await uploadFiles(dishImg.files[0])
    let dishObj = {
        dishID: dish_id,
        dishName: dishName.value,
        dishPrice: dishPrice.value,
        dishCategory: dishCategory.value,
        dishUrl: uploadedImage,
        deliveryType: deliveryType.value,
        restaurantID: user_uid
    }
    let closeBtn = document.getElementById('closeBtn');
    firebase.database().ref(`dishData/`).push(dishObj).then(() => {
        closeBtn.click()
    })
}



//Order retrive
firebase.auth().onAuthStateChanged((userInfo) => {
    if (userInfo) {
        firebase.database().ref(`orderData`).on("child_added", (data) => {
            var pending = document.getElementById("pending");
            if (data.val().restaurantID == userInfo.uid) {
                if (data.val().orderStatus == "pending") {
                    pending.innerHTML += `
                    <div class="card" style="width: 18rem;">
                     <img src="${data.val().dishUrl}" class="card-img-top" alt="...">
                     <div class="card-body">
                       <h5 class="card-title">${data.val().dishName}</h5>
                       <p style="color: black;">Rs: <span class="dishPrice">${data.val().dishPrice}</span></p>
                       <p style="color: black;">Category: <span class="dishPrice">${data.val().dishCategory}</span></p>
                       <p class="dishPrice">${data.val().deliveryType}</p>
                       <button type="button" class="btn btn-primary" onclick="orderAccept('${data.key}')">Accept</button>
                       <button type="button" class="btn btn-danger" onclick="orderReject('${data.key}')">Reject</button>
                     </div>
                   </div>`
                }
            }
        });
    }
});


// Order Accept

firebase.auth().onAuthStateChanged((userInfo) => {
    if (userInfo) {
        firebase.database().ref(`orderData`).on("child_added", (data) => {
            var accept = document.getElementById("accept");
            if (data.val().restaurantID == userInfo.uid) {
                if (data.val().orderStatus == "accept") {
                    accept.innerHTML += `
                    <div class="card" style="width: 18rem;">
                     <img src="${data.val().dishUrl}" class="card-img-top" alt="...">
                     <div class="card-body">
                       <h5 class="card-title">${data.val().dishName}</h5>
                       <p style="color: black;">Rs: <span class="dishPrice" id="dPrice">${data.val().dishPrice}</span></p>
                       <p style="color: black;">Category: <span class="dishPrice" id="dCate">${data.val().dishCategory}</span></p>
                       <p class="dishPrice" id="dType">${data.val().deliveryType}</p>
                       <button type="button" class="btn btn-success" onclick="orderDeliver('${data.key}')">Deliver</button>
                     </div>
                   </div>`
                }
            }
        });
    }
});

// Order Deliver
firebase.auth().onAuthStateChanged((userInfo) => {
    if (userInfo) {
        firebase.database().ref(`orderData`).on("child_added", (data) => {
            var deliver = document.getElementById("deliver");
            if (data.val().restaurantID == userInfo.uid) {
                if (data.val().orderStatus == "deliver") {
                    deliver.innerHTML += `
                    <div class="card" style="width: 18rem;">
                     <img src="${data.val().dishUrl}" class="card-img-top" alt="...">
                     <div class="card-body">
                       <h5 class="card-title">${data.val().dishName}</h5>
                       <p style="color: black;">Rs: <span class="dishPrice" id="dPrice">${data.val().dishPrice}</span></p>
                       <p style="color: black;">Category: <span class="dishPrice" id="dCate">${data.val().dishCategory}</span></p>
                       <p class="dishPrice" id="dType">${data.val().deliveryType}</p>
                       
                     </div>
                   </div>`
                }
            }
        });
    }
});




//Order Pending/Reject/Deliver

let orderAccept = (orderID) => {
    firebase.database().ref(`orderData`).on("child_added", (data) => {
        if (data.key == orderID) {
            firebase.database().ref(`orderData/${data.key}`).update({ orderStatus: "accept" })
            location.reload()
        }
    })
}

let orderReject = (orderID) => {
    firebase.database().ref(`orderData`).on("child_added", (data) => {
        if (data.key == orderID) {
            firebase.database().ref(`orderData/${data.key}`).remove();
            location.reload()
        }
    })
}

let orderDeliver = (orderID) => {
    firebase.database().ref(`orderData`).on("child_added", (data) => {
        if (data.key == orderID) {
            firebase.database().ref(`orderData/${data.key}`).update({ orderStatus: "delivered" })
            location.reload()
        }
    })
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