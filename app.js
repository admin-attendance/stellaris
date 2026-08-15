const header = document.querySelector('.site-header');
const menuButton = document.getElementById('menuButton');
const drawer = document.getElementById('drawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const drawerClose = document.getElementById('drawerClose');
const bookingModal = document.getElementById('bookingModal');
const bookingOpeners = document.querySelectorAll('[data-open-booking]');
const bookingClosers = document.querySelectorAll('[data-close-booking]');
const bookingTabs = document.querySelectorAll('[data-booking-tab]');
const bookingForm = document.getElementById('bookingForm');
const lookupForm = document.getElementById('lookupForm');
const formMessage = document.getElementById('formMessage');
const lookupMessage = document.getElementById('lookupMessage');
const fromInput = document.getElementById('fromInput');
const toInput = document.getElementById('toInput');
const swapButton = document.getElementById('swapButton');
const departDate = document.getElementById('departDate');
const returnDate = document.getElementById('returnDate');
const returnField = document.getElementById('returnField');

function updateHeader() {
  if (!header || document.body.dataset.page === 'fleets') return;
  header.classList.toggle('scrolled', window.scrollY > 24);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

function openDrawer() {
  if (!drawer || !drawerBackdrop || !menuButton) return;
  drawerBackdrop.hidden = false;
  requestAnimationFrame(() => drawer.classList.add('open'));
  drawer.setAttribute('aria-hidden', 'false');
  menuButton.classList.add('active');
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', '메뉴 닫기');
  document.body.classList.add('drawer-open');
}

function closeDrawer() {
  if (!drawer || !drawerBackdrop || !menuButton) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '메뉴 열기');
  document.body.classList.remove('drawer-open');
  window.setTimeout(() => { drawerBackdrop.hidden = true; }, 260);
}

menuButton?.addEventListener('click', () => {
  if (drawer?.classList.contains('open')) closeDrawer();
  else openDrawer();
});
drawerClose?.addEventListener('click', closeDrawer);
drawerBackdrop?.addEventListener('click', closeDrawer);
drawer?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeDrawer));

function openBooking() {
  if (!bookingModal) return;
  closeDrawer();
  bookingModal.hidden = false;
  document.body.classList.add('modal-open');
  window.setTimeout(() => bookingModal.querySelector('.modal-close')?.focus(), 30);
}

function closeBooking() {
  if (!bookingModal) return;
  bookingModal.hidden = true;
  document.body.classList.remove('modal-open');
}

bookingOpeners.forEach((button) => button.addEventListener('click', openBooking));
bookingClosers.forEach((button) => button.addEventListener('click', closeBooking));

function setBookingMode(mode) {
  bookingTabs.forEach((tab) => {
    const selected = tab.dataset.bookingTab === mode;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });

  const lookup = mode === 'lookup';
  if (bookingForm) bookingForm.hidden = lookup;
  if (lookupForm) lookupForm.hidden = !lookup;

  if (!lookup && returnField && returnDate) {
    const oneWay = mode === 'oneway';
    returnField.hidden = oneWay;
    returnDate.required = !oneWay;
  }
}

bookingTabs.forEach((tab) => {
  tab.addEventListener('click', () => setBookingMode(tab.dataset.bookingTab));
});

swapButton?.addEventListener('click', () => {
  if (!fromInput || !toInput) return;
  const current = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = current;
});

function dateValue(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

if (departDate && returnDate) {
  const today = new Date();
  const departure = new Date(today);
  departure.setDate(today.getDate() + 14);
  const returning = new Date(today);
  returning.setDate(today.getDate() + 19);

  departDate.min = dateValue(today);
  returnDate.min = dateValue(today);
  departDate.value = dateValue(departure);
  returnDate.value = dateValue(returning);

  departDate.addEventListener('change', () => {
    returnDate.min = departDate.value || dateValue(today);
    if (returnDate.value && returnDate.value < returnDate.min) returnDate.value = returnDate.min;
  });
}

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const mode = document.querySelector('[data-booking-tab].active')?.dataset.bookingTab;
  const trip = mode === 'oneway' ? '편도' : '왕복';
  if (formMessage) formMessage.textContent = `${fromInput?.value || ''} → ${toInput?.value || ''} · ${trip} 검색 기능을 연결할 준비가 되어 있습니다.`;
});

lookupForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (lookupMessage) lookupMessage.textContent = '예약 조회 시스템을 연결할 준비가 되어 있습니다.';
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (bookingModal && !bookingModal.hidden) closeBooking();
  else if (drawer?.classList.contains('open')) closeDrawer();
});

const revealTargets = document.querySelectorAll('.destination-card, .experience-list article, .fleet-card-large');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(18px)';
    element.style.transition = 'opacity .55s ease, transform .55s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((element) => observer.observe(element));
}