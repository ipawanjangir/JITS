/* =========================================================
   JANGIR IT SOLUTION
   ADMIN LOGIN JAVASCRIPT
   ========================================================= */


const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

const passwordToggle = document.getElementById("passwordToggle");


/* =========================================================
   1. PASSWORD SHOW / HIDE
   ========================================================= */

if (passwordToggle && passwordInput) {

    passwordToggle.addEventListener("click", () => {

        const icon = passwordToggle.querySelector("i");

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            passwordInput.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

}


/* =========================================================
   2. LOGIN MESSAGE
   ========================================================= */

function showMessage(message, type) {

    if (!loginMessage) return;

    loginMessage.textContent = message;

    loginMessage.className = "login-message " + type;

}


/* =========================================================
   3. LOGIN FORM
   ========================================================= */

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const username = usernameInput.value.trim();
        const password = passwordInput.value;


        /* -----------------------------------------
           Validation
        ----------------------------------------- */

        if (!username) {

            showMessage(
                "Please enter your username.",
                "error"
            );

            usernameInput.focus();

            return;
        }


        if (!password) {

            showMessage(
                "Please enter your password.",
                "error"
            );

            passwordInput.focus();

            return;
        }


        /* -----------------------------------------
           Disable Button
        ----------------------------------------- */

        const originalButtonHTML = loginBtn.innerHTML;

        loginBtn.disabled = true;

        loginBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Logging in...
        `;


        showMessage("", "");


        /* -----------------------------------------
           API Request
        ----------------------------------------- */

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );


            /* -----------------------------------------
               Successful Login
            ----------------------------------------- */

            if (response.ok) {

                const data = await response.json();


                if (!data.token) {

                    throw new Error(
                        "Token was not received from server."
                    );

                }


                /* -------------------------------------
                   Save JWT
                ------------------------------------- */

                localStorage.setItem(
                    "adminToken",
                    data.token
                );


                localStorage.setItem(
                    "adminUsername",
                    data.username || username
                );


                showMessage(
                    "Login successful! Redirecting...",
                    "success"
                );


                /* -------------------------------------
                   Redirect
                ------------------------------------- */

                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 800);

            }


            /* -----------------------------------------
               Login Failed
            ----------------------------------------- */

            else {

                let message =
                    "Invalid username or password.";


                try {

                    const errorData =
                        await response.json();

                    if (errorData.message) {

                        message = errorData.message;

                    }

                } catch (error) {

                    // Ignore JSON parsing error
                }


                showMessage(
                    message,
                    "error"
                );

            }

        }


        /* -----------------------------------------
           Server / Network Error
        ----------------------------------------- */

        catch (error) {

            console.error(
                "Admin login error:",
                error
            );


            showMessage(
                "Unable to connect with server. Please try again.",
                "error"
            );

        }


        /* -----------------------------------------
           Restore Button
        ----------------------------------------- */

        finally {

            loginBtn.disabled = false;

            loginBtn.innerHTML =
                originalButtonHTML;

        }

    });

}