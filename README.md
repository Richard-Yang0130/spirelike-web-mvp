# Spirelike Web MVP

网页端卡牌爬塔游戏原型，包含地图路线、战斗、卡牌、敌人意图、奖励、商店、休息点、事件、角色动作和卡牌特效。

## Version

v1.0.0

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
```

## Deploy

GitHub Pages 使用 `gh-pages` 分支部署构建产物：

```bash
GITHUB_PAGES=true npm run build
git subtree push --prefix dist origin gh-pages
```
