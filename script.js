// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Menu Hamburguer
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navbar) {
        mobileMenuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
            // Alterna o ícone entre barras e X
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times'); // Font Awesome X icon
        });

        // Fechar o menu ao clicar em um link (em mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Scroll Suave para links de navegação (CSS scroll-behavior: smooth é a principal forma, este é um fallback/extra)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Previne o comportamento padrão APENAS se for um link interno # e o target existir
            try {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) { // Verifica se o alvo existe na página
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                 // Ignora links # que não são IDs válidos ou elementos existentes
                 console.error('Erro ao tentar scroll suave:', error);
            }
        });
    });

    // 3. Header Fixo/Compacto ao Rolar
    const header = document.getElementById('header');
    const body = document.body; // Adiciona referência ao body
    const headerHeight = header ? header.offsetHeight : 0; // Altura inicial do header (verifica se header existe)
    const stickyThreshold = headerHeight; // Começa a fixar após rolar a altura inicial do header, ou defina um valor fixo (ex: 100)

    const stickyHeader = () => {
        if (header) { // Verifica se header existe
            if (window.scrollY > stickyThreshold) {
                header.classList.add('sticky');
                body.classList.add('sticky-padding'); // Adiciona classe ao body
                // Ajusta padding do body via JS se o CSS não for suficiente
                 body.style.paddingTop = header.offsetHeight + 'px';
            } else {
                header.classList.remove('sticky');
                body.classList.remove('sticky-padding'); // Remove classe do body
                 body.style.paddingTop = '0'; // Remove padding
            }
        }
    };

    // Adicionado debounce para otimizar eventos de scroll
    const debounce = (func, wait = 20, immediate = false) => {
        let timeout;
        return function () {
            const context = this, args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // Substituído o listener de scroll por uma versão com debounce
    window.addEventListener('scroll', debounce(() => {
        stickyHeader();
        toggleScrollToTop();
    }, 50));

    stickyHeader(); // Executa na carga da página caso já esteja scrollado (útil em recargas)


    // 4. Botão Voltar ao Topo
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    const toggleScrollToTop = () => {
        if (scrollToTopBtn) { // Verifica se o botão existe
            if (window.scrollY > 300) { // Mostra o botão após 300px de scroll
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }
    };

    if (scrollToTopBtn) { // Adiciona listener apenas se o botão existir
        window.addEventListener('scroll', toggleScrollToTop);
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        toggleScrollToTop(); // Executa na carga da página
    }


    // 5. Portfólio (Filtro, Modal, Detalhes)
    const setupPortfolio = () => {
        const filterButtons = document.querySelectorAll('.portfolio-filters .filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-item');
        const portfolioModal = document.getElementById('portfolioModal');
        const closeModalBtn = document.querySelector('.close-modal-btn');
        const modalBodyContent = document.getElementById('modalBodyContent');

        // Função para abrir o modal
        const openModal = (projectId) => {
            const projectDetails = document.getElementById(`details-${projectId}`);
            if (projectDetails) {
                modalBodyContent.innerHTML = projectDetails.innerHTML;
                portfolioModal.style.display = 'block';
                document.body.classList.add('modal-open');
            } else {
                console.error('Detalhes do projeto não encontrados para o ID:', projectId);
            }
        };

        // Fechar o modal
        const closeModal = () => {
            portfolioModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        };

        // Adicionando evento de clique para abrir o modal
        portfolioItems.forEach(item => {
            const button = item.querySelector('.view-details-btn');
            if (button) {
                button.addEventListener('click', () => {
                    const projectId = button.getAttribute('data-project-id');
                    openModal(projectId);
                });
            }
        });

        // Evento para fechar o modal
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        // Fechar o modal ao clicar fora dele
        window.addEventListener('click', (event) => {
            if (event.target === portfolioModal) {
                closeModal();
            }
        });

        // Inicializa o filtro "Todos" ao carregar
        const allFilterButton = document.querySelector('.portfolio-filters .filter-btn[data-filter="all"]');
        if (allFilterButton) {
            allFilterButton.click();
        }
    };

    // Inicializa as funções de portfólio
    setupPortfolio();

    // 6. Slider de Depoimentos
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonials = document.querySelectorAll('.testimonial-item');
    const prevTestimonialBtn = document.querySelector('.testimonial-nav.prev');
    const nextTestimonialBtn = document.querySelector('.testimonial-nav.next');

    let currentTestimonialIndex = 0;

    const showTestimonial = (index) => {
         // Garante que o índice está dentro dos limites
         index = Math.max(0, Math.min(index, testimonials.length - 1));
         currentTestimonialIndex = index; // Atualiza o índice global

        testimonials.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
         updateTestimonialNavigation();
    };

    const updateTestimonialNavigation = () => {
        if (!prevTestimonialBtn || !nextTestimonialBtn || testimonials.length === 0) return; // Checa se os elementos existem

        prevTestimonialBtn.disabled = currentTestimonialIndex === 0;
        nextTestimonialBtn.disabled = currentTestimonialIndex === testimonials.length - 1;

        // Opcional: Adicionar classes para estilização de botões desabilitados
        prevTestimonialBtn.classList.toggle('disabled', prevTestimonialBtn.disabled);
        nextTestimonialBtn.classList.toggle('disabled', nextTestimonialBtn.disabled);

         // Oculta botões se houver apenas um depoimento
        if (testimonials.length <= 1) {
             prevTestimonialBtn.style.visibility = 'hidden';
             nextTestimonialBtn.style.visibility = 'hidden';
        } else {
             prevTestimonialBtn.style.visibility = 'visible';
             nextTestimonialBtn.style.visibility = 'visible';
        }
    };


    if (testimonials.length > 0) {
         showTestimonial(currentTestimonialIndex); // Mostra o primeiro ao carregar
        if(prevTestimonialBtn) { // Checa se o botão existe antes de adicionar listener
            prevTestimonialBtn.addEventListener('click', () => {
                 showTestimonial(currentTestimonialIndex - 1); // Tenta ir para o anterior
            });
        }
         if(nextTestimonialBtn) { // Checa se o botão existe antes de adicionar listener
            nextTestimonialBtn.addEventListener('click', () => {
                 showTestimonial(currentTestimonialIndex + 1); // Tenta ir para o próximo
            });
        }
         // updateTestimonialNavigation(); // Já é chamado dentro de showTestimonial
    } else {
        // Oculta botões e wrapper se não houver depoimentos
        const testimonialWrapper = document.querySelector('.testimonial-slider-wrapper');
         if(testimonialWrapper) testimonialWrapper.style.display = 'none';
         if(prevTestimonialBtn) prevTestimonialBtn.style.display = 'none';
         if(nextTestimonialBtn) nextTestimonialBtn.style.display = 'none';
    }


    // 7. Ano Atual no Footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 8. Validação Básica do Formulário de Contato (usando mailto)
    const contactForm = document.getElementById('contactForm');
    const formStatusMessage = document.getElementById('form-status');

    // Melhorada a validação do formulário com mensagens específicas
    if (contactForm && formStatusMessage) { // Verifica se form e status message existem
        contactForm.addEventListener('submit', (event) => {
             // NÃO usamos event.preventDefault() aqui para permitir que o mailto: funcione
             // event.preventDefault(); // Descomente SE for usar AJAX ou outra forma de envio no backend

            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('input[required], textarea[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error'); // Adiciona classe para estilizar campo com erro
                    field.nextElementSibling.textContent = `O campo ${field.name} é obrigatório.`;
                } else {
                    field.classList.remove('error');
                    field.nextElementSibling.textContent = '';
                }
            });

            if (!isValid) {
                formStatusMessage.textContent = 'Por favor, corrija os erros acima antes de enviar.';
                formStatusMessage.style.color = 'red';
                event.preventDefault();
            } else {
                 // Mensagem para o usuário antes de tentar abrir o cliente de e-mail
                 formStatusMessage.textContent = 'Validando e preparando e-mail...';
                 formStatusMessage.style.color = 'orange';

                 // Como estamos usando mailto, o navegador fará o resto.
                 // A mensagem de status pode não sumir automaticamente,
                 // ou o usuário pode cancelar o envio do e-mail.
                 // Uma solução real exigiria um backend para enviar o e-mail.
            }

             // Se !isValid for true, o navegador não fará o submit via mailto
             // se a validação padrão do HTML5 (required) estiver ativa.
             // Se usar preventDefault, você controlaria tudo aqui.
        });

         // Opcional: Remover a classe de erro ao digitar no campo
         contactForm.querySelectorAll('input, textarea').forEach(field => {
             field.addEventListener('input', () => {
                 if (field.value.trim()) {
                     field.classList.remove('error');
                     field.nextElementSibling.textContent = '';
                 }
                  // Limpa a mensagem de status de erro ao começar a digitar se ela for vermelha (indicando erro de validação)
                 if (formStatusMessage.style.color === 'red') {
                      formStatusMessage.textContent = '';
                      formStatusMessage.style.color = '';
                 }
             });
         });
    }

    // Adicionando funcionalidade para abrir o modal do Projeto Alpha
    const setupPortfolioModal = () => {
        const portfolioModal = document.getElementById('portfolioModal');
        const modalBodyContent = document.getElementById('modalBodyContent');
        const closeModalBtn = document.querySelector('.close-modal-btn');
    
        // Função para abrir o modal
        const openModal = (projectId) => {
            const projectDetails = document.getElementById(`details-${projectId}`);
            if (projectDetails) {
                modalBodyContent.innerHTML = projectDetails.innerHTML;
                portfolioModal.style.display = 'block';
                document.body.classList.add('modal-open');
            }
        };
    
        // Fechar o modal
        const closeModal = () => {
            portfolioModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        };
    
        // Adicionando evento de clique para abrir o modal do Projeto Alpha
        const alphaButton = document.querySelector('[data-project-id="alpha"]');
        if (alphaButton) {
            alphaButton.addEventListener('click', () => openModal('alpha'));
        }
    
        // Evento para fechar o modal
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
    
        // Fechar o modal ao clicar fora dele
        window.addEventListener('click', (event) => {
            if (event.target === portfolioModal) {
                closeModal();
            }
        });
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        setupPortfolioModal();
    });

    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('portfolioModal');
    const modalContent = document.getElementById('modalBodyContent');
    const closeModalBtn = document.querySelector('.close-modal-btn');

    portfolioItems.forEach(item => {
        const viewDetailsBtn = item.querySelector('.view-details-btn');
        const projectId = viewDetailsBtn.getAttribute('data-project-id');
        const projectDetails = document.getElementById(`details-${projectId}`);

        viewDetailsBtn.addEventListener('click', () => {
            if (projectDetails) {
                modalContent.innerHTML = projectDetails.innerHTML;
                modal.style.display = 'block';
            }
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

}); // Fim do DOMContentLoaded