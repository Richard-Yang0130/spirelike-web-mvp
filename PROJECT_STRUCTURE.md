# 项目结构

当前目录是《杀戮尖塔 Like》网页卡牌爬塔游戏工程与设计文档仓库。

```text
Game/
├── README.md
├── PROJECT_STRUCTURE.md
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/assets/
│   ├── cards/                  # Image2 生成卡牌图
│   ├── characters/             # 玩家角色与动作图
│   ├── enemies/                # 敌人与动作图
│   ├── scenes/                 # 战斗/地图/商店等场景图
│   ├── relics/                 # 遗物图
│   ├── nodes/                  # 地图节点图
│   ├── skills/                 # 初始技能图
│   └── _source/                # 原始图集
├── src/
│   ├── components/             # React UI 与屏幕
│   ├── data/                   # 卡牌、敌人、遗物、事件数据
│   ├── game/                   # 战斗、地图、跑团、商店规则
│   ├── lib/                    # 资源与随机数工具
│   └── styles/                 # 视觉样式与动画
├── tests/core-loop.test.ts
├── 02-第1轮-PRD-杀戮尖塔Like网页核心循环.md
├── 02-第1轮-DESIGN-杀戮尖塔Like网页核心循环.md
├── 杀戮尖塔-实现逻辑与架构拆解.md
├── .agents/
├── .claude/
└── 0-前置安装/
```

## 关键文件

| 路径 | 说明 |
|---|---|
| `src/components/GameShell.tsx` | 游戏主状态机与屏幕调度 |
| `src/components/screens/BattleScreen.tsx` | 2.5D 战斗界面 |
| `src/components/ui/CardFxLayer.tsx` | 卡牌触发特效层 |
| `src/data/cards.ts` | 卡牌定义与每张卡的动画元数据 |
| `src/game/combat.ts` | 战斗规则、出牌结算、敌人回合 |
| `src/styles/game-ui.css` | 游戏界面、角色动作、敌人动作、卡牌特效样式 |
| `README.md` | 本地运行、测试、构建与 Pages 部署说明 |
