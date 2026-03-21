// Admin panel functionality
const token = localStorage.getItem('token');

// Check admin access
async function checkAdminAccess() {
  try {
    const response = await fetch('/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Admin access check failed:', error);
    window.location.href = '/';
  }
}

// API call helper
async function adminApiCall(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Initialize admin panel
window.addEventListener('load', () => {
  checkAdminAccess();
  loadOverview();

  // Setup navigation
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const page = e.target.dataset.page;

      document.querySelectorAll('.admin-page').forEach((p) => p.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));

      document.getElementById(page).classList.add('active');
      e.target.classList.add('active');

      if (page === 'overview') loadOverview();
      else if (page === 'plans') loadPendingPlans();
      else if (page === 'claims') loadClaimsReview();
      else if (page === 'users') loadUsers();
      else if (page === 'reports') loadReports();
    });
  });
});

// Load Dashboard Overview
async function loadOverview() {
  try {
    const data = await adminApiCall('/admin/dashboard');

    document.getElementById('totalUsers').textContent = data.totalUsers;
    document.getElementById('totalPlans').textContent = data.totalPlans;
    document.getElementById('totalClaims').textContent = data.totalClaims;
    document.getElementById('pendingClaims').textContent = data.pendingClaims;
    document.getElementById('totalRevenue').textContent = `$${data.totalRevenue.toFixed(2)}`;
  } catch (error) {
    console.error('Error loading overview:', error);
  }
}

// Load Pending Plans
async function loadPendingPlans() {
  try {
    const plans = await adminApiCall('/admin/plans/pending');

    const html = `
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Laptop</th>
            <th>Plan Type</th>
            <th>Monthly Premium</th>
            <th>Coverage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${plans
            .map(
              (plan) => `
            <tr>
              <td>${plan.user.firstName} ${plan.user.lastName}</td>
              <td>${plan.laptop.brand} ${plan.laptop.model}</td>
              <td>${plan.planType.toUpperCase()}</td>
              <td>$${plan.monthlyPremium.toFixed(2)}</td>
              <td>$${plan.coverageAmount.toFixed(2)}</td>
              <td>
                <button class="btn btn-sm" onclick="approvePlan('${plan._id}')">Approve</button>
                <button class="btn btn-sm btn-danger" onclick="rejectPlan('${plan._id}')">Reject</button>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

    document.getElementById('pendingPlans').innerHTML = html || '<p>No pending plans</p>';
  } catch (error) {
    console.error('Error loading pending plans:', error);
  }
}

// Approve Plan
function approvePlan(planId) {
  const notes = prompt('Add approval notes (optional):');

  adminApiCall(`/admin/plans/${planId}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ notes }),
  })
    .then(() => {
      alert('Plan approved successfully!');
      loadPendingPlans();
    })
    .catch((error) => alert('Error approving plan: ' + error.message));
}

// Reject Plan
function rejectPlan(planId) {
  const reason = prompt('Reason for rejection:');
  if (!reason) return;

  adminApiCall(`/admin/plans/${planId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  })
    .then(() => {
      alert('Plan rejected successfully!');
      loadPendingPlans();
    })
    .catch((error) => alert('Error rejecting plan: ' + error.message));
}

// Load Claims for Review
async function loadClaimsReview() {
  try {
    const claims = await adminApiCall('/admin/claims/review');

    const html = `
      <table>
        <thead>
          <tr>
            <th>Claim #</th>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${claims
            .map(
              (claim) => `
            <tr>
              <td>${claim.claimNumber}</td>
              <td>${claim.user.firstName} ${claim.user.lastName}</td>
              <td>${claim.claimType}</td>
              <td>$${claim.estimatedCost.toFixed(2)}</td>
              <td>${claim.status}</td>
              <td>
                <button class="btn btn-sm" onclick="approveClaim('${claim._id}')">Approve</button>
                <button class="btn btn-sm btn-danger" onclick="rejectClaim('${claim._id}')">Reject</button>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

    document.getElementById('claimsReview').innerHTML = html || '<p>No claims under review</p>';
  } catch (error) {
    console.error('Error loading claims:', error);
  }
}

// Approve Claim
function approveClaim(claimId) {
  const amount = prompt('Approved amount ($):');
  if (!amount) return;

  adminApiCall(`/admin/claims/${claimId}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ approvedAmount: parseFloat(amount) }),
  })
    .then(() => {
      alert('Claim approved!');
      loadClaimsReview();
    })
    .catch((error) => alert('Error approving claim: ' + error.message));
}

// Reject Claim
function rejectClaim(claimId) {
  const reason = prompt('Reason for rejection:');
  if (!reason) return;

  adminApiCall(`/admin/claims/${claimId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  })
    .then(() => {
      alert('Claim rejected!');
      loadClaimsReview();
    })
    .catch((error) => alert('Error rejecting claim: ' + error.message));
}

// Load Users
async function loadUsers() {
  try {
    const users = await adminApiCall('/admin/users');

    const html = `
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Country</th>
            <th>Joined</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${users
            .map(
              (user) => `
            <tr>
              <td>${user.firstName} ${user.lastName}</td>
              <td>${user.email}</td>
              <td>${user.phone}</td>
              <td>${user.country}</td>
              <td>${new Date(user.createdAt).toLocaleDateString()}</td>
              <td>${user.active ? 'Active' : 'Inactive'}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

    document.getElementById('usersList').innerHTML = html;
  } catch (error) {
    console.error('Error loading users:', error);
  }
}

// Load Reports
async function loadReports() {
  try {
    const [claimsReport, paymentsData] = await Promise.all([
      adminApiCall('/admin/reports/claims'),
      adminApiCall('/admin/reports/payments'),
    ]);

    const html = `
      <div class="report-section">
        <h3>Claims Report</h3>
        <p><strong>Total Claims:</strong> ${claimsReport.total}</p>
        <p><strong>Status Breakdown:</strong></p>
        <ul>
          <li>Submitted: ${claimsReport.byStatus.submitted}</li>
          <li>Under Review: ${claimsReport.byStatus.underReview}</li>
          <li>Approved: ${claimsReport.byStatus.approved}</li>
          <li>Rejected: ${claimsReport.byStatus.rejected}</li>
          <li>Paid: ${claimsReport.byStatus.paid}</li>
        </ul>
        <p><strong>Total Approved Amount:</strong> $${claimsReport.totalApproved.toFixed(2)}</p>
      </div>
    `;

    document.getElementById('reportContent').innerHTML = html;
  } catch (error) {
    console.error('Error loading reports:', error);
  }
}
