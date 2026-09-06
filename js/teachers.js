/* =========================================
   TEACHERS MODULE
   Frontend-only implementation
   Firebase integration can replace the
   storage layer later without redesigning UI.
========================================= */

"use strict";

const TEACHER_STORAGE_KEY = "schoolERP_teachers";
const TEACHERS_PER_PAGE = 4;

let teachers = [];
let filteredTeachers = [];
let currentTeacherPage = 1;
let selectedTeacherId = null;


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    initializeTeachersModule();
});


function initializeTeachersModule() {
    loadTeachers();

    if (document.body.dataset.page === "teachers") {
        initializeTeachersList();
    }

    initializeTeacherAdd();
    initializeTeacherEdit();
    initializeTeacherProfile();
    initializeTeacherDeactivateModal();
}


/* =========================================
   STORAGE
========================================= */

function loadTeachers() {
    const storedTeachers = localStorage.getItem(TEACHER_STORAGE_KEY);

    if (storedTeachers) {
        try {
            teachers = JSON.parse(storedTeachers);

            if (!Array.isArray(teachers)) {
                teachers = [];
            }
        } catch (error) {
            console.error("Unable to load teacher records:", error);
            teachers = [];
        }
    }

    if (!teachers.length) {
        teachers = getDefaultTeachers();
        saveTeachers();
    }
}


function saveTeachers() {
    localStorage.setItem(
        TEACHER_STORAGE_KEY,
        JSON.stringify(teachers)
    );
}


/* =========================================
   DEFAULT DATA
========================================= */

function getDefaultTeachers() {
    return [
        {
            id: "teacher-001",
            teacherId: "TCH-001",
            employeeId: "EMP-001",
            name: "Anita Sharma",
            gender: "Female",
            dob: "1988-04-15",
            teacherType: "Permanent",
            qualification: "M.A., B.Ed.",
            specialization: "English",
            subjects: ["English"],
            classes: ["Class 9", "Class 10"],
            phone: "9876543210",
            alternatePhone: "9123456780",
            email: "anita.sharma@example.com",
            joiningDate: "2018-06-01",
            salary: 32000,
            address: "Dikhlem, West Karbi Anglong, Assam",
            emergencyContactName: "Raj Sharma",
            emergencyContactRelation: "Spouse",
            emergencyContactPhone: "9876501234",
            bankName: "State Bank of India",
            accountNumber: "XXXXXX001",
            ifscCode: "SBIN0000001",
            status: "Active",
            remarks: ""
        },
        {
            id: "teacher-002",
            teacherId: "TCH-002",
            employeeId: "EMP-002",
            name: "Ramesh Das",
            gender: "Male",
            dob: "1985-09-21",
            teacherType: "Permanent",
            qualification: "M.Sc., B.Ed.",
            specialization: "Mathematics",
            subjects: ["Mathematics"],
            classes: ["Class 8", "Class 9", "Class 10"],
            phone: "9865432109",
            alternatePhone: "",
            email: "ramesh.das@example.com",
            joiningDate: "2019-04-10",
            salary: 35000,
            address: "Lanka, Assam",
            emergencyContactName: "Sunita Das",
            emergencyContactRelation: "Spouse",
            emergencyContactPhone: "9856001234",
            bankName: "State Bank of India",
            accountNumber: "XXXXXX002",
            ifscCode: "SBIN0000002",
            status: "Active",
            remarks: ""
        },
        {
            id: "teacher-003",
            teacherId: "TCH-003",
            employeeId: "EMP-003",
            name: "Maya Gurung",
            gender: "Female",
            dob: "1990-02-11",
            teacherType: "Contract",
            qualification: "M.A., B.Ed.",
            specialization: "Social Science",
            subjects: ["History", "Political Science"],
            classes: ["Class 7", "Class 8"],
            phone: "9812345678",
            alternatePhone: "",
            email: "maya.gurung@example.com",
            joiningDate: "2021-07-05",
            salary: 28000,
            address: "Lumding, Assam",
            emergencyContactName: "Dinesh Gurung",
            emergencyContactRelation: "Brother",
            emergencyContactPhone: "9801234567",
            bankName: "Punjab National Bank",
            accountNumber: "XXXXXX003",
            ifscCode: "PUNB0000003",
            status: "Active",
            remarks: ""
        },
        {
            id: "teacher-004",
            teacherId: "TCH-004",
            employeeId: "EMP-004",
            name: "Bikash Singh",
            gender: "Male",
            dob: "1982-12-03",
            teacherType: "Permanent",
            qualification: "M.Sc., B.Ed.",
            specialization: "Science",
            subjects: ["Physics", "Science"],
            classes: ["Class 9", "Class 10"],
            phone: "9798765432",
            alternatePhone: "",
            email: "bikash.singh@example.com",
            joiningDate: "2017-05-15",
            salary: 38000,
            address: "Hojai, Assam",
            emergencyContactName: "Kiran Singh",
            emergencyContactRelation: "Spouse",
            emergencyContactPhone: "9787654321",
            bankName: "State Bank of India",
            accountNumber: "XXXXXX004",
            ifscCode: "SBIN0000004",
            status: "Active",
            remarks: ""
        },
        {
            id: "teacher-005",
            teacherId: "TCH-005",
            employeeId: "EMP-005",
            name: "Pema Tamang",
            gender: "Female",
            dob: "1992-06-19",
            teacherType: "Part-Time",
            qualification: "B.A., B.Ed.",
            specialization: "Nepali",
            subjects: ["Nepali"],
            classes: ["Class 6", "Class 7"],
            phone: "9765432108",
            alternatePhone: "",
            email: "pema.tamang@example.com",
            joiningDate: "2023-06-12",
            salary: 18000,
            address: "Diphu, Assam",
            emergencyContactName: "Kumar Tamang",
            emergencyContactRelation: "Father",
            emergencyContactPhone: "9754321098",
            bankName: "Assam Gramin Vikash Bank",
            accountNumber: "XXXXXX005",
            ifscCode: "AGVB0000005",
            status: "Active",
            remarks: ""
        },
        {
            id: "teacher-006",
            teacherId: "TCH-006",
            employeeId: "EMP-006",
            name: "Sanjay Roy",
            gender: "Male",
            dob: "1987-01-28",
            teacherType: "Contract",
            qualification: "M.Com., B.Ed.",
            specialization: "Commerce",
            subjects: ["Commerce", "Accountancy"],
            classes: ["Class 11", "Class 12"],
            phone: "9753108642",
            alternatePhone: "",
            email: "sanjay.roy@example.com",
            joiningDate: "2020-08-03",
            salary: 30000,
            address: "Guwahati, Assam",
            emergencyContactName: "Rina Roy",
            emergencyContactRelation: "Spouse",
            emergencyContactPhone: "9742012345",
            bankName: "State Bank of India",
            accountNumber: "XXXXXX006",
            ifscCode: "SBIN0000006",
            status: "Inactive",
            remarks: ""
        }
    ];
}


