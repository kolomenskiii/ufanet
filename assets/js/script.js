const video = document.querySelector('.hero__video');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const applicationModal = document.querySelector('#application-modal');
const applicationForm = document.querySelector('#application-form');

const cityGroups = [
  { region: 'Республика Башкортостан', cities: 'Белебей|Белорецк|Бирск|Благовещенск|Дюртюли|Ишимбай|Кумертау|Мелеуз|Нефтекамск|Октябрьский|Салават|Сибай|Стерлитамак|Туймазы|Уфа|Янаул'.split('|') },
  { region: 'Московская область', cities: 'Балашиха|Волоколамск|Дмитров|Домодедово|Егорьевск|Звенигород|Истра|Коломна|Красногорск|Люберцы|Можайск|Москва|Наро-Фоминск|Одинцово|Подольск|Пушкино|Раменское|Солнечногорск|Чехов|Шатура|Щелково|Электросталь'.split('|') },
  { region: 'Оренбургская область', cities: 'Бугуруслан|Бузулук|Гай|Кувандык|Оренбург|Орск|Соль-Илецк|Сорочинск'.split('|') },
  { region: 'Нижегородская область', cities: 'Бор|Выкса|Нижний Новгород'.split('|') },
  { region: 'Рязанская область', cities: 'Касимов|Рязань|Скопин'.split('|') },
  { region: 'Республика Татарстан', cities: ['Казань'] },
  { region: 'Республика Марий Эл', cities: ['Йошкар-Ола'] }
];

const cityPrepositional = {
  'Белебей': 'Белебее',
  'Белорецк': 'Белорецке',
  'Бирск': 'Бирске',
  'Благовещенск': 'Благовещенске',
  'Дюртюли': 'Дюртюлях',
  'Ишимбай': 'Ишимбае',
  'Кумертау': 'Кумертау',
  'Мелеуз': 'Мелеузе',
  'Нефтекамск': 'Нефтекамске',
  'Октябрьский': 'Октябрьском',
  'Салават': 'Салавате',
  'Сибай': 'Сибае',
  'Стерлитамак': 'Стерлитамаке',
  'Туймазы': 'Туймазах',
  'Уфа': 'Уфе',
  'Янаул': 'Янауле',
  'Балашиха': 'Балашихе',
  'Волоколамск': 'Волоколамске',
  'Дмитров': 'Дмитрове',
  'Домодедово': 'Домодедове',
  'Егорьевск': 'Егорьевске',
  'Звенигород': 'Звенигороде',
  'Истра': 'Истре',
  'Коломна': 'Коломне',
  'Красногорск': 'Красногорске',
  'Люберцы': 'Люберцах',
  'Можайск': 'Можайске',
  'Москва': 'Москве',
  'Наро-Фоминск': 'Наро-Фоминске',
  'Одинцово': 'Одинцове',
  'Подольск': 'Подольске',
  'Пушкино': 'Пушкине',
  'Раменское': 'Раменском',
  'Солнечногорск': 'Солнечногорске',
  'Чехов': 'Чехове',
  'Шатура': 'Шатуре',
  'Щелково': 'Щелкове',
  'Электросталь': 'Электростали',
  'Бугуруслан': 'Бугуруслане',
  'Бузулук': 'Бузулуке',
  'Гай': 'Гае',
  'Кувандык': 'Кувандыке',
  'Оренбург': 'Оренбурге',
  'Орск': 'Орске',
  'Соль-Илецк': 'Соль-Илецке',
  'Сорочинск': 'Сорочинске',
  'Бор': 'Бору',
  'Выкса': 'Выксе',
  'Нижний Новгород': 'Нижнем Новгороде',
  'Касимов': 'Касимове',
  'Рязань': 'Рязани',
  'Скопин': 'Скопине',
  'Казань': 'Казани',
  'Йошкар-Ола': 'Йошкар-Оле'
};

