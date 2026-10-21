const businessTabs = [...document.querySelectorAll('[data-business-tab]')];
const businessPanels = [...document.querySelectorAll('.business-panel')];
function selectBusinessTab(tab) {
  businessTabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  businessPanels.forEach((panel) => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
}
if (businessTabs.length) {
  document.querySelector('.business-tabs').setAttribute('role', 'tablist');
  businessPanels.forEach((panel) => { panel.setAttribute('role', 'tabpanel'); panel.tabIndex = 0; });
  businessTabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.addEventListener('click', () => selectBusinessTab(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % businessTabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + businessTabs.length) % businessTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = businessTabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectBusinessTab(businessTabs[next]);
      businessTabs[next].focus();
    });
  });
  selectBusinessTab(businessTabs[0]);
}
document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-business-service], [data-open-modal]');
  if (trigger) {
    const service = trigger.dataset.businessService;
    if (service) openApplicationModal();
    document.querySelector('#application-tariff').value = service ? 'Для бизнеса · ' + service : 'Для бизнеса · Консультация';
    const selected = document.querySelector('#application-selected');
    selected.textContent = service ? 'Интересует услуга: ' + service + '.' : 'Поможем подобрать услуги для вашей компании.';
    selected.hidden = false;
  }
  if (event.target.closest('.mobile-nav a')) {
    document.querySelector('#mobile-nav').hidden = true;
    const toggle = document.querySelector('.menu-toggle');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
  }
});
