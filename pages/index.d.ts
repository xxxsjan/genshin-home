type RoleWithTianfu = {
  title: string;
  content_id: number;
  tianfu: string;
}[];
type WuqiData = {
  content_id: number;
  title: string;
  ext: string;
  icon: string;
  bbs_url: string;
  article_user_name: string;
  article_time: string;
  avatar_url: string;
  summary: string;
}[];

type Beibao = {
  content_id: number;
  title: string;
  ext: string;
  icon: string;
  bbs_url: string;
  article_user_name: string;
  article_time: string;
  avatar_url: string;
  summary: string;
}[];
type WuqiTupoCailiaoData = {
  content_id: number;
  title: string;
  ext: string;
  icon: string;
  bbs_url: string;
  article_user_name: string;
  article_time: string;
  avatar_url: string;
  summary: string;
  info: {
    imgSrc: string;
    name: string;
    getWay: string[];
    describe: string;
    wuqi: {
      name: string;
      src: string;
      count: string;
    }[];
  };
}[];
type ImageData = {
  content_id: number;
  title: string;
  ext: string;
  icon: string;
  bbs_url: string;
  article_user_name: string;
  article_time: string;
  avatar_url: string;
  summary: string;
};
type ImageDataList = Array<ImageData>;
