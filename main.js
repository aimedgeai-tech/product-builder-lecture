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
                justify-content: center;
                padding: 20px;
                border-radius: 15px;
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
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            .number-ball:hover {
                transform: scale(1.1);
            }
            .bonus-ball {
                background: linear-gradient(135deg, #f093fb, #f5576c);
            }
            .plus-icon {
                font-size: 1.5rem;
                color: #888;
                font-weight: bold;
            }
        `;
        this.numbersContainer = document.createElement('div');
        this.numbersContainer.classList.add('lotto-numbers');
        shadow.appendChild(style);
        shadow.appendChild(this.numbersContainer);
        
        this.generateAndDisplayNumbers(false);
    }

    async generateAndDisplayNumbers(saveToDB = true) {
        const numbers = this.generateLottoNumbers();
        this.displayNumbers(numbers);
        
        if (saveToDB && window.firebaseDB) {
            await this.saveNumbersToFirestore(numbers);
        }
    }

    generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        const mainNumbers = Array.from(numbers).sort((a, b) => a - b);
        let bonusNumber;
        do {
            bonusNumber = Math.floor(Math.random() * 45) + 1;
        } while (mainNumbers.includes(bonusNumber));
        return { mainNumbers, bonusNumber, timestamp: new Date() };
    }

    displayNumbers({ mainNumbers, bonusNumber }) {
        this.numbersContainer.innerHTML = ''; 
        mainNumbers.forEach(num => {
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

    async saveNumbersToFirestore(data) {
        const { db, collection, addDoc } = window.firebaseDB;
        try {
            await addDoc(collection(db, "lotto_history"), data);
        } catch (e) {
            console.error("Firestore Save Error:", e);
        }
    }
}

customElements.define('lotto-display', LottoDisplay);

function initHistoryListener() {
    if (!window.firebaseDB) return;
    const { db, collection, query, orderBy, limit, onSnapshot } = window.firebaseDB;
    const q = query(collection(db, "lotto_history"), orderBy("timestamp", "desc"), limit(5));
    
    onSnapshot(q, (snapshot) => {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;
        historyList.innerHTML = '';
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            const li = document.createElement('li');
            li.className = 'history-item';
            const dateStr = data.timestamp?.toDate().toLocaleString() || '방금 전';
            li.innerHTML = `
                <span class="history-date">${dateStr}</span>
                <div class="history-balls">
                    ${data.mainNumbers.map(n => `<span class="small-ball">${n}</span>`).join('')}
                    <span class="small-plus">+</span>
                    <span class="small-ball bonus">${data.bonusNumber}</span>
                </div>
            `;
            historyList.appendChild(li);
        });
    });
}

const checkFirebase = setInterval(() => {
    if (window.firebaseDB) {
        initHistoryListener();
        clearInterval(checkFirebase);
    }
}, 500);

document.getElementById('generate-btn').addEventListener('click', () => {
    const lottoDisplay = document.querySelector('lotto-display');
    lottoDisplay.generateAndDisplayNumbers(true);
});
