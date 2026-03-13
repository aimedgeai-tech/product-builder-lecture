import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

class PandaScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;
        this.camera.position.y = 0.2;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(5, 10, 7);
        this.scene.add(dirLight);

        this.createPanda();

        this.animate = this.animate.bind(this);
        this.isDrawing = false;
        this.animate();
        
        window.addEventListener('resize', () => {
            if (!this.container || this.container.clientWidth === 0) return;
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });
    }

    createPanda() {
        this.pandaGroup = new THREE.Group();

        const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const blackMat = new THREE.MeshLambertMaterial({ color: 0x222222 });

        // Head
        const headGeo = new THREE.SphereGeometry(1, 32, 32);
        this.head = new THREE.Mesh(headGeo, whiteMat);
        this.pandaGroup.add(this.head);

        // Ears
        const earGeo = new THREE.SphereGeometry(0.35, 16, 16);
        const leftEar = new THREE.Mesh(earGeo, blackMat);
        leftEar.position.set(-0.75, 0.75, 0);
        this.head.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeo, blackMat);
        rightEar.position.set(0.75, 0.75, 0);
        this.head.add(rightEar);

        // Eyes (black patches)
        const patchGeo = new THREE.SphereGeometry(0.28, 16, 16);
        const leftPatch = new THREE.Mesh(patchGeo, blackMat);
        leftPatch.position.set(-0.35, 0.1, 0.85);
        leftPatch.rotation.z = Math.PI / 4;
        this.head.add(leftPatch);

        const rightPatch = new THREE.Mesh(patchGeo, blackMat);
        rightPatch.position.set(0.35, 0.1, 0.85);
        rightPatch.rotation.z = -Math.PI / 4;
        this.head.add(rightPatch);

        // Eye whites
        const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const leftEye = new THREE.Mesh(eyeGeo, whiteMat);
        leftEye.position.set(-0.05, 0.05, 0.25);
        leftPatch.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeo, whiteMat);
        rightEye.position.set(0.05, 0.05, 0.25);
        rightPatch.add(rightEye);

        // Nose
        const noseGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const nose = new THREE.Mesh(noseGeo, blackMat);
        nose.position.set(0, -0.2, 0.98);
        this.head.add(nose);
        
        // Body
        const bodyGeo = new THREE.SphereGeometry(1.1, 32, 32);
        this.body = new THREE.Mesh(bodyGeo, whiteMat);
        this.body.position.set(0, -1.6, 0);
        this.pandaGroup.add(this.body);

        // Arms
        const armGeo = new THREE.CylinderGeometry(0.25, 0.2, 1.2);
        this.leftArm = new THREE.Mesh(armGeo, blackMat);
        this.leftArm.position.set(-1.1, -1.2, 0.5);
        this.leftArm.rotation.z = Math.PI / 4;
        this.leftArm.rotation.x = -Math.PI / 6;
        this.pandaGroup.add(this.leftArm);

        this.rightArm = new THREE.Mesh(armGeo, blackMat);
        this.rightArm.position.set(1.1, -1.2, 0.5);
        this.rightArm.rotation.z = -Math.PI / 4;
        this.rightArm.rotation.x = -Math.PI / 6;
        this.pandaGroup.add(this.rightArm);

        this.scene.add(this.pandaGroup);
        this.pandaGroup.position.y = 0.5;
    }

    animate() {
        requestAnimationFrame(this.animate);
        
        const time = Date.now();

        if (!this.isDrawing) {
            // Idle animation
            this.pandaGroup.rotation.y = Math.sin(time * 0.001) * 0.15;
            this.head.rotation.y = Math.sin(time * 0.0015) * 0.1;
            this.leftArm.rotation.x = -Math.PI / 6 + Math.sin(time * 0.002) * 0.05;
            this.rightArm.rotation.x = -Math.PI / 6 + Math.cos(time * 0.002) * 0.05;
        } else {
            // Magic drawing animation
            this.pandaGroup.rotation.y = Math.sin(time * 0.015) * 0.3;
            this.leftArm.rotation.z = Math.PI / 3 + Math.sin(time * 0.02) * 0.4;
            this.rightArm.rotation.z = -Math.PI / 3 + Math.cos(time * 0.02) * 0.4;
            this.leftArm.rotation.x = -Math.PI / 2 + Math.sin(time * 0.03) * 0.5;
            this.rightArm.rotation.x = -Math.PI / 2 + Math.cos(time * 0.03) * 0.5;
            this.pandaGroup.position.y = 0.5 + Math.abs(Math.sin(time * 0.01)) * 0.4;
        }

        this.renderer.render(this.scene, this.camera);
    }

    drawLotto(callback) {
        this.isDrawing = true;
        setTimeout(() => {
            this.isDrawing = false;
            // Reset positions smoothly
            this.pandaGroup.position.y = 0.5;
            this.leftArm.rotation.z = Math.PI / 4;
            this.leftArm.rotation.x = -Math.PI / 6;
            this.rightArm.rotation.z = -Math.PI / 4;
            this.rightArm.rotation.x = -Math.PI / 6;
            this.pandaGroup.rotation.y = 0;
            this.head.rotation.y = 0;
            if (callback) callback();
        }, 1500);
    }
}