/* =========================================
   TEACHER LIST
========================================= */

function initializeTeachersList() {
    const tableBody = document.getElementById("teacherTableBody");

    if (!tableBody) {
        return;
    }

    setupTeacherListEvents();
    applyTeacherFilters();
}


function setupTeacherListEvents() {

    const searchInput = document.getElementById("teacherSearch");
    const applyButton = document.getElementById("applyTeacherFilters");
    const resetButton = document.getElementById("resetTeacherFilters");
    const refreshButton = document.getElementById("refreshTeachers");

    if (searchInput) {
        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                applyTeacherFilters();
            }
        });
    }

    if (applyButton) {
        applyButton.addEventListener("click", function () {
            applyTeacherFilters();
        });
    }

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            resetTeacherFilters();
        });
    }

    if (refreshButton) {
        refreshButton.addEventListener("click", function () {
            loadTeachers();
            applyTeacherFilters();

            showTeacherMessage(
                "Teacher records refreshed successfully.",
                "success"
            );
        });
    }

    document.addEventListener("click", function (event) {

        const viewButton = event.target.closest(
            "[data-action='view-teacher']"
        );

        const editButton = event.target.closest(
            "[data-action='edit-teacher']"
        );

        const deactivateButton = event.target.closest(
            "[data-action='deactivate-teacher']"
        );

        if (viewButton) {
            const teacherId = viewButton.dataset.id;
            window.location.href =
                "teacher-profile.html?id=" +
                encodeURIComponent(teacherId);
        }

        if (editButton) {
            const teacherId = editButton.dataset.id;
            window.location.href =
                "teacher-edit.html?id=" +
                encodeURIComponent(teacherId);
        }

        if (deactivateButton) {
            openDeactivateTeacherModal(
                deactivateButton.dataset.id
            );
        }
    });
}


function applyTeacherFilters() {

    const searchInput = document.getElementById("teacherSearch");
    const statusFilter = document.getElementById("teacherStatusFilter");
    const genderFilter = document.getElementById("teacherGenderFilter");
    const typeFilter = document.getElementById("teacherTypeFilter");

    const search = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const status = statusFilter
        ? statusFilter.value
        : "";

    const gender = genderFilter
        ? genderFilter.value
        : "";

    const teacherType = typeFilter
        ? typeFilter.value
        : "";

    filteredTeachers = teachers.filter(function (teacher) {

        const searchableText = [
            teacher.teacherId,
            teacher.employeeId,
            teacher.name,
            teacher.phone,
            teacher.email,
            teacher.specialization,
            ...(Array.isArray(teacher.subjects)
                ? teacher.subjects
                : [])
        ]
            .join(" ")
            .toLowerCase();

        const matchesSearch =
            !search ||
            searchableText.includes(search);

        const matchesStatus =
            !status ||
            teacher.status === status;

        const matchesGender =
            !gender ||
            teacher.gender === gender;

        const matchesType =
            !teacherType ||
            teacher.teacherType === teacherType;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesGender &&
            matchesType
        );
    });

    currentTeacherPage = 1;

    renderTeacherSummary();
    renderTeacherTable();
    renderTeacherPagination();
}