const cityPicker = document.querySelector('.city-picker');
if (cityPicker) {
  const toggle = cityPicker.querySelector('#city-toggle');
  const panel = cityPicker.querySelector('#city-panel');
  const search = cityPicker.querySelector('#city-search');
  const regions = cityPicker.querySelector('#city-regions');
  const results = cityPicker.querySelector('#city-results');
  const empty = cityPicker.querySelector('#city-empty');
  const cityName = cityPicker.querySelector('#current-city');
  const heroCity = document.querySelector('#hero-city');
  const formCity = document.querySelector('#application-city');
  const allCities = cityGroups.flatMap((group) => group.cities.map((name) => ({ name, region: group.region })));
  let currentCity = 'Уфа';

  function closeCityPanel(restoreFocus = false) {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    search.value = '';
    results.hidden = true;
    empty.hidden = true;
    regions.hidden = false;
    regions.querySelectorAll('details').forEach((item) => { item.open = false; });
    if (restoreFocus) toggle.focus();
  }

  function setCity(name, updateUrl = false) {
    const selected = allCities.find((city) => city.name === name);
    if (!selected) return;
    currentCity = selected.name;
    cityName.textContent = selected.name;
    toggle.setAttribute('aria-label', `Выбрать город, сейчас ${selected.name}`);
    if (heroCity) heroCity.textContent = `в ${cityPrepositional[selected.name]}`;
    if (formCity) formCity.value = selected.name;
    document.documentElement.dataset.city = selected.name;
    document.documentElement.dataset.region = selected.region;
    cityPicker.querySelectorAll('.city-option').forEach((button) => {
      button.setAttribute('aria-current', String(button.dataset.city === selected.name));
    });
    try { localStorage.setItem('ufanet-city', selected.name); } catch (_) { /* Storage may be unavailable. */ }
    if (updateUrl && new URLSearchParams(location.search).get('city') !== selected.name) {
      const url = new URL(window.location.href);
      url.searchParams.set('city', selected.name);
      history.pushState({ city: selected.name }, '', url);
    }
    window.dispatchEvent(new CustomEvent('citychange', { detail: { city: selected.name, region: selected.region } }));
  }

  function makeCityButton(city) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'city-option';
    button.dataset.city = city.name;
    button.textContent = city.name;
    button.setAttribute('aria-current', String(city.name === currentCity));
    button.addEventListener('click', () => {
      setCity(city.name, true);
      closeCityPanel(true);
    });
    return button;
  }

  cityGroups.forEach((group) => {
    const item = document.createElement('details');
    item.className = 'city-region';
    const summary = document.createElement('summary');
    summary.append(document.createTextNode(group.region));
    const count = document.createElement('span');
    count.className = 'city-region__count';
    count.textContent = group.cities.length;
    const countWord = group.cities.length === 1 ? 'город' : group.cities.length < 5 ? 'города' : 'городов';
    count.setAttribute('aria-label', `${group.cities.length} ${countWord}`);
    summary.append(count);
    const list = document.createElement('div');
    list.className = 'city-region__cities';
    list.append(...group.cities.map((name) => makeCityButton({ name, region: group.region })));
    item.append(summary, list);
    item.addEventListener('toggle', () => {
      if (item.open) regions.querySelectorAll('details').forEach((other) => { if (other !== item) other.open = false; });
    });
    regions.append(item);
  });

  const normalize = (value) => value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
  search.addEventListener('input', () => {
    const query = normalize(search.value);
    regions.hidden = Boolean(query);
    results.hidden = !query;
    if (!query) {
      results.replaceChildren();
      empty.hidden = true;
      return;
    }
    const matches = allCities.filter((city) => normalize(city.name).includes(query));
    results.replaceChildren(...matches.map(makeCityButton));
    empty.hidden = matches.length > 0;
  });

  toggle.addEventListener('click', () => {
    if (!panel.hidden) { closeCityPanel(); return; }
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (mobileNav && menuButton) {
      mobileNav.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Открыть меню');
    }
  });
  cityPicker.querySelector('.city-panel__close').addEventListener('click', () => closeCityPanel(true));
  document.addEventListener('click', (event) => { if (!cityPicker.contains(event.target)) closeCityPanel(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); closeCityPanel(true); }
  });
  window.addEventListener('popstate', () => setCity(new URLSearchParams(location.search).get('city') || 'Уфа'));
  let savedCity = null;
  try { savedCity = localStorage.getItem('ufanet-city'); } catch (_) { /* Storage may be unavailable. */ }
  setCity(new URLSearchParams(location.search).get('city') || savedCity || 'Уфа');
}