// Global instance
let pandaApp = null;

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
                min-height: 60px;
            }
            .number-ball {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
                font-weight: bold;
                color: white;
                background: linear-gradient(135deg, #6e8efb, #a777e3);
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
                opacity: 0;
                transform: scale(0.5) translateY(20px);
                animation: popIn 0.5s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .number-ball:hover {
                transform: scale(1.1) !important;
            }
            .bonus-ball {
                background: linear-gradient(135deg, #f093fb, #f5576c);
            }
            .plus-icon {
                font-size: 1.5rem;
                color: #888;
                font-weight: bold;
                opacity: 0;
                animation: fadeIn 0.5s forwards;
            }
            @keyframes popIn {
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            .loading-text {
                font-size: 1.1rem;
                color: #666;
                font-weight: bold;
                animation: pulse 1s infinite alternate;
            }
            @keyframes pulse {
                from { opacity: 0.6; }
                to { opacity: 1; }
            }
        `;
        this.numbersContainer = document.createElement('div');
        this.numbersContainer.classList.add('lotto-numbers');
        shadow.appendChild(style);
        shadow.appendChild(this.numbersContainer);
        
        // Initial setup
        this.displayNumbers(this.generateLottoNumbers(), true);
    }

    async generateAndDisplayNumbers(saveToDB = true) {
        if (pandaApp) {
            this.numbersContainer.innerHTML = '<span class="loading-text">판다가 번호를 뽑고 있어요... 🐼✨</span>';
            pandaApp.drawLotto(async () => {
                const numbers = this.generateLottoNumbers();
                this.displayNumbers(numbers, false);
                
                if (saveToDB && window.firebaseDB) {
                    await this.saveNumbersToFirestore(numbers);
                }
            });
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

    displayNumbers({ mainNumbers, bonusNumber }, immediate = false) {
        this.numbersContainer.innerHTML = ''; 
        
        mainNumbers.forEach((num, index) => {
            const ball = document.createElement('div');
            ball.classList.add('number-ball');
            ball.textContent = num;
            if (immediate) {
                ball.style.animation = 'none';
                ball.style.opacity = '1';
                ball.style.transform = 'scale(1)';
            } else {
                ball.style.animationDelay = \`\${index * 0.1}s\`;
            }
            this.numbersContainer.appendChild(ball);
        });

        const plusIcon = document.createElement('div');
        plusIcon.classList.add('plus-icon');
        plusIcon.textContent = '+';
        if (immediate) {
            plusIcon.style.animation = 'none';
            plusIcon.style.opacity = '1';
        } else {
            plusIcon.style.animationDelay = \`\${mainNumbers.length * 0.1}s\`;
        }
        this.numbersContainer.appendChild(plusIcon);

        const bonusBall = document.createElement('div');
        bonusBall.classList.add('number-ball', 'bonus-ball');
        bonusBall.textContent = bonusNumber;
        if (immediate) {
            bonusBall.style.animation = 'none';
            bonusBall.style.opacity = '1';
            bonusBall.style.transform = 'scale(1)';
        } else {
            bonusBall.style.animationDelay = \`\${(mainNumbers.length + 1) * 0.1}s\`;
        }
        this.numbersContainer.appendChild(bonusBall);
    }

    async saveNumbersToFirestore(data) {
        if (!window.firebaseDB) return;
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
            li.innerHTML = \`
                <span class="history-date">\${dateStr}</span>
                <div class="history-balls">
                    \${data.mainNumbers.map(n => \`<span class="small-ball">\${n}</span>\`).join('')}
                    <span class="small-plus">+</span>
                    <span class="small-ball bonus">\${data.bonusNumber}</span>
                </div>
            \`;
            historyList.appendChild(li);
        });
    });
}

// Initializations
window.addEventListener('DOMContentLoaded', () => {
    pandaApp = new PandaScene('panda-canvas');
    
    document.getElementById('generate-btn').addEventListener('click', () => {
        const lottoDisplay = document.querySelector('lotto-display');
        lottoDisplay.generateAndDisplayNumbers(true);
    });

    const checkFirebase = setInterval(() => {
        if (window.firebaseDB) {
            initHistoryListener();
            clearInterval(checkFirebase);
        }
    }, 500);
});
