# fastapi sample with nextjs

# Setup supabase
supabase cliをインストールしておく

Macの場合
```bash
brew install supabase/tap/supabase
```

## Backend
起動:
```bash
make up
```

停止:
```bash
make down
```

## ユーザーの作成・更新など
supabaseのコンソールからユーザーを作成する。

http://127.0.0.1:54323/project/default/auth/users
