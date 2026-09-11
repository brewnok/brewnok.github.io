document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Nav Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            if (navLinks.classList.contains('open')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
                body.style.overflow = '';
            });
        });
    }

    // 2. FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    const expandAllBtn = document.getElementById('faqExpandAll');
    const collapseAllBtn = document.getElementById('faqCollapseAll');

    const toggleFaq = (item) => {
        const isOpen = item.classList.contains('open');
        const answer = item.querySelector('.faq-answer');
        
        if (isOpen) {
            item.classList.remove('open');
            answer.style.maxHeight = null;
        } else {
            item.classList.add('open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    };

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            toggleFaq(item);
        });
    });

    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.faq-item').forEach(item => {
                if (!item.classList.contains('open')) toggleFaq(item);
            });
        });
    }

    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item.classList.contains('open')) toggleFaq(item);
            });
        });
    }

    // 3. Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        revealElements.forEach(el => el.classList.add('visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
        
        // 3-second iframe fallback
        setTimeout(() => {
            revealElements.forEach(el => {
                if (!el.classList.contains('visible')) {
                    el.classList.add('visible');
                }
            });
        }, 3000);
    }

    // 4. Counter Animation
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutQuad
            const easeProgress = progress * (2 - progress);
            
            const currentVal = Math.floor(easeProgress * target);
            counter.innerText = currentVal + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.innerText = target + suffix;
            }
        };
        
        window.requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // 5. Typing Animation
    const typingElement = document.querySelector('.animated-typing');
    if (typingElement) {
        const strings = [
            'Observability & Monitoring Solutions',
            'Website Development',
            'Software Development',
            'Automation Services',
            'Performance Testing',
            'Resilience Testing'
        ];
        
        let stringIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const type = () => {
            const currentString = strings[stringIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentString.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentString.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typingSpeed = isDeleting ? 40 : 80;
            
            if (!isDeleting && charIndex === currentString.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                stringIndex = (stringIndex + 1) % strings.length;
                typingSpeed = 500;
            }
            
            setTimeout(type, typingSpeed);
        };
        
        setTimeout(type, 500);
    }

    // 6. Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = document.querySelector('.nav') ? document.querySelector('.nav').offsetHeight : 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Header background on scroll
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
        
        // Check initial state
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        }
    }

    // 8. Tech Stack Carousel Auto-Scroll
    const techTrack = document.querySelector('.tech-carousel-track');
    if (techTrack) {
        const firstGroup = techTrack.querySelector('.tech-carousel-group');
        if (firstGroup) {
            let scrollPos = 0;
            const speed = 0.5; // px per frame (~30px/s at 60fps)
            let paused = false;

            const carousel = techTrack.closest('.tech-carousel');
            if (carousel) {
                carousel.addEventListener('mouseenter', () => { paused = true; });
                carousel.addEventListener('mouseleave', () => { paused = false; });
                carousel.addEventListener('touchstart', () => { paused = true; }, { passive: true });
                carousel.addEventListener('touchend', () => { paused = false; });
            }

            function scrollCarousel() {
                if (!paused) {
                    scrollPos += speed;
                    // Reset when we've scrolled past the first group
                    if (scrollPos >= firstGroup.scrollWidth) {
                        scrollPos = 0;
                    }
                    techTrack.style.transform = 'translateX(-' + scrollPos + 'px)';
                }
                requestAnimationFrame(scrollCarousel);
            }

            requestAnimationFrame(scrollCarousel);
        }
    }
});
