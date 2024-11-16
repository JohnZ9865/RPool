export const api = async ({
  url,
  method,
  body,
}: {
  url: string;
  method: string;
  body?: any;
}) => {
  const response = await fetch(url, {
    method: method,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  return data;
};
