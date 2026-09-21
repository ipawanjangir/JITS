/* ==========================================================
   JANGIR IT SOLUTION
   ADMIN DASHBOARD JAVASCRIPT
   Version: 8.0 (Cleaned — duplicates removed)
   ========================================================== */


/* ==========================================================
   1. CONFIGURATION
   ========================================================== */

const API_BASE_URL = "http://localhost:8080";


/* ==========================================================
   2. AUTHENTICATION
   ========================================================== */

const token = localStorage.getItem("adminToken");
const username = localStorage.getItem("adminUsername");

if (!token) {
    window.location.href = "login.html";
}


/* ==========================================================
   3. DOM ELEMENTS
   ========================================================== */

const usernameElement = document.getElementById("adminUsername");
const welcomeUsernameElement = document.getElementById("welcomeUsername");

const totalLeadsElement = document.getElementById("totalLeads");
const newLeadsElement = document.getElementById("newLeads");
const activeProjectsElement = document.getElementById("activeProjects");
const totalClientsElement = document.getElementById("totalClients");
const sidebarLeadCountElement = document.getElementById("sidebarLeadCount");

const leadsTableBody = document.getElementById("leadsTableBody");
const emptyLeadsElement = document.getElementById("emptyLeads");

const leadSearchInput = document.getElementById("leadSearchInput");
const leadStatusFilter = document.getElementById("leadStatusFilter");

const refreshLeadsBtn = document.getElementById("refreshLeads");

const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");

const currentDateElement = document.getElementById("currentDate");
const notificationBtn = document.getElementById("notificationBtn");
const logoutBtn = document.getElementById("logoutBtn");

const leadPagination = document.getElementById("leadPagination");
const prevLeadPage = document.getElementById("prevLeadPage");
const nextLeadPage = document.getElementById("nextLeadPage");
const leadPaginationPages = document.getElementById("leadPaginationPages");

const leadModal = document.getElementById("leadModal");
const closeLeadModalBtn = document.getElementById("closeLeadModal");
const closeLeadModalBottomBtn = document.getElementById("closeLeadModalBottom");

const modalLeadId = document.getElementById("modalLeadId");
const modalLeadName = document.getElementById("modalLeadName");
const modalLeadEmail = document.getElementById("modalLeadEmail");
const modalLeadPhone = document.getElementById("modalLeadPhone");
const modalLeadService = document.getElementById("modalLeadService");
const modalLeadDate = document.getElementById("modalLeadDate");
const modalLeadStatus = document.getElementById("modalLeadStatus");
const modalLeadMessage = document.getElementById("modalLeadMessage");

const modalDeleteLeadBtn = document.getElementById("modalDeleteLead");
const modalUpdateStatusBtn = document.getElementById("modalUpdateStatus");
const modalFollowUpDate = document.getElementById("modalFollowUpDate");
const modalAdminNotes = document.getElementById("modalAdminNotes");
const modalSaveFollowUpBtn = document.getElementById("modalSaveFollowUp");


/* ==========================================================
   4. STATE
   ========================================================== */

let allContacts = [];
let filteredContacts = [];
let currentLeadPage = 1;
const leadsPerPage = 10;
let currentLeadId = null;


/* ==========================================================
   5. USERNAME + DATE DISPLAY
   ========================================================== */

const displayUsername = username || "Administrator";

if (usernameElement) usernameElement.innerText = displayUsername;
if (welcomeUsernameElement) welcomeUsernameElement.innerText = displayUsername;

function showCurrentDate() {
    if (!currentDateElement) return;

    const today = new Date();
    currentDateElement.innerText = today.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}
showCurrentDate();


/* ==========================================================
   6. SIDEBAR (mobile)
   ========================================================== */

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", function () {
        sidebar.classList.toggle("active");
    });
}

if (sidebar) {
    const navLinks = sidebar.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove("active");
            }
        });
    });
}

window.addEventListener("resize", function () {
    if (window.innerWidth > 768 && sidebar) {
        sidebar.classList.remove("active");
    }
});


/* ==========================================================
   7. UTILITY FUNCTIONS
   ========================================================== */

function getStatus(contact) {
    if (!contact || !contact.status) return "NEW";
    return String(contact.status).trim().toUpperCase();
}

