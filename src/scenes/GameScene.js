import SpinButton3D from '../js/SpinButton3D.js';
import UpDownButton3D from '../js/UpDownButton3D.js';
import SmallUpDownButton3D from '../js/SmallUpDownButton3D.js'
import PayTableButton3D from '../js/PayTableButton3D.js';
import Reel from '../js/Reel.js';
import PopupManager from '../js/PopupManager.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.linesCount = 1;
    this.betCount = 10;
    this.balanceCount = 100000;
    this.winCount = 0;
    this.activeWinLines = []; // 保存当前绘制的中奖线


    // ✅ 第一步：定义 20 条 paylines 常量（每条线是 5 个 [row, col] 坐标）
    this.paylines = [
      // --- 横向直线 ---
      [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], // line 1: top row
      [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]], // line 2: middle row
      [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]], // line 3: bottom row

      // --- 简单斜线 ---
      [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]], // line 4: V 型
      [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]], // line 5: 反 V 型
      [[0, 0], [0, 1], [1, 2], [2, 3], [2, 4]], // line 6: 斜下
      [[2, 0], [2, 1], [1, 2], [0, 3], [0, 4]], // line 7: 斜上

      // --- 对称线 ---
      [[1, 0], [0, 1], [1, 2], [2, 3], [1, 4]], // line 8: 菱形
      [[1, 0], [2, 1], [1, 2], [0, 3], [1, 4]], // line 9: 倒菱形

      // --- W 型 & M 型 ---
      [[0, 0], [2, 1], [0, 2], [2, 3], [0, 4]], // line 10: W 型
      [[2, 0], [0, 1], [2, 2], [0, 3], [2, 4]], // line 11: M 型

      // --- 小波浪线 ---
      [[0, 0], [1, 1], [0, 2], [1, 3], [0, 4]], // line 12: 上波浪
      [[2, 0], [1, 1], [2, 2], [1, 3], [2, 4]], // line 13: 下波浪
      [[1, 0], [2, 1], [1, 2], [2, 3], [1, 4]], // line 14: 下 zigzag
      [[1, 0], [0, 1], [1, 2], [0, 3], [1, 4]], // line 15: 上 zigzag

      // --- 外侧组合 ---
      [[0, 0], [2, 1], [2, 2], [2, 3], [0, 4]], // line 16: 外框下
      [[2, 0], [0, 1], [0, 2], [0, 3], [2, 4]], // line 17: 外框上

      // --- 特殊对角线 ---
      [[0, 0], [1, 1], [2, 2], [2, 3], [2, 4]], // line 18: 左高右低
      [[2, 0], [1, 1], [0, 2], [0, 3], [0, 4]], // line 19: 左低右高

      // --- 蛇形 ---
      [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]]  // line 20: 蛇形
    ];

    this.lineColors = [
      0xFF00FF, // Line 1 - 荧光粉
      0xFF8C00, // Line 2 - 亮橙色
      0x00FFFF, // Line 3 - 亮品蓝色
      0xFF0000, // Line 4 - 鲜红色
      0x00FF00, // Line 5 - 鲜绿色
      0xFFFF00, // Line 6 - 鲜黄色
      0x0000FF, // Line 7 - 电光蓝
      0x8A2BE2, // Line 8 - 亮紫色
      0xDC143C, // Line 9 - 海棠红
      0xFFD700, // Line 10 - 金黄色
      0x7CFC00, // Line 11 - 草木绿
      0x9400D3, // Line 12 - 亮紫色
      0xB22222, // Line 13 - 深红色
      0x1E90FF, // Line 14 - 亮湖蓝
      0xFF4500, // Line 15 - 橘红色
      0xFF69B4, // Line 16 - 亮粉色
      0x6B8E23, // Line 17 - 橄榄绿
      0x4169E1, // Line 18 - 宝石蓝
      0x00CED1, // Line 19 - 亮青色
      0xB8860B  // Line 20 - 金棕色
    ];


  }

  preload() {
    this.load.image('machineFrame', '/assets/reel-frame/cyber080303.png');
    this.load.image('paytable', '/assets/reel-frame/machine-frame4.png');
    for (let i = 1; i <= 10; i++) {
      this.load.image(`symbol${i}`, `/assets/symbols/transparent-symbol/symbol${i}.png`);
    }
  }

  create() {
    const { centerX, centerY, height } = this.cameras.main;

    // 🎯 背景框
    this.add.image(centerX, centerY, 'machineFrame').setDisplaySize(1920, 1080);

    // 🎯 老虎机参数
    const symbolSize = 190, cols = 5, rows = 3, offsetY = 330;
    const startX = centerX - (cols * symbolSize) / 2;
    const startY = centerY - offsetY;

    this.isSpining = false;
    // ✅ 新增：带权重的符号池配置
    const symbolConfig = [
      { key: "symbol10", weight: 7 },  // BITCOIN_A
      { key: "symbol9", weight: 7 },  // BITCOIN_B
      { key: "symbol8", weight: 7 },  // BITCOIN_C
      { key: "symbol7", weight: 7 },  // BITCOIN_D
      { key: "symbol6", weight: 18 }, // GLASS
      { key: "symbol5", weight: 15 }, // DEVICE
      { key: "symbol4", weight: 12 }, // SECURITY
      { key: "symbol3", weight: 10 }, // MOTORCYCLE
      { key: "symbol2", weight: 9 },  // SPEEDER
      { key: "symbol1", weight: 8 }, // JET
    ];

    // ✅ 新增：赔率表（和符号池对应）
    this.payTable = {
      symbol10: { 3: 180, 4: 460, 5: 1370 },  // BITCOIN_A
      symbol9: { 3: 180, 4: 460, 5: 1370 },  // BITCOIN_B
      symbol8: { 3: 180, 4: 460, 5: 1370 },  // BITCOIN_C
      symbol7: { 3: 180, 4: 460, 5: 1370 },  // BITCOIN_D
      symbol6: { 3: 270, 4: 730, 5: 1830 },  // GLASS
      symbol5: { 3: 460, 4: 1100, 5: 2740 }, // DEVICE
      symbol4: { 3: 730, 4: 1830, 5: 4570 }, // SECURITY
      symbol3: { 3: 920, 4: 2290, 5: 7330 }, // MOTORCYCLE
      symbol2: { 3: 1370, 4: 3660, 5: 9160 },// SPEEDER
      symbol1: { 3: 1830, 4: 4580, 5: 13740 } // JET
    };


    // ✅ 修改：把 symbolConfig 传给 Reel
    this.reels = Array.from({ length: cols }, (_, col) => {
      const x = startX + col * symbolSize + symbolSize / 2;
      return new Reel(this, x, startY, symbolSize, symbolConfig);
    });

    // 🎯 按钮
    this.spinButton = new SpinButton3D(this, centerX - 90, height - 250, 'SPIN', () => this.handleSpin());
    this.upLineButton = new UpDownButton3D(this, centerX - 615, height - 238, '▲', () => {
      this.updateCounter("lines", +1, 1, 20, this.linesValueText);
      this.drawPaylines();
    });
    this.downLineButton = new UpDownButton3D(this, centerX - 623, height - 178, '▼', () => {
      this.updateCounter("lines", -1, 1, 20, this.linesValueText);
      this.drawPaylines();
    });
    this.upBetButton = new SmallUpDownButton3D(this, centerX + 217, height - 233, '▲', () => this.updateCounter("bet", +10, 10, 50, this.betValueText));
    this.downBetButton = new SmallUpDownButton3D(this, centerX + 220, height - 173, '▼', () => this.updateCounter("bet", -10, 10, 50, this.betValueText));
    this.payTableButton = new PayTableButton3D(this, centerX - 775, height - 210, "", () => this.handlePayTable(this, centerX, height - 550));

    // 🎯 创建Lines和Bet方框函数
    const createLinesBetBox = (x, y, w, h, label, value, labelSize = 28, valueSize = 60) => {
      const box = this.add.graphics();
      box.fillStyle(0x000000, 1).fillRect(x - w / 2, y - h / 2, w, h).strokeRect(x - w / 2, y - h / 2, w, h);

      this.add.text(x, y - h / 3, label, {
        fontFamily: 'Arial',
        fontSize: `${labelSize}px`,
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5).setFontStyle('italic');

      const valueText = this.add.text(x, y + h / 6, value, {
        fontFamily: 'Arial',
        fontSize: `${valueSize}px`,
        color: '#71F2C4',
        fontStyle: 'bold',
      }).setOrigin(0.5).setFontStyle('italic');

      return valueText;
    };

    // 🎯 创建Lines和Bet方框函数
    const createBalanceWinBox = (x, y, w, h, label, value, labelSize = 28, valueSize = 60) => {
      const box = this.add.graphics();
      box.fillStyle(0x000000, 1).fillRect(x - w / 2, y - h / 2, w, h).strokeRect(x - w / 2, y - h / 2, w, h);

      this.add.text(x, y - h / 6, label, {
        fontFamily: 'Arial',
        fontSize: `${labelSize}px`,
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5).setFontStyle('italic');

      const valueText = this.add.text(x, y + h / 6, value, {
        fontFamily: 'Arial',
        fontSize: `${valueSize}px`,
        color: '#71F2C4',
        fontStyle: 'bold',
      }).setOrigin(0.5).setFontStyle('italic');

      return valueText;
    };

    // 🎯 创建 4 个方框
    this.balanceValueText = createBalanceWinBox(centerX - 690, height - 840, 250, 300, 'BALANCE', this.balanceCount, 50);
    this.winValueText = createBalanceWinBox(centerX - 690, height - 520, 250, 300, 'WIN', this.winCount, 50);
    this.linesValueText = createLinesBetBox(centerX - 400, height - 200, 210, 110, 'LINES', this.linesCount);
    this.betValueText = createLinesBetBox(centerX + 405, height - 200, 210, 110, 'BET', this.betCount);

    // ✅ 遮罩
    const maskShape = this.make.graphics();
    const maskWidth = cols * symbolSize;
    const maskHeight = rows * symbolSize;
    const maskY = startY - 100;
    maskShape.fillStyle(0xffffff).fillRect(startX, maskY, maskWidth, maskHeight);
    maskShape.lineStyle(6, 0xff0000).strokeRect(startX, maskY, maskWidth, maskHeight);

    const mask = maskShape.createGeometryMask();
    this.reels.forEach(reel => reel.container.setMask(mask));

    this.updateSpinButtonState();
  }

  // ✅ 新增：根据余额更新 Spin 按钮状态
  updateSpinButtonState() {
    const betAmount = this.linesCount * this.betCount;
    if (this.balanceCount < betAmount) {
      this.spinButton.disable();
    } else {
      this.spinButton.enable();
    }
  }

  handleSpin() {
    [this.spinButton, this.upLineButton, this.downLineButton, this.upBetButton, this.downBetButton].forEach(btn => btn.disable());

    // ✅ 清空上一次的中奖线
    if (this.activeWinLines.length > 0) {
      this.activeWinLines.forEach(line => line.destroy());
      this.activeWinLines = [];
    }

    // ✅ 清空所有 paylines
    if (this.paylineGraphics) {
      this.paylineGraphics.clear();
    }

    const betAmount = this.linesCount * this.betCount;

    // ✅ 先判断余额是否够
    if (this.balanceCount < betAmount) {
      console.log("余额不足，无法下注！");
      return;
    }

    // ✅ 扣除余额
    this.balanceCount -= betAmount;
    this.balanceValueText.setText(this.balanceCount);

    const baseSymbolsToSpin = 12;
    const baseDuration = 1200;
    const delayBetweenReels = 200;

    this.reels.forEach((reel, i) => {
      const delay = i * delayBetweenReels;
      const symbolsToSpin = baseSymbolsToSpin + i * 2;
      const duration = baseDuration + i * 100;
      reel.spin(delay, symbolsToSpin, duration);
    });

    const totalSpinTime =
      delayBetweenReels * this.reels.length +
      baseDuration +
      (this.reels.length - 1) * 100;

    setTimeout(() => {
      [this.spinButton, this.upLineButton, this.downLineButton, this.upBetButton, this.downBetButton].forEach(btn => btn.enable());
      this.checkWins();   // ✅ 转完后检查中奖
      this.updateSpinButtonState(); // ✅ Spin 完成后再检查一次
    }, totalSpinTime);
  }

  checkWins() {
    let totalWin = 0;
    const winningLines = [];

    for (let i = 0; i < this.linesCount; i++) {
      const line = this.paylines[i];
      const symbolsOnLine = line.map(([row, col]) => this.reels[col].symbols[row]);
      const keys = symbolsOnLine.map(s => s.texture.key);

      let count = 1;
      let currentSymbol = keys[0];
      for (let j = 1; j < keys.length; j++) {
        if (keys[j] === currentSymbol) {
          count++;
        } else {
          break;
        }
      }

      if (count >= 3) {
        // ✅ 修改：根据 payTable 获取真实赔率
        const payout = this.payTable[currentSymbol]?.[count] || 0;
        const lineWin = payout * (this.betCount / 10);
        // 这里我假设你的 betCount = 10 表示 1 倍下注，如果 betCount 增加，赔率随之放大

        totalWin += lineWin;

        winningLines.push({ index: i, symbolsOnLine, count });
      }
    }

    if (totalWin > 0) {
      this.winCount = totalWin;
      this.winValueText.setText(this.winCount);

      this.balanceCount += totalWin;
      this.balanceValueText.setText(this.balanceCount);

      this.showWinningLinesSequentially(winningLines);
    } else {
      this.winCount = 0;
      this.winValueText.setText(this.winCount);
    }
    // ✅ 中奖结算后检查余额
    this.updateSpinButtonState();
  }




  /**
   * 连环高亮显示中奖线
   */
  showWinningLinesSequentially(winningLines) {
    winningLines.forEach(({ index, symbolsOnLine }, i) => {
      const color = this.lineColors[index]; // ✅ 每条线固定颜色

      const g = this.add.graphics();
      g.lineStyle(8, color, 1);

      g.beginPath();
      g.moveTo(
        symbolsOnLine[0].parentContainer.x + symbolsOnLine[0].x,
        symbolsOnLine[0].parentContainer.y + symbolsOnLine[0].y
      );

      symbolsOnLine.forEach(symbol => {
        g.lineTo(
          symbol.parentContainer.x + symbol.x,
          symbol.parentContainer.y + symbol.y
        );
      });

      g.strokePath();

      // ✅ 保存中奖线
      this.activeWinLines.push(g);

      // ✅ 无限循环闪烁
      this.tweens.add({
        targets: g,
        alpha: 0,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        delay: i * 1000
      });
    });
  }


  // 🎯 通用的数值更新函数
  updateCounter(type, step, min, max, textObj) {
    let value = this[`${type}Count`];
    value += step;

    if (value > max) value = min;
    if (value < min) value = max;

    this[`${type}Count`] = value;
    textObj.setText(value);


    // ✅ 如果是修改 lines，就重绘 paylines
    if (type === "lines") {
      this.drawPaylines();
    }

    // ✅ 每次修改 lines 或 bet 后检查余额
    if (type === "lines" || type === "bet") {
      this.updateSpinButtonState();
    }
  }

  drawPaylines() {
    if (this.paylineGraphics) {
      this.paylineGraphics.clear();
    } else {
      this.paylineGraphics = this.add.graphics();
    }

    for (let i = 0; i < this.linesCount; i++) {
      const line = this.paylines[i];
      const isActive = (i === this.linesCount - 1);

      // ✅ 当前线：专属颜色 + 粗
      // ✅ 其他线：统一灰色 + 细
      const color = isActive ? this.lineColors[i % this.lineColors.length] : 0x808080;
      const thickness = isActive ? 8 : 3;

      this.paylineGraphics.lineStyle(thickness, color, 1);
      this.paylineGraphics.beginPath();

      for (let j = 0; j < line.length; j++) {
        const [row, col] = line[j];
        const symbol = this.reels[col].symbols[row];
        const x = symbol.x + this.reels[col].container.x;
        const y = symbol.y + this.reels[col].container.y;

        if (j === 0) {
          this.paylineGraphics.moveTo(x, y);
        } else {
          this.paylineGraphics.lineTo(x, y);
        }
      }

      this.paylineGraphics.strokePath(); // 🚀 每条线单独 stroke
    }
  }

  handlePayTable(scene, x, y) {
    this.popupManager = new PopupManager(scene, x, y);
  }

}
