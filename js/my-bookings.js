document.addEventListener('DOMContentLoaded', () => {
  // Tabs logic
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const panelId = tab.getAttribute('aria-controls');
      document.getElementById(panelId).classList.add('active');
    });
  });

  // Modal logic
  const modal = document.getElementById('cancel-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const btnConfirmCancel = document.getElementById('btn-confirm-cancel');
  let currentCancelBtn = null;
  let currentBookingId = null;

  const closeModal = () => {
    modal.classList.add('hidden');
    if (currentCancelBtn) {
      currentCancelBtn.focus();
    }
  };

  btnCloseModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Data fetching and rendering
  const upcomingGrid = document.getElementById('upcoming-grid');
  const pastGrid = document.getElementById('past-grid');
  const upcomingState = document.getElementById('upcoming-state');
  const pastState = document.getElementById('past-state');
  const tabUpcoming = document.getElementById('tab-upcoming');
  const tabPast = document.getElementById('tab-past');
  const messageContainer = document.getElementById('message-container');

  const showError = (msg) => {
    messageContainer.innerHTML = '';
    const errDiv = document.createElement('div');
    errDiv.className = 'message-error';
    errDiv.textContent = msg;
    messageContainer.appendChild(errDiv);
  };
  const clearError = () => {
    messageContainer.innerHTML = '';
  };

  const loadUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.status === 401) {
        window.location.href = 'index.html';
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data.rollNumber) {
          document.getElementById('header-roll-badge').textContent = `Roll: ${data.data.rollNumber}`;
        }
      }
    } catch (e) {
      console.error('Auth error', e);
    }
  };

  const loadBookings = async () => {
    try {
      clearError();
      upcomingState.style.display = 'block';
      upcomingGrid.style.display = 'none';
      pastState.style.display = 'block';
      pastGrid.style.display = 'none';
      upcomingState.textContent = 'Loading...';
      pastState.textContent = 'Loading...';

      const res = await fetch('/api/bookings/me');
      if (res.status === 401) {
        window.location.href = 'index.html';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const json = await res.json();

      const bookings = json.data || [];
      processBookings(bookings);
    } catch (error) {
      upcomingState.innerHTML = '';
      const errDiv = document.createElement('div');
      errDiv.className = 'empty-state';
      errDiv.textContent = 'Error loading bookings. ';
      const retryBtn = document.createElement('button');
      retryBtn.textContent = 'Retry';
      retryBtn.onclick = () => window.location.reload();
      errDiv.appendChild(retryBtn);
      upcomingState.appendChild(errDiv);

      pastState.innerHTML = '';
      const pastErrDiv = document.createElement('div');
      pastErrDiv.className = 'empty-state';
      pastErrDiv.textContent = 'Error loading bookings. ';
      const pastRetryBtn = document.createElement('button');
      pastRetryBtn.textContent = 'Retry';
      pastRetryBtn.onclick = () => window.location.reload();
      pastErrDiv.appendChild(pastRetryBtn);
      pastState.appendChild(pastErrDiv);

      showError(error.message);
    }
  };

  const processBookings = (bookings) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const currentHour = today.getHours();
    const currentMin = today.getMinutes();
    const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

    const upcoming = [];
    const past = [];

    bookings.forEach(b => {
      if (b.status === 'cancelled') {
        past.push(b);
        return;
      }

      if (b.date > todayStr) {
        upcoming.push(b);
      } else if (b.date === todayStr) {
        const slotEnd = b.slot.split('-')[1]; // e.g. "10:30"
        if (slotEnd > currentTimeStr) {
          upcoming.push(b);
        } else {
          past.push(b);
        }
      } else {
        past.push(b);
      }
    });

    upcoming.sort((a, b) => {
      if (a.date === b.date) return a.slot.localeCompare(b.slot);
      return a.date.localeCompare(b.date);
    });

    past.sort((a, b) => {
      if (a.date === b.date) return b.slot.localeCompare(a.slot);
      return b.date.localeCompare(a.date);
    });

    tabUpcoming.textContent = `Upcoming (${upcoming.length})`;
    tabPast.textContent = `Past (${past.length})`;

    renderGrid(upcoming, upcomingGrid, upcomingState, true);
    renderGrid(past, pastGrid, pastState, false);
  };

  const renderGrid = (bookings, gridEl, stateEl, isUpcoming) => {
    if (bookings.length === 0) {
      gridEl.style.display = 'none';
      stateEl.style.display = 'block';
      stateEl.innerHTML = '';
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'empty-state';
      emptyDiv.textContent = `No ${isUpcoming ? 'upcoming' : 'past'} bookings. `;
      const br = document.createElement('br');
      const a = document.createElement('a');
      a.href = 'catalog.html';
      a.textContent = 'Browse equipment';
      emptyDiv.appendChild(br);
      emptyDiv.appendChild(a);
      stateEl.appendChild(emptyDiv);
      return;
    }

    stateEl.style.display = 'none';
    gridEl.style.display = 'grid';
    gridEl.innerHTML = '';

    bookings.forEach(b => {
      const article = document.createElement('article');
      article.className = 'equipment-card booking-card';

      const wing = b.equipment?.lab?.wing || '';
      if (wing.includes('SOET')) article.classList.add('cat-soet');
      else if (wing.includes('Maker')) article.classList.add('cat-maker');
      else if (wing.includes('Robotics')) article.classList.add('cat-robotics');
      else if (wing.includes('IoT')) article.classList.add('cat-iot');

      const dateObj = new Date(b.date);
      const readableDate = dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
      const statusClass = b.status.toLowerCase();

      const cardTop = document.createElement('div');
      cardTop.className = 'card-top';
      const h3 = document.createElement('h3');
      h3.textContent = b.equipment?.name || 'Unknown Equipment';
      const spanStatus = document.createElement('span');
      spanStatus.className = `status-pill ${statusClass}`;
      spanStatus.textContent = b.status.toUpperCase();
      cardTop.appendChild(h3);
      cardTop.appendChild(spanStatus);

      const pLocation = document.createElement('p');
      pLocation.className = 'card-location';
      pLocation.textContent = `📍 ${b.equipment?.lab?.name || 'Unknown Lab'} - ${wing} • ID: ${b.equipment?.equipmentId || 'N/A'}`;

      const bookingDetails = document.createElement('div');
      bookingDetails.className = 'booking-details';

      const dateItem = document.createElement('div');
      dateItem.className = 'booking-detail-item';
      const dateLabel = document.createElement('span');
      dateLabel.className = 'booking-detail-label';
      dateLabel.textContent = 'Date: ';
      dateItem.appendChild(dateLabel);
      dateItem.append(readableDate);

      const timeItem = document.createElement('div');
      timeItem.className = 'booking-detail-item';
      const timeLabel = document.createElement('span');
      timeLabel.className = 'booking-detail-label';
      timeLabel.textContent = 'Time: ';
      timeItem.appendChild(timeLabel);
      timeItem.append(b.slot.replace('-', ' - '));

      bookingDetails.appendChild(dateItem);
      bookingDetails.appendChild(timeItem);

      article.appendChild(cardTop);
      article.appendChild(pLocation);
      article.appendChild(bookingDetails);

      if (isUpcoming && b.status !== 'cancelled') {
        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn-cancel-booking';
        btnCancel.setAttribute('data-id', b._id);
        btnCancel.setAttribute('data-name', b.equipment?.name || '');
        btnCancel.setAttribute('data-date', readableDate);
        btnCancel.setAttribute('data-slot', b.slot);
        btnCancel.textContent = 'Cancel Booking';
        article.appendChild(btnCancel);
      }

      gridEl.appendChild(article);
    });

    if (isUpcoming) {
      const cancelBtns = gridEl.querySelectorAll('.btn-cancel-booking');
      cancelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          currentCancelBtn = e.target;
          currentBookingId = btn.getAttribute('data-id');
          document.getElementById('cancel-equipment-name').textContent = btn.getAttribute('data-name');
          document.getElementById('cancel-date-slot').textContent = `${btn.getAttribute('data-date')} (${btn.getAttribute('data-slot')})`;

          modal.classList.remove('hidden');
          btnConfirmCancel.focus();
        });
      });
    }
  };

  btnConfirmCancel.addEventListener('click', async () => {
    if (!currentBookingId) return;

    btnConfirmCancel.disabled = true;
    btnConfirmCancel.textContent = 'Cancelling...';
    clearError();

    try {
      const res = await fetch(`/api/bookings/${currentBookingId}`, {
        method: 'DELETE'
      });

      if (res.status === 401) {
        window.location.href = 'index.html';
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        closeModal();
        await loadBookings();
      } else {
        showError(data.message || 'Failed to cancel booking');
        closeModal();
      }
    } catch (e) {
      showError('Network error. Please try again.');
      closeModal();
    } finally {
      btnConfirmCancel.disabled = false;
      btnConfirmCancel.textContent = 'Yes, Cancel';
    }
  });

  loadUser();
  loadBookings();
});
