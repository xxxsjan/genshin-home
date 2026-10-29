/**
 * 角色武器伤害期望榜单。
 *
 * 约定：以该角色「专武精 1」为 100% 基准（金一），其余武器相对换算。
 * 数据来自公开攻略整理，不同来源/配队/词条假设会有偏差，仅供参考。
 * 新增角色：在 wuqiEvRanking 末尾追加一项即可。
 */

export type WuqiEvWeapon = {
  /** 武器名，需与 tujian_wuqi.title 一致以便匹配图标 */
  name: string;
  /** 相对专武精1的期望百分比 */
  expect: number;
  /** 精炼，如「精1」「精5」；缺省按条目 note / 来源约定 */
  refine?: string;
  /** 补充条件，如「满层」「触发增伤」 */
  note?: string;
};

export type WuqiEvCharacter = {
  /** 角色名，需与 tujian_role.title 一致 */
  character: string;
  /** 专武名（基准 100%） */
  signature: string;
  /** 计算场景说明，如配队 */
  scenario?: string;
  /** 数据出处简述 */
  source?: string;
  /** 参考攻略链接 */
  sourceUrl?: string;
  weapons: WuqiEvWeapon[];
};

export const wuqiEvRanking: WuqiEvCharacter[] = [
  {
    character: "薇斯纳",
    signature: "蝶变",
    scenario:
      "Prydwen · Vodyanitsa Sustain 队伍列；已换算为专武精1=100%（原文以引火之源精5为100%）",
    source: "Prydwen Vesna Build",
    sourceUrl: "https://www.prydwen.gg/genshin-impact/characters/vesna",
    weapons: [
      { name: "蝶变", expect: 100, refine: "精1" },
      { name: "白湖冬羽", expect: 93.68, refine: "精1" },
      { name: "新枝", expect: 88.23, refine: "精5" },
      { name: "磐岩结绿", expect: 85.1, refine: "精1", note: "暴击易溢出" },
      { name: "赦罪", expect: 84.57, refine: "精1" },
      { name: "裁叶萃光", expect: 84.5, refine: "精1" },
      { name: "苍耀", expect: 84.11, refine: "精1" },
      {
        name: "雾切之回光",
        expect: 83.86,
        refine: "精1",
        note: "88%暴伤白板代表",
      },
      {
        name: "熔猎异端之刃",
        expect: 83.08,
        refine: "精5",
        note: "特效按75%覆盖",
      },
      { name: "波乱月白经津", expect: 82.87, refine: "精1" },
      { name: "新枝", expect: 82.3, refine: "精1" },
      { name: "引火之源", expect: 80.18, refine: "精5" },
      {
        name: "熔猎异端之刃",
        expect: 79.63,
        refine: "精1",
        note: "特效按75%覆盖",
      },
      { name: "银釭", expect: 78.4, refine: "精5" },
    ],
  },
  {
    character: "菲林斯",
    signature: "血染荒城",
    scenario:
      "Prydwen · DPS Team；已换算为专武精1=100%（原文以掘金之锹精5为100%）",
    source: "Prydwen Flins Build",
    sourceUrl: "https://www.prydwen.gg/genshin-impact/characters/flins",
    weapons: [
      { name: "血染荒城", expect: 100, refine: "精1" },
      { name: "赤沙之杖", expect: 95.5, refine: "精1", note: "半轴约1层" },
      { name: "支离轮光", expect: 95.5, refine: "精1" },
      { name: "护摩之杖", expect: 94.59, refine: "精1", note: "生命>50%" },
      { name: "决斗之枪", expect: 93.69, refine: "精5", note: "对单" },
      { name: "和璞鸢", expect: 93.69, refine: "精1" },
      { name: "峡湾长歌", expect: 91.89, refine: "精5", note: "队内3元素" },
      { name: "决斗之枪", expect: 91.89, refine: "精1", note: "对单" },
      { name: "掘金之锹", expect: 90.09, refine: "精5" },
      { name: "峡湾长歌", expect: 90.09, refine: "精1", note: "队内3元素" },
      { name: "风信之锋", expect: 89.19, refine: "精5" },
      { name: "且住亭御咄", expect: 88.29, refine: "精5" },
    ],
  },
  {
    character: "丝柯克",
    signature: "苍耀",
    scenario:
      "丝柯克 + 爱可菲 + 芙宁娜 + 夜兰 · 深廊终曲攻攻暴；专武精1=100%",
    source: "小黑盒/3楼猫 武器伤害期望对比（可莉本莉）",
    sourceUrl: "https://game.3loumao.org/761192027",
    weapons: [
      { name: "苍耀", expect: 100, refine: "精1" },
      { name: "波乱月白经津", expect: 87.51, refine: "精1" },
      { name: "雾切之回光", expect: 86.1, refine: "精1", note: "满被动" },
      { name: "磐岩结绿", expect: 85.78, refine: "精1" },
      { name: "雾切之回光", expect: 83.25, refine: "精1", note: "2层被动" },
      {
        name: "厄水之祸",
        expect: 83.07,
        refine: "精5",
        note: "夜兰换满命塔利雅（带盾）",
      },
      { name: "赦罪", expect: 81.28, refine: "精1" },
      {
        name: "斫峰之刃",
        expect: 79.16,
        refine: "精1",
        note: "夜兰换满命塔利雅（带盾）",
      },
      { name: "有乐御簾切", expect: 78.37, refine: "精1" },
      { name: "斫峰之刃", expect: 77.07, refine: "精1", note: "有护盾" },
      { name: "海渊终曲", expect: 76.91, refine: "精5" },
      { name: "裁叶萃光", expect: 76.68, refine: "精1" },
      { name: "静水流涌之辉", expect: 74.37, refine: "精1" },
      { name: "黑剑", expect: 74.3, refine: "精5" },
      { name: "黑岩长剑", expect: 71.82, refine: "精5" },
      { name: "黑剑", expect: 69.79, refine: "精1" },
    ],
  },
  {
    character: "玛薇卡",
    signature: "焚曜千阳",
    scenario: "茜特菈莉 + 希诺宁 + 班尼特 · 站场融化",
    source: "17173 武器伤害能力分析（V5.3）",
    sourceUrl: "https://news.17173.com/z/ys/content/01082025/142652174.shtml",
    weapons: [
      { name: "焚曜千阳", expect: 100, refine: "精1" },
      { name: "螭骨剑", expect: 91, refine: "精5", note: "满层（理论）" },
      { name: "苇海信标", expect: 88, refine: "精1" },
      { name: "赤角石溃杵", expect: 87, refine: "精1" },
      { name: "裁断", expect: 86, refine: "精1" },
      { name: "螭骨剑", expect: 85, refine: "精1", note: "满层（理论）" },
      { name: "狼的末路", expect: 85, refine: "精1", note: "敌方生命<30%" },
      { name: "山王长牙", expect: 81, refine: "精1" },
      { name: "狼的末路", expect: 78, refine: "精1", note: "常规" },
      { name: "聊聊棒", expect: 77, refine: "精1" },
      { name: "浪影阔剑", expect: 75, refine: "精5" },
      { name: "饰铁之花", expect: 75, refine: "精5" },
    ],
  },
  {
    character: "那维莱特",
    signature: "万世流涌大典",
    scenario: "那芙万希 · 四逐影 · 重击期望",
    source: "17173 V5.2 武器选择攻略",
    sourceUrl: "https://news.17173.com/z/ys/content/12122024/211903684.shtml",
    weapons: [
      { name: "流浪乐章", expect: 100.7, refine: "精5", note: "触发增伤" },
      { name: "万世流涌大典", expect: 100, refine: "精1" },
      { name: "遗祀玉珑", expect: 97.7, refine: "精5" },
      { name: "冲浪时光", expect: 87.7, refine: "精1" },
      { name: "遗祀玉珑", expect: 87.4, refine: "精1" },
      { name: "金流监督", expect: 82.9, refine: "精1" },
      { name: "乘浪的回旋", expect: 82.5, refine: "精5" },
      { name: "四风原典", expect: 81.4, refine: "精1", note: "2层" },
      { name: "神乐之真意", expect: 80.3, refine: "精1" },
      { name: "流浪乐章", expect: 74.3, refine: "精5", note: "不触发增伤" },
      { name: "碧落之珑", expect: 72.8, refine: "精1" },
      { name: "不灭月华", expect: 72.8, refine: "精1" },
      { name: "图莱杜拉的回忆", expect: 71.7, refine: "精1" },
      { name: "乘浪的回旋", expect: 71.4, refine: "精1" },
      { name: "试作金珀", expect: 70.7, refine: "精5" },
    ],
  },
  {
    character: "阿蕾奇诺",
    signature: "赤月之形",
    scenario:
      "Prydwen · Vape Solo；已换算为专武精1=100%（原文以白缨枪精5为100%）",
    source: "Prydwen Arlecchino Build",
    sourceUrl: "https://www.prydwen.gg/genshin-impact/characters/arlecchino",
    weapons: [
      {
        name: "赤沙之杖",
        expect: 103.13,
        refine: "精1",
        note: "精通沙/杯",
      },
      { name: "赤月之形", expect: 100, refine: "精1" },
      { name: "护摩之杖", expect: 94.53, refine: "精1" },
      { name: "决斗之枪", expect: 89.06, refine: "精5", note: "对单" },
      { name: "和璞鸢", expect: 89.06, refine: "精1" },
      { name: "峡湾长歌", expect: 85.94, refine: "精5" },
      { name: "决斗之枪", expect: 84.38, refine: "精1", note: "对单" },
      { name: "峡湾长歌", expect: 82.81, refine: "精1" },
      { name: "风信之锋", expect: 80.47, refine: "精5" },
      { name: "圣祭者的辉杖", expect: 76.56, refine: "精5" },
    ],
  },
  {
    character: "恰斯卡",
    signature: "星鹫赤羽",
    scenario: "黑曜4 · 班尼特 + 芙宁娜 + 莱依拉（公开攻略整理）",
    source: "玩一玩 / 米游社攻略转载（2024-11）",
    sourceUrl: "https://www.wywyx.com/news/202411/485106.html",
    weapons: [
      { name: "星鹫赤羽", expect: 100, refine: "精1" },
      { name: "最初的大魔术", expect: 81.8, refine: "精1" },
      { name: "若水", expect: 81.3, refine: "精1" },
      { name: "缀花之翎", expect: 80.7, refine: "精5" },
      { name: "烈阳之嗣", expect: 80.3, refine: "精5", note: "触发特效" },
      { name: "冬极白星", expect: 79.1, refine: "精1" },
      { name: "黑岩战弓", expect: 78.5, refine: "精5", note: "3层特效" },
      { name: "猎人之径", expect: 77.7, refine: "精1" },
      { name: "飞雷之弦振", expect: 76.2, refine: "精1" },
      { name: "天空之翼", expect: 74.5, refine: "精1" },
      { name: "静谧之曲", expect: 72.0, refine: "精5", note: "触发特效" },
      { name: "阿莫斯之弓", expect: 71.4, refine: "精1" },
      { name: "烈阳之嗣", expect: 70.8, refine: "精1", note: "触发特效" },
      { name: "缀花之翎", expect: 69.9, refine: "精1" },
      { name: "黑岩战弓", expect: 69.9, refine: "精1", note: "3层特效" },
      { name: "碎链", expect: 67.7, refine: "精5" },
      { name: "黑岩战弓", expect: 67.1, refine: "精5", note: "1层特效" },
      { name: "静谧之曲", expect: 65.6, refine: "精1", note: "触发特效" },
      { name: "黑岩战弓", expect: 64.1, refine: "精1", note: "1层特效" },
      { name: "碎链", expect: 63.7, refine: "精1" },
    ],
  },
 
];