function escapeHtml(value) {
    return String(value ?? "-")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function getContactDate(contact) {
    if (!contact) return null;
    return (
        contact.createdAt ||
        contact.createdDate ||
        contact.created_at ||
        contact.date ||
        contact.createdOn ||
        null
    );
}

function getAuthHeaders() {
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}

function handleUnauthorized(response) {
    if (response.status === 401 || response.status === 403) {
        console.warn("Admin session expired or unauthorized.");
        logout();
        return true;
    }
    return false;
}


/* ==========================================================
   8. DASHBOARD STATS
   ========================================================== */

function updateDashboardStats(contacts) {
    if (!Array.isArray(contacts)) contacts = [];

    const totalLeads = contacts.length;

    const newLeads = contacts.filter(function (c) {
        return getStatus(c) === "NEW";
    }).length;

    // Project API baad me connect hoga.
    const activeProjects = 0;

    // Currently CONVERTED leads ko clients maana jayega.
    const totalClients = contacts.filter(function (c) {
        return getStatus(c) === "CONVERTED";
    }).length;

    if (totalLeadsElement) totalLeadsElement.innerText = totalLeads;
    if (newLeadsElement) newLeadsElement.innerText = newLeads;
    if (activeProjectsElement) activeProjectsElement.innerText = activeProjects;
    if (totalClientsElement) totalClientsElement.innerText = totalClients;
    if (sidebarLeadCountElement) sidebarLeadCountElement.innerText = totalLeads;
}


/* ==========================================================
   9. RENDER LEADS TABLE
   ========================================================== */

function renderContacts(contacts) {
    if (!leadsTableBody) return;

    if (!Array.isArray(contacts) || contacts.length === 0) {
        leadsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="table-loading">
                    <i class="fa-solid fa-inbox"></i>
                    No leads found.
                </td>
            </tr>
        `;

        if (emptyLeadsElement) emptyLeadsElement.style.display = "block";
        renderPagination();
        return;
    }

    if (emptyLeadsElement) emptyLeadsElement.style.display = "none";

    const totalPages = Math.ceil(contacts.length / leadsPerPage);
    if (currentLeadPage < 1) currentLeadPage = 1;
    if (currentLeadPage > totalPages) currentLeadPage = totalPages;

    const startIndex = (currentLeadPage - 1) * leadsPerPage;
    const endIndex = startIndex + leadsPerPage;
    const pageContacts = contacts.slice(startIndex, endIndex);

    leadsTableBody.innerHTML = "";

    pageContacts.forEach(function (contact) {
        const row = document.createElement("tr");

        const id = contact.id ?? "-";
        const status = getStatus(contact);
        const statusClass = status.toLowerCase().replace(/\s+/g, "-");
        const date = formatDate(getContactDate(contact));

        row.innerHTML = `
            <td>#${escapeHtml(id)}</td>
            <td>${escapeHtml(contact.name)}</td>
            <td>${escapeHtml(contact.email)}</td>
            <td>${escapeHtml(contact.phone)}</td>
            <td>${escapeHtml(contact.service)}</td>
            <td>
                <span class="status status-${escapeHtml(statusClass)}">
                    ${escapeHtml(status)}
                </span>
            </td>
            <td>${escapeHtml(date)}</td>
            <td>
                <button type="button" class="view-btn" title="View Lead" onclick="viewLead(${Number(id)})">
                    <i class="fa-solid fa-eye"></i>
                </button>
            </td>
        `;

        leadsTableBody.appendChild(row);
    });

    renderPagination();
}


/* ==========================================================
   10. PAGINATION
   ========================================================== */

function renderPagination() {
    if (!leadPagination || !leadPaginationPages) return;

    const totalItems = filteredContacts.length;
    const totalPages = Math.ceil(totalItems / leadsPerPage);

    if (totalItems === 0 || totalPages <= 1) {
        leadPagination.style.display = totalItems === 0 ? "none" : "flex";
        leadPaginationPages.innerHTML =
            totalItems === 0 ? "" : `<span class="active">1</span>`;

        if (prevLeadPage) prevLeadPage.disabled = true;
        if (nextLeadPage) nextLeadPage.disabled = true;
        return;
    }

    leadPagination.style.display = "flex";

    if (prevLeadPage) prevLeadPage.disabled = currentLeadPage <= 1;
    if (nextLeadPage) nextLeadPage.disabled = currentLeadPage >= totalPages;

    leadPaginationPages.innerHTML = "";

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement("button");
        pageButton.type = "button";
        pageButton.className = "pagination-page";
        if (page === currentLeadPage) pageButton.classList.add("active");
        pageButton.innerText = page;

        pageButton.addEventListener("click", function () {
            goToLeadPage(page);
        });

        leadPaginationPages.appendChild(pageButton);
    }
}

function goToLeadPage(page) {
    const totalPages = Math.ceil(filteredContacts.length / leadsPerPage);

    if (totalPages === 0) {
        currentLeadPage = 1;
        renderContacts(filteredContacts);
        return;
    }

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    currentLeadPage = page;
    renderContacts(filteredContacts);

    if (leadsTableBody) {
        const table = leadsTableBody.closest("table");
        if (table) {
            table.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
}

if (prevLeadPage) {
    prevLeadPage.addEventListener("click", function () {
        if (currentLeadPage > 1) goToLeadPage(currentLeadPage - 1);
    });
}

if (nextLeadPage) {
    nextLeadPage.addEventListener("click", function () {
        const totalPages = Math.ceil(filteredContacts.length / leadsPerPage);
        if (currentLeadPage < totalPages) goToLeadPage(currentLeadPage + 1);
    });
}


/* ==========================================================
   11. SEARCH + FILTER
   ========================================================== */

function filterLeads(resetPage = true) {
    const searchTerm = (leadSearchInput?.value || "").trim().toLowerCase();
    const selectedStatus = leadStatusFilter?.value || "ALL";

    if (resetPage) currentLeadPage = 1;

    filteredContacts = allContacts.filter(function (contact) {
        const name = String(contact.name || "").toLowerCase();
        const email = String(contact.email || "").toLowerCase();
        const phone = String(contact.phone || "").toLowerCase();
        const service = String(contact.service || "").toLowerCase();
        const status = getStatus(contact);

        const matchesSearch =
            !searchTerm ||
            name.includes(searchTerm) ||
            email.includes(searchTerm) ||
            phone.includes(searchTerm) ||
            service.includes(searchTerm);

        const matchesStatus = selectedStatus === "ALL" || status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredContacts.length / leadsPerPage);
    if (totalPages === 0) {
        currentLeadPage = 1;
    } else if (currentLeadPage > totalPages) {
        currentLeadPage = totalPages;
    }

    renderContacts(filteredContacts);
}

if (leadSearchInput) {
    leadSearchInput.addEventListener("input", function () {
        filterLeads(true);
    });
}

if (leadStatusFilter) {
    leadStatusFilter.addEventListener("change", function () {
        filterLeads(true);
    });
}


/* ==========================================================
   12. LOAD CONTACTS FROM BACKEND
   ========================================================== */

async function loadContacts() {
    if (!leadsTableBody) return;

    leadsTableBody.innerHTML = `
        <tr>
            <td colspan="8" class="table-loading">
                <i class="fa-solid fa-spinner fa-spin"></i>
                Loading leads...
            </td>
        </tr>
    `;

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/contacts`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (handleUnauthorized(response)) return;

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const contacts = await response.json();
        allContacts = Array.isArray(contacts) ? contacts : [];

        console.log("Admin contacts:", allContacts);

        updateDashboardStats(allContacts);
        filterLeads(false);

    } catch (error) {
        console.error("Load contacts error:", error);

        leadsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="table-loading">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    Unable to load leads.
                </td>
            </tr>
        `;

        if (leadPagination) leadPagination.style.display = "none";
    }
}


/* ==========================================================
   13. LEAD DETAILS MODAL
   ========================================================== */

function openLeadModal() {
    if (!leadModal) return;
    leadModal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closeLeadModal() {
    if (!leadModal) return;
    leadModal.classList.remove("active");
    document.body.classList.remove("modal-open");
    currentLeadId = null;
}

function fillLeadModal(contact) {
    if (!contact) return;

    currentLeadId = contact.id;

    if (modalLeadId) modalLeadId.innerText = `#${contact.id ?? "-"}`;
    if (modalLeadName) modalLeadName.innerText = contact.name || "-";
    if (modalLeadEmail) modalLeadEmail.innerText = contact.email || "-";
    if (modalLeadPhone) modalLeadPhone.innerText = contact.phone || "-";
    if (modalLeadService) modalLeadService.innerText = contact.service || "-";
    if (modalLeadDate) modalLeadDate.innerText = formatDate(getContactDate(contact));
    if (modalLeadStatus) modalLeadStatus.value = getStatus(contact);
       if (modalLeadMessage) modalLeadMessage.innerText = contact.message || "No message provided.";
    if (modalFollowUpDate) modalFollowUpDate.value = contact.followUpDate ? contact.followUpDate.slice(0, 16) : "";
    if (modalAdminNotes) modalAdminNotes.value = contact.adminNotes || "";
}

async function viewLead(id) {
    if (!id || isNaN(Number(id))) {
        alert("Invalid lead ID.");
        return;
    }

    const leadId = Number(id);
    currentLeadId = leadId;

    openLeadModal();

    if (modalLeadId) modalLeadId.innerText = `#${leadId}`;
    if (modalLeadName) modalLeadName.innerText = "Loading...";
    if (modalLeadEmail) modalLeadEmail.innerText = "Loading...";
    if (modalLeadPhone) modalLeadPhone.innerText = "Loading...";
    if (modalLeadService) modalLeadService.innerText = "Loading...";
    if (modalLeadDate) modalLeadDate.innerText = "Loading...";
    if (modalLeadStatus) modalLeadStatus.value = "NEW";
    if (modalLeadMessage) modalLeadMessage.innerText = "Loading...";

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/contacts/${leadId}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (handleUnauthorized(response)) {
            closeLeadModal();
            return;
        }

        if (!response.ok) {
            throw new Error(`Unable to fetch lead: ${response.status}`);
        }

        const contact = await response.json();
        console.log("Selected lead:", contact);

        fillLeadModal(contact);

    } catch (error) {
        console.error("View lead error:", error);
        closeLeadModal();
        alert("Unable to load lead details.");
    }
}

if (closeLeadModalBtn) {
    closeLeadModalBtn.addEventListener("click", closeLeadModal);
}

if (closeLeadModalBottomBtn) {
    closeLeadModalBottomBtn.addEventListener("click", closeLeadModal);
}

if (leadModal) {
    leadModal.addEventListener("click", function (event) {
        if (event.target === leadModal) closeLeadModal();
    });
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && leadModal && leadModal.classList.contains("active")) {
        closeLeadModal();
    }
});

