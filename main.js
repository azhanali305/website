/* =============================================================
   THE TRUST SIGNAL — main.js
   Author: Ayan Ali  |  MA Content Creation, NTU
   =============================================================

   This file handles all interactive behaviour:
   - Section switching (single-page navigation)
   - Active state on nav links
   - Scroll-to-top on section change

   STRUCTURE
   ---------
   1.  showSection()    — core page-switching function
   2.  initNav()        — attach click listeners to nav links
   3.  DOMContentLoaded — run on page load
   ============================================================= */


/* ─────────────────────────────────────────────────────────────
   1. showSection(id)
   Hides all <section> elements, shows only the one matching
   the given id, and updates the nav highlight.

   @param {string} id  — matches the <section id="..."> attribute
                         and the corresponding <a id="nav-..."> link

   TWEAK: To add a custom action when a specific section opens,
   add a condition inside this function, e.g.:
     if (id === 'project') { console.log('project opened'); }
   ───────────────────────────────────────────────────────────── */
function showSection(id) {

  /* — Hide every section — */
  document.querySelectorAll('section').forEach(function(section) {
    section.classList.remove('active');
  });

  /* — Remove 'active' class from every nav link — */
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    link.classList.remove('active');
  });

  /* — Show the target section — */
  var targetSection = document.getElementById(id);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  /* — Highlight the matching nav link (convention: id="nav-{sectionId}") — */
  var targetNav = document.getElementById('nav-' + id);
  if (targetNav) {
    targetNav.classList.add('active');
  }

  /* — Scroll back to the top of the page smoothly —
     TWEAK: Change 'smooth' to 'instant' to jump without animation */
  window.scrollTo({ top: 0, behavior: 'smooth' });

  /* — Prevent default anchor behaviour when called from onclick — */
  return false;
}


/* ─────────────────────────────────────────────────────────────
   2. initNav()
   Reads the section id from each nav link's data-section attribute
   and wires up the click handler.
   This keeps the HTML cleaner — no inline onclick="" needed
   if you switch to data attributes in the future.

   Currently the HTML uses onclick="showSection('...')" directly,
   so this function is available as a future-proofing upgrade.
   ───────────────────────────────────────────────────────────── */
function initNav() {
  /* Grab all nav links that have a data-section attribute */
  var navLinks = document.querySelectorAll('.nav-links a[data-section]');

  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();  /* Stop the # href from jumping the page */
      var sectionId = link.getAttribute('data-section');
      showSection(sectionId);
    });
  });
}


/* — Hide nav on scroll down, show on scroll up or at top — */
var lastScroll = 0;
var nav = document.querySelector('nav');

window.addEventListener('scroll', function() {
  var currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    nav.style.transform = 'translateY(0)';
  } else if (currentScroll > lastScroll) {
    nav.style.transform = 'translateY(-100%)';
  } else {
    nav.style.transform = 'translateY(0)';
  }

  lastScroll = currentScroll;
});

/* ─────────────────────────────────────────────────────────────
   3. DOMContentLoaded
   Runs once the page HTML is fully parsed.
   Safe place to set initial state and attach listeners.

   TWEAK: Add any startup logic here, e.g. loading saved
   preferences or fetching dynamic content.
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {

  /* Initialise data-attribute nav wiring (progressive enhancement) */
  initNav();

  /* Read the URL hash on load so deep-linking works.
     e.g. opening index.html#project goes straight to My Project.
     TWEAK: Remove this block if you don't want hash-based routing. */
  var hash = window.location.hash.replace('#', '');
  var validSections = ['about', 'project', 'research', 'management', 'sustainability', 'collaboration', 'more'];

  if (hash && validSections.indexOf(hash) !== -1) {
    showSection(hash);
  } else {
    /* Default: show About Me on first load */
    showSection('about');
  }

  /* Update the URL hash whenever a section changes so the browser
     back button and bookmarks work correctly.
     This listener patches the showSection function to also push state.
     TWEAK: Remove this block if you prefer clean URLs without hashes. */
  var originalShowSection = showSection;
  window.showSection = function(id) {
    originalShowSection(id);
    history.replaceState(null, '', '#' + id);
    return false;
  };

});

function toggleBpAccordion(trigger) {
  var body = trigger.nextElementSibling;
  var isOpen = trigger.classList.contains('open');

  /* Close all open bp items */
  document.querySelectorAll('.bp-trigger.open').forEach(function(t) {
    t.classList.remove('open');
    t.nextElementSibling.classList.remove('open');
  });

  /* If it wasn't already open, open this one */
  if (!isOpen) {
    trigger.classList.add('open');
    body.classList.add('open');
  }
}

function toggleAccordion(trigger) {
  var body = trigger.nextElementSibling;
  var isOpen = trigger.classList.contains('open');

  /* Close all open items */
  document.querySelectorAll('.accordion-trigger.open').forEach(function(t) {
    t.classList.remove('open');
    t.nextElementSibling.classList.remove('open');
  });

  /* If it wasn't already open, open this one */
  if (!isOpen) {
    trigger.classList.add('open');
    body.classList.add('open');
  }
}

/* ─────────────────────────────────────────────────────────────
   toggleReferences(btn)
   Expands / collapses the References dropdown in the More section.
   Called via onclick="toggleReferences(this)" on the button.
   ───────────────────────────────────────────────────────────── */
function toggleReferences(btn) {
  var body = document.getElementById('references-body');
  var isOpen = btn.classList.contains('open');

  if (isOpen) {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    body.classList.remove('open');
  } else {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    body.classList.add('open');
  }
}
