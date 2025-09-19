let styleInserted = false;

export default class PopupManager {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.injectStyles();

    const html = `           
        <div class="uiverse-pixel-card">
          <div class="uiverse-card-header">
            PAY TABLE
            <button class="uiverse-close-btn">X</button>
          </div>
          <div class="card">
            <div class="card-image"><img src="/assets/symbols/transparent-symbol/symbol1.png" alt=""></div>
            <div class="category"> JET </div>
            <div class="heading">5.&nbsp13740<br>4.&nbsp4580&nbsp<br>3.&nbsp1830&nbsp<br>2.&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</div>
          </div>
          <div class="card">
            <div class="card-image"><img src="/assets/symbols/transparent-symbol/symbol2.png" alt=""></div>
            <div class="category"> SPEEDER </div>
            <div class="heading">5.&nbsp9160<br>4.&nbsp3660<br>3.&nbsp1370<br>2.&nbsp&nbsp&nbsp&nbsp&nbsp</div>
          </div>
          <div class="card">
            <div class="card-image"><img src="/assets/symbols/transparent-symbol/symbol3.png" alt=""></div>
            <div class="category"> MOTORCYCLE </div>
            <div class="heading">5.&nbsp7330<br>4.&nbsp2290<br>3.&nbsp920&nbsp<br>2.&nbsp&nbsp&nbsp&nbsp&nbsp</div>
          </div>
          <div class="card">
            <div class="card-image"><img src="/assets/symbols/transparent-symbol/symbol4.png" alt=""></div>
            <div class="category"> SECURITY </div>
            <div class="heading">5.&nbsp4570<br>4.&nbsp1830<br>3.&nbsp730&nbsp<br>2.&nbsp&nbsp&nbsp&nbsp&nbsp</div>
          </div>
          <div class="card">
            <div class="card-image"><img src="/assets/symbols/transparent-symbol/symbol5.png" alt=""></div>
            <div class="category"> DEVICE </div>
            <div class="heading">5.&nbsp2740<br>4.&nbsp1100<br>3.&nbsp460&nbsp<br>2.&nbsp&nbsp&nbsp&nbsp&nbsp</div>
          </div>
          <div class="card">
            <div class="card-image"><img src="/assets/symbols/transparent-symbol/symbol6.png" alt=""></div>
            <div class="category"> GLASS </div>
            <div class="heading">5.&nbsp1830<br>4.&nbsp730&nbsp<br>3.&nbsp270&nbsp<br>2.&nbsp&nbsp&nbsp&nbsp&nbsp</div>
          </div>
          <div class="card">
            <div class="card-image"><img src="/assets/symbols/transparent-symbol/symbol7.png" alt=""></div>
            <div class="category"> BITCOIN </div>
            <div class="heading">5.&nbsp1370<br>4.&nbsp460&nbsp<br>3.&nbsp180&nbsp<br>2.&nbsp&nbsp&nbsp&nbsp&nbsp</div>
          </div>
          <div class="card">
            <div class="card-image"><img src="/assets/symbols/transparent-symbol/symbol8.png" alt=""></div>
            <div class="category"> BITCOIN </div>
            <div class="heading">5.&nbsp1370<br>4.&nbsp460&nbsp<br>3.&nbsp180&nbsp<br>2.&nbsp&nbsp&nbsp&nbsp&nbsp</div>
          </div>
          <div class="card">
            <div class="card-image"><img src="/assets/symbols/transparent-symbol/symbol9.png" alt=""></div>
            <div class="category"> BITCOIN </div>
            <div class="heading">5.&nbsp1370<br>4.&nbsp460&nbsp<br>3.&nbsp180&nbsp<br>2.&nbsp&nbsp&nbsp&nbsp&nbsp</div>
          </div>
          <div class="card">
            <div class="card-image"><img src="/assets/symbols/transparent-symbol/symbol10.png" alt=""></div>
            <div class="category"> BITCOIN </div>
            <div class="heading">5.&nbsp1370<br>4.&nbsp460&nbsp<br>3.&nbsp180&nbsp<br>2.&nbsp&nbsp&nbsp&nbsp&nbsp</div>
          </div>
        </div>
        `;
    this.domElement = scene.add.dom(x, y).createFromHTML(html);

    // 绑定关闭事件
    const closeBtn = this.domElement.node.querySelector(".uiverse-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

  }

  injectStyles() {
    if (styleInserted) return;

    const style = document.createElement("style");
    style.textContent = `
        .card {
        height:450px;
        background: white;
        padding: .4em;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        }

        .card-image {
        background-color: none;
        width: 100%;
        height: 230px;
        border-radius: 6px 6px 0 0;
        overflow: hidden;         
        display: flex;
        align-items: center;      
        justify-content: center;  
        }

        .card-image img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;   /* 完整显示图片，保持比例 */
        border-radius: 6px 6px 0 0;
        }

        .card-image:hover {
        transform: scale(0.98);
        }

        .category {
        text-transform: uppercase;
        font-size: 1.7em;
        font-weight: 600;
        color: rgb(63, 121, 230);
        padding: 10px 7px 0;
        text-align: center;
        }

        .category:hover {
        cursor: pointer;
        }

        .heading {
        font-size:1.7em;
        font-weight: 600;
        color: rgb(88, 87, 87);
        padding: 7px;
        text-align: center;   /* 文字居中 */
        }


        .heading:hover {
        cursor: pointer;
        }

        .author {
        color: gray;
        font-weight: 400;
        font-size: 11px;
        padding-top: 20px;
        }

        .name {
        font-weight: 600;
        }

        .name:hover {
        cursor: pointer;
        }

        .uiverse-pixel-card {
          font-family: "Courier New", monospace;
          font-size: 1em;
          background: #ff6b35;
          color: #fff;
          width: 1750px;
          height: auto;
          padding: 1em;
          image-rendering: pixelated;
          text-shadow: 1px 1px #000;
          box-shadow:
            0 0 0 0.15em #000,
            0 0 0 0.3em #fff,
            0 0 0 0.45em #000,
            0 0.5em 0 0 #d1451e,
            0 0.5em 0 0.15em #000;
          transition: transform 0.2s steps(1);

          display: grid;
          grid-template-columns: repeat(5, 1fr); /* 每行 5 列 */
          grid-template-rows: repeat(2, auto);   /* 总共 2 行 */
          gap: 1em;
        }

        .uiverse-pixel-card:hover {
          transform: translateY(-0.2em);
          animation: uiverse-card-glitch 0.3s steps(2) infinite;
          background: #ff8c42;
        }

        .uiverse-card-header {
        grid-column: 1 / -1;   /* 独占整行 */
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 0em;
        border-bottom: 2px solid #000;
        padding-bottom: 0.25em;
        text-align: center;
        }

        .uiverse-close-btn {
          background: #ff0000;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 1em;
          padding: 0.2em 0.5em;
        }

        .uiverse-close-btn:hover {
          background: #cc0000;
        }

        .uiverse-card-body p {
        margin: 0.5em 0;
        line-height: 1.4;
        }

        .status {
        color: #00ff99;
        font-weight: bold;
        text-shadow: 1px 1px #000;
        }

        /* Glitch animation */
        @keyframes uiverse-card-glitch {
        0% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(-1px, 1px);
        }
        50% {
            transform: translate(1px, -1px);
        }
        75% {
            transform: translate(-1px, -1px);
        }
        100% {
            transform: translate(0, 0);
        }
        }
        `;
    document.head.appendChild(style);
    styleInserted = true;
  }

  close() {
    if (this.domElement) {
      this.domElement.destroy();
      this.domElement = null;
    }
  }
}
