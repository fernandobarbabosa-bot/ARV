(() => {
  'use strict';

  // ==========================================
  // EXISTING SITE ELEMENTS
  // ==========================================

  const header = document.querySelector('.site-header');
  const menuTrigger = document.getElementById('menuTrigger');
  const menuOverlay = document.getElementById('fullscreenMenu');
  const menuClose = document.getElementById('menuClose');
  const year = document.getElementById('year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // ==========================================
  // FULL-SCREEN NAVIGATION
  // ==========================================

  const setMenu = (open) => {
    if (!menuOverlay || !menuTrigger) return;

    document.body.classList.toggle('menu-open', open);
    menuOverlay.classList.toggle('open', open);
    menuOverlay.setAttribute('aria-hidden', String(!open));
    menuTrigger.setAttribute('aria-expanded', String(open));
    menuTrigger.setAttribute(
      'aria-label',
      open ? 'Cerrar menú' : 'Abrir menú'
    );

    if (open && menuClose) {
      menuClose.focus();
    } else if (!open) {
      menuTrigger.focus();
    }
  };

  if (menuTrigger && menuOverlay) {
    menuTrigger.addEventListener('click', () => {
      setMenu(!menuOverlay.classList.contains('open'));
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', () => setMenu(false));
  }

  if (menuOverlay) {
    // Ordinary navigation links close the menu. Contact is handled below
    // so it can close the menu and open the contact modal in one action.
    menuOverlay
      .querySelectorAll('a:not([data-open-arv-contact])')
      .forEach((link) => {
        link.addEventListener('click', () => setMenu(false));
      });
  }

  // ==========================================
  // HEADER SCROLL STATE
  // ==========================================

  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 24);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ==========================================
  // SCROLL REVEALS
  // ==========================================

  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  // ==========================================
  // CAPABILITY ACCORDIONS
  // ==========================================

  const capabilities = document.querySelectorAll('.capability');

  capabilities.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        capabilities.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // ==========================================
  // ARV CONTACT OVERLAY
  // ==========================================

  const contactOverlay = document.getElementById('arvContactOverlay');
  const contactModal = document.getElementById('arvContactModal');
  const contactTriggers = document.querySelectorAll('[data-open-arv-contact]');
  const contactClose = document.getElementById('closeArvContact');

  const contactForm = document.getElementById('arvContactForm');
  const contactStatus = document.getElementById('arvFormStatus');
  const contactSendButton = document.getElementById('arvSendBtn');
  const contactSuccess = document.getElementById('arvContactSuccess');
  const contactSuccessClose = document.getElementById('closeArvSuccess');
  const contactWhatsApp = document.querySelector('.arv-whatsapp-link');

  const ARV_FORM_ENDPOINT =
    'https://formsubmit.co/ajax/289ead8c02f3538f5eb19c370f889d14';

  const DEFAULT_CONTACT_STATUS =
    'Tus datos se utilizarán únicamente para responder tu consulta.';

  let contactReturnFocus = null;
  let contactSubmissionSucceeded = false;

  const resetContactAfterSuccess = () => {
    if (!contactSubmissionSucceeded) return;

    if (contactForm) {
      contactForm.reset();
      contactForm.hidden = false;
    }

    if (contactSuccess) {
      contactSuccess.hidden = true;
    }

    if (contactWhatsApp) {
      contactWhatsApp.hidden = false;
    }

    if (contactStatus) {
      contactStatus.textContent = DEFAULT_CONTACT_STATUS;
      contactStatus.classList.remove('is-error');
    }

    contactSubmissionSucceeded = false;
  };

  const openContactModal = (sourceElement) => {
    if (!contactOverlay || !contactModal) return;

    // When Contact is selected from the fullscreen menu, return focus to
    // the menu button after the modal closes (the menu itself is hidden).
    contactReturnFocus = menuOverlay && menuOverlay.contains(sourceElement)
      ? menuTrigger
      : sourceElement;

    contactOverlay.classList.add('is-open');
    contactOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('arv-overlay-open');

    window.requestAnimationFrame(() => {
      const nameField = document.getElementById('arvName');
      if (nameField && !nameField.disabled) {
        nameField.focus();
      } else {
        contactModal.focus();
      }
    });
  };

  const closeContactModal = () => {
    if (!contactOverlay) return;

    contactOverlay.classList.remove('is-open');
    contactOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('arv-overlay-open');

    resetContactAfterSuccess();

    if (contactReturnFocus && contactReturnFocus.isConnected) {
      contactReturnFocus.focus();
    } else if (menuTrigger) {
      menuTrigger.focus();
    }

    contactReturnFocus = null;
  };

  // One handler for every contact entry point: desktop nav, header button,
  // fullscreen menu, contact-section button and floating CTA.
  contactTriggers.forEach((contactTrigger) => {
    contactTrigger.addEventListener('click', (event) => {
      event.preventDefault();

      const fromFullscreenMenu =
        menuOverlay && menuOverlay.contains(contactTrigger);

      if (fromFullscreenMenu && menuOverlay.classList.contains('open')) {
        setMenu(false);
      }

      openContactModal(contactTrigger);
    });
  });

  if (contactClose) {
    contactClose.addEventListener('click', closeContactModal);
  }

  if (contactSuccessClose) {
    contactSuccessClose.addEventListener('click', closeContactModal);
  }

  // Clicking the backdrop closes the modal; clicks inside the panel do not.
  if (contactOverlay) {
    contactOverlay.addEventListener('click', (event) => {
      if (event.target === contactOverlay) {
        closeContactModal();
      }
    });
  }

  // Keep keyboard focus inside the modal while it is open.
  if (contactModal) {
    contactModal.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeContactModal();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = Array.from(
        contactModal.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
        )
      ).filter((element) => {
        return !element.closest('[hidden]') && element.getClientRects().length > 0;
      });

      if (!focusableElements.length) {
        event.preventDefault();
        contactModal.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  // ==========================================
  // FORMSUBMIT — AJAX
  // ==========================================

  if (contactForm && contactStatus && contactSendButton && contactSuccess) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      contactSendButton.disabled = true;
      contactSendButton.textContent = 'Enviando…';
      contactStatus.textContent = 'Enviando tu mensaje…';
      contactStatus.classList.remove('is-error');

      try {
        const data = Object.fromEntries(
          new FormData(contactForm).entries()
        );

        data._subject = 'Nueva consulta comercial desde ARV';
        data._template = 'table';
        data._captcha = 'true';

        const response = await fetch(ARV_FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(data)
        });

        let result;

        try {
          result = await response.json();
        } catch (parseError) {
          throw new Error('El servicio devolvió una respuesta que no pudimos leer.');
        }

        // FormSubmit may return success as a boolean or as the string "true".
        // Only an explicit positive response is treated as a successful send.
        const confirmed =
          String(result && result.success).toLowerCase() === 'true';

        if (!response.ok || !confirmed) {
          throw new Error(
            (result && result.message) ||
            'FormSubmit no confirmó la recepción del mensaje.'
          );
        }

        contactSubmissionSucceeded = true;
        contactForm.hidden = true;
        contactSuccess.hidden = false;

        if (contactWhatsApp) {
          contactWhatsApp.hidden = true;
        }

        contactSuccessClose?.focus();

      } catch (error) {
        console.error('ARV contact form submission failed:', error);

        contactStatus.textContent =
          'No pudimos confirmar el envío. Intenta nuevamente o contáctanos por WhatsApp.';
        contactStatus.classList.add('is-error');

      } finally {
        contactSendButton.disabled = false;
        contactSendButton.innerHTML = 'Enviar mensaje <span>↗</span>';
      }
    });
  }
})();
