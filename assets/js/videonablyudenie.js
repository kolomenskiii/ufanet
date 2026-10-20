document.addEventListener('click', (event) => {
  const cameraButton = event.target.closest('[data-camera]');
  if (cameraButton) {
    const camera = cameraButton.dataset.camera;
    openApplicationModal({ tariff: camera });
    const selected = document.querySelector('#application-selected');
    selected.textContent = `Интересует камера «${camera}».`;
    return;
  }
  const planButton = event.target.closest('[data-plan]');
  if (planButton) {
    openApplicationModal({ tariff: planButton.dataset.plan });
    return;
  }
  if (event.target.closest('.mobile-nav a')) {
    const nav = document.querySelector('#mobile-nav');
    const toggle = document.querySelector('.menu-toggle');
    nav.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
  }
});

