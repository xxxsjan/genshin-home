/** 软件 / 资源下载列表 — 有新软件时在这里追加一项即可 */

export type ResourceLink = {
  /** 按钮文案，如「直链下载」「百度网盘」「蓝奏云」 */
  label: string;
  url: string;
  /** direct = 浏览器直接下；cloud = 网盘页面 */
  type: "direct" | "cloud";
};

export type ResourceItem = {
  id: string;
  name: string;
  description?: string;
  version?: string;
  links: ResourceLink[];
};

export const resources: ResourceItem[] = [
  {
    id: "example-app",
    name: "马哈鱼壁纸工具",
    description: "",
    version: "0.1.0",
    links: [
      {
        label: "直链下载",
        url: "",
        type: "direct",
      },
      {
        label: "夸克网盘",
        url: "https://pan.baidu.com/s/xxxxx",
        type: "cloud",
      },
    ],
  },
];
