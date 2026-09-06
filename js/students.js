/* =========================================
   STUDENTS MODULE
   Frontend-only storage
   Firebase can replace the storage layer later
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeStudentsModule();
});

const STUDENT_STORAGE_KEY = "schoolERP_students";
const STUDENTS_PER_PAGE = 4;

let currentStudentPage = 1;
let filteredStudents = [];
let studentPendingDeactivate = null;


/* =========================================
   DEFAULT STUDENT DATA
========================================= */

const defaultStudents = [
    {
        id: "STU001",
        admissionNo: "ADM001",
        studentId: "STU001",
        name: "Aarav Sharma",
        gender: "Male",
        dob: "2012-04-15",
        className: "Class 8",
        section: "A",
        rollNo: "1",
        admissionDate: "2024-04-01",
        guardianName: "Rajesh Sharma",
        relationship: "Father",
        phone: "9876543210",
        alternatePhone: "",
        address: "Dikhlem, West Karbi Anglong, Assam",
        bloodGroup: "B+",
        email: "",
        remarks: "",
        status: "Active"
    },
    {
        id: "STU002",
        admissionNo: "ADM002",
        studentId: "STU002",
        name: "Ananya Das",
        gender: "Female",
        dob: "2011-08-20",
        className: "Class 9",
        section: "A",
        rollNo: "2",
        admissionDate: "2024-04-02",
        guardianName: "Pradip Das",
        relationship: "Father",
        phone: "9876543211",
        alternatePhone: "",
        address: "Lanka, Hojai, Assam",
        bloodGroup: "O+",
        email: "",
        remarks: "",
        status: "Active"
    },
    {
        id: "STU003",
        admissionNo: "ADM003",
        studentId: "STU003",
        name: "Rohan Singh",
        gender: "Male",
        dob: "2013-01-11",
        className: "Class 7",
        section: "B",
        rollNo: "4",
        admissionDate: "2024-04-03",
        guardianName: "Mohan Singh",
        relationship: "Father",
        phone: "9876543212",
        alternatePhone: "",
        address: "Lumding, Assam",
        bloodGroup: "A+",
        email: "",
        remarks: "",
        status: "Active"
    },
    {
        id: "STU004",
        admissionNo: "ADM004",
        studentId: "STU004",
        name: "Priya Thapa",
        gender: "Female",
        dob: "2010-12-09",
        className: "Class 10",
        section: "A",
        rollNo: "5",
        admissionDate: "2024-04-04",
        guardianName: "Dinesh Thapa",
        relationship: "Father",
        phone: "9876543213",
        alternatePhone: "",
        address: "Hojai, Assam",
        bloodGroup: "AB+",
        email: "",
        remarks: "",
        status: "Active"
    },
    {
        id: "STU005",
        admissionNo: "ADM005",
        studentId: "STU005",
        name: "Rahul Roy",
        gender: "Male",
        dob: "2014-06-18",
        className: "Class 6",
        section: "B",
        rollNo: "3",
        admissionDate: "2024-04-05",
        guardianName: "Sanjay Roy",
        relationship: "Father",
        phone: "9876543214",
        alternatePhone: "",
        address: "Diphu, Assam",
        bloodGroup: "O+",
        email: "",
        remarks: "",
        status: "Active"
    },
    {
        id: "STU006",
        admissionNo: "ADM006",
        studentId: "STU006",
        name: "Sneha Gurung",
        gender: "Female",
        dob: "2012-10-25",
        className: "Class 8",
        section: "B",
        rollNo: "6",
        admissionDate: "2024-04-06",
        guardianName: "Bikash Gurung",
        relationship: "Father",
        phone: "9876543215",
        alternatePhone: "",
        address: "Karbi Anglong, Assam",
        bloodGroup: "A-",
        email: "",
        remarks: "",
        status: "Active"
    }
];


/* =========================================
   INITIALIZATION
========================================= */

function initializeStudentsModule() {

    initializeStudentStorage();

    const page = document.body.dataset.page;

    if (page !== "students") {
        initializeStudentSubPage();
        return;
    }

    initializeStudentsList();
    initializeStudentAddForm();
    initializeStudentEditForm();
    initializeStudentProfile();
}


/* =========================================
   STORAGE
========================================= */

function initializeStudentStorage() {

    const existingData = localStorage.getItem(STUDENT_STORAGE_KEY);

    if (!existingData) {
        localStorage.setItem(
            STUDENT_STORAGE_KEY,
            JSON.stringify(defaultStudents)
        );
    }
}


