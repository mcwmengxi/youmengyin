import { getSidebarsItems } from '../sidebar'

function sidebarFront() {
  return [
    {
      text: '前端',
      items: [
        {
          text: '介绍',
          link: '/docs/front-end/index'
        },
        {
          text: 'JavaScript',
          collapsed: true,
          items: [
            { text: '基础', link: '/docs/front-end/javascript/basic' },
            { text: 'DOM 相关', link: '/docs/front-end/javascript/dom' },
            { text: '函数', link: '/docs/front-end/javascript/function' },
            { text: '数据类型', link: '/docs/front-end/javascript/data-type' },
            { text: '字符串方法', link: '/docs/front-end/javascript/methods-string' },
            { text: '数组方法', link: '/docs/front-end/javascript/methods-array' },
            { text: '数组迭代', link: '/docs/front-end/javascript/array-iteration' },
            { text: '对象方法', link: '/docs/front-end/javascript/methods-object' },
            { text: '日期对象', link: '/docs/front-end/javascript/date-object' },
            { text: '数学对象', link: '/docs/front-end/javascript/math-object' },
            { text: '异步函数', link: '/docs/front-end/javascript/fun-async' },
            { text: '面向对象编程', link: '/docs/front-end/javascript/fun-prototype' },
            { text: 'Class 类的使用', link: '/docs/front-end/javascript/fun-class' },
            { text: 'JavaScript API', link: '/docs/front-end/javascript/javascript-api' },
            { text: '生成器', link: '/docs/front-end/javascript/generator' },
            { text: 'proxy 代理', link: '/docs/front-end/javascript/proxy' },
            { text: '事件循环', link: '/docs/front-end/javascript/event-loop' },
          ],
        }, 
        {
          text: '前端API',
          link: '/docs/front-end/front_api'
        },
        {
          text: '通过Node实现一个CLI工具',
          link: '/docs/front-end/cli'
        },
        {
          text: '工作',
          link: '/docs/front-end/work'
        },
        {
          text: 'Vue系列',
          collapsed: true,
          items: [
            {
              text: 'vue',
              link: '/docs/front-end/vue-series/vue'
            },
            {
              text: 'vue-router',
              link: '/docs/front-end/vue-series/vue-router'
            },
            {
              text: 'vuex',
              link: '/docs/front-end/vue-series/vuex'
            },
            {
              text: 'vue',
              items: getSidebarsItems('/front-end/vue')
            },
            {
              text: 'Vue.js 设计与实现',
              collapsible: true, 
              collapsed: true,
              items: [
                { text: '第一章 权衡的艺术', link: '/docs/front-end/vue-series/vue-design/page-1' },
                {
                  text: '第二章 框架设计的核心要素',
                  link: '/docs/front-end/vue-series/vue-design/page-2',
                },
                {
                  text: '第三章 Vue.js 3 的设计思路',
                  link: '/docs/front-end/vue-series/vue-design/page-3',
                },
                {
                  text: '第四章 响应系统的作用与实现',
                  link: '/docs/front-end/vue-series/vue-design/page-4',
                },
              ],
            }
          ]
        },
        {
          text: '前端工程化',
          items: [
            {
              text: 'Webpack',
              items: [
                {
                  text: 'Loader',
                  link: '/docs/front-end/modules/webpack/loader'
                },
                {
                  text: 'Plugins',
                  link: '/docs/front-end/modules/webpack/plugins'
                },
              ]
            }
          ]
        },
        {
          text: '性能优化',
          items: [
            {
              text: '指标',
              link: '/docs/front-end/performance-optimization/indicator'
            }
          ]
        },
        {
          text: 'node',
          items: [
            {
              text: '基础',
              link: '/docs/front-end/node/basic'
            },
            {
              text: 'node详解',
              link: '/docs/front-end/node/node-detail'
            },
            {
              text: 'node框架详解',
              link: '/docs/front-end/node/node框架详解'
            }
          ]
        },
        {
          text: 'typescript',
          collapsed: true,
          items: [
            {
              text: '介绍',
              link: '/docs/front-end/typescript/index'
            },
            {
              text: '基础入门',
              link: '/docs/front-end/typescript/base'
            },
            { text: '基础', collapsed: true, items: new Array(10).fill({}).map((item, idx) => ({ text: `基础-${idx+1}`, link: `/docs/front-end/typescript/base/base-${idx+1}` })) },
            { text: 'ts基础', link: '/docs/front-end/typescript/basic' },
            { text: '类型', link: '/docs/front-end/typescript/type' },
            { text: '其它', link: '/docs/front-end/typescript/other' },
            { text: 'TS最佳实践', link: '/docs/front-end/typescript/ts-best-practice' }
          ]
        },
        {
          text: 'threeJS',
          collapsed: true,
          items: [
            {
              text: '01. 创建一个立方体',
              link: '/docs/front-end/threeJS/01. 创建一个立方体'
            },
            {
              text: '02. 坐标辅助器与轨道控制器',
              link: '/docs/front-end/threeJS/02. 坐标辅助器与轨道控制器'
            },
            {
              text: '03. 物体位移与父子元素',
              link: '/docs/front-end/threeJS/03. 物体位移与父子元素'
            },
            {
              text: '04. 物体的缩放与旋转',
              link: '/docs/front-end/threeJS/04. 物体的缩放与旋转'
            },
            {
              text: '05. 设置响应式画布与全屏控制',
              link: '/docs/front-end/threeJS/05. 设置响应式画布与全屏控制'
            },
            {
              text: '06. 应用lil-GUI调试开发3D效果',
              link: '/docs/front-end/threeJS/06. 应用lil-GUI调试开发3D效果'
            },
            {
              text: '07. 几何体_顶点_索引_面之BufferGeometry',
              link: '/docs/front-end/threeJS/07. 几何体_顶点_索引_面之BufferGeometry'
            },
            {
              text: '08. 几何体划分顶点组设置不同材质',
              link: '/docs/front-end/threeJS/08. 几何体划分顶点组设置不同材质'
            },
            {
              text: '09. 贴图的加载与环境遮蔽贴图强度设置',
              link: '/docs/front-end/threeJS/09. 贴图的加载与环境遮蔽贴图强度设置'
            },
            {
              text: '10. 透明度贴图_环境贴图加载与高光贴图配合使用',
              link: '/docs/front-end/threeJS/10. 透明度贴图_环境贴图加载与高光贴图配合使用'
            },
            {
              text: '11. 纹理的颜色空间',
              link: '/docs/front-end/threeJS/11. 纹理的颜色空间'
            },
            {
              text: '12. 场景的线型雾和招数雾',
              link: '/docs/front-end/threeJS/12. 场景的线型雾和招数雾'
            },
            {
              text: '13. 加载gltf模型和加载压缩过的模型',
              link: '/docs/front-end/threeJS/13. 加载gltf模型和加载压缩过的模型'
            },
            {
              text: '14. 光线投射实现3d场景交互事件',
              link: '/docs/front-end/threeJS/14. 光线投射实现3d场景交互事件'
            },
            {
              text: '15. 补间动画Tween应用',
              link: '/docs/front-end/threeJS/15. 补间动画Tween应用'
            },
            {
              text: '16. 全面讲解UV与应用',
              link: '/docs/front-end/threeJS/16. 全面讲解UV与应用'
            },
            {
              text: '17. 法向量属性应用与法向量辅助器',
              link: '/docs/front-end/threeJS/17. 法向量属性应用与法向量辅助器'
            },
            {
              text: '18. 几何体顶点转化_顶点位移_旋转_缩放',
              link: '/docs/front-end/threeJS/18. 几何体顶点转化_顶点位移_旋转_缩放'
            },
            {
              text: '19. 包围盒使用与世界矩阵转换',
              link: '/docs/front-end/threeJS/19.包围盒使用与世界矩阵转换'
            },
            {
              text: '20. 几何体居中与获取几何体中心',
              link: '/docs/front-end/threeJS/20.几何体居中与获取几何体中心'
            },
            {
              text: '21. 获取多个物体包围盒',
              link: '/docs/front-end/threeJS/21.获取多个物体包围盒'
            },
            {
              text: '22. 边缘几何体与线框几何体',
              link: '/docs/front-end/threeJS/22.边缘几何体与线框几何体'
            },
            {
              text: '23. 灯光与阴影的设置',
              link: '/docs/front-end/threeJS/23.灯光与阴影的设置'
            },
          ]
        },
      ]
    },
  ]
}
function sidebarFlutter(){
  return [
    {
      text: 'flutter基础',
      items: [
        { text: 'index', link: '/views/flutter/index' },
        { text: '基础入门', link: '/views/flutter/base'},
      ]
    },
  ]
}
export { sidebarFront, sidebarFlutter }