function resetTeacherFilters() {

    const searchInput = document.getElementById("teacherSearch");
    const statusFilter = document.getElementById("teacherStatusFilter");
    const genderFilter = document.getElementById("teacherGenderFilter");
    const typeFilter = document.getElementById("teacherTypeFilter");

    if (searchInput) {
        searchInput.value = "";
    }

    if (statusFilter) {
        statusFilter.value = "";
    }

    if (genderFilter) {
        genderFilter.value = "";
    }

    if (typeFilter) {
        typeFilter.value = "";
    }

    applyTeacherFilters();
}


/* =========================================
   SUMMARY
========================================= */

function renderTeacherSummary() {

    const totalElement = document.getElementById("totalTeachers");
    const activeElement = document.getElementById("activeTeachers");
    const inactiveElement = document.getElementById("inactiveTeachers");
    const teachingStaffElement =
        document.getElementById("teachingStaffCount");

    const total = teachers.length;

    const active = teachers.filter(function (teacher) {
        return teacher.status === "Active";
    }).length;

    const inactive = teachers.filter(function (teacher) {
        return teacher.status === "Inactive";
    }).length;

    const teachingStaff = teachers.filter(function (teacher) {
        return teacher.status === "Active" &&
            Array.isArray(teacher.subjects) &&
            teacher.subjects.length > 0;
    }).length;

    if (totalElement) {
        totalElement.textContent = total;
    }

    if (activeElement) {
        activeElement.textContent = active;
    }

    if (inactiveElement) {
        inactiveElement.textContent = inactive;
    }

    if (teachingStaffElement) {
        teachingStaffElement.textContent = teachingStaff;
    }
}


/* =========================================
   TABLE
========================================= */

function renderTeacherTable() {

    const tableBody =
        document.getElementById("teacherTableBody");

    if (!tableBody) {
        return;
    }

    const startIndex =
        (currentTeacherPage - 1) * TEACHERS_PER_PAGE;

    const pageTeachers =
        filteredTeachers.slice(
            startIndex,
            startIndex + TEACHERS_PER_PAGE
        );

    if (!pageTeachers.length) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="11" class="empty-table-cell">
                    No teacher records found.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = pageTeachers.map(function (teacher) {

        const subjects =
            Array.isArray(teacher.subjects) &&
            teacher.subjects.length
                ? teacher.subjects.join(", ")
                : "—";

        const salary = formatCurrency(teacher.salary);

        const statusClass =
            teacher.status === "Active"
                ? "status-active"
                : "status-inactive";

        return `
            <tr>
                <td>${escapeHtml(teacher.teacherId)}</td>

                <td>
                    <strong>${escapeHtml(teacher.name)}</strong>
                </td>

                <td>${escapeHtml(teacher.gender || "—")}</td>

                <td>${escapeHtml(teacher.teacherType || "—")}</td>

                <td>${escapeHtml(teacher.qualification || "—")}</td>

                <td>${escapeHtml(subjects)}</td>

                <td>${escapeHtml(teacher.phone || "—")}</td>

                <td>${formatDate(teacher.joiningDate)}</td>

                <td>${salary}</td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${escapeHtml(teacher.status)}
                    </span>
                </td>

                <td>
                    <div class="table-actions">

                        <button
                            type="button"
                            class="table-action-btn"
                            data-action="view-teacher"
                            data-id="${escapeHtml(teacher.id)}"
                            title="View Teacher"
                            aria-label="View Teacher"
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>

                        <button
                            type="button"
                            class="table-action-btn"
                            data-action="edit-teacher"
                            data-id="${escapeHtml(teacher.id)}"
                            title="Edit Teacher"
                            aria-label="Edit Teacher"
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                            </svg>
                        </button>

                        ${
                            teacher.status === "Active"
                                ? `
                                <button
                                    type="button"
                                    class="table-action-btn table-action-danger"
                                    data-action="deactivate-teacher"
                                    data-id="${escapeHtml(teacher.id)}"
                                    title="Deactivate Teacher"
                                    aria-label="Deactivate Teacher"
                                >
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="9"></circle>
                                        <line x1="8" y1="8" x2="16" y2="16"></line>
                                        <line x1="16" y1="8" x2="8" y2="16"></line>
                                    </svg>
                                </button>
                                `
                                : ""
                        }

                    </div>
                </td>
            </tr>
        `;
    }).join("");
}


/* =========================================
   PAGINATION
========================================= */

