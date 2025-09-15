let styleInserted = false;
export default class UpDownButton3D {
    constructor(scene, x, y, text, onClick) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.text = text || "▲";
        this.onClick = onClick;

        this.injectStyles();

        const html = `           
            <button class="button-name" role="button">${this.text}</button>
        `;

        this.domElement = scene.add.dom(x, y).createFromHTML(html);

        this.button = this.domElement.node.querySelector('.button-name');

        if (this.button) {
            this.button.addEventListener('click', () => {
                if (this.enabled && onClick) {
                    onClick();
                }
            });
        }

        this.enabled = true;
    }

    injectStyles() {
        if (styleInserted) return;

        const style = document.createElement('style');
        style.textContent = `
.button-name {
  display: inline-block;
  padding: 10px 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  color: #fff;
  background-color: #ff5252;
  border: 2px solid #000;
  border-radius: 10px;
  box-shadow: 5px 5px 0px #000;
  transition: all 0.3s ease;
  cursor: pointer;
  transform: skewX(-10deg);
}

.button-name:hover {
  background-color: #fff;
  color: #ff5252;
  border: 2px solid #ff5252;
  box-shadow: 5px 5px 0px #ff5252;
}

.button-name:active {
  background-color: #fcf414;
  box-shadow: none;
  transform: translateY(4px);
}

/* 禁用状态 */
.button-name.disabled {
  background-color: gray !important;
  color: #ccc !important;
  border: 2px solid #666 !important;
  box-shadow: none !important;
  cursor: not-allowed !important;
  pointer-events: none;
}
`;
        document.head.appendChild(style);
        styleInserted = true;
    }

    // 启用按钮
    enable() {
        this.enabled = true;
        this.button.disabled = false;
        this.domElement.setAlpha(1);
        this.button.classList.remove('disabled');
    }

    // 禁用按钮
    disable() {
        this.enabled = false;
        this.button.disabled = true;
        this.domElement.setAlpha(0.9);
        this.button.classList.add('disabled');
    }
}
