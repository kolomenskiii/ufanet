document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-barrier-plan], [data-open-modal]');
  if (trigger) {
    const option = trigger.dataset.barrierPlan;
    // The shared script opens generic links; plan buttons open the dialog here.
    if (option) openApplicationModal();
    const service = option ? `Умный шлагбаум · ${option}` : 'Умный шлагбаум';
    document.querySelector('#application-tariff').value = service;
    const selected = document.querySelector('#application-selected');
    selected.textContent = option ? `Вариант подключения: ${option}.` : 'Интересует подключение умного шлагбаума.';
    selected.hidden = false;
  }
  if (event.target.closest('.mobile-nav a')) {
    document.querySelector('#mobile-nav').hidden = true;
    const toggle = document.querySelector('.menu-toggle');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
  }
});
