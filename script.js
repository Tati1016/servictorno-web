document.addEventListener('DOMContentLoaded', () => {
    // ═══════════ REFERENCES ═══════════
    const header = document.getElementById('header');
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    // ═══════════ HEADER SCROLL — GLASSMORPHISM TRANSITION ═══════════
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // ═══════════ MOBILE MENU TOGGLE ═══════════
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
                document.body.style.overflow = 'hidden';
            } else {
                icon.setAttribute('data-lucide', 'menu');
                document.body.style.overflow = '';
            }
            lucide.createIcons();
        });
    }

    // ═══════════ DROPDOWN SERVICES MENU ═══════════
    const navDropdown = document.getElementById('navDropdownServicios');
    const dropdownTrigger = navDropdown ? navDropdown.querySelector('.dropdown-trigger') : null;
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    // Toggle dropdown on click (both desktop & mobile — no scroll)
    if (dropdownTrigger && navDropdown) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navDropdown.classList.toggle('open');
        });
    }

    // Dropdown items: scroll to service card + highlight
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetCard = document.querySelector(targetId);

            if (targetCard) {
                const headerOffset = 120;
                const elementPosition = targetCard.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Highlight flash on the card
                setTimeout(() => {
                    targetCard.classList.add('highlight-flash');
                    setTimeout(() => {
                        targetCard.classList.remove('highlight-flash');
                    }, 1200);
                }, 600);
            }

            // Close mobile menu if open
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.classList.remove('active');
                navDropdown.classList.remove('open');
                document.body.style.overflow = '';
                const icon = menuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    });

    // Close dropdown when clicking outside (desktop)
    document.addEventListener('click', (e) => {
        if (navDropdown && !navDropdown.contains(e.target)) {
            navDropdown.classList.remove('open');
        }
    });

    // ═══════════ CLOSE MENU ON LINK CLICK (MOBILE) ═══════════
    const links = document.querySelectorAll('.nav-links > li > a:not(.dropdown-trigger)');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.classList.remove('active');
                if (navDropdown) navDropdown.classList.remove('open');
                document.body.style.overflow = '';
                const icon = menuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    });

    // ═══════════ REVEAL ON SCROLL — STAGGERED PREMIUM FADE ═══════════
    const revealElements = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for sibling cards
                const parent = entry.target.parentElement;
                const siblings = parent ? parent.querySelectorAll('.reveal') : [];
                let delay = 0;
                
                siblings.forEach((sibling, i) => {
                    if (sibling === entry.target) {
                        delay = i * 100; // 100ms stagger
                    }
                });

                setTimeout(() => {
                    entry.target.classList.add('active');
                }, Math.min(delay, 400));
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ═══════════ IMPACT NUMBERS — COUNT-UP ANIMATION ═══════════
    const animateCountUp = (element, target, suffix = '') => {
        let current = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        
        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(counter);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    };

    const impactNumbers = document.querySelectorAll('.impact-number');
    const impactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent.trim();
                
                // Parse the value
                if (text.includes('/')) {
                    // 24/7 — just reveal, no counting
                    el.style.opacity = '1';
                } else if (text.startsWith('+')) {
                    animateCountUp(el, 1, '');
                    setTimeout(() => { el.textContent = '+1'; }, 2100);
                } else {
                    const num = parseInt(text);
                    if (!isNaN(num)) {
                        animateCountUp(el, num, '');
                    }
                }
                
                impactObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    impactNumbers.forEach(el => impactObserver.observe(el));

    // ═══════════ SMOOTH SCROLL WITH HEADER OFFSET ═══════════
    document.querySelectorAll('a[href^="#"]:not(.dropdown-trigger):not(.dropdown-item):not(.card-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ═══════════ CARD LINK MODAL TRIGGERS ═══════════
    document.querySelectorAll('.card-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceKey = link.getAttribute('data-service');
            if (window.openServiceModal) {
                window.openServiceModal(serviceKey);
            }
        });
    });

    // ═══════════ ACTIVE NAV LINK HIGHLIGHT ═══════════
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    const highlightNav = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 200;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navAnchors.forEach(a => {
                    a.classList.remove('nav-active');
                    if (a.getAttribute('href') === '#' + sectionId) {
                        a.classList.add('nav-active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav);

    // ═══════════ SERVICE DETAIL MODAL — OFF-CANVAS PANEL ═══════════
    const serviceData = {
        torno: {
            number: '01',
            title: 'TORNO CONVENCIONAL',
            subtitle: 'Precisión y robustez en la fabricación de piezas cilíndricas.',
            images: [
                { src: 'assets/IMAGENESSERVICIOS/torno_trabajo.png', alt: 'Torno trabajando eje de acero' },
                { src: 'assets/IMAGENESSERVICIOS/piezas_terminadas.png', alt: 'Piezas de torno terminadas' }
            ],
            materials: [
                'Acero 4140',
                'Acero Inoxidable 304/316',
                'Bronce SAE 65',
                'Aluminio 6061',
                'Polímeros industriales'
            ],
            capabilities: [
                'Roscado métrico y NPT',
                'Desbaste de alta precisión',
                'Ajustes de tolerancia ±0.01mm',
                'Ejes hasta 2m de longitud',
                'Acabados superficiales Ra 0.8'
            ],
            differentiator: 'Al ser un taller local en Yopal, garantizamos un trato directo, sin burocracia, priorizando la urgencia de su operación. Entrega de ejes y bujes en menos de 24 horas.',
            whatsapp: 'https://wa.me/573105826051?text=Hola%2C%20necesito%20cotizar%20el%20servicio%20de%20Torno%20Convencional'
        },
        mecanizado: {
            number: '02',
            title: 'MECANIZADO INDUSTRIAL',
            subtitle: 'Soluciones avanzadas de fresado y rectificado para piezas críticas.',
            images: [
                { src: 'assets/IMAGENESSERVICIOS/fresado_industrial.png', alt: 'Fresado CNC industrial' },
                { src: 'assets/IMAGENESSERVICIOS/piezas_terminadas.png', alt: 'Piezas mecanizadas de precisión' }
            ],
            materials: [
                'Acero al carbono',
                'Acero inoxidable',
                'Acero bonificado',
                'Aluminio aeronáutico',
                'Fundición gris/nodular'
            ],
            capabilities: [
                'Fresado plano y escalonado',
                'Rectificado de superficies',
                'Control dimensional con micrómetro',
                'Piezas bajo plano técnico',
                'Tolerancias ISO de precisión'
            ],
            differentiator: 'Contamos con instrumentos de medición calibrados para garantizar cada dimensión crítica. Nuestro equipo verifica pieza por pieza antes de la entrega final.',
            whatsapp: 'https://wa.me/573105826051?text=Hola%2C%20necesito%20cotizar%20el%20servicio%20de%20Mecanizado%20Industrial'
        },
        fabricacion: {
            number: '03',
            title: 'FABRICACIÓN A MEDIDA',
            subtitle: 'Diseño y producción de componentes exclusivos para su maquinaria.',
            images: [
                { src: 'assets/IMAGENESSERVICIOS/fabricacion_piezas.png', alt: 'Piñones y engranajes fabricados' },
                { src: 'assets/IMAGENESSERVICIOS/piezas_terminadas.png', alt: 'Componentes a medida terminados' }
            ],
            materials: [
                'Aceros de alta resistencia',
                'Bronce fosfórico',
                'Poliacetal (POM)',
                'Nylon industrial',
                'Acero inoxidable dúplex'
            ],
            capabilities: [
                'Piñonería recta y helicoidal',
                'Prototipos funcionales',
                'Componentes de reposición',
                'Ingeniería inversa de piezas',
                'Producción en serie limitada'
            ],
            differentiator: 'Fabricamos la pieza que usted necesita desde cero. Envíenos una foto, un plano o la pieza dañada y nosotros la replicamos con material y acabados de primera.',
            whatsapp: 'https://wa.me/573105826051?text=Hola%2C%20necesito%20cotizar%20el%20servicio%20de%20Fabricación%20a%20Medida'
        },
        mantenimiento: {
            number: '04',
            title: 'MANTENIMIENTO TÉCNICO',
            subtitle: 'Recuperación y restauración de componentes industriales dañados.',
            images: [
                { src: 'assets/IMAGENESSERVICIOS/soldadura_mantenimiento.png', alt: 'Soldadura especializada de componentes' },
                { src: 'assets/IMAGENESSERVICIOS/torno_trabajo.png', alt: 'Ajuste dimensional en torno' }
            ],
            materials: [
                'Soldadura MIG/MAG',
                'Soldadura TIG (argón)',
                'Electrodos especiales',
                'Recargue duro (hard facing)',
                'Aportes de acero inoxidable'
            ],
            capabilities: [
                'Recuperación de ejes desgastados',
                'Relleno y reperfilado',
                'Diagnóstico de falla mecánica',
                'Ajustes dimensionales finos',
                'Balanceo y alineación'
            ],
            differentiator: 'No descarte su pieza dañada. En SERVICTORNO evaluamos la viabilidad de recuperación para ahorrarle tiempo y dinero frente a la compra de un repuesto nuevo.',
            whatsapp: 'https://wa.me/573105826051?text=Hola%2C%20necesito%20cotizar%20el%20servicio%20de%20Mantenimiento%20Técnico'
        }
    };

    // Modal DOM references
    const modalOverlay = document.getElementById('serviceModalOverlay');
    const serviceModal = document.getElementById('serviceModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // Open Modal Function (global)
    window.openServiceModal = function(serviceKey) {
        const data = serviceData[serviceKey];
        if (!data) return;

        // Populate content
        document.getElementById('modalNumber').textContent = data.number;
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalSubtitle').textContent = data.subtitle;

        // Gallery images
        const img1 = document.getElementById('modalImg1');
        const img2 = document.getElementById('modalImg2');
        img1.src = data.images[0].src;
        img1.alt = data.images[0].alt;
        img2.src = data.images[1].src;
        img2.alt = data.images[1].alt;

        // Materials list
        const materialsUl = document.getElementById('modalMaterials');
        materialsUl.innerHTML = data.materials.map(m => `<li>${m}</li>`).join('');

        // Capabilities list
        const capabilitiesUl = document.getElementById('modalCapabilities');
        capabilitiesUl.innerHTML = data.capabilities.map(c => `<li>${c}</li>`).join('');

        // Differentiator
        document.getElementById('modalDifferentiator').textContent = data.differentiator;

        // CTA WhatsApp link
        document.getElementById('modalCTA').href = data.whatsapp;

        // Show modal
        modalOverlay.classList.add('active');
        serviceModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Re-init Lucide icons for new modal content
        lucide.createIcons();

        // Scroll modal body to top
        const modalBody = serviceModal.querySelector('.modal-body');
        if (modalBody) modalBody.scrollTop = 0;
    };

    // Close Modal Function
    function closeServiceModal() {
        modalOverlay.classList.remove('active');
        serviceModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close event listeners
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeServiceModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeServiceModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
            closeServiceModal();
        }
    });

    // ═══════════ PORTFOLIO FILTERS ═══════════
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterBtns.length > 0 && portfolioCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                portfolioCards.forEach(card => {
                    if (filterValue === 'all' || card.classList.contains(filterValue)) {
                        card.style.display = 'block';
                        // Small timeout to allow display:block to apply before animating opacity
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300); // match a transition if added, or just hide immediately
                    }
                });
            });
        });
        
        // Add basic transition for smooth filter animation
        portfolioCards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }

});
