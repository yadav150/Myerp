/* ==========================================
   STUDENTS MODULE
   Frontend-only data layer
   Firebase can replace this layer later.
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    if (document.body.dataset.page !== "students") {
        return;
    }

    const STORAGE_KEY = "schoolERP_students";
    const ITEMS_PER_PAGE = 4;

    let students = [];
    let filteredStudents = [];
    let currentPage = 1;
    let studentToDeactivate = null;


    const tableBody = document.getElementById("studentsTableBody");
    const pagination = document.getElementById("studentsPagination");
    const paginationInfo = document.getElementById("paginationInfo");
    const summary = document.getElementById("studentSummary");

    const searchInput = document.getElementById("studentSearch");
    const classFilter = document.getElementById("classFilter");
    const sectionFilter = document.getElementById("sectionFilter");
    const statusFilter = document.getElementById("statusFilter");

    const applyButton = document.getElementById("applyFiltersButton");
    const resetButton = document.getElementById("resetFiltersButton");
    const refreshButton = document.getElementById("refreshStudentsButton");

    const deleteModal = document.getElementById("deleteStudentModal");
    const deleteMessage = document.getElementById("deleteStudentMessage");
    const confirmDeleteButton =
        document.getElementById("confirmDeleteStudentButton");


    /* ------------------------------------------
       INITIAL DATA
    ------------------------------------------ */

    const defaultStudents = [
        {
            id: "STU-0001",
            admissionNo: "ADM-2026-001",
            name: "Aarav Sharma",
            gender: "Male",
            dob: "2014-05-12",
            className: "6",
            section: "A",
            guardian: "Rajesh Sharma",
            phone: "9876543210",
            admissionDate: "2026-04-04",
            session: "2026-27",
            status: "Active"
        },
        {
            id: "STU-0002",
            admissionNo: "ADM-2026-002",
            name: "Ananya Das",
            gender: "Female",
            dob: "2013-09-21",
            className: "7",
            section: "A",
            guardian: "Ramesh Das",
            phone: "9876543211",
            admissionDate: "2026-04-05",
            session: "2026-27",
            status: "Active"
        },
        {
            id: "STU-0003",
            admissionNo: "ADM-2026-003",
            name: "Rohan Singh",
            gender: "Male",
            dob: "2012-11-03",
            className: "8",
            section: "B",
            guardian: "Mohan Singh",
            phone: "9876543212",
            admissionDate: "2026-04-05",
            session: "2026-27",
            status: "Active"
        },
        {
            id: "STU-0004",
            admissionNo: "ADM-2026-004",
            name: "Priya Thapa",
            gender: "Female",
            dob: "2011-07-15",
            className: "9",
            section: "A",
            guardian: "Dinesh Thapa",
            phone: "9876543213",
            admissionDate: "2026-04-06",
            session: "2026-27",
            status: "Active"
        },
        {
            id: "STU-0005",
            admissionNo: "ADM-2026-005",
            name: "Rahul Gurung",
            gender: "Male",
            dob: "2010-02-28",
            className: "10",
            section: "B",
            guardian: "Kiran Gurung",
            phone: "9876543214",
            admissionDate: "2026-04-07",
            session: "2026-27",
            status: "Active"
        },
        {
            id: "STU-0006",
            admissionNo: "ADM-2026-006",
            name: "Sneha Devi",
            gender: "Female",
            dob: "2015-12-10",
            className: "5",
            section: "C",
            guardian: "Bikash Devi",
            phone: "9876543215",
            admissionDate: "2026-04-08",
            session: "2026-27",
            status: "Active"
        }
    ];


    /* ------------------------------------------
       STORAGE
    ------------------------------------------ */

    function loadStudents() {

        try {

            const savedData = localStorage.getItem(STORAGE_KEY);

            if (savedData) {
                students = JSON.parse(savedData);
            } else {
                students = [...defaultStudents];
                saveStudents();
            }

        } catch (error) {

            console.error("Unable to load students:", error);
            students = [...defaultStudents];

        }
    }


    function saveStudents() {

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(students)
            );
        } catch (error) {
            console.error("Unable to save students:", error);
        }
    }


    /* ------------------------------------------
       FILTERING
    ------------------------------------------ */

    function applyFilters() {

        const search =
            searchInput.value.trim().toLowerCase();

        const selectedClass =
            classFilter.value;

        const selectedSection =
            sectionFilter.value;

        const selectedStatus =
            statusFilter.value;


        filteredStudents = students.filter(student => {

            const matchesSearch =
                !search ||
                student.name.toLowerCase().includes(search) ||
                student.admissionNo.toLowerCase().includes(search) ||
                student.id.toLowerCase().includes(search) ||
                student.guardian.toLowerCase().includes(search) ||
                student.phone.includes(search);


            const matchesClass =
                !selectedClass ||
                student.className === selectedClass;


            const matchesSection =
                !selectedSection ||
                student.section === selectedSection;


            const matchesStatus =
                !selectedStatus ||
                student.status === selectedStatus;


            return (
                matchesSearch &&
                matchesClass &&
                matchesSection &&
                matchesStatus
            );

        });


        currentPage = 1;
        renderStudents();
    }


    function resetFilters() {

        searchInput.value = "";
        classFilter.value = "";
        sectionFilter.value = "";
        statusFilter.value = "";

        currentPage = 1;

        applyFilters();
    }


    /* ------------------------------------------
       TABLE
    ------------------------------------------ */

    function renderStudents() {

        tableBody.innerHTML = "";

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    filteredStudents.length / ITEMS_PER_PAGE
                )
            );


        if (currentPage > totalPages) {
            currentPage = totalPages;
        }


        const startIndex =
            (currentPage - 1) * ITEMS_PER_PAGE;

        const endIndex =
            Math.min(
                startIndex + ITEMS_PER_PAGE,
                filteredStudents.length
            );


        const pageStudents =
            filteredStudents.slice(
                startIndex,
                endIndex
            );


        if (pageStudents.length === 0) {

            tableBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="11">
                        No student records found.
                    </td>
                </tr>
            `;

        } else {

            pageStudents.forEach(student => {

                const row =
                    document.createElement("tr");

                row.innerHTML = `
                    <td>${escapeHTML(student.admissionNo)}</td>

                    <td>${escapeHTML(student.id)}</td>

                    <td>
                        <strong>
                            ${escapeHTML(student.name)}
                        </strong>
                    </td>

                    <td>${escapeHTML(student.gender)}</td>

                    <td>${formatDate(student.dob)}</td>

                    <td>Class ${escapeHTML(student.className)}</td>

                    <td>${escapeHTML(student.section)}</td>

                    <td>${escapeHTML(student.guardian)}</td>

                    <td>${escapeHTML(student.phone)}</td>

                    <td>
                        <span class="status-badge ${
                            student.status === "Active"
                                ? "status-active"
                                : "status-inactive"
                        }">
                            ${escapeHTML(student.status)}
                        </span>
                    </td>

                    <td>

                        <div class="table-actions">

                            <button
                                type="button"
                                class="table-action"
                                title="View Student"
                                data-action="view"
                                data-id="${student.id}">

                                <svg viewBox="0 0 24 24"
                                     aria-hidden="true">
                                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"></path>
                                    <circle cx="12" cy="12" r="2.5"></circle>
                                </svg>

                            </button>


                            <button
                                type="button"
                                class="table-action"
                                title="Edit Student"
                                data-action="edit"
                                data-id="${student.id}">

                                <svg viewBox="0 0 24 24"
                                     aria-hidden="true">
                                    <path d="M4 20h4L19 9l-4-4L4 16v4z"></path>
                                    <path d="m13 6 4 4"></path>
                                </svg>

                            </button>


                            <button
                                type="button"
                                class="table-action danger"
                                title="Deactivate Student"
                                data-action="deactivate"
                                data-id="${student.id}">

                                <svg viewBox="0 0 24 24"
                                     aria-hidden="true">
                                    <path d="M6 7h12"></path>
                                    <path d="M9 7V4h6v3"></path>
                                    <path d="M8 7v13h8V7"></path>
                                    <path d="M10 11v5"></path>
                                    <path d="M14 11v5"></path>
                                </svg>

                            </button>

                        </div>

                    </td>
                `;

                tableBody.appendChild(row);

            });

        }


        renderPagination(totalPages);
        updateSummary(startIndex, endIndex);
    }


    /* ------------------------------------------
       PAGINATION
    ------------------------------------------ */

    function renderPagination(totalPages) {

        pagination.innerHTML = "";

        if (filteredStudents.length === 0) {
            return;
        }


        const previousButton =
            document.createElement("button");

        previousButton.type = "button";
        previousButton.textContent = "‹";
        previousButton.title = "Previous page";
        previousButton.disabled = currentPage === 1;

        previousButton.addEventListener(
            "click",
            () => {

                if (currentPage > 1) {
                    currentPage--;
                    renderStudents();
                }

            }
        );

        pagination.appendChild(previousButton);


        for (let page = 1; page <= totalPages; page++) {

            const button =
                document.createElement("button");

            button.type = "button";
            button.textContent = page;

            if (page === currentPage) {
                button.classList.add("active");
            }

            button.addEventListener(
                "click",
                () => {
                    currentPage = page;
                    renderStudents();
                }
            );

            pagination.appendChild(button);
        }


        const nextButton =
            document.createElement("button");

        nextButton.type = "button";
        nextButton.textContent = "›";
        nextButton.title = "Next page";
        nextButton.disabled =
            currentPage === totalPages;

        nextButton.addEventListener(
            "click",
            () => {

                if (currentPage < totalPages) {
                    currentPage++;
                    renderStudents();
                }

            }
        );

        pagination.appendChild(nextButton);
    }


    function updateSummary(startIndex, endIndex) {

        const total = filteredStudents.length;

        if (total === 0) {

            summary.textContent =
                "No student records found.";

            paginationInfo.textContent =
                "Showing 0 of 0 students.";

            return;
        }


        summary.textContent =
            `Showing ${total} student record${total !== 1 ? "s" : ""}.`;


        paginationInfo.textContent =
            `Showing ${startIndex + 1}-${endIndex} of ${total} students.`;
    }


    /* ------------------------------------------
       ACTIONS
    ------------------------------------------ */

    tableBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest("[data-action]");

            if (!button) {
                return;
            }


            const id =
                button.dataset.id;

            const action =
                button.dataset.action;


            if (action === "view") {
                window.location.href =
                    `student-profile.html?id=${encodeURIComponent(id)}`;
            }


            if (action === "edit") {
                window.location.href =
                    `student-edit.html?id=${encodeURIComponent(id)}`;
            }


            if (action === "deactivate") {
                openDeactivateModal(id);
            }

        }
    );


    function openDeactivateModal(id) {

        const student =
            students.find(item => item.id === id);

        if (!student) {
            return;
        }


        studentToDeactivate = id;

        deleteMessage.textContent =
            `Are you sure you want to deactivate ${student.name}?`;


        if (typeof window.openModal === "function") {
            window.openModal("deleteStudentModal");
        } else {
            deleteModal.classList.remove("hidden");
        }
    }


    function deactivateStudent() {

        if (!studentToDeactivate) {
            return;
        }


        const student =
            students.find(
                item => item.id === studentToDeactivate
            );


        if (!student) {
            return;
        }


        student.status = "Inactive";

        saveStudents();

        studentToDeactivate = null;

        if (typeof window.closeModal === "function") {
            window.closeModal("deleteStudentModal");
        } else {
            deleteModal.classList.add("hidden");
        }

        applyFilters();

        showStudentMessage(
            "Student has been deactivated successfully."
        );
    }


    /* ------------------------------------------
       REFRESH
    ------------------------------------------ */

    function refreshStudents() {

        loadStudents();
        applyFilters();

        showStudentMessage(
            "Student records refreshed."
        );
    }


    /* ------------------------------------------
       FEEDBACK
    ------------------------------------------ */

    function showStudentMessage(message) {

        if (typeof window.showMessage === "function") {

            window.showMessage(
                message,
                "success"
            );

            return;
        }


        alert(message);
    }


    /* ------------------------------------------
       HELPERS
    ------------------------------------------ */

    function formatDate(dateString) {

        if (!dateString) {
            return "-";
        }


        const date =
            new Date(`${dateString}T00:00:00`);


        if (Number.isNaN(date.getTime())) {
            return dateString;
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }


    /* ------------------------------------------
       EVENTS
    ------------------------------------------ */

    applyButton.addEventListener(
        "click",
        applyFilters
    );


    resetButton.addEventListener(
        "click",
        resetFilters
    );


    refreshButton.addEventListener(
        "click",
        refreshStudents
    );


    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                applyFilters();
            }

        }
    );


    confirmDeleteButton.addEventListener(
        "click",
        deactivateStudent
    );


    document.querySelectorAll(
        '[data-close-modal="deleteStudentModal"]'
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (typeof window.closeModal === "function") {
                    window.closeModal("deleteStudentModal");
                } else {
                    deleteModal.classList.add("hidden");
                }

                studentToDeactivate = null;
            }
        );

    });


    /* ------------------------------------------
       INITIALIZE
    ------------------------------------------ */

    loadStudents();

    filteredStudents = [...students];

    renderStudents();

});