function renderTeacherPagination() {

    const pagination =
        document.getElementById("teacherPagination");

    if (!pagination) {
        return;
    }

    const totalPages =
        Math.ceil(
            filteredTeachers.length / TEACHERS_PER_PAGE
        );

    pagination.innerHTML = "";

    if (totalPages <= 1) {
        return;
    }

    const previousButton =
        createPaginationButton(
            "Previous",
            currentTeacherPage === 1,
            function () {
                if (currentTeacherPage > 1) {
                    currentTeacherPage--;
                    renderTeacherTable();
                    renderTeacherPagination();
                }
            }
        );

    pagination.appendChild(previousButton);

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {
        const pageButton =
            createPaginationButton(
                String(page),
                false,
                function () {
                    currentTeacherPage = page;
                    renderTeacherTable();
                    renderTeacherPagination();
                }
            );

        if (page === currentTeacherPage) {
            pageButton.classList.add("active");
            pageButton.setAttribute("aria-current", "page");
        }

        pagination.appendChild(pageButton);
    }

    const nextButton =
        createPaginationButton(
            "Next",
            currentTeacherPage === totalPages,
            function () {
                if (currentTeacherPage < totalPages) {
                    currentTeacherPage++;
                    renderTeacherTable();
                    renderTeacherPagination();
                }
            }
        );

    pagination.appendChild(nextButton);
}


function createPaginationButton(
    label,
    disabled,
    callback
) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "pagination-btn";
    button.textContent = label;
    button.disabled = disabled;

    button.addEventListener("click", callback);

    return button;
}


/* =========================================
   ADD TEACHER
========================================= */

function initializeTeacherAdd() {

    const form =
        document.getElementById("teacherAddForm");

    if (!form) {
        return;
    }

    populateTeacherFormOptions(form);

    const cancelButton =
        document.getElementById("cancelTeacherAdd");

    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            window.location.href = "teachers.html";
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        handleTeacherAdd(form);
    });
}


function handleTeacherAdd(form) {

    clearFormErrors(form);

    const teacherData =
        collectTeacherFormData(form);

    const validation =
        validateTeacherData(
            teacherData,
            null
        );

    if (!validation.valid) {
        showTeacherFormError(
            form,
            validation.message,
            validation.field
        );
        return;
    }

    const newTeacher = {
        id: generateTeacherId(),
        ...teacherData
    };

    teachers.push(newTeacher);
    saveTeachers();

    showTeacherMessage(
        "Teacher added successfully.",
        "success"
    );

    setTimeout(function () {
        window.location.href =
            "teacher-profile.html?id=" +
            encodeURIComponent(newTeacher.id);
    }, 500);
}


/* =========================================
   EDIT TEACHER
========================================= */

function initializeTeacherEdit() {

    const form =
        document.getElementById("teacherEditForm");

    if (!form) {
        return;
    }

    const teacherId =
        getQueryParameter("id");

    if (!teacherId) {
        showTeacherFormError(
            form,
            "Teacher record could not be identified."
        );
        disableTeacherForm(form);
        return;
    }

    const teacher =
        teachers.find(function (item) {
            return item.id === teacherId;
        });

    if (!teacher) {
        showTeacherFormError(
            form,
            "Teacher record was not found."
        );
        disableTeacherForm(form);
        return;
    }

    populateTeacherFormOptions(form);
    populateTeacherForm(form, teacher);

    const cancelButton =
        document.getElementById("cancelTeacherEdit");

    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            window.location.href =
                "teacher-profile.html?id=" +
                encodeURIComponent(teacher.id);
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        handleTeacherEdit(form, teacher.id);
    });
}


function handleTeacherEdit(form, teacherId) {

    clearFormErrors(form);

    const teacherData =
        collectTeacherFormData(form);

    const validation =
        validateTeacherData(
            teacherData,
            teacherId
        );

    if (!validation.valid) {
        showTeacherFormError(
            form,
            validation.message,
            validation.field
        );
        return;
    }

    const index =
        teachers.findIndex(function (teacher) {
            return teacher.id === teacherId;
        });

    if (index === -1) {
        showTeacherFormError(
            form,
            "Teacher record was not found."
        );
        return;
    }

    teachers[index] = {
        ...teachers[index],
        ...teacherData
    };

    saveTeachers();

    showTeacherMessage(
        "Teacher record updated successfully.",
        "success"
    );

    setTimeout(function () {
        window.location.href =
            "teacher-profile.html?id=" +
            encodeURIComponent(teacherId);
    }, 500);
}


/* =========================================
   FORM DATA
========================================= */

