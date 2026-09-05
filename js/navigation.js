/* ============================================================
   js/navigation.js — Navigation state & active link highlighting
   ============================================================ */
(function() {
    'use strict';

    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

    // Highlight active sidebar link
    document.querySelectorAll('.sidebar-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.closest('.sidebar-item')?.classList.add('active');
        } else {
            link.closest('.sidebar-item')?.classList.remove('active');
        }
    });

    // Update header breadcrumb & title based on page
    const pageTitleMap = {
        'dashboard.html': 'Dashboard',
        'students.html': 'Students',
        'student-profile.html': 'Student Profile',
        'teachers.html': 'Teachers',
        'teacher-profile.html': 'Teacher Profile',
        'attendance.html': 'Attendance',
        'fees.html': 'Fees',
        'salary.html': 'Salary',
        'id-cards.html': 'ID Cards',
        'certificates.html': 'Certificates',
        'notices.html': 'Notices',
        'reports.html': 'Reports',
        'settings.html': 'Settings'
    };

    const title = pageTitleMap[currentPage] || 'Dashboard';
    const h1 = document.querySelector('.header-title h1');
    if (h1) h1.textContent = title;

    // Breadcrumb mapping
    const breadcrumbMap = {
        'dashboard.html': 'Home / Dashboard',
        'students.html': 'Academic / Students',
        'student-profile.html': 'Academic / Students / Profile',
        'teachers.html': 'Academic / Teachers',
        'teacher-profile.html': 'Academic / Teachers / Profile',
        'attendance.html': 'Academic / Attendance',
        'fees.html': 'Finance / Fees',
        'salary.html': 'Finance / Salary',
        'id-cards.html': 'Documents / ID Cards',
        'certificates.html': 'Documents / Certificates',
        'notices.html': 'Communication / Notices',
        'reports.html': 'Administration / Reports',
        'settings.html': 'Administration / Settings'
    };
    const bc = document.querySelector('.header-breadcrumb');
    if (bc) bc.textContent = breadcrumbMap[currentPage] || 'Home / Dashboard';

})();
