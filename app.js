const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileNav = document.getElementById('mobileNav');

mobileMenuButton?.addEventListener('click', () => {
  const open = mobileMenuButton.getAttribute('aria-expanded') === 'true';
  mobileMenuButton.setAttribute('aria-expanded', String(!open));
  mobileMenuButton.setAttribute('aria-label', open ? '메뉴 열기' : '메뉴 닫기');
  if (mobileNav) mobileNav.hidden = open;
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.hidden = true;
    mobileMenuButton?.setAttribute('aria-expanded', 'false');
  });
});

const bookingTabs = document.querySelectorAll('[data-booking-tab]');
const flightPanel = document.querySelector('[data-panel="flight"]');
const lookupPanel = document.querySelector('[data-panel="lookup"]');
const returnField = document.getElementById('returnField');
const returnDate = document.getElementById('returnDate');
const departDate = document.getElementById('departDate');
const swapButton = document.getElementById('swapButton');
const fromInput = document.getElementById('fromInput');
const toInput = document.getElementById('toInput');
const bookingForm = document.getElementById('bookingForm');
const lookupForm = document.getElementById('lookupForm');
const formMessage = document.getElementById('formMessage');
const lookupMessage = document.getElementById('lookupMessage');

function dateValue(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

if (departDate && returnDate) {
  const today = new Date();
  const depart = new Date(today); depart.setDate(today.getDate() + 14);
  const back = new Date(today); back.setDate(today.getDate() + 19);
  departDate.min = dateValue(today);
  returnDate.min = dateValue(today);
  departDate.value = dateValue(depart);
  returnDate.value = dateValue(back);
  departDate.addEventListener('change', () => {
    returnDate.min = departDate.value || dateValue(today);
    if (returnDate.value && returnDate.value < returnDate.min) returnDate.value = returnDate.min;
  });
}

bookingTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    bookingTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    const mode = tab.dataset.bookingTab;
    if (mode === 'lookup') {
      if (flightPanel) flightPanel.hidden = true;
      if (lookupPanel) lookupPanel.hidden = false;
      return;
    }
    if (flightPanel) flightPanel.hidden = false;
    if (lookupPanel) lookupPanel.hidden = true;
    const oneWay = mode === 'oneway';
    if (returnField) returnField.hidden = oneWay;
    if (returnDate) returnDate.required = !oneWay;
  });
});

swapButton?.addEventListener('click', () => {
  if (!fromInput || !toInput) return;
  const temp = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = temp;
});

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (formMessage) formMessage.textContent = '현재 예약 페이지는 UI 데모입니다. 실제 예약 엔진은 추후 연결할 수 있습니다.';
});

lookupForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (lookupMessage) lookupMessage.textContent = '현재 예약 조회는 UI 데모입니다.';
});
