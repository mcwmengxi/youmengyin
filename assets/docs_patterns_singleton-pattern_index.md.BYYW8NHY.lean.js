import{d as y,o as E,c as b,a as l,t as o,p as e,F,m as n,h as C,E as m,J as t,w as h,a4 as g}from"./chunks/framework.C2K-FukO.js";const D=n("br",null,null,-1),A=y({__name:"demo1",setup(r){let a=0;class p{getInstance(){return this}getCount(){return a}increment(){return++a}decrement(){return--a}}const s=new p,i=new p;return(_,V)=>(E(),b(F,null,[l(" 我们来比对一下结果："),D,l(" counter1.getInstance() === counter2.getInstance() 的结果是："+o(e(s).getInstance()===e(i).getInstance()),1)],64))}});let u,k=0;class v{constructor(){if(u)throw new Error("You can only create one instance!");u=this}getInstance(){return this}getCount(){return k}increment(){return++k}decrement(){return--k}}const c=Object.freeze(new v),d=Object.freeze(u),f=n("br",null,null,-1),B=n("br",null,null,-1),x=n("br",null,null,-1),q=n("br",null,null,-1),w=y({__name:"demo2",setup(r){const a=C(0);return(p,s)=>(E(),b(F,null,[l(" 点击如下按钮："),f,l(" 按钮 1 和按钮 2 点击事件使用的实例"+o(e(c).getInstance()===e(d).getInstance()?"相同":"不同")+" ",1),B,n("button",{onClick:s[0]||(s[0]=i=>a.value=e(c).increment())}," 按钮 1 点击增加 "),n("button",{onClick:s[1]||(s[1]=i=>a.value=e(c).decrement())}," 按钮 1 点击减少 "),n("button",{onClick:s[2]||(s[2]=i=>a.value=e(d).increment())}," 按钮 2 点击增加 "),n("button",{onClick:s[3]||(s[3]=i=>a.value=e(d).decrement())}," 按钮 2 点击减少 "),x,q,l(" count 结果："+o(a.value),1)],64))}}),P=n("h1",{id:"单例模式",tabindex:"-1"},[l("单例模式 "),n("a",{class:"header-anchor",href:"#单例模式","aria-label":'Permalink to "单例模式"'},"​")],-1),T=g("",12),j=g("",7),I=g("",18),z=JSON.parse('{"title":"单例模式","description":"","frontmatter":{"author":"Choi Yang","contributors":["HearLing"]},"headers":[],"relativePath":"docs/patterns/singleton-pattern/index.md","filePath":"docs/patterns/singleton-pattern/index.md","lastUpdated":1715534646000}'),S={name:"docs/patterns/singleton-pattern/index.md"},N=Object.assign(S,{setup(r){return(a,p)=>{const s=m("VideoLink"),i=m("DemoContainer");return E(),b("div",null,[P,t(s,{bvId:"BV1FA411o7Vm"},{default:h(()=>[l("【编程】单例模式是啥，面试居然也会问？ | Singleton Pattern B 站视频传送门")]),_:1}),T,t(i,{pkg:"patterns/singleton-pattern",path:"demo1.vue"},{default:h(()=>[t(A)]),_:1}),j,t(i,{pkg:"patterns/singleton-pattern",path:"demo2.vue"},{default:h(()=>[t(w)]),_:1}),I])}}});export{z as __pageData,N as default};
