module.exports = {
  // 路径名为 "/<REPO>/"
  base: "/tech-blog/",
  title: "好运来的技术博客",
  description: "个人技术博客 Html、Css、JavaScript、Vue、React等",
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  theme: "reco",
  themeConfig: {
    nav: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "好运来的Javascript博客",
        items: [
          { text: "Github", link: "https://github.com/huangquanya" },
          { text: "掘金", link: "https://juejin.cn/user/747323640255918" },
        ],
      },
    ],
    sidebar: [
      {
        title: "欢迎学习",
        path: "/",
        collapsable: false,
        children: [
          {
            title: "学前必读",
            path: "/",
          },
        ],
      },
      {
        title: "Css学习",
        path: "/handbook/css/CssStackingContext",
        collapsable: false, // 不折叠
        children: [
          { title: "层叠上下文", path: "/handbook/css/CssStackingContext" },
        ],
      },
      {
        title: "Js学习",
        path: "",
        children: [],
      },
      {
        title: "算法学习",
        path: "/handbook/algorithm/fib",
        collapsable: false, // 不折叠
        children: [{ title: "斐波那契数列", path: "/handbook/algorithm/fib" }],
      },
      {
        title: "后端相关学习",
        path: "/handbook/backend/nginx",
        collapsable: false, // 不折叠
        children: [{ title: "nginx知识", path: "/handbook/backend/nginx" }],
      },
      {
        title: "git使用相关",
        path: "/handbook/git/git-ssh-config",
        collapsable: false, // 不折叠
        children: [
          {
            title: "电脑上配置github和gitlab的ssh",
            path: "/handbook/git/git-ssh-config",
          },
        ],
      },
    ],
    subSidebar: "auto",
  },
};
