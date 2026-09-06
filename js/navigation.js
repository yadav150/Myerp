"use strict";

document.addEventListener("DOMContentLoaded", () => {

    initializeSidebar();
    initializeProfileMenu();
    initializeQuickActionModal();
    initializeDashboardControls();
    initializeCurrentYear();
    initializeActiveNavigation();

});


function initializeSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    const toggle =
        document.getElementById("sidebarToggle");

    if (!sidebar || !toggle) {
        return;
    }

    toggle.addEventListener("click", () => {

        const isOpen =
            sidebar.classList.toggle("sidebar-open");

        toggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });

}


function initializeProfileMenu() {

    const button =
        document.getElementById("profileButton");

    const dropdown =
        document.getElementById("profileDropdown");

    if (!button || !dropdown) {
        return;
    }

    button.addEventListener("click", (event) => {

        event.stopPropagation();

        const isHidden =
            dropdown.hidden;

        dropdown.hidden = !isHidden;

        button.setAttribute(
            "aria-expanded",
            String(isHidden)
        );

    });

    document.addEventListener("click", () => {

        dropdown.hidden = true;

        button.setAttribute(
            "aria-expanded",
            "false"
        );

    });

    dropdown.addEventListener("click", (event) => {
        event.stopPropagation();
    });

}


function initializeQuickActionModal() {

    const modal =
        document.getElementById("quickActionModal");

    const open =
        document.getElementById("quickActionButton");

    const close =
        document.getElementById("quickActionClose");

    if (!modal || !open || !close) {
        return;
    }

    open.addEventListener("click", () => {
        openNavigationModal(modal);
    });

    close.addEventListener("click", () => {
        closeNavigationModal(modal);
    });

    modal.addEventListener("click", (event) => {

        if (event.target === modal) {
            closeNavigationModal(modal);
        }

    });

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            !modal.hidden
        ) {
            closeNavigationModal(modal);
        }

    });

}


function openNavigationModal(modal) {

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

}


function closeNavigationModal(modal) {

    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


function initializeDashboardControls() {

    const refresh =
        document.getElementById("refreshDashboard");

    const notification =
        document.getElementById("notificationButton");

    const viewAll =
        document.getElementById("viewAllActivities");

    const logout =
        document.getElementById("logoutButton");

    if (refresh) {

        refresh.addEventListener("click", () => {

            refresh.classList.add("is-loading");

            setTimeout(() => {

                refresh.classList.remove("is-loading");

                if (typeof window.showToast === "function") {

                    window.showToast(
                        "Dashboard refreshed.",
                        "info"
                    );

                }

            }, 500);

        });

    }

    if (notification) {

        notification.addEventListener("click", () => {

            if (typeof window.showToast === "function") {

                window.showToast(
                    "No new notifications available.",
                    "info"
                );

            }

        });

    }

    if (viewAll) {

        viewAll.addEventListener("click", () => {

            if (typeof window.showToast === "function") {

                window.showToast(
                    "Activity history will be available here.",
                    "info"
                );

            }

        });

    }

    if (logout) {

        logout.addEventListener("click", () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to log out?"
                );

            if (!confirmed) {
                return;
            }

            /*
             * Firebase signOut() will be connected here later.
             */

            window.location.href = "index.html";

        });

    }

}


function initializeCurrentYear() {

    const year =
        document.getElementById("currentYear");

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }

}


function initializeActiveNavigation() {

    const currentPage =
        document.body.dataset.page;

    if (!currentPage) {
        return;
    }

    const links =
        document.querySelectorAll(
            ".nav-item[data-page]"
        );

    links.forEach((link) => {

        link.classList.toggle(
            "active",
            link.dataset.page === currentPage
        );

    });

}
