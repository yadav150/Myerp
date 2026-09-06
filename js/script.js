"use strict";

document.addEventListener("DOMContentLoaded", () => {

    initializePasswordToggle();
    initializeLoginForm();
    initializeForgotPassword();
    initializeModalControls();

});


function initializePasswordToggle() {

    const passwordInput =
        document.getElementById("loginPassword");

    const toggleButton =
        document.getElementById("passwordToggle");

    const toggleIcon =
        document.getElementById("passwordToggleIcon");

    if (!passwordInput || !toggleButton) {
        return;
    }

    toggleButton.addEventListener("click", () => {

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";

        toggleButton.setAttribute(
            "aria-label",
            isPassword
                ? "Hide password"
                : "Show password"
        );

        toggleButton.setAttribute(
            "aria-pressed",
            String(isPassword)
        );

        if (toggleIcon) {

            if (isPassword) {

                toggleIcon.innerHTML = `
                    <path d="M3 3l18 18"></path>
                    <path
                        d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                    ></path>
                    <path
                        d="M9.9 5.2A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-3.2 3.8"
                    ></path>
                    <path
                        d="M6.1 6.1C3.4 8.1 2 12 2 12s3.5 7 10 7a9.9 9.9 0 0 0 4.2-.9"
                    ></path>
                `;

            } else {

                toggleIcon.innerHTML = `
                    <path
                        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                    ></path>
                    <circle cx="12" cy="12" r="3"></circle>
                `;

            }
        }

    });

}


function initializeLoginForm() {

    const form =
        document.getElementById("loginForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        clearLoginErrors();

        const email =
            document.getElementById("loginEmail");

        const password =
            document.getElementById("loginPassword");

        const loginButton =
            document.getElementById("loginButton");

        const message =
            document.getElementById("loginMessage");

        let valid = true;

        if (!email.value.trim()) {

            showFieldError(
                email,
                "loginEmailError",
                "Email address is required."
            );

            valid = false;

        } else if (!isValidEmail(email.value.trim())) {

            showFieldError(
                email,
                "loginEmailError",
                "Enter a valid email address."
            );

            valid = false;
        }

        if (!password.value) {

            showFieldError(
                password,
                "loginPasswordError",
                "Password is required."
            );

            valid = false;
        }

        if (!valid) {
            return;
        }

        /*
         * FRONTEND-ONLY LOGIN
         *
         * Firebase Authentication will be connected here later.
         */

        setLoginLoading(loginButton, true);

        setTimeout(() => {

            setLoginLoading(loginButton, false);

            showMessage(
                message,
                "Login authentication is not connected yet. Firebase Authentication will be integrated in the backend phase.",
                "info"
            );

        }, 700);

    });

}


function initializeForgotPassword() {

    const form =
        document.getElementById("forgotPasswordForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const email =
            document.getElementById("resetEmail");

        const error =
            document.getElementById("resetEmailError");

        const message =
            document.getElementById("resetMessage");

        error.textContent = "";
        email.classList.remove("input-error");

        if (!email.value.trim()) {

            email.classList.add("input-error");

            error.textContent =
                "Email address is required.";

            return;
        }

        if (!isValidEmail(email.value.trim())) {

            email.classList.add("input-error");

            error.textContent =
                "Enter a valid email address.";

            return;
        }

        /*
         * Firebase password reset will be connected here later.
         */

        showMessage(
            message,
            "Password reset functionality will be connected with Firebase Authentication.",
            "info"
        );

    });

}


function initializeModalControls() {

    const modal =
        document.getElementById("forgotPasswordModal");

    const openButton =
        document.getElementById("forgotPasswordButton");

    const closeButton =
        document.getElementById("forgotPasswordClose");

    const cancelButton =
        document.getElementById("resetCancelButton");

    if (!modal) {
        return;
    }

    if (openButton) {

        openButton.addEventListener("click", () => {
            openModal(modal);
        });

    }

    if (closeButton) {

        closeButton.addEventListener("click", () => {
            closeModal(modal);
        });

    }

    if (cancelButton) {

        cancelButton.addEventListener("click", () => {
            closeModal(modal);
        });

    }

    modal.addEventListener("click", (event) => {

        if (event.target === modal) {
            closeModal(modal);
        }

    });

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            !modal.hidden
        ) {
            closeModal(modal);
        }

    });

}


function openModal(modal) {

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

}


function closeModal(modal) {

    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


function showFieldError(
    input,
    errorId,
    message
) {

    input.classList.add("input-error");

    const error =
        document.getElementById(errorId);

    if (error) {
        error.textContent = message;
    }

}


function clearLoginErrors() {

    const email =
        document.getElementById("loginEmail");

    const password =
        document.getElementById("loginPassword");

    const emailError =
        document.getElementById("loginEmailError");

    const passwordError =
        document.getElementById("loginPasswordError");

    const message =
        document.getElementById("loginMessage");

    email?.classList.remove("input-error");
    password?.classList.remove("input-error");

    if (emailError) {
        emailError.textContent = "";
    }

    if (passwordError) {
        passwordError.textContent = "";
    }

    if (message) {
        message.hidden = true;
        message.textContent = "";
        message.className = "form-message";
    }

}


function showMessage(
    element,
    message,
    type = "info"
) {

    if (!element) {
        return;
    }

    element.textContent = message;
    element.className =
        `form-message ${type}`;

    element.hidden = false;

}


function setLoginLoading(button, loading) {

    if (!button) {
        return;
    }

    const text =
        button.querySelector(".button-text");

    const loader =
        button.querySelector(".button-loader");

    button.disabled = loading;

    if (text) {
        text.textContent =
            loading ? "Signing In..." : "Sign In";
    }

    if (loader) {
        loader.hidden = !loading;
    }

}


function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}