function collectTeacherFormData(form) {

    const getValue = function (id) {
        const field = form.querySelector("#" + id);
        return field ? field.value.trim() : "";
    };

    const getCheckedValues = function (name) {
        return Array.from(
            form.querySelectorAll(
                'input[name="' + name + '"]:checked'
            )
        ).map(function (input) {
            return input.value;
        });
    };

    const subjectsField =
        form.querySelector("#subjects");

    let subjects = [];

    if (subjectsField) {
        subjects = subjectsField.value
            .split(",")
            .map(function (subject) {
                return subject.trim();
            })
            .filter(Boolean);
    }

    const classesField =
        form.querySelector("#classes");

    let classes = [];

    if (classesField) {
        classes = classesField.value
            .split(",")
            .map(function (item) {
                return item.trim();
            })
            .filter(Boolean);
    }

    const salaryValue =
        getValue("salary");

    return {
        teacherId:
            getValue("teacherId"),

        employeeId:
            getValue("employeeId"),

        name:
            getValue("name"),

        gender:
            getValue("gender"),

        dob:
            getValue("dob"),

        teacherType:
            getValue("teacherType"),

        qualification:
            getValue("qualification"),

        specialization:
            getValue("specialization"),

        subjects:
            subjects.length
                ? subjects
                : getCheckedValues("subjects"),

        classes:
            classes,

        phone:
            getValue("phone"),

        alternatePhone:
            getValue("alternatePhone"),

        email:
            getValue("email"),

        joiningDate:
            getValue("joiningDate"),

        salary:
            salaryValue
                ? Number(salaryValue)
                : 0,

        address:
            getValue("address"),

        emergencyContactName:
            getValue("emergencyContactName"),

        emergencyContactRelation:
            getValue("emergencyContactRelation"),

        emergencyContactPhone:
            getValue("emergencyContactPhone"),

        bankName:
            getValue("bankName"),

        accountNumber:
            getValue("accountNumber"),

        ifscCode:
            getValue("ifscCode"),

        status:
            getValue("status") || "Active",

        remarks:
            getValue("remarks")
    };
}


function populateTeacherFormOptions(form) {

    const teacherType =
        form.querySelector("#teacherType");

    if (
        teacherType &&
        !teacherType.options.length
    ) {
        teacherType.innerHTML = `
            <option value="">Select Teacher Type</option>
            <option value="Permanent">Permanent</option>
            <option value="Contract">Contract</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Guest">Guest</option>
        `;
    }
}


function populateTeacherForm(form, teacher) {

    const setValue = function (id, value) {

        const field =
            form.querySelector("#" + id);

        if (field) {
            field.value =
                value !== undefined &&
                value !== null
                    ? value
                    : "";
        }
    };

    setValue("teacherId", teacher.teacherId);
    setValue("employeeId", teacher.employeeId);
    setValue("name", teacher.name);
    setValue("gender", teacher.gender);
    setValue("dob", teacher.dob);
    setValue("teacherType", teacher.teacherType);
    setValue("qualification", teacher.qualification);
    setValue("specialization", teacher.specialization);
    setValue(
        "subjects",
        Array.isArray(teacher.subjects)
            ? teacher.subjects.join(", ")
            : ""
    );
    setValue(
        "classes",
        Array.isArray(teacher.classes)
            ? teacher.classes.join(", ")
            : ""
    );
    setValue("phone", teacher.phone);
    setValue("alternatePhone", teacher.alternatePhone);
    setValue("email", teacher.email);
    setValue("joiningDate", teacher.joiningDate);
    setValue("salary", teacher.salary);
    setValue("address", teacher.address);
    setValue(
        "emergencyContactName",
        teacher.emergencyContactName
    );
    setValue(
        "emergencyContactRelation",
        teacher.emergencyContactRelation
    );
    setValue(
        "emergencyContactPhone",
        teacher.emergencyContactPhone
    );
    setValue("bankName", teacher.bankName);
    setValue("accountNumber", teacher.accountNumber);
    setValue("ifscCode", teacher.ifscCode);
    setValue("status", teacher.status);
    setValue("remarks", teacher.remarks);
}


/* =========================================
   VALIDATION
========================================= */

