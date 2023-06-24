// https://nuxt.com/docs/guide/directory-structure/server

export default defineEventHandler((event) => {
  const query = getQuery(event);
  console.log('query: ', query);

  // 抛错
  // throw createError({
  //   statusCode: 400,
  //   statusMessage: 'ID should be an integer',
  // })

  // 返回其他状态码
  // setResponseStatus(event, 202)

  return {
    hello: "world",
  };
});
// 使用：const { data } = await useFetch("/api/hello?a=1");