function getStudents() {

    try {

        const data = localStorage.getItem(STUDENT_STORAGE_KEY);

        if (!data) {
            return [];
        }

        return JSON.parse(data);

    } catch (error) {

        console.error("Unable to read student data:", error);
        return [];

    }
}


function saveStudents(students) {

    localStorage.setItem(
        STUDENT_STORAGE_KEY,
        JSON.stringify(students)
    );
}


/* =========================================
   PAGE DETECTION
========================================= */

function initializeStudentSubPage() {

    initializeStudentAddForm();
    initializeStudentEditForm();
    initializeStudentProfile();
}


/* =========================================
   STUDENT LIST
========================================= */

function initializeStudentsList() {

    const tableBody = document.getElementById("studentTableBody");

    if (!tableBody) {
        return;
    }

    filteredStudents = getStudents();

    renderStudentList();

    setupStudentFilters();
    setupStudentPagination();
    setupStudentActions();
    setupStudentSummary();
    setupStudentRefresh();
}


function setupStudentFilters() {

    const searchInput = document.getElementById("studentSearch");
    const classFilter = document.getElementById("classFilter");
    const sectionFilter = document.getElementById("sectionFilter");
    const statusFilter = document.getElementById("statusFilter");
    const applyButton = document.getElementById("applyStudentFilters");
    const resetButton = document.getElementById("resetStudentFilters");

    if (applyButton) {
        applyButton.addEventListener("click", applyStudentFilters);
    }

    if (resetButton) {

        resetButton.addEventListener("click", () => {

            if (searchInput) searchInput.value = "";
            if (classFilter) classFilter.value = "";
            if (sectionFilter) sectionFilter.value = "";
            if (statusFilter) statusFilter.value = "";

            currentStudentPage = 1;

            applyStudentFilters();

        });

    }

    if (searchInput) {

        searchInput.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {
                event.preventDefault();
                applyStudentFilters();
            }

        });

    }
}


function applyStudentFilters() {

    const searchInput = document.getElementById("studentSearch");
    const classFilter = document.getElementById("classFilter");
    const sectionFilter = document.getElementById("sectionFilter");
    const statusFilter = document.getElementById("statusFilter");

    const search = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const classValue = classFilter
        ? classFilter.value
        : "";

    const sectionValue = sectionFilter
        ? sectionFilter.value
        : "";

    const statusValue = statusFilter
        ? statusFilter.value
        : "";

    const students = getStudents();

    filteredStudents = students.filter(student => {

        const matchesSearch =
            !search ||
            String(student.name || "").toLowerCase().includes(search) ||
            String(student.admissionNo || "").toLowerCase().includes(search) ||
            String(student.studentId || "").toLowerCase().includes(search) ||
            String(student.guardianName || "").toLowerCase().includes(search) ||
            String(student.phone || "").toLowerCase().includes(search);

        const matchesClass =
            !classValue ||
            student.className === classValue;

        const matchesSection =
            !sectionValue ||
            student.section === sectionValue;

        const matchesStatus =
            !statusValue ||
            student.status === statusValue;

        return (
            matchesSearch &&
            matchesClass &&
            matchesSection &&
            matchesStatus
        );

    });

    currentStudentPage = 1;

    renderStudentList();
}


/* =========================================
   RENDER STUDENTS
========================================= */

