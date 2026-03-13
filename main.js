class LottoDisplay extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = `
            .lotto-numbers {
                display: flex;
                gap: 1rem;
                align-items: center;
            }
            .number-ball {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                font-weight: bold;
                color: white;
                background-color: var(--primary-color);
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .bonus-ball {
                background-color: var(--secondary-color);
            }
            .plus-icon {
                font-size: 2rem;
                color: #999;
            }
        `;
        this.numbersContainer = document.createElement('div');
        this.numbersContainer.classList.add('lotto-numbers');
        shadow.appendChild(style);
        shadow.appendChild(this.numbersContainer);
        this.generateAndDisplayNumbers();
    }

    generateAndDisplayNumbers() {
        const numbers = this.generateLottoNumbers();
        this.displayNumbers(numbers);
    }

    generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        const mainNumbers = Array.from(numbers);
        let bonusNumber;
        do {
            bonusNumber = Math.floor(Math.random() * 45) + 1;
        } while (mainNumbers.includes(bonusNumber));
        return { mainNumbers, bonusNumber };
    }

    displayNumbers({ mainNumbers, bonusNumber }) {
        this.numbersContainer.innerHTML = ''; 
        mainNumbers.sort((a, b) => a - b).forEach(num => {
            const ball = document.createElement('div');
            ball.classList.add('number-ball');
            ball.textContent = num;
            this.numbersContainer.appendChild(ball);
        });

        const plusIcon = document.createElement('div');
        plusIcon.classList.add('plus-icon');
        plusIcon.textContent = '+';
        this.numbersContainer.appendChild(plusIcon);

        const bonusBall = document.createElement('div');
        bonusBall.classList.add('number-ball', 'bonus-ball');
        bonusBall.textContent = bonusNumber;
        this.numbersContainer.appendChild(bonusBall);
    }
}

customElements.define('lotto-display', LottoDisplay);

document.getElementById('generate-btn').addEventListener('click', () => {
    const lottoDisplay = document.querySelector('lotto-display');
    lottoDisplay.generateAndDisplayNumbers();
});
