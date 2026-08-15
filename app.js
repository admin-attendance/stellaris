const header = document.querySelector('.site-header');
const menuButton = document.getElementById('menuButton');
const mobileMenu = document.getElementById('mobileMenu');
const swapButton = document.getElementById('swapButton');
const fromInput = document.getElementById('fromInput');
const toInput = document.getElementById('toInput');
const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');
const departDate = document.getElementById('departDate');
const returnDate = document.getElementById('returnDate');
const returnField = document.getElementById('returnField');
const tripTabs = document.querySelectorAll('.trip-tab');
const newsletterForm = document.getElementById('newsletterForm');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 18);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? '메뉴 열기' : '메뉴 닫기');
  menuButton.classList.toggle('active', !open);
  mobileMenu.hidden = open;
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '메뉴 열기');
    menuButton.classList.remove('active');
  });
});

swapButton?.addEventListener('click', () => {
  const temp = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = temp;
});

const today = new Date();
const twoWeeks = new Date(today);
twoWeeks.setDate(today.getDate() + 14);
const nineteenDays = new Date(today);
nineteenDays.setDate(today.getDate() + 19);

function toDateInputValue(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

departDate.min = toDateInputValue(today);
returnDate.min = toDateInputValue(today);
departDate.value = toDateInputValue(twoWeeks);
returnDate.value = toDateInputValue(nineteenDays);

departDate.addEventListener('change', () => {
  returnDate.min = departDate.value || toDateInputValue(today);
  if (returnDate.value && returnDate.value < returnDate.min) {
    returnDate.value = returnDate.min;
  }
});

tripTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tripTabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
    });

    const isOneWay = tab.dataset.trip === 'oneway';
    returnField.style.display = isOneWay ? 'none' : '';
    returnDate.required = !isOneWay;
  });
});

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const activeTrip = document.querySelector('.trip-tab.active')?.dataset.trip;
  const tripText = activeTrip === 'oneway' ? '편도' : '왕복';
  formMessage.textContent = `${fromInput.value} → ${toInput.value} · ${tripText} 검색 화면을 연결할 수 있습니다. 현재는 디자인 데모입니다.`;
});

newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.getElementById('emailInput');
  const button = newsletterForm.querySelector('button');
  if (!input.value) return;
  button.textContent = '구독 완료';
  button.disabled = true;
  input.disabled = true;
});

const revealTargets = document.querySelectorAll('.destination-card, .mini-card, .fleet-card');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease, box-shadow .25s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealTargets.forEach((el) => observer.observe(el));
}