window.viewLead = viewLead;


/* ==========================================================
   14. UPDATE LEAD STATUS
   ========================================================== */

async function updateLeadStatus(id, status) {
    if (!id || !status) {
        console.warn("Invalid lead ID or status.");
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/contacts/${id}/status`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: String(status).toUpperCase() })
        });

        if (handleUnauthorized(response)) return false;

        if (!response.ok) {
            throw new Error(`Status update failed: ${response.status}`);
        }

        console.log("Lead status updated successfully:", id, status);

        const contact = allContacts.find(function (item) {
            return Number(item.id) === Number(id);
        });
        if (contact) contact.status = String(status).toUpperCase();

        updateDashboardStats(allContacts);
        filterLeads(false);

        return true;

    } catch (error) {
        console.error("Update lead status error:", error);
        alert("Unable to update lead status.");
        return false;
    }
}

if (modalUpdateStatusBtn) {
    modalUpdateStatusBtn.addEventListener("click", async function () {
        if (!currentLeadId) {
            alert("No lead selected.");
            return;
        }

        if (!modalLeadStatus) {
            console.error("Lead status element not found.");
            return;
        }

        const newStatus = String(modalLeadStatus.value || "").trim().toUpperCase();
        if (!newStatus) {
            alert("Please select a valid status.");
            return;
        }

        const originalText = modalUpdateStatusBtn.innerHTML;
        modalUpdateStatusBtn.disabled = true;
        modalUpdateStatusBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Updating...`;

        const success = await updateLeadStatus(currentLeadId, newStatus);

        modalUpdateStatusBtn.disabled = false;
        modalUpdateStatusBtn.innerHTML = originalText;

        if (success) {
            alert("Lead status updated successfully.");
            closeLeadModal();
        }
    });
}

