// Dashboard functionality
const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/login';
}

// Navigation between sections
document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', (e) => {
    const section = e.target.dataset.section;
    
    // If no section attribute, it's an external link - let it navigate normally
    if (!section) return;
    
    e.preventDefault();

    document.querySelectorAll('.section').forEach((s) => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach((i) => i.classList.remove('active'));

    const targetSection = document.getElementById(section);
    if (targetSection) {
      targetSection.classList.add('active');
      e.target.classList.add('active');

      // Load data for specific section
      if (section === 'overview') loadOverview();
      else if (section === 'laptops') loadLaptops();
      else if (section === 'plans') loadPlans();
      else if (section === 'payments') loadPayments();
      else if (section === 'claims') loadClaims();
      else if (section === 'profile') loadProfile();
    }
  });
});

// Load initial data
window.addEventListener('load', () => {
  loadOverview();
});

// Fetch with token
async function apiCall(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Load Overview
async function loadOverview() {
  try {
    // Fetch plans and claims stats
    const [plans, payments, claims] = await Promise.all([
      apiCall('/api/plan'),
      apiCall('/api/payment/stats'),
      apiCall('/api/claim/stats'),
    ]);

    const activePlans = plans.filter((p) => p.status === 'active').length;
    const totalCoverage = plans.reduce((sum, p) => sum + (p.coverageAmount || 0), 0);
    const monthlyPayment = plans.reduce((sum, p) => sum + (p.monthlyPremium || 0), 0);

    document.getElementById('activePolicies').textContent = activePlans;
    document.getElementById('totalCoverage').textContent = `ZMW ${totalCoverage.toFixed(2)}`;
    document.getElementById('monthlyPayment').textContent = `ZMW ${monthlyPayment.toFixed(2)}`;
    document.getElementById('claimsStatus').textContent = claims.paid || 0;
  } catch (error) {
    console.error('Error loading overview:', error);
  }
}

// Load Laptops
async function loadLaptops() {
  try {
    const laptops = await apiCall('/api/laptop');

    const html = laptops
      .map(
        (laptop) => `
      <div class="laptop-card">
        <h3>${laptop.brand} ${laptop.model}</h3>
        <p><strong>Serial:</strong> ${laptop.serialNumber}</p>
        <p><strong>Value:</strong> ZMW ${laptop.purchaseValue}</p>
        <p><strong>Status:</strong> <span class="badge badge-${laptop.status}">${laptop.status}</span></p>
        <div class="card-actions">
          <button class="btn btn-sm" onclick="viewLaptop('${laptop._id}')">View</button>
          <button class="btn btn-sm" onclick="selectPlan('${laptop._id}')">Get Plan</button>
          <button class="btn btn-sm btn-danger" onclick="deleteLaptop('${laptop._id}')">Delete</button>
        </div>
      </div>
    `
      )
      .join('');

    document.getElementById('laptopsList').innerHTML = html || '<p>No laptops added yet.</p>';
  } catch (error) {
    console.error('Error loading laptops:', error);
  }
}

// Show Add Laptop Form
function showAddLaptopForm() {
  window.location.href = '/add-laptop';
}

// Select Plan for Laptop
async function selectPlan(laptopId) {
  try {
    const plans = await apiCall(`/api/laptop/${laptopId}/suggested-plans`);

    const form = `
      <form id="selectPlanForm" class="modal-form">
        <h3>Choose Insurance Plan</h3>
        <div class="plan-options">
          ${plans
            .map(
              (plan) => `
            <div class="plan-option">
              <input type="radio" name="planType" value="${plan.type}" required />
              <label>
                <strong>${plan.name}</strong> - ZMW ${plan.monthly.toFixed(2)}/mo
                <p>${plan.description}</p>
                <p>Coverage: $${plan.coverage.toFixed(2)}</p>
              </label>
            </div>
          `
            )
            .join('')}
        </div>
        <button type="submit" class="btn btn-primary">Select Plan</button>
      </form>
    `;

    document.getElementById('modals').innerHTML = form;

    document.getElementById('selectPlanForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const planType = new FormData(e.target).get('planType');

      try {
        const response = await apiCall('/api/plan', {
          method: 'POST',
          body: JSON.stringify({ laptopId, planType }),
        });

        alert('Plan created successfully! Awaiting approval.');
        loadPlans();
        document.getElementById('modals').innerHTML = '';
      } catch (error) {
        alert('Error creating plan: ' + error.message);
      }
    });
  } catch (error) {
    alert('Error loading plans: ' + error.message);
  }
}

// Load Plans
async function loadPlans() {
  try {
    const plans = await apiCall('/api/plan');

    const html = plans
      .map(
        (plan) => `
      <div class="plan-card">
        <h3>${plan.planType.toUpperCase()}</h3>
        <p><strong>Monthly:</strong> $${plan.monthlyPremium.toFixed(2)}</p>
        <p><strong>Coverage:</strong> $${plan.coverageAmount.toFixed(2)}</p>
        <p><strong>Status:</strong> ${plan.status}</p>
        <button class="btn btn-sm" onclick="viewPlanDetails('${plan._id}')">Details</button>
        ${
          plan.status === 'active'
            ? `<button class="btn btn-sm btn-danger" onclick="cancelPlan('${plan._id}')">Cancel</button>`
            : ''
        }
      </div>
    `
      )
      .join('');

    document.getElementById('plansList').innerHTML = html || '<p>No plans yet. Add a laptop to get started!</p>';
  } catch (error) {
    console.error('Error loading plans:', error);
  }
}

