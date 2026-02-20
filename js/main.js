/**
 * ARCHIVO: main.js
 * DESCRIPCIÓN: Script principal para funcionalidad del sitio web
 * AUTOR: Empresa Constructora
 * FECHA: 2026
 */

'use strict';

// ========================================
// INICIALIZACIÓN AL CARGAR EL DOM
// ========================================

/**
 * Ejecuta todas las funciones de inicialización cuando el DOM está completamente cargado
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initCarousel();
    initSmoothScroll();
    initLazyLoading();
});

// ========================================
// MENÚ MÓVIL (HAMBURGUESA)
// ========================================

/**
 * Inicializa el menú hamburguesa para dispositivos móviles
 * Maneja la apertura/cierre del menú y la animación del botón
 * @returns {void}
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    // Toggle del menú al hacer clic en el botón hamburguesa
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Actualizar atributo ARIA para accesibilidad
        const isExpanded = navMenu.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
        
        // Animación del botón hamburguesa
        this.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ========================================
// CARRUSEL DE IMÁGENES
// ========================================

/**
 * Inicializa el carrusel de imágenes con controles y auto-reproducción
 * @returns {void}
 */
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const indicators = carousel.querySelectorAll('.indicator');
    
    let currentIndex = 0;
    let autoPlayInterval;
    
    /**
     * Muestra un slide específico del carrusel
     * @param {number} index - Índice del slide a mostrar
     * @returns {void}
     */
    function showSlide(index) {
        // Asegurar que el índice esté dentro del rango válido
        if (index >= items.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = items.length - 1;
        } else {
            currentIndex = index;
        }
        
        // Remover clase active de todos los elementos
        items.forEach(item => item.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Agregar clase active al elemento actual
        items[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');
    }
    
    /**
     * Avanza al siguiente slide
     * @returns {void}
     */
    function nextSlide() {
        showSlide(currentIndex + 1);
    }
    
    /**
     * Retrocede al slide anterior
     * @returns {void}
     */
    function prevSlide() {
        showSlide(currentIndex - 1);
    }
    
    /**
     * Inicia la reproducción automática del carrusel
     * @returns {void}
     */
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // Cambiar cada 5 segundos
    }
    
    /**
     * Detiene la reproducción automática del carrusel
     * @returns {void}
     */
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners para los controles
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            stopAutoPlay();
            startAutoPlay(); // Reiniciar auto-play después de interacción manual
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }
    
    // Event listeners para los indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showSlide(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });
    
    // Pausar auto-play cuando el mouse está sobre el carrusel
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Soporte para navegación con teclado (accesibilidad)
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        }
    });
    
    // Iniciar auto-play
    startAutoPlay();
}

// ========================================
// DESPLAZAMIENTO SUAVE (SMOOTH SCROLL)
// ========================================

/**
 * Implementa desplazamiento suave para enlaces internos
 * Mejora la experiencia de usuario al navegar por la página
 * @returns {void}
 */

// ========================================
// AJUSTE DINÁMICO DE NAVBAR
// ========================================

function ajustarNavbar() {
    const topHeader = document.querySelector('.top-header');
    const navbar = document.querySelector('.navbar');
    if (topHeader && navbar) {
        const alturaHeader = topHeader.offsetHeight;
        navbar.style.top = alturaHeader + 'px';
    }
}

ajustarNavbar();
window.addEventListener('resize', ajustarNavbar);

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Solo aplicar smooth scroll si el href es un ID válido
            if (targetId !== '#' && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const offsetTop = targetElement.offsetTop - 80; // 80px para el navbar fijo
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar focus para accesibilidad
                    targetElement.focus({ preventScroll: true });
                }
            }
        });
    });
}

// ========================================
// CARGA DIFERIDA DE IMÁGENES (LAZY LOADING)
// ========================================

/**
 * Implementa carga diferida de imágenes para mejorar el rendimiento
 * Las imágenes se cargan solo cuando están cerca del viewport
 * @returns {void}
 */
function initLazyLoading() {
    // Verificar si el navegador soporta IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Cargar la imagen
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Dejar de observar esta imagen
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Comenzar a cargar 50px antes de que sea visible
        });
        
        // Observar todas las imágenes con data-src
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}


// ========================================
// UTILIDADES GENERALES
// ========================================

/**
 * Realiza un debounce de una función
 * Útil para optimizar eventos que se disparan frecuentemente (scroll, resize)
 * @param {Function} func - La función a ejecutar
 * @param {number} wait - Tiempo de espera en milisegundos
 * @returns {Function} - Función con debounce aplicado
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Detecta si un elemento está visible en el viewport
 * @param {HTMLElement} element - El elemento a verificar
 * @returns {boolean} - True si el elemento es visible
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========================================
// MANEJO DE ERRORES GLOBAL
// ========================================

/**
 * Maneja errores globales de JavaScript
 * Registra errores para debugging sin romper la experiencia del usuario
 */
window.addEventListener('error', function(e) {
    console.error('Error detectado:', e.message, 'en', e.filename, 'línea', e.lineno);
    // En producción, aquí se podría enviar el error a un servicio de logging
});