function validateTeacherData(
    teacherData,
    currentTeacherId
) {

    if (!teacherData.teacherId) {
        return {
            valid: false,
            field: "teacherId",
            message: "Teacher ID is required."
        };
    }

    if (!teacherData.name) {
        return {
            valid: false,
            field: "name",
            message: "Teacher name is required."
        };
    }

    if (!teacherData.gender) {
        return {
            valid: false,
            field: "gender",
            message: "Please select gender."
        };
    }

    if (!teacherData.teacherType) {
        return {
            valid: false,
            field: "teacherType",
            message: "Please select teacher type."
        };
    }

    if (!teacherData.qualification) {
        return {
            valid: false,
            field: "qualification",
            message: "Qualification is required."
        };
    }

    if (!teacherData.phone) {
        return {
            valid: false,
            field: "phone",
            message: "Phone number is required."
        };
    }

    if (!isValidPhone(teacherData.phone)) {
        return {
            valid: false,
            field: "phone",
            message: "Enter a valid 10-digit phone number."
        };
    }

    if (
        teacherData.alternatePhone &&
        !isValidPhone(teacherData.alternatePhone)
    ) {
        return {
            valid: false,
            field: "alternatePhone",
            message: "Enter a valid alternate phone number."
        };
    }

    if (
        teacherData.email &&
        !isValidEmail(teacherData.email)
    ) {
        return {
            valid: false,
            field: "email",
            message: "Enter a valid email address."
        };
    }

    if (!teacherData.joiningDate) {
        return {
            valid: false,
            field: "joiningDate",
            message: "Joining date is required."
        };
    }

    if (
        !teacherData.salary ||
        teacherData.salary < 0
    ) {
        return {
            valid: false,
            field: "salary",
            message: "Enter a valid salary amount."
        };
    }

    const duplicateTeacherId =
        teachers.some(function (teacher) {
            return (
                teacher.teacherId.toLowerCase() ===
                teacherData.teacherId.toLowerCase() &&
                teacher.id !== currentTeacherId
            );
        });

    if (duplicateTeacherId) {
        return {
            valid: false,
            field: "teacherId",
            message: "This Teacher ID already exists."
        };
    }

    if (teacherData.employeeId) {

        const duplicateEmployeeId =
            teachers.some(function (teacher) {
                return (
                    teacher.employeeId &&
                    teacher.employeeId.toLowerCase() ===
                    teacherData.employeeId.toLowerCase() &&
                    teacher.id !== currentTeacherId
                );
            });

        if (duplicateEmployeeId) {
            return {
                valid: false,
                field: "employeeId",
                message: "This Employee ID already exists."
            };
        }
    }

    return {
        valid: true,
        message: ""
    };
}


/* =========================================
   TEACHER PROFILE
========================================= */

function initializeTeacherProfile() {

    const profileContainer =
        document.getElementById("teacherProfile");

    if (!profileContainer) {
        return;
    }

    const teacherId =
        getQueryParameter("id");

    if (!teacherId) {
        showTeacherProfileMessage(
            "Teacher record could not be identified."
        );
        return;
    }

    const teacher =
        teachers.find(function (item) {
            return item.id === teacherId;
        });

    if (!teacher) {
        showTeacherProfileMessage(
            "Teacher record was not found."
        );
        return;
    }

    renderTeacherProfile(teacher);
}


