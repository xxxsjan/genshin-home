// $fetch('/api/submit', { method: 'post', body: { test: 123 } })
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return { body };
});
