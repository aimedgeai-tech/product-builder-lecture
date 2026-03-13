import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

class PandaScene {
    constructor(containerId) {
        try {
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
        } catch (e) {
            console.error("Three.js Init Error:", e);
        }
    }

    createPanda() {
        this.pandaGroup = new THREE.Group();
        const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const blackMat = new THREE.MeshLambertMaterial({ color: 0x222222 });

        const headGeo = new THREE.SphereGeometry(1, 32, 32);
        this.head = new THREE.Mesh(headGeo, whiteMat);
        this.pandaGroup.add(this.head);

        const earGeo = new THREE.SphereGeometry(0.35, 16, 16);
        const leftEar = new THREE.Mesh(earGeo, blackMat);
        leftEar.position.set(-0.75, 0.75, 0);
        this.head.add(leftEar);
        const rightEar = new THREE.Mesh(earGeo, blackMat);
        rightEar.position.set(0.75, 0.75, 0);
        this.head.add(rightEar);

        const patchGeo = new THREE.SphereGeometry(0.28, 16, 16);
        const leftPatch = new THREE.Mesh(patchGeo, blackMat);
        leftPatch.position.set(-0.35, 0.1, 0.85);
        this.head.add(leftPatch);
        const rightPatch = new THREE.Mesh(patchGeo, blackMat);
        rightPatch.position.set(0.35, 0.1, 0.85);
        this.head.add(rightPatch);

        const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
        const leftEye = new THREE.Mesh(eyeGeo, whiteMat);
        leftEye.position.set(-0.05, 0.05, 0.25);
        leftPatch.add(leftEye);
        const rightEye = new THREE.Mesh(eyeGeo, whiteMat);
        rightEye.position.set(0.05, 0.05, 0.25);
        rightPatch.add(rightEye);

        const bodyGeo = new THREE.SphereGeometry(1.1, 32, 32);
        this.body = new THREE.Mesh(bodyGeo, whiteMat);
        this.body.position.set(0, -1.6, 0);
        this.pandaGroup.add(this.body);

        const armGeo = new THREE.CylinderGeometry(0.25, 0.2, 1.2);
        this.leftArm = new THREE.Mesh(armGeo, blackMat);
        this.leftArm.position.set(-1.1, -1.2, 0.5);
        this.leftArm.rotation.z = Math.PI / 4;
        this.pandaGroup.add(this.leftArm);
        this.rightArm = new THREE.Mesh(armGeo, blackMat);
        this.rightArm.position.set(1.1, -1.2, 0.5);
        this.rightArm.rotation.z = -Math.PI / 4;
        this.pandaGroup.add(this.rightArm);

        this.scene.add(this.pandaGroup);
        this.pandaGroup.position.y = 0.5;
    }

    animate() {
        requestAnimationFrame(this.animate);
        const time = Date.now();
        if (!this.isDrawing) {
            this.pandaGroup.rotation.y = Math.sin(time * 0.001) * 0.15;
            this.head.rotation.y = Math.sin(time * 0.0015) * 0.1;
        } else {
            this.pandaGroup.rotation.y = Math.sin(time * 0.015) * 0.3;
            this.pandaGroup.position.y = 0.5 + Math.abs(Math.sin(time * 0.01)) * 0.4;
        }
        this.renderer.render(this.scene, this.camera);
    }

    drawLotto(callback) {
        if (!this.renderer) { if(callback) callback(); return; }
        this.isDrawing = true;
        setTimeout(() => {
            this.isDrawing = false;
            this.pandaGroup.position.y = 0.5;
            this.pandaGroup.rotation.y = 0;
            if (callback) callback();
        }, 1500);
    }
}

let pandaApp = null;

class LottoDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.displayNumbers(this.generateLottoNumbers(), true);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .lotto-numbers {
                    display: flex;
                    gap: 0.8rem;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    min-height: 60px;
                    flex-wrap: wrap;
                }
                .number-ball {
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    font-weight: bold;
                    color: white;
                    background: linear-gradient(135deg, #6e8efb, #a777e3);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    opacity: 0;
                    transform: scale(0.5);
                    animation: popIn 0.5s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .bonus-ball { background: linear-gradient(135deg, #f093fb, #f5576c); }
                .plus-icon { font-size: 1.2rem; color: #888; font-weight: bold; opacity: 0; animation: fadeIn 0.5s forwards; }
                @keyframes popIn { to { opacity: 1; transform: scale(1); } }
                @keyframes fadeIn { to { opacity: 1; } }
                .loading-text { font-size: 1.1rem; color: #666; font-weight: bold; animation: pulse 1s infinite alternate; }
                @keyframes pulse { from { opacity: 0.6; } to { opacity: 1; } }
            </style>
            <div class="lotto-numbers"></div>
        `;
        this.numbersContainer = this.shadowRoot.querySelector('.lotto-numbers');
    }

    async generateAndDisplayNumbers(saveToDB = true) {
        const numbers = this.generateLottoNumbers();
        if (pandaApp && pandaApp.renderer) {
            this.numbersContainer.innerHTML = '<span class="loading-text">판다가 번호를 뽑고 있어요... 🐼✨</span>';
            pandaApp.drawLotto(async () => {
                this.displayNumbers(numbers, false);
                if (saveToDB) await this.saveToDB(numbers);
            });
        } else {
            this.displayNumbers(numbers, false);
            if (saveToDB) await this.saveToDB(numbers);
        }
    }

    generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) numbers.add(Math.floor(Math.random() * 45) + 1);
        const mainNumbers = Array.from(numbers).sort((a, b) => a - b);
        let bonusNumber;
        do { bonusNumber = Math.floor(Math.random() * 45) + 1; } while (mainNumbers.includes(bonusNumber));
        return { mainNumbers, bonusNumber, timestamp: new Date() };
    }

    displayNumbers({ mainNumbers, bonusNumber }, immediate = false) {
        this.numbersContainer.innerHTML = ''; 
        mainNumbers.forEach((num, index) => {
            const ball = document.createElement('div');
            ball.className = 'number-ball';
            ball.textContent = num;
            if (immediate) { ball.style.animation = 'none'; ball.style.opacity = '1'; ball.style.transform = 'scale(1)'; }
            else { ball.style.animationDelay = \`\${index * 0.1}s\`; }
            this.numbersContainer.appendChild(ball);
        });
        const plus = document.createElement('div');
        plus.className = 'plus-icon';
        plus.textContent = '+';
        if (immediate) plus.style.opacity = '1'; else plus.style.animationDelay = '0.6s';
        this.numbersContainer.appendChild(plus);
        const bonus = document.createElement('div');
        bonus.className = 'number-ball bonus-ball';
        bonus.textContent = bonusNumber;
        if (immediate) { bonus.style.animation = 'none'; bonus.style.opacity = '1'; bonus.style.transform = 'scale(1)'; }
        else { bonus.style.animationDelay = '0.7s'; }
        this.numbersContainer.appendChild(bonus);
    }

    async saveToDB(data) {
        if (!window.firebaseDB) return;
        try {
            const { db, collection, addDoc } = window.firebaseDB;
            await addDoc(collection(db, "lotto_history"), data);
        } catch (e) { console.error("Save Error:", e); }
    }
}

customElements.define('lotto-display', LottoDisplay);

document.addEventListener('DOMContentLoaded', () => {
    try {
        pandaApp = new PandaScene('panda-canvas');
    } catch(e) { console.error(e); }

    const genBtn = document.getElementById('generate-btn');
    if (genBtn) {
        genBtn.addEventListener('click', () => {
            const display = document.querySelector('lotto-display');
            if (display) display.generateAndDisplayNumbers(true);
        });
    }

    const checkDB = setInterval(() => {
        if (window.firebaseDB) {
            initHistory();
            clearInterval(checkDB);
        }
    }, 1000);
});

function initHistory() {
    try {
        const { db, collection, query, orderBy, limit, onSnapshot } = window.firebaseDB;
        const q = query(collection(db, "lotto_history"), orderBy("timestamp", "desc"), limit(5));
        onSnapshot(q, (snap) => {
            const list = document.getElementById('history-list');
            if (!list) return;
            list.innerHTML = '';
            snap.forEach(doc => {
                const d = doc.data();
                const li = document.createElement('li');
                li.className = 'history-item';
                li.innerHTML = \`
                    <span class="history-date">\${d.timestamp?.toDate().toLocaleString() || ''}</span>
                    <div class="history-balls">
                        \${d.mainNumbers.map(n => \`<span class="small-ball">\${n}</span>\`).join('')}
                        <span class="small-plus">+</span>
                        <span class="small-ball bonus">\${d.bonusNumber}</span>
                    </div>
                \`;
                list.appendChild(li);
            });
        });
    } catch(e) { console.error("History Init Error:", e); }
}
