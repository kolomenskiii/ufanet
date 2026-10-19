const video = document.querySelector('.hero__video');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (video) {
  const showVideo = () => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !video.paused) {
      video.classList.add('is-ready');
    }
  };

  video.addEventListener('playing', showVideo);
  video.addEventListener('loadeddata', showVideo);
  video.addEventListener('error', () => video.classList.remove('is-ready'));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.pause();
  } else {
    showVideo();
    video.play().then(showVideo).catch(() => {});
  }
}

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
    mobileNav.hidden = isOpen;
  });
}

const coverageForm = document.querySelector('#coverage-form');
if (coverageForm) {
  const address = document.querySelector('#coverage-address');
  const phone = document.querySelector('#coverage-phone');
  const status = document.querySelector('#coverage-status');

  const phoneDigits = () => phone.value.replace(/\D/g, '');

  phone.addEventListener('input', () => {
    let digits = phoneDigits();
    if (!digits) return;
    if (digits[0] === '8') digits = '7' + digits.slice(1);
    if (digits[0] !== '7') digits = '7' + digits;
    digits = digits.slice(0, 11);
    const local = digits.slice(1);
    phone.value = '+7' +
      (local.length ? ' (' + local.slice(0, 3) : '') +
      (local.length >= 3 ? ')' : '') +
      (local.length > 3 ? ' ' + local.slice(3, 6) : '') +
      (local.length > 6 ? '-' + local.slice(6, 8) : '') +
      (local.length > 8 ? '-' + local.slice(8, 10) : '');
    phone.setCustomValidity('');
    phone.removeAttribute('aria-invalid');
    status.hidden = true;
  });

  address.addEventListener('input', () => {
    address.setCustomValidity('');
    address.removeAttribute('aria-invalid');
    status.hidden = true;
  });

  coverageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    address.value = address.value.trim();
    address.setCustomValidity(address.value.length >= 6 ? '' : 'Укажите улицу и номер дома.');
    phone.setCustomValidity(phoneDigits().length === 11 ? '' : 'Введите номер телефона полностью.');
    address.toggleAttribute('aria-invalid', !address.validity.valid);
    phone.toggleAttribute('aria-invalid', !phone.validity.valid);
    status.hidden = true;
    if (!coverageForm.reportValidity()) return;
    status.hidden = false;
  });
}

