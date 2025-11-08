// Ce script sert d’écouteur global pour toutes les CTA qui doivent faire défiler la page jusqu’au formulaire d’éligibilité (ou tout autre élément). Plutôt que de coller un <script> inline dans chaque composant, on l’inclut une seule fois (via BaseLayout par exemple) et on équipe chaque bouton d’un attribut data-scroll-target.

// Workflow :

// 1. Le script écoute les clics sur document.
// 2. À chaque clic, il vérifie si la cible (ou un de ses parents) possède data-scroll-target.
// 3. Si oui, il lit l’identifiant (data-scroll-target="eligibility-form-wrapper") ainsi qu’un offset optionnel (data-scroll-offset="80"), puis effectue un window.scrollTo({ top, behavior: 'smooth' }).
// 4. Résultat : n’importe quel bouton balisé déclenche automatiquement le scroll vers la section souhaitée, sans code JS dupliqué dans les composants.



const SELECTOR_ATTR = 'data-scroll-to-form-target';
const SELECTOR = '[' + SELECTOR_ATTR + ']';

function scrollToTarget(targetId, offset = 0) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

function handleClick(event) {
  const trigger = event.target.closest(SELECTOR);
  if (!trigger) return;

  event.preventDefault();
  const targetId = trigger.getAttribute(SELECTOR_ATTR);
  if (!targetId) return;

  const offsetAttr = trigger.getAttribute('data-scroll-offset');
  const offset = offsetAttr ? Number(offsetAttr) || 0 : 0;

  scrollToTarget(targetId, offset);
}

if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClick);
}