let styleInserted = false;

export default class SpinButton3D {
  constructor(scene, x, y, text = 'Spin', callback) {
    this.scene = scene;

    // 创建按钮的 HTML 结构
    const html = `
      <button type="button" class="button">
        <div class="button-top">${text}</div>
        <div class="button-bottom"></div>
        <div class="button-base"></div>
      </button>
    `;

    // 使用 Phaser 的 DOM 插件创建 DOM 元素
    this.domElement = scene.add.dom(x, y).createFromHTML(html);
    this.domElement.setOrigin(0.5);

    // 获取按钮和文本元素
    this.button = this.domElement.node.querySelector('button');
    this.textElement = this.domElement.node.querySelector('.button-top');
    this.buttonBottom = this.domElement.node.querySelector('.button-bottom');

    // 绑定点击事件
    if (this.button) {
      this.button.addEventListener('click', () => {
        if (this.enabled && callback) {
          callback();
        }
      });
    }

    this.enabled = true;

    // 插入样式（只插入一次）
    if (!styleInserted) {
      const style = document.createElement('style');
      style.textContent = `
/* From Uiverse.io by njesenberger */ 
.button {
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  border-width: 0;
  padding: 0 8px 12px;
  min-width: 18em;
  box-sizing: border-box;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.button-top {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 0;
  padding: 35px 16px;
  transform: translateY(0);
  text-align: center;
  font-family: Audiowide;
  font-size: 3em;
  color: #fff;
  text-shadow: 0 -1px rgba(0, 0, 0, .25);
  transition-property: transform;
  transition-duration: .2s;
  -webkit-user-select: none;
  user-select: none;
}

.button:active .button-top {
  transform: translateY(6px);
}

.button-top::after {
  content: '';
  position: absolute;
  z-index: -1;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  box-sizing: content-box;
  background-image: radial-gradient(#cd3f64, #9d3656);
  text-align: center;
  color: #fff;
  box-shadow: inset 0 0 0px 1px rgba(255, 255, 255, .2), 0 1px 2px 1px rgba(255, 255, 255, .2);
  transition-property: border-radius, padding, width, transform;
  transition-duration: .2s;
}

.button:active .button-top::after {
  border-radius: 6px;
  padding: 0 2px;
}

.button-bottom {
  position: absolute;
  z-index: -1;
  bottom: 4px;
  left: 4px;
  border-radius: 8px / 16px 16px 8px 8px;
  padding-top: 6px;
  width: calc(100% - 8px);
  height: calc(100% - 10px);
  box-sizing: content-box;
  background-color: #803;
  background-image: radial-gradient(4px 8px at 4px calc(100% - 8px), rgba(255, 255, 255, .25), transparent), radial-gradient(4px 8px at calc(100% - 4px) calc(100% - 8px), rgba(255, 255, 255, .25), transparent), radial-gradient(16px at -4px 0, white, transparent), radial-gradient(16px at calc(100% + 4px) 0, white, transparent);
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.5), inset 0 -1px 3px 3px rgba(0, 0, 0, .4);
  transition-property: border-radius, padding-top;
  transition-duration: .2s;
}

.button:active .button-bottom {
  border-radius: 10px 10px 8px 8px / 8px;
  padding-top: 0;
}

.button-base {
  position: absolute;
  z-index: -2;
  top: 4px;
  left: 0;
  border-radius: 12px;
  width: 100%;
  height: calc(100% - 4px);
  background-color: #233d45;
  box-shadow: 0 1px 1px 0 #233d45, inset 0 2px 2px #233d45;
}

/* 禁用样式 */
.button.disabled {
  pointer-events: none;
}

.button-bottom.disabled {
  background-color: gray !important;
}

.button.disabled .button-top::after {
  background-image: none !important;
  background-color: gray !important;
  box-shadow: none !important;
}
`;
      document.head.appendChild(style);
      styleInserted = true;
    }
  }

  // 启用按钮：恢复样式与交互
  enable() {
    this.enabled = true;
    this.button.disabled = false;
    this.domElement.setAlpha(1);
    this.button.classList.remove('disabled');
    this.buttonBottom.classList.remove('disabled');

  }

  // 禁用按钮：灰色+不可点击
  disable() {
    this.enabled = false;
    this.button.disabled = true;
    this.domElement.setAlpha(0.9);
    this.button.classList.add('disabled');
    this.buttonBottom.classList.add('disabled');
  }

  // 修改按钮文字
  setText(newText) {
    if (this.textElement) {
      this.textElement.textContent = newText;
    }
  }

  // 获取 DOM 元素
  get dom() {
    return this.domElement;
  }

  hide() {
    this.domElement.setVisible(false);
  }

  show() {
    this.domElement.setVisible(true);
  }

  destroy() {
    this.domElement.destroy();
  }
}
