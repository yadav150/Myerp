/* ============================================================
   js/components.js — Reusable UI components (dropdowns, modals, tabs, etc.)
   ============================================================ */
(function() {
    'use strict';

    // ---- Profile dropdown toggle ----
    const profileToggle = document.getElementById('profileToggle');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileToggle && profileDropdown) {
        profileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('open');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('open');
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && profileDropdown.classList.contains('open')) {
                profileDropdown.classList.remove('open');
            }
        });
    }

    // ---- Logout button (demo) ----
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                alert('Logout functionality will be available in Phase 2.');
            }
        });
    }

    // ---- "Add" buttons (demo) ----
    const addButtons = [
        { id: 'addStudentBtn', msg: 'Add Student form will open here (Phase 2).' },
        { id: 'addTeacherBtn', msg: 'Add Teacher form will open here (Phase 2).' },
        { id: 'addFeeBtn', msg: 'Add Fee Record form will open here (Phase 2).' },
        { id: 'addSalaryBtn', msg: 'Add Salary Record form will open here (Phase 2).' },
        { id: 'addNoticeBtn', msg: 'Add Notice form will open here (Phase 2).' },
        { id: 'issueCertificateBtn', msg: 'Issue Certificate form will open here (Phase 2).' },
        { id: 'generateIdBtn', msg: 'Generate ID Card form will open here (Phase 2).' },
        { id: 'generateReportBtn', msg: 'Report generation will be available in Phase 2.' }
    ];

    addButtons.forEach(({ id, msg }) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                alert(msg);
            });
        }
    });

    // ---- Reset filter buttons ----
    document.querySelectorAll('#resetFilters, #resetAttendance, #resetFilters').forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                const form = this.closest('.filter-bar');
                if (form) {
                    form.querySelectorAll('input, select').forEach(el => {
                        if (el.tagName === 'INPUT' && el.type === 'search') {
                            el.value = '';
                        } else if (el.tagName === 'SELECT') {
                            el.selectedIndex = 0;
                        }
                    });
                    alert('Filters have been reset.');
                }
            });
        }
    });

    // ---- Save Attendance button ----
    const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
    if (saveAttendanceBtn) {
        saveAttendanceBtn.addEventListener('click', function() {
            const selects = document.querySelectorAll('.attendance-status');
            const data = [];
            selects.forEach(sel => {
                const student = sel.dataset.student || 'Unknown';
                data.push({ student, status: sel.value });
            });
            alert('Attendance saved for ' + data.length + ' students.\n\n' + 
                  data.map(d => d.student + ': ' + d.status).join('\n'));
        });
    }

    // ---- Notice form submission ----
    const noticeForm = document.getElementById('noticeForm');
    if (noticeForm) {
        noticeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('noticeTitle')?.value || 'Untitled';
            alert('Notice "' + title + '" has been published successfully!');
            this.reset();
        });
    }

    // ---- Toast notification helper (for future use) ----
    window.showToast = function(message, type) {
        type = type || 'info';
        alert(message); // Simple fallback — replace with proper toast in Phase 2
    };

    // ---- Confirm delete (demo) ----
    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this item?')) {
                const row = this.closest('tr');
                if (row) {
                    row.style.opacity = '0.5';
                    setTimeout(() => {
                        row.remove();
                        alert('Item deleted (demo).');
                    }, 300);
                }
            }
        });
    });

})();
