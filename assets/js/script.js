
// Seletor dos elementos do DOM
const drawCnt = document.querySelector(".draw-container");
const drawRes = document.getElementById("draw-result");
const resultContainer = document.getElementById("result");
const count = document.getElementById("draw-count");

// Seletor das respectivas glow-borders e seus botões
const drawBtn = document.getElementById("draw-button");
const newDrawBtn = document.getElementById("new-draw-button");
const drawGlow = drawBtn.closest(".glow-border");
const newDrawGlow = newDrawBtn.closest(".glow-border");
const rotatingSVG = newDrawGlow.querySelector(".rotating-svg");

// Função para obter as configurações do sorteio
function getSettings() {
    const numbersQtt = document.getElementById("quantity").value;
    const min = document.getElementById("min").value;
    const max = document.getElementById("max").value;
    const repeat = document.getElementById("check");
    return {
        numbersQtt: Number(numbersQtt),
        min: Number(min),
        max: Number(max),
        repeat: repeat.checked,
    };
}

// Função para gerar números aleatórios
function generateNumbers(min, max, quantity, allowRepeat) {
    const numbers = [];

    while (numbers.length < quantity) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        // se o checkbox estiver marcado, não repetir números
        if (!allowRepeat && numbers.includes(randomNumber)) {
            continue;
        }
        numbers.push(randomNumber);
    }

    return numbers;
}

// Função para limpar os resultados anteriores
function clearResults() {
    const previousResults = document.querySelectorAll("#result > div");
    previousResults.forEach((result) => {
        result.remove();
    });
}

//Função para criar os elementos de resultado
function createResultElements(numbers) {
    numbers.forEach((number) => {
        const id = new Date().getTime() + Math.floor(Math.random() * 1000);
        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <img src="assets/images/square.svg" alt="">
            <span id="result-number-${id}">${number}</span>
        `;
        resultContainer.append(wrapper);
    });
}

// Função para animar os resultados
function animateResults() {
    const wrappers = document.querySelectorAll("#result > div");

    wrappers.forEach((wrapper, i) => {
        setTimeout(() => {
            wrapper.classList.add("animate");
        }, 1000 + i * 2000);
    });

    // Mostrar botão após todas animações
    const tempoFinal = 1000 + (wrappers.length - 1) * 2000 + 2000; // último + duração da animação
    setTimeout(() => {
        newDrawBtn.classList.add("show");
    }, tempoFinal);
}

// Função para lidar com o sorteio
function handleDraw() {
    // 1) limpar resultados anteriores
    clearResults();

    // 2) buscar configurações do sorteio
    const settings = getSettings();

    // 3) gerar números aleatórios
    const numbers = generateNumbers(
        settings.min,
        settings.max,
        settings.numbersQtt,
        settings.repeat
    );

    // 4) criar novos resultados
    createResultElements(numbers);

    // 5) dispara as animações em sequência
    animateResults();
}

// Função genérica para animar cada botão
function handleButtonHover(glow, button) {
    if (glow.classList.contains("animate-border")) return;

    glow.classList.add("animate-border");

    if (button === drawBtn) {
        const arrowImg = drawBtn.querySelector("img");
        if (arrowImg) {
            arrowImg.classList.add("animate-arrow");
        }
    }

    if (button === newDrawBtn && rotatingSVG) {
        rotatingSVG.classList.add("spin-active");
    }

    setTimeout(() => {
        glow.classList.remove("animate-border");

        if (button === drawBtn) {
            const arrowImg = drawBtn.querySelector("img");
            if (arrowImg) {
                arrowImg.classList.remove("animate-arrow");
            }
        }

        if (button === newDrawBtn && rotatingSVG) {
            rotatingSVG.classList.remove("spin-active");
        }
    }, 2000);
}

// Evento ao clicar em “Sortear”
drawBtn.addEventListener("click", (e) => {
    e.preventDefault();
    count.innerText = 1;

    // esconder o section draw-container e mostrar resultados
    drawCnt.style.display = "none";
    drawRes.style.visibility = "visible";
    drawRes.style.position = "static";
    drawRes.style.pointerEvents = "auto";
    document.querySelector(".wrapper").style.gridTemplateAreas = `
        "header draw-result"
        "instructions draw-result"
    `;

    // função inicializar o sorteio
    handleDraw();
});

// Evento ao clicar em “Novo sorteio”
newDrawBtn.addEventListener("click", (e) => {
    e.preventDefault();
    count.innerText = Number(count.innerText) + 1;

    newDrawBtn.classList.remove("show");
    newDrawGlow.classList.remove("animate-border");

    // função inicializar o sorteio
    handleDraw();
});

// Eventos de mouseenter  dos botões
drawBtn.addEventListener("mouseenter", () =>
    handleButtonHover(drawGlow, drawBtn)
);

newDrawBtn.addEventListener("mouseenter", () =>
    handleButtonHover(newDrawGlow, newDrawBtn)
);
