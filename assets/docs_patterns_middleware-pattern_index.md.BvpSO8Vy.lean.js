import{_ as n,E as t,c as l,J as i,m as s,a,a4 as p,o as r}from"./chunks/framework.C2K-FukO.js";const P=JSON.parse('{"title":"中介/中间件模式","description":"","frontmatter":{"author":"Choi Yang","date":"2023-03-07T00:00:00.000Z"},"headers":[],"relativePath":"docs/patterns/middleware-pattern/index.md","filePath":"docs/patterns/middleware-pattern/index.md","lastUpdated":1715534646000}'),h={name:"docs/patterns/middleware-pattern/index.md"},d=s("h1",{id:"中介-中间件模式",tabindex:"-1"},[a("中介/中间件模式 "),s("a",{class:"header-anchor",href:"#中介-中间件模式","aria-label":'Permalink to "中介/中间件模式"'},"​")],-1),k=s("p",null,[a("通过中间件模式，我们能够更好地处理组件之间的通信，可以想象成有一个中心点，其它组件只需要由它来进行接受和转发信息即可，组件之间不需要直接对话，在 "),s("code",null,"JS"),a(" 中，一个中间件可以是一个对象字面量或者一个函数。")],-1),o=s("p",null,"举个例子，可以将这种模式转换为空中交通管制员和飞行员之间的关系，飞行员只需要与空中交通管制员对话，而不是让飞行员直接相互交谈，想想，如果是直接交谈，你找我我找你，到底听谁的呢？山里都得有个老大不是哈哈，没有人管控就会非常混乱。",-1),c=s("p",null,"那么在这当中空中交通管制员的任务就是要确保所有飞机都接收到安全飞行所需的信息，不会撞到其他飞机。",-1),E=s("p",null,[a("那么同样在 "),s("code",null,"JS"),a(" 中，如果有大量的组件，没有一个领头的，相互之间通信也会非常混乱，对于开发者而言也很痛苦，不知道这个数据到底怎么传，如下图所示：")],-1),_=s("p",null,"那么，使用了中间件模式之后，不需要让组件之间去通信了，而是直接从多对多的关系变为了多对一的关系，如下图所示。",-1),m=p("",7),u=s("p",null,"我们再把上述代码完善一下，看看下方的 demo，展示一个中间件链的使用：",-1),g=s("iframe",{src:"https://stackblitz.com/edit/middleware-pattern-node-express?ctl=1&embed=1&file=index.js"},null,-1),b=s("p",null,[a("当我们访问根路径 "),s("code",null,"/"),a(" 时，请求和响应之间的两个中间件都会调用。")],-1),y=s("h2",{id:"总结",tabindex:"-1"},[a("总结 "),s("a",{class:"header-anchor",href:"#总结","aria-label":'Permalink to "总结"'},"​")],-1),F=s("p",null,"中间件模式让所有通信都通过一个中心点，从而简化对象之间的多对多关系。",-1);function x(C,f,B,w,v,A){const e=t("CloudinaryImg");return r(),l("div",null,[d,k,o,c,E,i(e,{publicId:"patterns/middleware-pattern-1_uynu2e",alt:"middleware-pattern-1"}),_,i(e,{publicId:"patterns/middleware-pattern_ebrees",alt:"middleware-pattern"}),m,i(e,{publicId:"patterns/middleware-express_lgniew",alt:"middleware-express"}),u,g,b,y,F])}const q=n(h,[["render",x]]);export{P as __pageData,q as default};
