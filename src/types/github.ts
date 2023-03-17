export type AccessTokenResponse = {
  token: string;
};

export type GithubError = {
  message: string;
};

export type Installation = {
  id: number;
  account: {
    login: string;
  };
};

export type Issue = {
  html_url: string;
  number: number;
  title: string;
  user: {
    login: string;
    html_url: string;
  };
  comments: number;
  created_at: string;
  body: string;
};

export type Search<Item> = {
  items: Item[];
};

export type User = {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  bio: string;
  followers: number;
};
