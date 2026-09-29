declare global {
  type RoleTianfu = {
    title: string;
    content_id: number;
    tianfu?: string;
    checkedAt?: string;
  };

  type TujianItem = {
    content_id: number;
    title: string;
    ext: string;
    icon: string;
    bbs_url?: string;
    article_user_name?: string;
    article_time?: string;
    avatar_url?: string;
    summary?: string;
  };

  type WuqiTupoCailiaoItem = {
    content_id: number;
    title: string;
    ext: string;
    icon: string;
    bbs_url?: string;
    article_user_name?: string;
    article_time?: string;
    avatar_url?: string;
    summary?: string;
    info: {
      imgSrc: string;
      name: string;
      getWay: string[];
      describe: string;
      wuqi: {
        name: string;
        src: string;
        count: string;
        content_id?: number;
      }[];
    };
    checkedAt?: string;
  };

  type GenshinHomeBundle = {
    updatedAt: string;
    meta: {
      roleCount: number;
      wuqiCount: number;
      beibaoCount: number;
      cailiaoCount: number;
    };
    tujian_role: TujianItem[];
    tujian_wuqi: TujianItem[];
    tujian_beibao: TujianItem[];
    roleWithTianfu: RoleTianfu[];
    wuqiTupoCailiao: WuqiTupoCailiaoItem[];
    source?: string;
    synced?: {
      roleTianfu: number;
      wuqiCailiao: number;
      pendingRole: number;
      pendingCailiao: number;
    };
    error?: string;
  };
}

export {};