const tariffGrids = document.querySelectorAll('.tariffs__grid[data-source]');
if (tariffGrids.length) {
  const money = (amount) => new Intl.NumberFormat('ru-RU').format(amount);
  const globeIcon = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="1.8"/><path d="M4 16h24M16 4c3.7 3.2 5.5 7.2 5.5 12S19.7 24.8 16 28M16 4c-3.7 3.2-5.5 7.2-5.5 12S12.3 24.8 16 28" stroke="currentColor" stroke-width="1.8"/></svg>';
  const tvIcon = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="4" y="8" width="24" height="19" rx="5" stroke="currentColor" stroke-width="1.8"/><path d="m11 4 5 4 5-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const routerIcon = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="4" y="18" width="24" height="8" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M9 18v-4m14 4v-4M10 11a8 8 0 0 1 12 0M13 14a4 4 0 0 1 6 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="22" r="1" fill="currentColor"/></svg>';

  const renderTariff = (tariff, grid) => {
    const service = grid.dataset.service;
    const hasTelevision = Number.isFinite(tariff.channels);
    const card = document.createElement('article');
    card.className = 'tariff-card';
    card.id = grid.id + '-' + tariff.id;
    card.innerHTML = `
      <div class="tariff-card__top">
        <div class="tariff-card__brand"></div>
        <h3 class="tariff-card__name"></h3>
      </div>
      <div class="tariff-card__features">
        <div class="tariff-card__feature"><span class="tariff-card__icon">${globeIcon}</span><div><strong class="tariff-card__speed"></strong><span>Домашний интернет</span></div></div>
        ${hasTelevision ? `<div class="tariff-card__feature"><span class="tariff-card__icon">${tvIcon}</span><div><strong class="tariff-card__channels"></strong><span>Цифровое ТВ</span></div></div>` : ''}
      </div>
      <div class="tariff-card__router">
        <span class="tariff-card__router-icon">${routerIcon}</span>
        <div class="tariff-card__router-copy"><strong>Wi-Fi роутер</strong><span class="tariff-card__router-label"></span></div>
        <label class="tariff-card__switch"><input type="checkbox" aria-label="Добавить Wi-Fi роутер"><span aria-hidden="true"></span></label>
      </div>
      <div class="tariff-card__pricing">
        <div class="tariff-card__price-line"><s class="tariff-card__old-price"></s><strong class="tariff-card__price"></strong><span class="tariff-card__period">₽/мес</span></div>
        <p class="tariff-card__promo"></p>
        <p class="tariff-card__router-price" aria-live="polite"></p>
      </div>
      <a class="tariff-card__action" href="#check-address">Подключить <span aria-hidden="true">↗</span></a>
    `;

    card.querySelector('.tariff-card__brand').textContent = service;
    card.querySelector('.tariff-card__name').textContent = tariff.name;

    const speed = card.querySelector('.tariff-card__speed');
    speed.append(document.createTextNode(tariff.speed + ' '));
    const speedUnit = document.createElement('small');
    speedUnit.textContent = tariff.speedUnit;
    speed.append(speedUnit);

    if (hasTelevision) {
      const channels = card.querySelector('.tariff-card__channels');
      channels.append(document.createTextNode(tariff.channels + ' '));
      const channelsUnit = document.createElement('small');
      channelsUnit.textContent = 'каналов';
      channels.append(channelsUnit);
    }

    card.querySelector('.tariff-card__router-label').textContent = tariff.router.label;
    card.querySelector('.tariff-card__price').textContent = tariff.firstMonthPrice === 0 ? '0' : money(tariff.monthlyPrice);

    const oldPrice = card.querySelector('.tariff-card__old-price');
    const promo = card.querySelector('.tariff-card__promo');
    if (tariff.firstMonthPrice === 0) {
      card.classList.add('tariff-card--promo');
      oldPrice.textContent = money(tariff.monthlyPrice);
      promo.textContent = tariff.priceNote ?? '1-й месяц бесплатно';
    } else {
      oldPrice.hidden = true;
      promo.textContent = tariff.priceNote ?? 'Ежемесячная плата';
      promo.hidden = promo.textContent === '';
    }

    const routerSwitch = card.querySelector('.tariff-card__switch input');
    const routerPrice = card.querySelector('.tariff-card__router-price');
    routerSwitch.addEventListener('change', () => {
      if (!routerSwitch.checked) {
        routerPrice.textContent = '';
        return;
      }
      if (tariff.router.type === 'purchase') {
        routerPrice.textContent = `Роутер: ${money(tariff.router.price)} ₽ при покупке.`;
        return;
      }
      routerPrice.textContent = tariff.firstMonthPrice === 0
        ? `С роутером: ${money(tariff.router.price)} ₽ в первый месяц, далее ${money(tariff.monthlyPrice + tariff.router.price)} ₽/мес.`
        : `С роутером: ${money(tariff.monthlyPrice + tariff.router.price)} ₽/мес.`;
    });

    card.querySelector('.tariff-card__action').addEventListener('click', () => {
      let selected = document.querySelector('#selected-tariff');
      if (!selected) {
        selected = document.createElement('p');
        selected.id = 'selected-tariff';
        selected.className = 'coverage__selected';
        document.querySelector('.coverage__panel').prepend(selected);
      }
      selected.textContent = `Выбран тариф «${service} ${tariff.name}»${routerSwitch.checked ? ' с Wi-Fi роутером' : ''}.`;
    });

    return card;
  };

  tariffGrids.forEach((grid) => {
    fetch(grid.dataset.source)
      .then((response) => {
        if (!response.ok) throw new Error('Tariffs unavailable');
        return response.json();
      })
      .then((tariffs) => {
        grid.replaceChildren(...tariffs.map((tariff) => renderTariff(tariff, grid)));
      })
      .catch(() => {
        const error = grid.parentElement.querySelector('.tariffs__error');
        if (error) error.hidden = false;
      });
  });
}