export default class Reel {
  // ✅ 修改 symbolKeys → symbolConfig
  constructor(scene, x, y, symbolSize, symbolConfig) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.symbolSize = symbolSize;
    this.symbolConfig = symbolConfig; // ✅ 保存符号池配置

    this.symbols = [];
    this.container = scene.add.container(x, y);

    // 初始化 3 个 symbol，垂直排列
    for (let i = 0; i < 3; i++) {
      const key = this.getRandomSymbol(); // ✅ 修改：使用带权重随机
      const symbol = scene.add.image(0, i * symbolSize, key);
      symbol.setDisplaySize(symbolSize, symbolSize);
      this.container.add(symbol);
      this.symbols.push(symbol);
    }
  }

  // ✅ 新增：带权重随机函数
  getRandomSymbol() {
    const totalWeight = this.symbolConfig.reduce((sum, s) => sum + s.weight, 0);
    const rnd = Math.random() * totalWeight;
    let acc = 0;

    for (const s of this.symbolConfig) {
      acc += s.weight;
      if (rnd < acc) {
        return s.key;
      }
    }
    return this.symbolConfig[this.symbolConfig.length - 1].key; // fallback
  }

  spin(delay = 0, totalSymbolsToSpin = 10, spinDuration = 1000) {
    const { scene, symbolSize, container } = this;
    const newSymbols = [];

    // 生成新 symbol（多于可见区域）
    for (let i = 0; i < totalSymbolsToSpin; i++) {
      const key = this.getRandomSymbol(); // ✅ 修改：带权重随机
      const symbol = scene.add.image(0, -symbolSize * (i + 1), key);
      symbol.setDisplaySize(symbolSize, symbolSize);
      container.addAt(symbol, 0);
      newSymbols.unshift(symbol);
    }

    // 添加旧 symbols 到滚动队列的末尾
    this.symbols.forEach(s => newSymbols.push(s));

    // 动画下滚
    newSymbols.forEach(symbol => {
      scene.tweens.add({
        targets: symbol,
        y: symbol.y + totalSymbolsToSpin * symbolSize,
        duration: spinDuration,
        delay,
        ease: 'Cubic.easeInOut'
      });
    });

    // 动画完成后清理
    scene.time.delayedCall(delay + spinDuration, () => {
      newSymbols.forEach(symbol => {
        if (symbol.y >= 3 * symbolSize) {
          container.remove(symbol, true);
        }
      });

      this.symbols = newSymbols.filter(symbol => symbol.y < 3 * symbolSize);

      this.symbols.forEach((symbol, i) => {
        symbol.y = i * symbolSize;
      });
    });
  }
}
