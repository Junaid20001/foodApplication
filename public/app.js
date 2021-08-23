let loading = document.getElementById("splashScreen");
let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
let regexSpace = /([^\s])/;
let regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
let checkEmpty = /^(\w+\S+)$/;

//page redirect if user already signedIn
var signedUser = localStorage.getItem("uid");
if (signedUser) {
    window.location = "index.html"
}

//User Signup
let signUp = () => {
    let userName = document.getElementById("userName");
    let userEmail = document.getElementById("userEmail");
    let userPassword = document.getElementById("userPassword");
    let userPhone = document.getElementById("userPhone");
    let userAddress = document.getElementById("userAddress");
    let userCiy = document.getElementById("userCiy");
    let userState = document.getElementById("userState");
    let data = {
        fullName: userName.value,
        phone: userPhone.value,
        email: userEmail.value,
        password: userPassword.value,
        address: userAddress.value,
        city: userCiy.value,
        state: userState.value
    }
    if (userName.value == "" || userName.value == null || regexSpace.test(userName.value) == false) {
        swal({
            title: "Wrong User Name",
            text: "Input field must not be empty",
            icon: "error",
            button: "Ok",
        });
        userName.focus();
        userName.value = "";
    }

    else if (regexEmail.test(userEmail.value) == false) {
        swal({
            title: "Please First Login to Order!",
            text: "Invalid Format or empty field",
            icon: "error",
            button: "Ok",
        });
        userEmail.focus();
        userEmail.value = "";
    }

    else if (regexPass.test(userPassword.value) == false) {
        swal({
            title: "Password Format",
            text: "Start with UpperCase,Min length 8",
            icon: "error",
            button: "Ok",
        });
        userPassword.focus();
    }

    else if (checkEmpty.test(userPhone.value) == false || checkEmpty.test(userAddress.value) == false || checkEmpty.test(userCiy.value) == false || checkEmpty.test(userState.value) == false) {
        swal({
            title: "Check other fields",
            text: "Fileds must contain more than 2 character",
            icon: "error",
            button: "Ok",
        });
    }
    if (regexSpace.test(userName.value) && regexEmail.test(userEmail.value) && regexPass.test(userPassword.value) &&
        checkEmpty.test(userPhone.value) && checkEmpty.test(userAddress.value) && checkEmpty.test(userCiy.value) && checkEmpty.test(userState.value)) {
        loading.setAttribute("class", "splash")
        firebase.auth().createUserWithEmailAndPassword(userEmail.value, userPassword.value)
            .then((res) => {
                localStorage.setItem("uid", res.user.uid)
                firebase.database().ref(`users`).child(res.user.uid).set(data)
                    .then(() => {
                        loading.setAttribute("class", "splash splashHide")
                        swal({
                            title: "Good job!",
                            text: "User Registered Successfully",
                            icon: "success",
                            button: "Ok",
                        }).then(() => {
                            if (data.state == "Restaurant") {
                                window.location = "Dashboard.html"
                            } else {
                                window.location = "profile.html"
                            }
                        })
                        userName.value = "";
                        userEmail.value = "";
                        userPassword.value = "";
                        userPhone.value = "";
                        userAddress.value = "";
                        userCiy.value = "";
                        userState.value = "";
                    })
            })
            .catch((error) => {
                var errorMessage = error.message;
                loading.setAttribute("class", "splash splashHide");
                swal({
                    title: "Oppsss!",
                    text: errorMessage,
                    icon: "error",
                    button: "Ok",
                });
            });
    }
};




//User SignIn
let signIn = () => {
    let userEmail = document.getElementById("userEmail");
    let userPass = document.getElementById("userPass");

    if (regexEmail.test(userEmail.value) == false) {
        swal({
            title: "Wrong Email",
            text: "Invalid Format or empty field",
            icon: "error",
            button: "Ok",
        });
        userEmail.focus();
        userEmail.value = "";
    }

    else if (regexPass.test(userPass.value) == false) {
        swal({
            title: "Password Format",
            text: "Start with UpperCase,Min length 8",
            icon: "error",
            button: "Ok",
        });
        userPass.focus();
    }

    if (regexEmail.test(userEmail.value) && regexPass.test(userPass.value)) {

        firebase.auth().signInWithEmailAndPassword(userEmail.value, userPass.value)
            .then((userCredential) => {
                loading.setAttribute("class", "splash splashHide")
                var user = userCredential.user;
                localStorage.setItem("uid", user.uid)
                userEmail.value = "";
                userPass.value = "";
                var check_user = firebase.auth().currentUser;
                if (check_user !== null) {
                    firebase.database().ref(`users/${check_user.uid}`)
                        .once('value', (data) => {
                            let userLogin = data.val();
                            if (userLogin.state == "Restaurant") {
                                window.location = "Dashboard.html"
                            }
                            else {
                                window.location = "index.html"
                            }
                        })

                }
            })
            .catch((error) => {
                var errorMessage = error.message;
                loading.setAttribute("class", "splash splashHide")
                swal({
                    title: "Oppsss!",
                    text: errorMessage,
                    icon: "error",
                    button: "Ok",
                });
            });

    }
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