// Load Payments
async function loadPayments() {
  try {
    const payments = await apiCall('/api/payment');

    const html = payments
      .map(
        (payment) => `
      <tr>
        <td>${new Date(payment.createdAt).toLocaleDateString()}</td>
        <td>$${payment.amount.toFixed(2)}</td>
        <td>${payment.plan?.planType || 'N/A'}</td>
        <td><span class="badge badge-${payment.status}">${payment.status}</span></td>
        <td>
          ${
            payment.status === 'pending'
              ? `<button class="btn btn-sm" onclick="payNow('${payment._id}')">Pay Now</button>`
              : `<button class="btn btn-sm" onclick="viewReceipt('${payment._id}')">Receipt</button>`
          }
        </td>
      </tr>
    `
      )
      .join('');

    document.getElementById('paymentsBody').innerHTML = html || '<tr><td colspan="5">No payments yet.</td></tr>';
  } catch (error) {
    console.error('Error loading payments:', error);
  }
}

// Load Claims
async function loadClaims() {
  try {
    const claims = await apiCall('/api/claim');

    const html = claims
      .map(
        (claim) => `
      <div class="claim-card">
        <h3>Claim #${claim.claimNumber}</h3>
        <p><strong>Type:</strong> ${claim.claimType}</p>
        <p><strong>Amount:</strong> $${claim.estimatedCost.toFixed(2)}</p>
        <p><strong>Status:</strong> <span class="badge badge-${claim.status}">${claim.status}</span></p>
        <button class="btn btn-sm" onclick="trackClaim('${claim._id}')">Track</button>
      </div>
    `
      )
      .join('');

    document.getElementById('claimsList').innerHTML = html || '<p>No claims yet.</p>';
  } catch (error) {
    console.error('Error loading claims:', error);
  }
}

// Show Submit Claim Form
function showSubmitClaimForm() {
  // First fetch laptops with active plans
  apiCall('/api/laptop')
    .then((laptops) => {
      const form = `
        <form id="submitClaimForm" class="modal-form">
          <h3>Submit Insurance Claim</h3>
          <div class="form-group">
            <label>Select Laptop</label>
            <select name="laptopId" required>
              <option value="">Choose a laptop...</option>
              ${laptops
                .filter((l) => l.status === 'active')
                .map((l) => `<option value="${l._id}">${l.brand} ${l.model}</option>`)
                .join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Claim Type</label>
            <select name="claimType" required>
              <option value="damage">Damage</option>
              <option value="theft">Theft</option>
              <option value="loss">Loss</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>Date of Incident</label>
            <input type="date" name="incidentDate" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description" required maxlength="2000"></textarea>
          </div>
          <div class="form-group">
            <label>Estimated Cost ($)</label>
            <input type="number" name="estimatedCost" required min="0" />
          </div>
          <div class="form-group">
            <label>Evidence (Photos/Documents)</label>
            <input type="file" name="evidence" multiple accept="image/*,application/pdf" />
          </div>
          <button type="submit" class="btn btn-primary">Submit Claim</button>
        </form>
      `;

      document.getElementById('modals').innerHTML = form;

      document.getElementById('submitClaimForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        try {
          const response = await fetch('/api/claim', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          const result = await response.json();
          if (response.ok) {
            alert(`Claim submitted successfully! Claim #: ${result.claimNumber}`);
            loadClaims();
            document.getElementById('modals').innerHTML = '';
          } else {
            alert(result.message);
          }
        } catch (error) {
          alert('Error submitting claim: ' + error.message);
        }
      });
    })
    .catch((error) => alert('Error loading laptops: ' + error.message));
}

// Load Profile
async function loadProfile() {
  try {
    const user = await apiCall('/api/user/me');

    document.getElementById('firstName').value = user.firstName;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;
    document.getElementById('country').value = user.country;
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

// Event listener for profile form
document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  try {
    await apiCall('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    alert('Profile updated successfully!');
  } catch (error) {
    alert('Error updating profile: ' + error.message);
  }
});

// Helper functions
function deleteLaptop(laptopId) {
  if (confirm('Are you sure you want to delete this laptop?')) {
    apiCall(`/api/laptop/${laptopId}`, { method: 'DELETE' })
      .then(() => {
        alert('Laptop deleted successfully!');
        loadLaptops();
      })
      .catch((error) => alert('Error deleting laptop: ' + error.message));
  }
}

function cancelPlan(planId) {
  if (confirm('Are you sure you want to cancel this plan?')) {
    apiCall(`/api/plan/${planId}/cancel`, { method: 'PUT' })
      .then(() => {
        alert('Plan cancelled successfully!');
        loadPlans();
      })
      .catch((error) => alert('Error cancelling plan: ' + error.message));
  }
}

function trackClaim(claimId) {
  apiCall(`/api/claim/track/${claimId}`)
    .then((data) => {
      console.log('Claim Timeline:', data.timeline);
      alert(`Claim Status: ${data.claim.status}\n\nTimeline: ${data.timeline.map((t) => t.description).join(' → ')}`);
    })
    .catch((error) => alert('Error tracking claim: ' + error.message));
}

function payNow(paymentId) {
  alert('Stripe payment integration coming soon! Payment ID: ' + paymentId);
}

function viewReceipt(paymentId) {
  alert('Receipt viewer coming soon! Payment ID: ' + paymentId);
}

function viewLaptop(laptopId) {
  alert('Laptop details viewer coming soon! Laptop ID: ' + laptopId);
}

function viewPlanDetails(planId) {
  alert('Plan details viewer coming soon! Plan ID: ' + planId);
}
