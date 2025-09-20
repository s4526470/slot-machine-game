let styleInserted = false;
export default class {
    constructor(scene, x, y, text, onClick) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.text = text || "PAY<br>TABLE";
        this.onClick = onClick;

        this.injectStyles();

        const html = `           
            <button class="paytable-button">${this.text}</button>
        `;

        this.domElement = scene.add.dom(x, y).createFromHTML(html);

        // 点击事件
        this.domElement.addListener('click');
        this.domElement.on('click', (event) => {
            event.preventDefault();
            if (this.onClick) {
                this.onClick();
            }
        });
    }

    injectStyles() {
        if (styleInserted) return;

        const style = document.createElement('style');
        style.textContent = `
.paytable-button {
  color: #ecf0f1;
  font-family: Audiowide;
  font-size: 2em;
  background-color: #e67e22;
  border: 1px solid #f39c12;
  border-radius: 5px;
  cursor: pointer;
  padding: 40px 27px 40px 27px;
  box-shadow: 0px 6px 0px #d35400;
  transition: all 0.1s;
  transform: skewX(-12deg);
}

.paytable-button:active {
  box-shadow: 0px 2px 0px #d35400;
  position: relative;
  top: 2px;
}

`;

        document.head.appendChild(style);
        styleInserted = true;
    }
}