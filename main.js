import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';

const FOOD_DATA = [
    { name: "비빔밥", category: "korean", tip: "각종 나물과 고추장의 조화! 건강한 한 끼를 원하신다면 추천합니다.", img: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=600&auto=format&fit=crop" },
    { name: "삼겹살", category: "korean", tip: "오늘 하루 수고한 당신에게 주는 보상! 지글지글 고기 파티 어때요?", img: "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?q=80&w=600&auto=format&fit=crop" },
    { name: "김치찌개", category: "korean", tip: "얼큰하고 칼칼한 국물이 생각날 때! 밥 한 그릇 뚝딱입니다.", img: "https://images.unsplash.com/photo-1583213334190-7815b81a044d?q=80&w=600&auto=format&fit=crop" },
    { name: "짜장면", category: "chinese", tip: "남녀노소 누구나 좋아하는 국민 외식! 오늘 저녁은 중식 어때요?", img: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=600&auto=format&fit=crop" },
    { name: "마라탕", category: "chinese", tip: "스트레스 풀리는 매콤함! 좋아하는 재료 가득 담아 드셔보세요.", img: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=600&auto=format&fit=crop" },
    { name: "초밥", category: "japanese", tip: "깔끔하고 신선한 저녁을 원하신다면! 다양한 맛을 즐겨보세요.", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop" },
    { name: "라멘", category: "japanese", tip: "진한 국물과 쫄깃한 면발의 조화! 뜨끈한 국물이 일품입니다.", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop" },
    { name: "돈카츠", category: "japanese", tip: "겉바속촉의 정석! 바삭한 튀김 옷 안의 육즙을 느껴보세요.", img: "https://images.unsplash.com/photo-1548946522-4a313e8972a4?q=80&w=600&auto=format&fit=crop" },
    { name: "피자", category: "western", tip: "친구들과 함께 즐기기 좋은 메뉴! 고소한 치즈가 듬뿍!", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop" },
    { name: "파스타", category: "western", tip: "분위기 있는 저녁을 원하신다면! 다양한 소스의 파스타를 추천합니다.", img: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=600&auto=format&fit=crop" },
    { name: "스테이크", category: "western", tip: "근사한 저녁 식사! 육즙 가득한 스테이크로 단백질 충전!", img: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?q=80&w=600&auto=format&fit=crop" },
    { name: "치킨", category: "special", tip: "오늘 저녁은 치맥 어때요? 바삭한 튀김과 시원한 맥주 한 잔!", img: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop" },
    { name: "햄버거", category: "special", tip: "간편하게 즐기는 든든한 한 끼! 프렌치 프라이도 잊지 마세요.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop" },
    { name: "쌀국수", category: "special", tip: "속 편한 저녁을 원하신다면! 시원한 국물의 쌀국수를 추천합니다.", img: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=600&auto=format&fit=crop" }
];

const CHEF_QUOTES = [
    "음... 이 메뉴는 어떠신가요?",
    "오늘따라 이 음식이 정말 맛있어 보이네요!",
    "후회 없는 선택이 될 거예요!",
    "판다 셰프 강력 추천 메뉴입니다!",
    "재료가 신선할 때 꼭 드셔보세요!"
];

class PandaChef {
    constructor(containerId) {
        try {
            this.container = document.getElementById(containerId);
            if (!this.container) return;
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.container.appendChild(this.renderer.domElement);
            this.camera.position.z = 4.5;
            this.camera.position.y = 0.2;
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
            this.scene.add(ambientLight);
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
            dirLight.position.set(5, 10, 7);
            this.scene.add(dirLight);
            this.createPanda();
            this.isAnimating = false;
            this.animate();
            window.addEventListener('resize', () => {
                if (!this.container || this.container.clientWidth === 0) return;
                this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            });
        } catch (e) { console.error(e); }
    }

    createPanda() {
        this.pandaGroup = new THREE.Group();
        const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const blackMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const hatMat = new THREE.MeshLambertMaterial({ color: 0xffffff });

        // Head & Body
        const head = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), whiteMat);
        const body = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), whiteMat);
        body.position.set(0, -1.6, 0);
        this.pandaGroup.add(head);
        this.pandaGroup.add(body);

        // Chef Hat
        const hatBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4), hatMat);
        hatBase.position.set(0, 1.1, 0);
        head.add(hatBase);
        const hatTop = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), hatMat);
        hatTop.position.set(0, 1.4, 0);
        head.add(hatTop);

        // Ears, Patches, Eyes (simplified for performance)
        [-0.75, 0.75].forEach(x => {
            const ear = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), blackMat);
            ear.position.set(x, 0.75, 0);
            head.add(ear);
            const patch = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), blackMat);
            patch.position.set(x * 0.45, 0.1, 0.85);
            head.add(patch);
        });

        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), blackMat);
        nose.position.set(0, -0.2, 0.98);
        head.add(nose);

        this.scene.add(this.pandaGroup);
        this.pandaGroup.position.y = 0.3;
        this.head = head;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const time = Date.now();
        if (!this.isAnimating) {
            this.pandaGroup.rotation.y = Math.sin(time * 0.001) * 0.1;
            this.head.rotation.x = Math.sin(time * 0.0015) * 0.05;
        } else {
            this.pandaGroup.rotation.y = Math.sin(time * 0.02) * 0.5;
            this.pandaGroup.position.y = 0.3 + Math.abs(Math.sin(time * 0.01)) * 0.5;
        }
        this.renderer.render(this.scene, this.camera);
    }

    startCooking(callback) {
        this.isAnimating = true;
        setTimeout(() => {
            this.isAnimating = false;
            this.pandaGroup.position.y = 0.3;
            this.pandaGroup.rotation.y = 0;
            if (callback) callback();
        }, 1500);
    }
}

class FoodDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { width: 100%; display: block; }
                .food-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    animation: slideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .food-image {
                    width: 220px;
                    height: 220px;
                    border-radius: 50%;
                    object-fit: cover;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    border: 6px solid #ff9f43;
                    margin-bottom: 1.5rem;
                }
                .food-name {
                    font-size: 2rem;
                    font-weight: 800;
                    margin: 0.5rem 0;
                    color: #ee5253;
                }
                .food-tip {
                    font-size: 1rem;
                    opacity: 0.9;
                    max-width: 90%;
                    line-height: 1.6;
                    color: #4a3b30;
                }
                .placeholder { font-size: 1.2rem; color: #888; font-style: italic; }
            </style>
            <div id="container">
                <div class="placeholder">셰프 판다에게 추천을 요청해보세요! 🐼🍚</div>
            </div>
        `;
        this.container = this.shadowRoot.getElementById('container');
    }

    update(food) {
        this.container.innerHTML = `
            <div class="food-card">
                <img src="${food.img}" alt="${food.name}" class="food-image">
                <div class="food-name">${food.name}</div>
                <div class="food-tip">${food.tip}</div>
            </div>
        `;
    }
}

customElements.define('food-display', FoodDisplay);

// Logic initialization
let chef = null;
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    chef = new PandaChef('panda-canvas');
    
    const display = document.querySelector('food-display');
    const quoteEl = document.getElementById('chef-quote');
    const recommendBtn = document.getElementById('recommend-btn');
    const categoryBtns = document.querySelectorAll('.category-btn');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
        });
    });

    recommendBtn.addEventListener('click', () => {
        if (chef.isAnimating) return;
        
        quoteEl.textContent = "...요리하는 중... 🐼🔥";
        chef.startCooking(() => {
            const filtered = currentCategory === 'all' 
                ? FOOD_DATA 
                : FOOD_DATA.filter(f => f.category === currentCategory);
            
            const randomFood = filtered[Math.floor(Math.random() * filtered.length)];
            display.update(randomFood);
            quoteEl.textContent = `"${CHEF_QUOTES[Math.floor(Math.random() * CHEF_QUOTES.length)]}"`;
        });
    });
});
