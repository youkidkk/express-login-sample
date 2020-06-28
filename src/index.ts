import * as express from "express";
import * as session from "express-session";
import * as passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import flash = require("express-flash");

// Express
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

// express-session の設定
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "passport test",
  })
);

// express-flash の有効化
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy((username, password, done) => {
    // 認証ロジック
    if (username !== "user" || password !== "pass") {
      // 既定のユーザー名、パスワード以外 -> 認証失敗
      return done(null, false);
    }
    // 認証成功
    return done(null, username);
  })
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// ビューエンジンに EJS を使用
app.set("view engine", "ejs");

// ホームページ
app.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    // 未認証時はログイン画面にリダイレクト
    res.redirect("/login");
    return;
  }
  res.render("index");
});

// ログイン画面
app.get("/login", (req, res) => {
  res.render("login", { message: req.flash().error });
});

// ログインリクエスト
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "ユーザーIDまたはパスワードが誤っています。",
    session: true,
  }),
  (req, res) => {
    // 認証成功時
    res.redirect("/");
  }
);

// ログアウトリクエスト
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// localhost:3000 でリッスン
app.listen(3000, function() {
  //
});
