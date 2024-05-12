# bem

## scss语法
父选择器&
```css
a {
  font-weight: bold;
  text-decoration: none;
  &:hover { text-decoration: underline; }
  body.firefox & { font-weight: normal; }
}
/* 编译为 */

a {
  font-weight: bold;
  text-decoration: none; }
  a:hover {
    text-decoration: underline; }
  body.firefox a {
    font-weight: normal; 
}

```
变量$
```css
$width: 5em;
/* 直接使用即调用变量*/

#main {
  width: $width;
}
```
插值语句${}
```css
$name: foo;
$attr: border;
p.#{$name} {
  #{$attr}-color: blue;
}
/* 编译为 */

p.foo {
  border-color: blue; 
}

p {
  $font-size: 12px;
  $line-height: 30px;
  font: #{$font-size}/#{$line-height};
}
/* 编译为 */

p {
  font: 12px/30px; }
```

脱离嵌套规则@at-root (with without)
```css
.parent {
  ...
  @at-root {
    .child1 { ... }
    .child2 { ... }
  }
  .step-child { ... }
}


.parent { ... }
.child1 { ... }
.child2 { ... }
.parent .step-child { ... }


@media print {
  .page {
    width: 8in;
    @at-root (without: media) {
      color: red;
    }
  }
}
/* out: */

@media print {
  .page {
    width: 8in;
  }
}
.page {
  color: red;
}
```

混合mixins includes

<!-- mixins定义可重复使用的样式 -->
```css
@mixin clearfix {
  display: inline-block;
  &:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  * html & { height: 1px }
}
```
<!-- includes 使用 -->
```css
/* 可以携带参数 */

@mixin sexy-border($color, $width: 1in) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
p { @include sexy-border(blue); }
h1 { @include sexy-border(blue, 2in); }

/* 编译为 */ 
p {
  border-color: blue;
  border-width: 1in;
  border-style: dashed; }
```
<!-- 混入嵌套 -->
```scss
@mixin compound {
  @include highlighted-background;
  @include header-text;
}
@mixin highlighted-background { background-color: #ffcc00; }
@mixin header-text { font-size: 20px; }
```
## bem

项目使用了element-plus,默认的混入不能冲突
```css
@mixin B($block){
  $B:#{$Namespace + $block-sel + $block};
  .#{$B}{
    // 占位符 slot
    @content;
  }
}
// <input class="el-input__inner" />
@mixin E($el){
  $selector: &;
  @at-root{
    #{$selector + $element-sel + $el}{
      @content;
    }
  }
}
@mixin M($m){
  $selector: &;
  @at-root{
    #{$selector + $modify-sel + $m}{
      @content;
    }
  }
}

/* vite.config.ts导入 */
css: {
  preprocessorOptions: {
    scss: {
      // 在组件中使用SCSS全局变量
      additionalData: `@use "@/styles/elementplus/index.scss" as *;@use "@/styles/variables.scss" as *;@use "@/styles/bem.scss" as *;`
    }
  }
},

/* 使用 */
@include B(test) {
	text-shadow: 1ch;
	@include E(wrapper) {
		background: plum;
		@include M(primary) {
			color: greenyellow;
		}
	}
}
```