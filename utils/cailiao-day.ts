import dayjs from "dayjs";

export type CailiaoGridItem = {
  name: string;
  area: string;
  time: string;
  data?: TujianItem[];
  role?: {
    title: string;
    content_id: number;
    tianfu?: string;
    image?: TujianItem;
  }[];
};

export type CailiaoDayResult = {
  tianfudata: CailiaoGridItem[];
  renderWuqi: WuqiTupoCailiaoItem[][];
};

export const weekLabelMap: Record<number, string> = {
  1: "周一/周四",
  2: "周二/周五",
  3: "周三/周六",
  4: "周一/周四",
  5: "周二/周五",
  6: "周三/周六",
  0: "周日",
};

/** 游戏日刷新：凌晨 4 点前算前一天 */
export function getGameDayOfWeek(now = dayjs()): number {
  const hour = Number(now.format("HH"));
  if (hour < 4) {
    const prev = now.day() - 1;
    return prev === -1 ? 6 : prev;
  }
  return now.day();
}

function numberToChinese(num: number) {
  const digits = ["日", "一", "二", "三", "四", "五", "六", "日"];
  return digits[num];
}

export function createCailiaoData(
  day: number,
  src: GenshinHomeBundle
): CailiaoDayResult {
  const wuqiData = src.tujian_wuqi;
  const beibao = src.tujian_beibao;
  const imageData = src.tujian_role;
  const roleWithTianfu = src.roleWithTianfu;
  const wuqiTupoCailiaoData = src.wuqiTupoCailiao;

  const tupocailiaoMap = [
    ["凛风奔狼", "高塔孤王", "狮牙斗士"],
    ["雾海云间", "孤云寒林", "漆黑陨铁"],
    ["鸣神御灵", "远海夷地", "今昔剧画"],
    ["绿洲花园", "谧林涓露", "烈日威权"],
    ["悠古弦音", "纯圣露滴", "无垢之海"],
  ];

  function filterWuqiTupoCailiao() {
    const reg = new RegExp(numberToChinese(day));
    const res = JSON.parse(
      JSON.stringify(wuqiTupoCailiaoData)
    ) as WuqiTupoCailiaoItem[];
    const filtered = res.filter((f) => f.info?.getWay?.[0]?.match(reg));

    filtered.forEach((item) => {
      item.info.wuqi = item.info.wuqi.filter((f) => {
        const found = wuqiData.find((m) => m.title === f.name);
        if (found) {
          f.content_id = found.content_id;
          return true;
        }
        return false;
      });
    });
    return filtered;
  }

  const renderSource = filterWuqiTupoCailiao();
  const nextRenderWuqi: WuqiTupoCailiaoItem[][] = Array.from({
    length: tupocailiaoMap.length,
  }).map(() => []);

  function findMapIndex(str: string) {
    for (const [key, value] of Object.entries(tupocailiaoMap)) {
      if (value.find((f) => str.match(new RegExp(f)))) {
        return Number(key);
      }
    }
    return -1;
  }

  while (renderSource.length) {
    const item = renderSource.shift()!;
    const index = findMapIndex(item.title);
    if (index > -1) nextRenderWuqi[index].push(item);
  }

  const talentBooks = [
    { name: "「自由」", area: "蒙德", time: "周一/周四" },
    { name: "「繁荣」", area: "璃月", time: "周一/周四" },
    { name: "「浮世」", area: "稻妻", time: "周一/周四" },
    { name: "「诤言」", area: "须弥", time: "周一/周四" },
    { name: "「公平」", area: "枫丹", time: "周一/周四" },
    { name: "「抗争」", area: "蒙德", time: "周二/周五" },
    { name: "「勤劳」", area: "璃月", time: "周二/周五" },
    { name: "「风雅」", area: "稻妻", time: "周二/周五" },
    { name: "「巧思」", area: "须弥", time: "周二/周五" },
    { name: "「正义」", area: "枫丹", time: "周二/周五" },
    { name: "「诗文」", area: "蒙德", time: "周三/周六" },
    { name: "「黄金」", area: "璃月", time: "周三/周六" },
    { name: "「天光」", area: "稻妻", time: "周三/周六" },
    { name: "「笃行」", area: "须弥", time: "周三/周六" },
    { name: "「秩序」", area: "枫丹", time: "周三/周六" },
  ];

  const useData: CailiaoGridItem[] = talentBooks.filter(
    (f) => day === 7 || f.time.match(new RegExp(numberToChinese(day)))
  );

  useData.forEach((item) => {
    item.data = beibao.filter((f) => f.title.indexOf(item.name) > -1);
    item.role = roleWithTianfu
      .filter((f) => f.tianfu && f.tianfu === item.name)
      .map((it) => ({
        ...it,
        image: imageData.find((f) => f.title === it.title),
      }));
  });

  const nextTianfu: CailiaoGridItem[] = [
    useData.find((f) => f.area === "蒙德") as CailiaoGridItem,
    useData.find((f) => f.area === "璃月") as CailiaoGridItem,
    useData.find((f) => f.area === "稻妻") as CailiaoGridItem,
    useData.find((f) => f.area === "须弥") as CailiaoGridItem,
    useData.find((f) => f.area === "枫丹") as CailiaoGridItem,
  ];

  return {
    tianfudata: nextTianfu,
    renderWuqi: nextRenderWuqi,
  };
}

/** 从当日材料结果里抽出角色列表（去重） */
export function flattenTodayRoles(result: CailiaoDayResult) {
  const map = new Map<
    string,
    { title: string; content_id: number; icon: string }
  >();
  for (const area of result.tianfudata) {
    if (!area?.role) continue;
    for (const role of area.role) {
      if (!map.has(role.title)) {
        map.set(role.title, {
          title: role.title,
          content_id: role.content_id,
          icon: role.image?.icon ?? "",
        });
      }
    }
  }
  return [...map.values()];
}

/** 从当日材料结果里抽出武器列表（去重） */
export function flattenTodayWeapons(result: CailiaoDayResult) {
  const map = new Map<
    string,
    { name: string; icon: string; content_id?: number }
  >();
  for (const group of result.renderWuqi) {
    for (const mat of group) {
      for (const w of mat.info?.wuqi ?? []) {
        if (!map.has(w.name)) {
          map.set(w.name, {
            name: w.name,
            icon: w.src,
            content_id: w.content_id,
          });
        }
      }
    }
  }
  return [...map.values()];
}