function renderStudentList() {

    const tableBody = document.getElementById("studentTableBody");

    if (!tableBody) {
        return;
    }

    const startIndex =
        (currentStudentPage - 1) * STUDENTS_PER_PAGE;

    const endIndex =
        startIndex + STUDENTS_PER_PAGE;

    const pageStudents =
        filteredStudents.slice(startIndex, endIndex);

    if (!pageStudents.length) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="11" class="empty-row">
                    No students found.
                </td>
            </tr>
        `;

        updateStudentPagination();
        updateStudentSummary();

        return;
    }

    tableBody.innerHTML = pageStudents.map(student => {

        const statusClass =
            String(student.status).toLowerCase() === "active"
                ? "status-active"
                : "status-inactive";

        return `
            <tr>
                <td>${escapeHtml(student.admissionNo)}</td>
                <td>${escapeHtml(student.studentId)}</td>

                <td>
                    <strong>${escapeHtml(student.name)}</strong>
                </td>

                <td>${escapeHtml(student.gender)}</td>

                <td>${formatDate(student.dob)}</td>

                <td>${escapeHtml(student.className)}</td>

                <td>${escapeHtml(student.section)}</td>

                <td>${escapeHtml(student.guardianName)}</td>

                <td>${escapeHtml(student.phone)}</td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${escapeHtml(student.status)}
                    </span>
                </td>

                <td>
                    <div class="table-actions">

                        <button
                            type="button"
                            class="table-action-btn"
                            data-action="view"
                            data-id="${escapeHtml(student.id)}">
                            View
                        </button>

                        <button
                            type="button"
                            class="table-action-btn"
                            data-action="edit"
                            data-id="${escapeHtml(student.id)}">
                            Edit
                        </button>

                        <button
                            type="button"
                            class="table-action-btn danger"
                            data-action="deactivate"
                            data-id="${escapeHtml(student.id)}">
                            Deactivate
                        </button>

                    </div>
                </td>

            </tr>
        `;

    }).join("");

    updateStudentPagination();
    updateStudentSummary();
}


/* =========================================
   ACTIONS
========================================= */

function setupStudentActions() {

    const tableBody = document.getElementById("studentTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.addEventListener("click", (event) => {

        const button =
            event.target.closest("[data-action]");

        if (!button) {
            return;
        }

        const action = button.dataset.action;
        const studentId = button.dataset.id;

        if (action === "view") {
            viewStudent(studentId);
        }

        if (action === "edit") {
            editStudent(studentId);
        }

        if (action === "deactivate") {
            openDeactivateStudentModal(studentId);
        }

    });
}


function viewStudent(studentId) {

    if (!studentId) {
        return;
    }

    window.location.href =
        `student-profile.html?id=${encodeURIComponent(studentId)}`;
}


function editStudent(studentId) {

    if (!studentId) {
        return;
    }

    window.location.href =
        `student-edit.html?id=${encodeURIComponent(studentId)}`;
}


/* =========================================
   DEACTIVATE
========================================= */

function openDeactivateStudentModal(studentId) {

    const student =
        getStudents().find(item => item.id === studentId);

    if (!student) {
        return;
    }

    studentPendingDeactivate = studentId;

    const modal = document.getElementById("deactivateStudentModal");
    const nameElement = document.getElementById("deactivateStudentName");

    if (nameElement) {
        nameElement.textContent = student.name;
    }

    if (modal) {
        modal.classList.add("active");
    }
}


function deactivateStudent() {

    if (!studentPendingDeactivate) {
        return;
    }

    const students = getStudents();

    const studentIndex =
        students.findIndex(
            student => student.id === studentPendingDeactivate
        );

    if (studentIndex === -1) {
        return;
    }

    students[studentIndex].status = "Inactive";

    saveStudents(students);

    studentPendingDeactivate = null;

    closeStudentDeactivateModal();

    applyStudentFilters();

    showStudentMessage(
        "Student has been deactivated successfully.",
        "success"
    );
}


function closeStudentDeactivateModal() {

    const modal =
        document.getElementById("deactivateStudentModal");

    if (modal) {
        modal.classList.remove("active");
    }

    studentPendingDeactivate = null;
}


document.addEventListener("click", event => {

    if (event.target.id === "cancelDeactivateStudent") {
        closeStudentDeactivateModal();
    }

    if (event.target.id === "confirmDeactivateStudent") {
        deactivateStudent();
    }

});


/* =========================================
   ADD STUDENT
========================================= */

function initializeStudentAddForm() {

    const form =
        document.getElementById("studentAddForm");

    if (!form) {
        return;
    }

    const admissionDate =
        document.getElementById("admissionDate");

    if (admissionDate && !admissionDate.value) {
        admissionDate.value = getTodayDate();
    }

    form.addEventListener("submit", event => {

        event.preventDefault();

        if (!validateStudentForm(form)) {
            return;
        }

        const students = getStudents();

        const admissionNo =
            document.getElementById("admissionNo").value.trim();

        const studentId =
            document.getElementById("studentId").value.trim();

        const duplicateAdmission =
            students.some(student =>
                student.admissionNo.toLowerCase() ===
                admissionNo.toLowerCase()
            );

        const duplicateStudentId =
            students.some(student =>
                student.studentId.toLowerCase() ===
                studentId.toLowerCase()
            );

        if (duplicateAdmission) {

            showStudentMessage(
                "Admission number already exists.",
                "error"
            );

            return;
        }

        if (duplicateStudentId) {

            showStudentMessage(
                "Student ID already exists.",
                "error"
            );

            return;
        }

        const newStudent = {

            id: generateStudentId(),

            admissionNo,

            studentId,

            name:
                document.getElementById("studentName").value.trim(),

            gender:
                document.getElementById("gender").value,

            dob:
                document.getElementById("dob").value,

            className:
                document.getElementById("studentClass").value,

            section:
                document.getElementById("section").value,

            rollNo:
                document.getElementById("rollNo").value.trim(),

            admissionDate:
                document.getElementById("admissionDate").value,

            guardianName:
                document.getElementById("guardianName").value.trim(),

            relationship:
                document.getElementById("relationship").value,

            phone:
                document.getElementById("phone").value.trim(),

            alternatePhone:
                document.getElementById("alternatePhone").value.trim(),

            address:
                document.getElementById("address").value.trim(),

            bloodGroup:
                document.getElementById("bloodGroup").value,

            email:
                document.getElementById("email").value.trim(),

            remarks:
                document.getElementById("remarks").value.trim(),

            status:
                document.getElementById("studentStatus").value || "Active"

        };

        students.push(newStudent);

        saveStudents(students);

        showStudentMessage(
            "Student saved successfully. Redirecting...",
            "success"
        );

        setTimeout(() => {

            window.location.href =
                "students.html";

        }, 700);

    });
}


/* =========================================
   EDIT STUDENT
========================================= */

function initializeStudentEditForm() {

    const form =
        document.getElementById("studentEditForm");

    if (!form) {
        return;
    }

    const studentId =
        getQueryParameter("id");

    if (!studentId) {

        showStudentMessage(
            "Student record could not be identified.",
            "error"
        );

        disableEditForm(form);

        return;
    }

    const student =
        getStudents().find(
            item => item.id === studentId
        );

    if (!student) {

        showStudentMessage(
            "Student record was not found.",
            "error"
        );

        disableEditForm(form);

        return;
    }

    populateStudentEditForm(student);

    form.addEventListener("submit", event => {

        event.preventDefault();

        if (!validateStudentForm(form, true)) {
            return;
        }

        updateStudentRecord(studentId);

    });
}


function populateStudentEditForm(student) {

    setValue("editStudentKey", student.id);
    setValue("editAdmissionNo", student.admissionNo);
    setValue("editStudentId", student.studentId);
    setValue("editStudentName", student.name);
    setValue("editGender", student.gender);
    setValue("editDob", student.dob);
    setValue("editClass", student.className);
    setValue("editSection", student.section);
    setValue("editRollNo", student.rollNo);
    setValue("editAdmissionDate", student.admissionDate);
    setValue("editStatus", student.status);
    setValue("editGuardianName", student.guardianName);
    setValue("editRelationship", student.relationship);
    setValue("editPhone", student.phone);
    setValue("editAlternatePhone", student.alternatePhone);
    setValue("editAddress", student.address);
    setValue("editBloodGroup", student.bloodGroup);
    setValue("editEmail", student.email);
    setValue("editRemarks", student.remarks);
}


function updateStudentRecord(studentId) {

    const students = getStudents();

    const index =
        students.findIndex(
            student => student.id === studentId
        );

    if (index === -1) {

        showStudentMessage(
            "Unable to update student record.",
            "error"
        );

        return;
    }

    const admissionNo =
        document.getElementById("editAdmissionNo").value.trim();

    const studentCode =
        document.getElementById("editStudentId").value.trim();

    const duplicateAdmission =
        students.some((student, currentIndex) =>
            currentIndex !== index &&
            student.admissionNo.toLowerCase() ===
            admissionNo.toLowerCase()
        );

    const duplicateStudentId =
        students.some((student, currentIndex) =>
            currentIndex !== index &&
            student.studentId.toLowerCase() ===
            studentCode.toLowerCase()
        );

    if (duplicateAdmission) {

        showStudentMessage(
            "Admission number already exists.",
            "error"
        );

        return;
    }

    if (duplicateStudentId) {

        showStudentMessage(
            "Student ID already exists.",
            "error"
        );

        return;
    }

    students[index] = {

        ...students[index],

        admissionNo,

        studentId: studentCode,

        name:
            document.getElementById("editStudentName").value.trim(),

        gender:
            document.getElementById("editGender").value,

        dob:
            document.getElementById("editDob").value,

        className:
            document.getElementById("editClass").value,

        section:
            document.getElementById("editSection").value,

        rollNo:
            document.getElementById("editRollNo").value.trim(),

        admissionDate:
            document.getElementById("editAdmissionDate").value,

        status:
            document.getElementById("editStatus").value,

        guardianName:
            document.getElementById("editGuardianName").value.trim(),

        relationship:
            document.getElementById("editRelationship").value,

        phone:
            document.getElementById("editPhone").value.trim(),

        alternatePhone:
            document.getElementById("editAlternatePhone").value.trim(),

        address:
            document.getElementById("editAddress").value.trim(),

        bloodGroup:
            document.getElementById("editBloodGroup").value,

        email:
            document.getElementById("editEmail").value.trim(),

        remarks:
            document.getElementById("editRemarks").value.trim()

    };

    saveStudents(students);

    showStudentMessage(
        "Student updated successfully. Redirecting...",
        "success"
    );

    setTimeout(() => {

        window.location.href =
            `student-profile.html?id=${encodeURIComponent(studentId)}`;

    }, 700);
}


/* =========================================
   STUDENT PROFILE
========================================= */

function initializeStudentProfile() {

    const profileName =
        document.getElementById("profileStudentName");

    if (!profileName) {
        return;
    }

    const studentId =
        getQueryParameter("id");

    const student =
        getStudents().find(
            item => item.id === studentId
        );

    if (!student) {

        profileName.textContent =
            "Student Not Found";

        showStudentMessage(
            "The requested student record could not be found.",
            "error"
        );

        return;
    }

    renderStudentProfile(student);

    setupProfileTabs();

    const editButton =
        document.getElementById("editProfileButton");

    if (editButton) {

        editButton.href =
            `student-edit.html?id=${encodeURIComponent(student.id)}`;

    }
}


function renderStudentProfile(student) {

    setText("profileStudentName", student.name);
    setText("profileStudentId", student.studentId);

    setText("summaryName", student.name);
    setText("summaryAdmissionNo", student.admissionNo);
    setText("summaryStudentId", student.studentId);
    setText("summaryClass", student.className);
    setText("summarySection", student.section);
    setText("summaryStatus", student.status);

    setText("detailName", student.name);
    setText("detailGender", student.gender);
    setText("detailDob", formatDate(student.dob));
    setText("detailBloodGroup", student.bloodGroup || "-");
    setText("detailEmail", student.email || "-");

    setText("detailAdmissionNo", student.admissionNo);
    setText("detailStudentId", student.studentId);
    setText("detailClass", student.className);
    setText("detailSection", student.section);
    setText("detailRollNo", student.rollNo || "-");
    setText(
        "detailAdmissionDate",
        formatDate(student.admissionDate)
    );

    setText(
        "detailGuardianName",
        student.guardianName
    );

    setText(
        "detailRelationship",
        student.relationship || "-"
    );

    setText(
        "detailPhone",
        student.phone
    );

    setText(
        "detailAlternatePhone",
        student.alternatePhone || "-"
    );

    setText(
        "detailAddress",
        student.address || "-"
    );

    setText(
        "detailRemarks",
        student.remarks || "-"
    );

    const avatar =
        document.getElementById("studentAvatar");

    if (avatar) {

        avatar.textContent =
            getInitials(student.name);

    }

    const statusElement =
        document.getElementById("summaryStatus");

    if (statusElement) {

        statusElement.className =
            "status-badge " +
            (
                student.status === "Active"
                    ? "status-active"
                    : "status-inactive"
            );

    }
}


/* =========================================
   PROFILE TABS
========================================= */

function setupProfileTabs() {

    const tabs =
        document.querySelectorAll(".profile-tab");

    const contents =
        document.querySelectorAll(".profile-tab-content");

    if (!tabs.length) {
        return;
    }

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            const target =
                tab.dataset.tab;

            tabs.forEach(item =>
                item.classList.remove("active")
            );

            contents.forEach(content =>
                content.classList.remove("active")
            );

            tab.classList.add("active");

            const targetContent =
                document.getElementById(
                    `${target}Tab`
                );

            if (targetContent) {
                targetContent.classList.add("active");
            }

        });

    });
}


/* =========================================
   PAGINATION
========================================= */

function setupStudentPagination() {

    document.addEventListener("click", event => {

        const button =
            event.target.closest("[data-student-page]");

        if (!button) {
            return;
        }

        const page =
            Number(button.dataset.studentPage);

        if (!page || page < 1) {
            return;
        }

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    filteredStudents.length /
                    STUDENTS_PER_PAGE
                )
            );

        if (page > totalPages) {
            return;
        }

        currentStudentPage = page;

        renderStudentList();

    });
}


function updateStudentPagination() {

    const pagination =
        document.getElementById("studentPagination");

    if (!pagination) {
        return;
    }

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredStudents.length /
                STUDENTS_PER_PAGE
            )
        );

    let html = "";

    html += `
        <button
            type="button"
            class="pagination-btn"
            data-student-page="${currentStudentPage - 1}"
            ${currentStudentPage === 1 ? "disabled" : ""}>
            Previous
        </button>
    `;

    for (let page = 1; page <= totalPages; page++) {

        html += `
            <button
                type="button"
                class="pagination-btn ${page === currentStudentPage ? "active" : ""}"
                data-student-page="${page}">
                ${page}
            </button>
        `;

    }

    html += `
        <button
            type="button"
            class="pagination-btn"
            data-student-page="${currentStudentPage + 1}"
            ${currentStudentPage === totalPages ? "disabled" : ""}>
            Next
        </button>
    `;

    pagination.innerHTML = html;
}


/* =========================================
   SUMMARY
========================================= */

function setupStudentSummary() {
    updateStudentSummary();
}


function updateStudentSummary() {

    const students =
        getStudents();

    const total =
        document.getElementById("totalStudents");

    const active =
        document.getElementById("activeStudents");

    const inactive =
        document.getElementById("inactiveStudents");

    if (total) {
        total.textContent = students.length;
    }

    if (active) {
        active.textContent =
            students.filter(
                student => student.status === "Active"
            ).length;
    }

    if (inactive) {
        inactive.textContent =
            students.filter(
                student => student.status === "Inactive"
            ).length;
    }
}


/* =========================================
   REFRESH
========================================= */

function setupStudentRefresh() {

    const refreshButton =
        document.getElementById("refreshStudents");

    if (!refreshButton) {
        return;
    }

    refreshButton.addEventListener("click", () => {

        refreshButton.classList.add("is-loading");

        setTimeout(() => {

            filteredStudents = getStudents();
            currentStudentPage = 1;

            renderStudentList();

            refreshButton.classList.remove("is-loading");

        }, 250);

    });
}


/* =========================================
   FORM VALIDATION
========================================= */

function validateStudentForm(form, isEdit = false) {

    let valid = true;

    const requiredFields = isEdit
        ? [
            "editAdmissionNo",
            "editStudentId",
            "editStudentName",
            "editGender",
            "editDob",
            "editClass",
            "editSection",
            "editGuardianName",
            "editPhone"
        ]
        : [
            "admissionNo",
            "studentId",
            "studentName",
            "gender",
            "dob",
            "studentClass",
            "section",
            "guardianName",
            "phone"
        ];

    requiredFields.forEach(id => {

        const field =
            document.getElementById(id);

        if (!field) {
            return;
        }

        field.classList.remove("input-error");

        if (!field.value.trim()) {

            field.classList.add("input-error");

            valid = false;

        }

    });

    const phoneId =
        isEdit ? "editPhone" : "phone";

    const phone =
        document.getElementById(phoneId);

    if (phone && phone.value.trim()) {

        if (!/^[0-9]{10}$/.test(phone.value.trim())) {

            phone.classList.add("input-error");

            showStudentMessage(
                "Please enter a valid 10-digit phone number.",
                "error"
            );

            return false;

        }

    }

    if (!valid) {

        showStudentMessage(
            "Please fill in all required fields.",
            "error"
        );

        return false;
    }

    return true;
}


function disableEditForm(form) {

    const elements =
        form.querySelectorAll("input, select, textarea, button");

    elements.forEach(element => {
        element.disabled = true;
    });
}


/* =========================================
   HELPERS
========================================= */

function getQueryParameter(name) {

    const params =
        new URLSearchParams(window.location.search);

    return params.get(name);
}


function generateStudentId() {

    return (
        "STU" +
        Date.now().toString().slice(-6)
    );
}


function getTodayDate() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date =
        new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


function getInitials(name) {

    if (!name) {
        return "ST";
    }

    const words =
        name.trim().split(/\s+/);

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();
}


function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.value = value ?? "";
    }
}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value || "-";
    }
}


function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function showStudentMessage(message, type = "info") {

    const possibleElements = [
        document.getElementById("studentFormMessage"),
        document.getElementById("studentEditMessage"),
        document.getElementById("profileMessage")
    ];

    const element =
        possibleElements.find(item => item);

    if (!element) {
        return;
    }

    element.textContent = message;

    element.className =
        `form-message ${type}`;

    element.classList.remove("hidden");

    setTimeout(() => {

        element.classList.add("hidden");

    }, 4000);
}