function renderTeacherProfile(teacher) {

    const profileContainer =
        document.getElementById("teacherProfile");

    if (!profileContainer) {
        return;
    }

    const initials =
        getInitials(teacher.name);

    const subjects =
        Array.isArray(teacher.subjects) &&
        teacher.subjects.length
            ? teacher.subjects.join(", ")
            : "—";

    const classes =
        Array.isArray(teacher.classes) &&
        teacher.classes.length
            ? teacher.classes.join(", ")
            : "—";

    const statusClass =
        teacher.status === "Active"
            ? "status-active"
            : "status-inactive";

    profileContainer.innerHTML = `
        <div class="profile-summary-card">

            <div class="profile-summary-main">

                <div class="student-avatar">
                    ${escapeHtml(initials)}
                </div>

                <div class="student-summary-info">

                    <h2>${escapeHtml(teacher.name)}</h2>

                    <div class="student-summary-meta">

                        <span>
                            <strong>Teacher ID:</strong>
                            ${escapeHtml(teacher.teacherId)}
                        </span>

                        <span>
                            <strong>Employee ID:</strong>
                            ${escapeHtml(teacher.employeeId || "—")}
                        </span>

                        <span>
                            <strong>Type:</strong>
                            ${escapeHtml(teacher.teacherType)}
                        </span>

                    </div>

                </div>

            </div>

            <span class="status-badge ${statusClass}">
                ${escapeHtml(teacher.status)}
            </span>

        </div>

        <div class="profile-grid">

            <section class="data-card">

                <div class="data-card-header">
                    <h3>Personal Information</h3>
                    <p>Basic teacher details.</p>
                </div>

                <div class="details-list">

                    ${renderDetailItem("Full Name", teacher.name)}

                    ${renderDetailItem("Gender", teacher.gender)}

                    ${renderDetailItem(
                        "Date of Birth",
                        formatDate(teacher.dob)
                    )}

                    ${renderDetailItem(
                        "Phone",
                        teacher.phone
                    )}

                    ${renderDetailItem(
                        "Alternate Phone",
                        teacher.alternatePhone || "—"
                    )}

                    ${renderDetailItem(
                        "Email",
                        teacher.email || "—"
                    )}

                    ${renderDetailItemColumn(
                        "Address",
                        teacher.address || "—"
                    )}

                </div>

            </section>

            <section class="data-card">

                <div class="data-card-header">
                    <h3>Professional Information</h3>
                    <p>Employment and teaching details.</p>
                </div>

                <div class="details-list">

                    ${renderDetailItem(
                        "Teacher Type",
                        teacher.teacherType
                    )}

                    ${renderDetailItem(
                        "Qualification",
                        teacher.qualification
                    )}

                    ${renderDetailItem(
                        "Specialization",
                        teacher.specialization || "—"
                    )}

                    ${renderDetailItem(
                        "Subjects",
                        subjects
                    )}

                    ${renderDetailItem(
                        "Classes",
                        classes
                    )}

                    ${renderDetailItem(
                        "Joining Date",
                        formatDate(teacher.joiningDate)
                    )}

                    ${renderDetailItem(
                        "Monthly Salary",
                        formatCurrency(teacher.salary)
                    )}

                </div>

            </section>

            <section class="data-card">

                <div class="data-card-header">
                    <h3>Emergency Contact</h3>
                    <p>Emergency contact information.</p>
                </div>

                <div class="details-list">

                    ${renderDetailItem(
                        "Name",
                        teacher.emergencyContactName || "—"
                    )}

                    ${renderDetailItem(
                        "Relationship",
                        teacher.emergencyContactRelation || "—"
                    )}

                    ${renderDetailItem(
                        "Phone",
                        teacher.emergencyContactPhone || "—"
                    )}

                </div>

            </section>

            <section class="data-card">

                <div class="data-card-header">
                    <h3>Bank Information</h3>
                    <p>Salary payment information.</p>
                </div>

                <div class="details-list">

                    ${renderDetailItem(
                        "Bank",
                        teacher.bankName || "—"
                    )}

                    ${renderDetailItem(
                        "Account Number",
                        teacher.accountNumber || "—"
                    )}

                    ${renderDetailItem(
                        "IFSC Code",
                        teacher.ifscCode || "—"
                    )}

                </div>

            </section>

        </div>

        <section class="data-card profile-record-card">

            <div class="data-card-header">
                <h3>Teacher Records</h3>
                <p>Attendance, salary and academic records.</p>
            </div>

            <div class="profile-record-tabs">

                <button
                    type="button"
                    class="profile-tab active"
                    data-teacher-tab="attendance"
                >
                    Attendance
                </button>

                <button
                    type="button"
                    class="profile-tab"
                    data-teacher-tab="salary"
                >
                    Salary
                </button>

                <button
                    type="button"
                    class="profile-tab"
                    data-teacher-tab="classes"
                >
                    Classes
                </button>

            </div>

            <div
                class="profile-tab-content active"
                data-teacher-tab-content="attendance"
            >
                <div class="empty-state">
                    <h4>Attendance Records</h4>
                    <p>
                        Teacher attendance records will appear here
                        after the attendance module is connected.
                    </p>
                </div>
            </div>

            <div
                class="profile-tab-content"
                data-teacher-tab-content="salary"
            >
                <div class="empty-state">
                    <h4>Salary Records</h4>
                    <p>
                        Monthly salary payment records will appear here
                        after the salary module is connected.
                    </p>
                </div>
            </div>

            <div
                class="profile-tab-content"
                data-teacher-tab-content="classes"
            >
                <div class="empty-state">
                    <h4>Assigned Classes</h4>
                    <p>
                        Class and subject assignments will appear here.
                    </p>
                </div>
            </div>

        </section>
    `;

    setupTeacherProfileTabs();

    setupTeacherProfileActions(teacher);
}


function setupTeacherProfileTabs() {

    const tabs =
        document.querySelectorAll(
            "[data-teacher-tab]"
        );

    const contents =
        document.querySelectorAll(
            "[data-teacher-tab-content]"
        );

    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const target =
                tab.dataset.teacherTab;

            tabs.forEach(function (item) {
                item.classList.remove("active");
            });

            contents.forEach(function (content) {
                content.classList.remove("active");
            });

            tab.classList.add("active");

            const content =
                document.querySelector(
                    '[data-teacher-tab-content="' +
                    target +
                    '"]'
                );

            if (content) {
                content.classList.add("active");
            }
        });
    });
}


function setupTeacherProfileActions(teacher) {

    const editButton =
        document.getElementById("editTeacher");

    if (editButton) {
        editButton.addEventListener("click", function () {
            window.location.href =
                "teacher-edit.html?id=" +
                encodeURIComponent(teacher.id);
        });
    }
}


/* =========================================
   DEACTIVATE TEACHER
========================================= */

function initializeTeacherDeactivateModal() {

    const closeButton =
        document.getElementById("closeDeactivateTeacher");

    const cancelButton =
        document.getElementById("cancelDeactivateTeacher");

    const confirmButton =
        document.getElementById("confirmDeactivateTeacher");

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeDeactivateTeacherModal
        );
    }

    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            closeDeactivateTeacherModal
        );
    }

    if (confirmButton) {
        confirmButton.addEventListener(
            "click",
            confirmDeactivateTeacher
        );
    }

    document.addEventListener("click", function (event) {

        const modal =
            document.getElementById(
                "deactivateTeacherModal"
            );

        if (
            modal &&
            event.target === modal
        ) {
            closeDeactivateTeacherModal();
        }
    });
}