window.updateLeadStatus = updateLeadStatus;

async function saveFollowUp(id, followUpDate, adminNotes) {
    if (!id) {
        console.warn("Invalid lead ID.");
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/contacts/${id}/follow-up`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({
                followUpDate: followUpDate || null,
                adminNotes: adminNotes || ""
            })
        });

        if (handleUnauthorized(response)) return false;

        if (!response.ok) {
            throw new Error(`Follow-up save failed: ${response.status}`);
        }

        const updatedContact = await response.json();

        const contact = allContacts.find(function (item) {
            return Number(item.id) === Number(id);
        });
        if (contact) {
            contact.followUpDate = updatedContact.followUpDate;
            contact.adminNotes = updatedContact.adminNotes;
        }

        return true;

    } catch (error) {
        console.error("Save follow-up error:", error);
        alert("Unable to save follow-up.");
        return false;
    }
}

if (modalSaveFollowUpBtn) {
    modalSaveFollowUpBtn.addEventListener("click", async function () {
        if (!currentLeadId) {
            alert("No lead selected.");
            return;
        }

        const followUpDate = modalFollowUpDate ? modalFollowUpDate.value : "";
        const adminNotes = modalAdminNotes ? modalAdminNotes.value.trim() : "";

        const originalText = modalSaveFollowUpBtn.innerHTML;
        modalSaveFollowUpBtn.disabled = true;
        modalSaveFollowUpBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;

        const success = await saveFollowUp(currentLeadId, followUpDate, adminNotes);

        modalSaveFollowUpBtn.disabled = false;
        modalSaveFollowUpBtn.innerHTML = originalText;

        if (success) {
            alert("Follow-up saved successfully.");
        }
    });
}

window.saveFollowUp = saveFollowUp;


/* ==========================================================
   15. DELETE LEAD
   ========================================================== */

async function deleteLead(id) {
    if (!id || isNaN(id)) {
        alert("Invalid lead ID.");
        return false;
    }

    const leadId = Number(id);
    const confirmed = confirm("Are you sure you want to delete this lead?");
    if (!confirmed) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/contacts/${leadId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (handleUnauthorized(response)) return false;

        if (!response.ok) {
            throw new Error(`Delete failed: ${response.status}`);
        }

        console.log("Lead deleted successfully:", leadId);

        allContacts = allContacts.filter(function (contact) {
            return Number(contact.id) !== leadId;
        });

        updateDashboardStats(allContacts);
        filterLeads(false);
        currentLeadId = null;

        alert("Lead deleted successfully.");
        return true;

    } catch (error) {
        console.error("Delete lead error:", error);
        alert("Unable to delete lead.");
        return false;
    }
}

if (modalDeleteLeadBtn) {
    modalDeleteLeadBtn.addEventListener("click", async function () {
        if (!currentLeadId) {
            alert("No lead selected.");
            return;
        }

        const leadId = Number(currentLeadId);
        const originalText = modalDeleteLeadBtn.innerHTML;

        modalDeleteLeadBtn.disabled = true;
        modalDeleteLeadBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Deleting...`;

        const success = await deleteLead(leadId);

        modalDeleteLeadBtn.disabled = false;
        modalDeleteLeadBtn.innerHTML = originalText;

        if (success) closeLeadModal();
    });
}

