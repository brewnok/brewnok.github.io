document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileNavToggle && nav) {
        mobileNavToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            
            // Toggle icon (hamburger to close)
            const isOpen = nav.classList.contains('active');
            if (isOpen) {
                mobileNavToggle.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            } else {
                mobileNavToggle.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            }
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileNavToggle.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            });
        });
    }

    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const animatedElements = document.querySelectorAll('.fade-in, .scale-in, .slide-up');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    animatedElements.forEach(element => {
        appearOnScroll.observe(element);
    });
});

// Floating Contact Button with Drag and Drop
document.addEventListener("DOMContentLoaded", () => {
    const floatingBtn = document.createElement("div");
    floatingBtn.id = "floating-contact-btn";
    floatingBtn.title = "Drag to reposition";
    floatingBtn.innerHTML = `
        <a href="https://tally.so/r/0Ql2BB" target="_blank" draggable="false">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
        </a>
    `;
    document.body.appendChild(floatingBtn);

    let isDragging = false;
    let startX, startY;
    let mStartX = 0, mStartY = 0;

    const onMouseDown = (e) => {
        isDragging = true;
        const rect = floatingBtn.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        mStartX = e.clientX;
        mStartY = e.clientY;
        floatingBtn.style.cursor = "grabbing";
        floatingBtn.style.transition = "none";
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        let newX = e.clientX - startX;
        let newY = e.clientY - startY;

        newX = Math.max(0, Math.min(newX, window.innerWidth - floatingBtn.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - floatingBtn.offsetHeight));

        floatingBtn.style.left = `${newX}px`;
        floatingBtn.style.top = `${newY}px`;
        floatingBtn.style.bottom = "auto";
        floatingBtn.style.right = "auto";
    };

    const onMouseUp = () => {
        if (isDragging) {
            isDragging = false;
            floatingBtn.style.cursor = "grab";
            
            const rect = floatingBtn.getBoundingClientRect();
            const centerX = window.innerWidth / 2;
            const padding = 30;

            let targetX = rect.left + (rect.width / 2) < centerX 
                ? padding 
                : window.innerWidth - rect.width - padding;

            floatingBtn.style.transition = "left 0.4s cubic-bezier(0.25, 1, 0.5, 1), top 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.2s ease, box-shadow 0.2s ease";
            floatingBtn.style.left = `${targetX}px`;
        }
    };

    floatingBtn.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    floatingBtn.addEventListener("touchstart", (e) => {
        isDragging = true;
        const rect = floatingBtn.getBoundingClientRect();
        startX = e.touches[0].clientX - rect.left;
        startY = e.touches[0].clientY - rect.top;
        mStartX = e.touches[0].clientX;
        mStartY = e.touches[0].clientY;
        floatingBtn.style.transition = "none";
    }, {passive: true});

    document.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        let newX = e.touches[0].clientX - startX;
        let newY = e.touches[0].clientY - startY;

        newX = Math.max(0, Math.min(newX, window.innerWidth - floatingBtn.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - floatingBtn.offsetHeight));

        floatingBtn.style.left = `${newX}px`;
        floatingBtn.style.top = `${newY}px`;
        floatingBtn.style.bottom = "auto";
        floatingBtn.style.right = "auto";
    }, {passive: false});

    document.addEventListener("touchend", onMouseUp);

    floatingBtn.querySelector("a").addEventListener("click", (e) => {
        const currentX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || mStartX;
        const currentY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || mStartY;
        
        if (Math.abs(currentX - mStartX) > 5 || Math.abs(currentY - mStartY) > 5) {
            e.preventDefault();
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    // Auto-Counter Animation
    const counters = document.querySelectorAll(".counter");
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute("data-target");
                const suffix = counter.getAttribute("data-suffix") || "";
                const duration = 1500;
                const increment = target / (duration / 16);
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.1 });
    
    counters.forEach(counter => countObserver.observe(counter));

    // 3D Hover Image Effect
    const hover3dImgs = document.querySelectorAll(".hover-3d-img");
    hover3dImgs.forEach(hover3dImg => {
        hover3dImg.addEventListener("mousemove", (e) => {
            const rect = hover3dImg.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;
            
            hover3dImg.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            hover3dImg.style.boxShadow = `${-rotateY}px ${rotateX + 20}px 40px rgba(37, 99, 235, 0.2)`;
        });
        
        hover3dImg.addEventListener("mouseleave", () => {
            hover3dImg.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
            hover3dImg.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.1)";
            hover3dImg.style.transition = "transform 0.5s ease-out, box-shadow 0.5s ease-out";
        });
        
        hover3dImg.addEventListener("mouseenter", () => {
            hover3dImg.style.transition = "transform 0.1s ease-out, box-shadow 0.1s ease-out";
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {
    // Typing Effect
    const typingElement = document.querySelector(".animated-typing");
    if (typingElement) {
        const phrases = ["Working for your success", "Automating your workflows", "Scaling your business"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeEffect = () => {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typingSpeed = isDeleting ? 40 : 80;
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2500; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before new word
            }
            
            setTimeout(typeEffect, typingSpeed);
        };
        
        // Start typing immediately
        typeEffect();
    }
});


document.addEventListener("DOMContentLoaded", () => {
    // Cookie Consent Logic
    if (!sessionStorage.getItem("cookieConsent")) {
        const cookieBanner = document.createElement("div");
        cookieBanner.id = "cookie-consent";
        cookieBanner.innerHTML = `
            <div class="cookie-content">
                <h4>We value your privacy</h4>
                <p>We use cookies to enhance your browsing experience and analyze our traffic. Please choose whether you accept our cookies.</p>
            </div>
            <div class="cookie-actions">
                <button class="btn-cookie btn-deny" id="btn-deny-cookies">Deny</button>
                <button class="btn-cookie btn-accept" id="btn-accept-cookies">Accept</button>
            </div>
        `;
        document.body.appendChild(cookieBanner);

        // Animate in after a short delay
        setTimeout(() => {
            cookieBanner.classList.add("show");
        }, 1500);

        document.getElementById("btn-accept-cookies").addEventListener("click", () => {
            sessionStorage.setItem("cookieConsent", "accepted");
            cookieBanner.classList.remove("show");
            setTimeout(() => cookieBanner.remove(), 500);
        });

        document.getElementById("btn-deny-cookies").addEventListener("click", () => {
            sessionStorage.setItem("cookieConsent", "denied");
            cookieBanner.classList.remove("show");
            setTimeout(() => cookieBanner.remove(), 500);
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    // Idle Easter Egg
    let idleTimer;
    let easterEggTriggered = false;

    const resetIdleTimer = () => {
        if (easterEggTriggered) return;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            triggerEasterEgg();
        }, 30000); // 30 seconds
    };

    const triggerEasterEgg = () => {
        easterEggTriggered = true;
        const toast = document.createElement("div");
        toast.id = "idle-toast";
        toast.innerHTML = `
            <button class="idle-toast-close">&times;</button>
            <span style="font-size: 2rem;">🤖</span>
            <div>
                <strong>Still there?</strong><br>
                <span style="font-size: 0.85rem; opacity: 0.9; line-height: 1.3; display: block; margin-top: 4px;">
                    You&apos;ve been idle for 30 seconds. While you were resting, we automated 4,203 processes. 🚀
                </span>
            </div>
        `;
        document.body.appendChild(toast);
        
        toast.querySelector('.idle-toast-close').addEventListener('click', () => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 600);
        });
        
        // Force reflow
        void toast.offsetWidth;
        
        toast.classList.add("show");
        
        // Remove after 8 seconds
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 600);
        }, 8000);
        
        // Clean up listeners
        document.removeEventListener("mousemove", resetIdleTimer);
        document.removeEventListener("keydown", resetIdleTimer);
        document.removeEventListener("scroll", resetIdleTimer);
        document.removeEventListener("touchstart", resetIdleTimer);
    };

    // Attach listeners
    document.addEventListener("mousemove", resetIdleTimer);
    document.addEventListener("keydown", resetIdleTimer);
    document.addEventListener("scroll", resetIdleTimer);
    document.addEventListener("touchstart", resetIdleTimer);
    
    // Start timer initially
    resetIdleTimer();
});