function openApplicationModal(values = {}) {
  if (!applicationModal || !applicationForm) return;
  const name = applicationForm.querySelector('#application-name');
  const phone = applicationForm.querySelector('#application-phone');
  const address = applicationForm.querySelector('#application-address');
  const consent = applicationForm.querySelector('#application-consent');
  const selected = applicationModal.querySelector('#application-selected');
  name.value = values.name || document.querySelector('#callback-name')?.value || name.value;
  phone.value = values.phone || document.querySelector('#coverage-phone')?.value || document.querySelector('#callback-phone')?.value || phone.value;
  address.value = values.address || document.querySelector('#coverage-address')?.value || address.value;
  consent.checked = values.consent ?? consent.checked;
  applicationForm.querySelector('#application-tariff').value = values.tariff ?? '';
  selected.textContent = values.tariff ? `Выбран тариф «${values.tariff}».` : '';
  selected.hidden = !values.tariff;
  applicationForm.querySelector('#application-status').hidden = true;
  applicationForm.querySelectorAll('[aria-invalid]').forEach((input) => {
    input.setCustomValidity('');
    input.removeAttribute('aria-invalid');
  });
  applicationModal.showModal();
}

if (applicationModal && applicationForm) {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-modal]');
    if (!trigger) return;
    event.preventDefault();
    openApplicationModal();
  });
  applicationModal.querySelector('[data-close-modal]').addEventListener('click', () => applicationModal.close());
  applicationModal.addEventListener('click', (event) => {
    if (event.target === applicationModal) applicationModal.close();
  });

  const name = applicationForm.querySelector('#application-name');
  const phone = applicationForm.querySelector('#application-phone');
  const address = applicationForm.querySelector('#application-address');
  const status = applicationForm.querySelector('#application-status');

  for (const input of [name, phone, address]) {
    input.addEventListener('input', () => {
      input.setCustomValidity('');
      input.removeAttribute('aria-invalid');
      status.hidden = true;
    });
  }

  applicationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    name.value = name.value.trim();
    address.value = address.value.trim();
    const digits = phone.value.replace(/\D/g, '');
    name.setCustomValidity(name.value.length >= 2 ? '' : 'Укажите ваше имя.');
    phone.setCustomValidity(digits.length === 11 ? '' : 'Введите номер телефона полностью.');
    address.setCustomValidity(address.value.length >= 6 ? '' : 'Укажите адрес подключения.');
    for (const input of [name, phone, address]) input.toggleAttribute('aria-invalid', !input.validity.valid);
    status.hidden = true;
    if (!applicationForm.reportValidity()) return;
    status.textContent = 'Заявка заполнена. Отправка с сайта пока не подключена.';
    status.hidden = false;
  });

}

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

  phone.addEventListener('input', () => {
    let digits = phone.value.replace(/\D/g, '');
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
    status.hidden = true;
    openApplicationModal({ address: address.value, phone: phone.value, consent: document.querySelector('#coverage-consent').checked });
  });
}

const callbackForm = document.querySelector('#callback-form');
if (callbackForm) {
  const name = callbackForm.querySelector('#callback-name');
  const phone = callbackForm.querySelector('#callback-phone');
  const status = callbackForm.querySelector('#callback-status');
  phone.addEventListener('input', () => {
    let digits = phone.value.replace(/\D/g, '');
    if (digits[0] === '8') digits = '7' + digits.slice(1);
    if (digits && digits[0] !== '7') digits = '7' + digits;
    digits = digits.slice(0, 11);
    const local = digits.slice(1);
    phone.value = digits ? '+7' +
      (local.length ? ' (' + local.slice(0, 3) : '') +
      (local.length >= 3 ? ')' : '') +
      (local.length > 3 ? ' ' + local.slice(3, 6) : '') +
      (local.length > 6 ? '-' + local.slice(6, 8) : '') +
      (local.length > 8 ? '-' + local.slice(8, 10) : '') : '';
    phone.setCustomValidity('');
    phone.removeAttribute('aria-invalid');
    status.hidden = true;
  });

  name.addEventListener('input', () => {
    name.setCustomValidity('');
    name.removeAttribute('aria-invalid');
    status.hidden = true;
  });

  callbackForm.addEventListener('submit', (event) => {
    event.preventDefault();
    status.hidden = true;
    openApplicationModal({ name: name.value, phone: phone.value, consent: document.querySelector('#callback-consent').checked });
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
      <a class="cta-button tariff-card__action" href="#application-modal">Подключить <span class="cta-button__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M8 5h11v11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></a>
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

    card.querySelector('.tariff-card__action').addEventListener('click', (event) => {
      event.preventDefault();
      openApplicationModal({ tariff: `${service} ${tariff.name}${routerSwitch.checked ? ' с Wi-Fi роутером' : ''}` });
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