window.deleteLead = deleteLead;


/* ==========================================================
   16. REFRESH + LOGOUT
   ========================================================== */

if (refreshLeadsBtn) {
    refreshLeadsBtn.addEventListener("click", async function () {
        const originalText = refreshLeadsBtn.innerHTML;
        refreshLeadsBtn.disabled = true;
        refreshLeadsBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Refreshing...`;

        try {
            await loadContacts();
        } catch (error) {
            console.error("Refresh leads error:", error);
        } finally {
            refreshLeadsBtn.disabled = false;
            refreshLeadsBtn.innerHTML = originalText;
        }
    });
}

function logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");

    currentLeadId = null;
    allContacts = [];
    filteredContacts = [];

    window.location.href = "login.html";
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        const confirmed = confirm("Are you sure you want to logout?");
        if (!confirmed) return;
        logout();
    });
}

window.logout = logout;


/* ==========================================================
   17. INITIAL LOAD + AUTO REFRESH
   ========================================================== */

loadContacts();

const AUTO_REFRESH_INTERVAL = 30000;

const autoRefreshTimer = setInterval(function () {
    if (document.hidden) return;
    loadContacts();
}, AUTO_REFRESH_INTERVAL);

window.addEventListener("beforeunload", function () {
    clearInterval(autoRefreshTimer);
});

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
        loadContacts();
    }
});


/* ==========================================================
   18. MODAL BODY SCROLL LOCK
   ========================================================== */

function handleBodyModalState() {
    if (leadModal && leadModal.classList.contains("active")) {
        document.body.classList.add("modal-open");
    } else {
        document.body.classList.remove("modal-open");
    }
}

if (leadModal) {
    const modalObserver = new MutationObserver(function () {
        handleBodyModalState();
    });

    modalObserver.observe(leadModal, {
        attributes: true,
        attributeFilter: ["class"]
    });
}


/* ==========================================================
   19. SESSION CHECK
   ========================================================== */

function checkAdminSession() {
    const currentToken = localStorage.getItem("adminToken");
    if (!currentToken) {
        window.location.href = "login.html";
        return false;
    }
    return true;
}

checkAdminSession();

console.log("Jangir IT Solution Admin Dashboard JS loaded successfully.");

/* ==========================================================
   END OF FILE
   ========================================================== */