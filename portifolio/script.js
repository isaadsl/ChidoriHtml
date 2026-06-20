    function efeitoDigitacao() {
    const elemento = document.querySelector('.hero-tag');
    if (!elemento) return;

    const textoCompleto = elemento.textContent;
    elemento.textContent = '';

    let index = 0;
    const velocidade = 35;

    function digitar() {
      if (index < textoCompleto.length) {
        elemento.textContent += textoCompleto.charAt(index);
        index++;
        setTimeout(digitar, velocidade);
      }
    }

    digitar();
  }

  efeitoDigitacao();
  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observer.unobserve(entrada.target);
      }
    });
  }, {
    threshold: 0.15
  });
  const elementosAnimados = document.querySelectorAll('.missao-card, .certificado-card');
  elementosAnimados.forEach((el) => observer.observe(el));