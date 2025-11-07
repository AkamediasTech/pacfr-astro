document.addEventListener("DOMContentLoaded", function () {
const stats = document.querySelectorAll(".stats h3");
let animationQueue = [];
let isAnimating = false;

stats.forEach(stat => {
    stat.setAttribute("data-value", stat.innerText);
    stat.innerText = "0";
});

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.boundingClientRect.top <= window.innerHeight && entry.isIntersecting) {
            animationQueue.push(entry.target);
            observer.unobserve(entry.target);
            if (!isAnimating && animationQueue.length === 1) {
                scrollDown();
            }
        }
    });
}, { threshold: 0 });

stats.forEach(stat => observer.observe(stat));

function scrollDown() {
    const scrollOffset = window.innerHeight * 0.75; 
    window.scrollBy({
        top: scrollOffset,
        behavior: 'smooth'  
    });

    setTimeout(() => {
        lockScroll();
        startNextAnimation();
    }, 600);  // Délai pour permettre à l'auto-défilement de se terminer
}

function lockScroll() {
    document.body.style.overflow = 'hidden';
}

function unlockScroll() {
    document.body.style.overflow = '';
}

function startNextAnimation() {
    if (animationQueue.length > 0) {
        isAnimating = true;
        const currentElement = animationQueue.shift();
        let targetValue = currentElement.getAttribute("data-value");
        if (targetValue) {
            animateNumbers(currentElement, targetValue, () => {
                setTimeout(() => {
                    isAnimating = false;
                    if (animationQueue.length > 0) {
                        startNextAnimation();
                    } else {
                        unlockScroll(); // Déverrouiller le scroll une fois toutes les animations terminées
                    }
                }, 100);
            });
        }
    }
}

function animateNumbers(element, targetValue, callback) {
    let target = parseInt(targetValue.replace('%', ''));
    let isPercentage = targetValue.includes('%');
    let count = 0;
    let steps = 50;
    let increment = Math.ceil(target / steps);
    let speed = 15;

    function updateNumber() {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(interval);
            if (callback) callback();
        }
        element.innerText = count + (isPercentage ? '%' : '');
    }

    let interval = setInterval(updateNumber, speed);
}


document.querySelectorAll(".fade-text-auto").forEach(element => {
    if (element.getBoundingClientRect().top < window.innerHeight - 75) {
        element.classList.add("fade-in");
    }
});
});
