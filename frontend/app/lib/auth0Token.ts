// accessTokenを取得するヘルパー関数
export async function getAccessToken(getAccessTokenSilently: Function): Promise<string> {
  return await getAccessTokenSilently({
    authorizationParams: {
      audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    },
  });
}
