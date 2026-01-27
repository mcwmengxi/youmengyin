import { getThemeConfig } from '@sugarat/theme/node'

// 所有配置项，详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  // 开启RSS支持
  // RSS,
  // 搜索
  // 默认开启pagefind离线的全文搜索支持（如使用其它的可以设置为false）
  // search: false,
  // 默认关闭 markdown 图表支持（开启会增加一定的构建耗时）
  // mermaid: false
  // 主题色修改
  themeColor: 'el-blue',
  timeline: true,
  taskCheckbox: true,
  // 文章默认作者
  author: 'mcwmengxi',
  // 右侧精选文章栏目
  hotArticle: {
    title: '🔥 精选文章',
    nextText: '换一组',
    pageSize: 9,
    empty: '暂无精选内容',
  },
  friend: {
    list: [
      {
        nickname: '茂茂物语',
        des: '茂茂的成长之路，包含前端常用知识、源码阅读笔记、各种奇淫技巧、日常提效工具等',
        url: 'https://notes.fe-mm.com',
        avatar: 'https://notes.fe-mm.com/logo.png',
      },
      {
        nickname: '技术茶馆',
        url: 'https://teazg.top/',
        avatar: 'https://teazg.top/index_logo.png',
        des: '张工的技术茶馆，分享技术札记、实战经验、源码剖析与效率工具',
      },
      {
        url: 'https://relaxing.top/',
        nickname: '放',
        avatar: 'https://relaxing.top/logo.png',
        des: '放的博客',
      },
      {
        nickname: '七仔的博客',
        des: '记录自己在写程序过程中的发现、问题、成果',
        url: 'https://www.baby7blog.com',
        avatar: 'https://www.baby7blog.com/favicon.ico',
      },
      {
        nickname: '李年糕',
        des: '佛系的打工人',
        avatar:
          'https://cdn.upyun.sugarat.top/mdImg/sugar/617be739258b761b7dfed4fa0869326c',
        url: 'https://rimochiko.github.io/',
      },
      {
        nickname: '冴羽',
        des: '冴羽的博客',
        avatar: 'https://cdn.upyun.sugarat.top/avatar/blog/mqyqingfeng.png',
        url: 'https://yayujs.com/',
      },
      {
        nickname: 'Linbudu',
        des: '未来的不可知，是前进的原动力',
        avatar: 'https://cdn.upyun.sugarat.top/avatar/blog/linbudu.jfif',
        url: 'https://linbudu.top/',
      },
      {
        nickname: '小九',
        des: '日益努力，而后风生水起',
        avatar: 'https://cdn.upyun.sugarat.top/avatar/blog/jiangly.png',
        url: 'https://jiangly.com/',
      },
      {
        nickname: '花喵电台      ',
        des: '曹豪侠和余湾湾还有两只猫的生活记录~',
        avatar: 'https://cdn.upyun.sugarat.top/avatar/blog/fmcat.jpeg',
        url: 'https://www.fmcat.top',
      },
      {
        nickname: '张成威的网络日志',
        des: '知不足而奋进，望远山而前行',
        avatar: 'https://cdn.upyun.sugarat.top/avatar/blog/zhangchengwei.png',
        url: 'https://www.zhangchengwei.work',
      },
      {
        url: 'https://leelaa.cn',
        avatar: 'https://cdn.upyun.sugarat.top/avatar/blog/leelaa.png',
        des: '肯了个德的博客',
        nickname: 'LEEDAISEN',
      },
      {
        url: 'https://next.blackcell.fun/',
        avatar: 'https://cdn.upyun.sugarat.top/avatar/blog/blackcell.jpeg',
        des: '物以类聚 人以群分',
        nickname: 'BlackCell',
      },
      {
        url: 'https://tenyon.cn',
        avatar: 'https://cdn.upyun.sugarat.top/avatar/blog/tenyon.webp',
        des: '工夫为艺，笃志成技',
        nickname: "Yovvis's Blog",
      },
      {
        nickname: '强少来了',
        des: '互联网产品经理',
        avatar: 'https://cdn.upyun.sugarat.top/avatar/blog/fengxiaoqiang.png',
        url: 'https://fengxiaoqiang.com/',
      },
      {
        nickname: '博友圈',
        des: '独立博客人的专属朋友圈！',
        avatar:
          'https://cdn.upyun.sugarat.top/mdImg/sugar/bdee5d11a1e036ca3634943d34469f59',
        url: 'https://www.boyouquan.com/home',
      },
      {
        nickname: 'Simon He',
        des: '除了coding，我什么都不会',
        avatar: 'https://cdn.upyun.sugarat.top/avatar/blog/simonme.png',
        url: 'https://simonme.netlify.app/',
      },
      {
        nickname: 'laiky',
        des: '一名全栈开发工程师，.NET全栈经验',
        avatar: 'https://cdn.upyun.sugarat.top/avatar/blog/llxz.png',
        url: 'http://llxz.top/',
      },
      {
        nickname: '菜园前端',
        des: '小白都能看懂的笔记',
        avatar: 'https://note.noxussj.top/logo.png',
        url: 'https://note.noxussj.top/?s=y8',
      },
      {
        nickname: 'Hacxy Blog',
        des: '指尖改变命运😋',
        avatar: 'https://hacxy.cn/logo.png',
        url: 'https://hacxy.cn',
      },
      {
        avatar: 'https://onedayxyy.cn/favicon.ico',
        des: '明心静性，爱自己',
        nickname: 'One',
        url: 'https://onedayxyy.cn/',
      },
      {
        url: 'https://teek.seasir.top/',
        avatar: 'https://teek.seasir.top/favicon.ico',
        des: '人心中的成见是一座大山',
        nickname: 'Hyde',
      },
    ].map((v) => {
      if (v.avatar.includes('//cdn.upyun.sugarat.top')) {
        v.avatar = `${v.avatar}-wh50`
      }
      return v
    }),
    random: true,
    limit: 6,
  },

  // 页脚
  footer: [
    {
      version: false,
      copyright: {
        message: `Copyrights ©️ 2022-${new Date().getFullYear()} 丨 青萱织梦人`,
        icon: false,
      },
    },
    {
      version: false,
      message: '基于vitepress+@sugarat/theme主题',
    },
  ],
})

export { blogTheme }