function openDeactivateTeacherModal(teacherId) {

    const teacher =
        teachers.find(function (item) {
            return item.id === teacherId;
        });

    if (!teacher) {
        return;
    }

    selectedTeacherId = teacherId;

    const modal =
        document.getElementById(
            "deactivateTeacherModal"
        );

    const nameElement =
        document.getElementById(
            "deactivateTeacherName"
        );

    const messageElement =
        document.getElementById(
            "deactivateTeacherMessage"
        );

    if (nameElement) {
        nameElement.textContent =
            teacher.name;
    }

    if (messageElement) {
        messageElement.className =
            "form-message hidden";
        messageElement.textContent = "";
    }

    if (modal) {
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
    }
}


function closeDeactivateTeacherModal() {

    const modal =
        document.getElementById(
            "deactivateTeacherModal"
        );

    selectedTeacherId = null;

    if (modal) {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
    }
}


function confirmDeactivateTeacher() {

    if (!selectedTeacherId) {
        return;
    }

    const teacher =
        teachers.find(function (item) {
            return item.id === selectedTeacherId;
        });

    if (!teacher) {
        closeDeactivateTeacherModal();
        return;
    }

    teacher.status = "Inactive";

    saveTeachers();

    closeDeactivateTeacherModal();

    applyTeacherFilters();

    showTeacherMessage(
        "Teacher deactivated successfully.",
        "success"
    );
}


/* =========================================
   HELPER FUNCTIONS
========================================= */

function generateTeacherId() {

    let number = teachers.length + 1;

    let id =
        "teacher-" +
        String(number).padStart(3, "0");

    while (
        teachers.some(function (teacher) {
            return teacher.id === id;
        })
    ) {
        number++;

        id =
            "teacher-" +
            String(number).padStart(3, "0");
    }

    return id;
}


function getQueryParameter(name) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get(name);
}


function getInitials(name) {

    if (!name) {
        return "T";
    }

    const parts =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (parts.length === 1) {
        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
    ).toUpperCase();
}


function formatDate(dateString) {

    if (!dateString) {
        return "—";
    }

    const date =
        new Date(dateString + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
        return escapeHtml(dateString);
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    ).format(date);
}


function formatCurrency(amount) {

    const numericAmount =
        Number(amount);

    if (
        Number.isNaN(numericAmount)
    ) {
        return "₹0";
    }

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(numericAmount);
}


function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
}


function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function renderDetailItem(label, value) {

    return `
        <div class="detail-item">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value || "—")}</strong>
        </div>
    `;
}


function renderDetailItemColumn(label, value) {

    return `
        <div class="detail-item detail-item-column">
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(value || "—")}</strong>
        </div>
    `;
}


/* =========================================
   FORM HELPERS
========================================= */

function clearFormErrors(form) {

    if (!form) {
        return;
    }

    form.querySelectorAll(
        ".input-error"
    ).forEach(function (field) {
        field.classList.remove("input-error");
    });

    form.querySelectorAll(
        ".field-error"
    ).forEach(function (error) {
        error.remove();
    });

    const message =
        form.querySelector(".form-message");

    if (message) {
        message.className =
            "form-message hidden";
        message.textContent = "";
    }
}


function showTeacherFormError(
    form,
    message,
    fieldId
) {

    if (!form) {
        return;
    }

    const messageElement =
        form.querySelector(".form-message");

    if (messageElement) {
        messageElement.className =
            "form-message error";
        messageElement.textContent =
            message;
    }

    if (fieldId) {

        const field =
            form.querySelector("#" + fieldId);

        if (field) {
            field.classList.add("input-error");

            field.focus();
        }
    }
}


function disableTeacherForm(form) {

    if (!form) {
        return;
    }

    form.querySelectorAll(
        "input, select, textarea, button"
    ).forEach(function (element) {
        element.disabled = true;
    });
}


function showTeacherMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "teacherMessage"
        );

    if (!element) {
        return;
    }

    element.className =
        "form-message " +
        (type || "info");

    element.textContent =
        message;
}


function showTeacherProfileMessage(message) {

    const container =
        document.getElementById(
            "teacherProfile"
        );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="empty-state">
            <h4>Teacher Not Found</h4>
            <p>${escapeHtml(message)}</p>
            <br>
            <a href="teachers.html" class="btn btn-primary">
                Back to Teachers
            </a>
        </div>
    `;
}


/* =========================================
   BACKWARD-COMPATIBLE GLOBAL HELPERS
========================================= */

window.applyTeacherFilters = applyTeacherFilters;
window.resetTeacherFilters = resetTeacherFilters;
window.openDeactivateTeacherModal =
    openDeactivateTeacherModal;
window.closeDeactivateTeacherModal =
    closeDeactivateTeacherModal;
